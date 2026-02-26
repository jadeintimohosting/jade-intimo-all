import { db } from "#config/database.js"
import { cart_items } from "#models/cart-items.model.js"
import { carts } from "#models/cart.model.js"
import { eq ,and} from "drizzle-orm"
import { products } from "#models/product.model.js"
import { product_variants } from "#models/product-variant.model.js"
import logger from "#config/logger.js"

export const getCartProds = async (userId) => {
    try {
        const [userCart] = await db
            .select()
            .from(carts)
            .where(eq(carts.user_id, userId));

        if (!userCart) return [];

        // 2. Perform a joined query to get items with product and variant details
        const items = await db
            .select({
                cartItemId: cart_items.id,
                quantity: cart_items.quantity,
                // Product Fields
                productId: products.id,
                productName: products.name,
                productImage: products.image,
                productPrice: products.price,
                // Variant Fields
                variantId: product_variants.id,
                variantSize: product_variants.size,
            })
            .from(cart_items)
            .innerJoin(products, eq(cart_items.product_id, products.id))
            .innerJoin(product_variants, eq(cart_items.variant_id, product_variants.id))
            .where(eq(cart_items.cart_id, userCart.id));

        // 3. Group variants by product using reduce
        const groupedData = items.reduce((acc, current) => {
            const { productId, productName, productImage, productPrice, ...variantInfo } = current;

            // If product isn't in the accumulator yet, add it
            if (!acc[productId]) {
                acc[productId] = {
                    id: productId,
                    name: productName,
                    image: productImage,
                    price: productPrice,
                    variants: [] 
                };
            }

            // Push the variant-specific data into the product's variant array
            acc[productId].variants.push({
                cartItemId: variantInfo.cartItemId,
                variantId: variantInfo.variantId,
                size: variantInfo.variantSize,
                quantity: variantInfo.quantity
            });

            return acc;
        }, {});

        return Object.values(groupedData);

    } catch (error) {
        logger.error("Error in getCartProds service:", error);
        throw new Error("Could not retrieve grouped cart data");
    }
};

export const addProdToCart = async (userId, productId, variantId, quantity = 1) => {
    try {
        let [cart] = await db.select().from(carts).where(eq(carts.user_id, userId)).limit(1);

        if (!cart) {
            [cart] = await db.insert(carts).values({ user_id: userId }).returning();
        }

        const [existingItem] = await db
            .select()
            .from(cart_items)
            .where(
                and(
                    eq(cart_items.cart_id, cart.id),
                    eq(cart_items.variant_id, variantId)
                )
            );

        if (existingItem) {
            const [updatedItem] = await db
                .update(cart_items)
                .set({ quantity: existingItem.quantity + Number(quantity) })
                .where(eq(cart_items.id, existingItem.id))
                .returning();
            
            logger.info(`Increased quantity for item ${variantId} in cart ${cart.id}`);
            return updatedItem;
        }

        const [newItem] = await db
            .insert(cart_items)
            .values({
                cart_id: cart.id,
                product_id: productId,
                variant_id: variantId,
                quantity: Number(quantity)
            })
            .returning();

        logger.info(`new product ${productId} added to cart ${cart.id}`);
        return newItem;

    } catch (error) {
        logger.error("Error in addProdToCart service:", error);
        throw new Error("Could not add item to cart");
    }
};

export const deleteProduct = async (userId, variantId) => {
    try {
        const [cart] = await db
            .select({ id: carts.id })
            .from(carts)
            .where(eq(carts.user_id, userId));

        if (!cart) {
            throw new Error("Cart not found for this user");
        }

        const [deletedItem] = await db
            .delete(cart_items)
            .where(
                and(
                    eq(cart_items.cart_id, cart.id),
                    eq(cart_items.variant_id, variantId)
                )
            )
            .returning();

        if (!deletedItem) {
            logger.warn(`Attempted to delete non-existent item: Variant ${variantId} in Cart ${cart.id}`);
            return null;
        }

        logger.info(`Product variant ${variantId} removed from cart ${cart.id}`);
        
        return {
            ...deletedItem,
            cartId: cart.id
        };

    } catch (error) {
        logger.error("Error in deleteProduct service:", error);
        throw new Error("Could not delete item from cart"); 
    }
};

export const updateProdQuantity=async (userId,variantId,nr)=>{
    try {
        const [cart] = await db
            .select({ id: carts.id })
            .from(carts)
            .where(eq(carts.user_id, userId))
            .limit(1);

        if (!cart) {
            throw new Error("Cart not found for this user");
        }

        const [item] = await db
            .select()
            .from(cart_items)
            .where(
                and(
                    eq(cart_items.variant_id, variantId),
                    eq(cart_items.cart_id, cart.id)
                ) 
            )
            .limit(1);

        if (!item) {
            throw new Error("Item not found in cart");
        }
        const delta = nr > 0 ? 1 : nr < 0 ? -1 : 0;
        if (delta === 0) {
            return { action: "noop", item, cartId: cart.id };
        }

        if (delta < 0 && item.quantity === 1) {
            const [deletedItem] = await db
                .delete(cart_items)
                .where(
                    and(
                        eq(cart_items.cart_id, cart.id),
                        eq(cart_items.variant_id, variantId)
                    )
                )
                .returning();

            return {
                ...deletedItem,
                cartId: cart.id
            };
        }

        const newQuantity = item.quantity + (delta);

        const [updatedItem] = await db
            .update(cart_items)
            .set({ quantity: newQuantity })
            .where(eq(cart_items.id, item.id))
            .returning();

        return { action: "updated", item: updatedItem, cartId: cart.id };
        
    } catch (error) {
        logger.error("Error updating product quantity:", error);
        throw error;
    }
}