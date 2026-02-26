import { db } from "#config/database.js";
import { orders } from "#models/order.model.js";
import { orderItems } from "#models/order-items.model.js";
import { product_variants } from "#models/product-variant.model.js";
import { carts } from "#models/cart.model.js"; 
import { cart_items } from "#models/cart-items.model.js";
import { and, desc, eq, ilike, inArray, sql, } from "drizzle-orm";
import { products } from "#models/product.model.js";
import logger from "#config/logger.js";

const createOrder = async ({
    user_id,
    email,
    first_name,
    last_name,
    address_line,
    city,
    state,
    postal_code,
    country,
    total_ammount,
    items,
    stripe_payment_id
}) => {
    try {
        const result = await db.transaction(async (tx) => {
            
            let shipping_cost = 0;
            if (total_ammount < 50000)
                shipping_cost = 2500;

            // 1. Insert Order
            const [newOrder] = await tx
                .insert(orders)
                .values({
                    user_id: user_id || null, 
                    total_ammount,
                    email,
                    first_name,
                    last_name,
                    address_line,
                    city,
                    state,
                    postal_code,
                    country,
                    status: 'pending',
                    shipping_cost,
                    stripe_payment_id 
                })
                .returning({ id: orders.id });

            if (!newOrder) {
                throw new Error("Failed to create order");
            }

            // 2. Insert Order Items
            const orderItemsData = items.map((item) => ({
                order_id: newOrder.id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                price_at_purchase: item.price
            }));

            if (orderItemsData.length > 0) {
                await tx.insert(orderItems).values(orderItemsData);
                
                // --- 3. Update Inventory & Sales Metrics ---
                const variantIds = items.map(item => item.variant_id);

                const variantRecords = await tx
                    .select({ 
                        id: product_variants.id, 
                        product_id: product_variants.product_id 
                    })
                    .from(product_variants)
                    .where(inArray(product_variants.id, variantIds));

                const variantToProductMap = {};
                variantRecords.forEach(v => {
                    variantToProductMap[v.id] = v.product_id;
                });

                // Execute updates for both Products (sales) and Variants (stock) in parallel
                await Promise.all(items.map((item) => {
                    const productId = variantToProductMap[item.variant_id];
                    const updates = [];

                    // A. DECREASE VARIANT STOCK
                    // Make sure to change 'stock' if your column is named differently (e.g., 'quantity')
                    updates.push(
                        tx.update(product_variants)
                            .set({
                                quantity: sql`${product_variants.quantity} - ${item.quantity}` 
                            })
                            .where(eq(product_variants.id, item.variant_id))
                    );

                    // B. INCREASE PRODUCT SOLD PIECES
                    if (productId) {
                        updates.push(
                            tx.update(products)
                                .set({ 
                                    soldPieces: sql`${products.soldPieces} + ${item.quantity}` 
                                })
                                .where(eq(products.id, productId))
                        );
                    }

                    // Run both updates for this item
                    return Promise.all(updates);
                }));
            }

            // 4. Clear Cart
            if (user_id) {
                const [userCart] = await tx
                    .select()
                    .from(carts)
                    .where(eq(carts.user_id, user_id));

                if (userCart) {
                    await tx
                        .delete(cart_items)
                        .where(eq(cart_items.cart_id, userCart.id));
                }
            }

            return { orderId: newOrder.id, status: "success" };
        });

        return result;

    } catch (error) {
        console.error("Transaction Error:", error);
        throw error;
    }
};

const verifyStock = async (items) => {
    const variantIds = items.map((item) => item.variant_id);

    if (variantIds.length === 0) return true;

    const dbVariants = await db
        .select({
            id: product_variants.id,
            quantity: product_variants.quantity,
        })
        .from(product_variants)
        .where(inArray(product_variants.id, variantIds));

    const variantsMap = new Map(dbVariants.map((v) => [v.id, v]));

    for (const item of items) {
        const dbVariant = variantsMap.get(item.variant_id);

        if (!dbVariant) {
            throw new Error(`Product variant with ID ${item.variant_id} does not exist.`);
        }

        if (dbVariant.quantity < item.quantity) {
            throw new Error(
                `Insufficient stock for variant ID ${item.variant_id}. Requested: ${item.quantity}, Available: ${dbVariant.quantity}`
            );
        }
    }

    return true;
};

const getOrdersByUserId = async (userId) => {
    try {
        const userOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.user_id, userId))
            .orderBy(desc(orders.created_at));

        return userOrders;
    } catch (error) {
        console.error("Error fetching user orders:", error);
        throw error;
    }
};


const fetchDetails = async (userId, orderId) => {
    try {
        const [order] = await db
            .select()
            .from(orders)
            .where(
                and(
                    eq(orders.id, orderId),
                    eq(orders.user_id, userId)
                )                
            );

        if (!order) {
            throw new Error("Order not found or access denied.");
        }

        const orderProds = await db
            .select({
                id: orderItems.id,
                quantity: orderItems.quantity,
                price: orderItems.price_at_purchase,
                size: product_variants.size,
                productName: products.name,
                image: products.image
            })
            .from(orderItems)
            .leftJoin(product_variants, eq(orderItems.variant_id, product_variants.id))
            .leftJoin(products, eq(product_variants.product_id, products.id))
            .where(eq(orderItems.order_id, orderId));

        return {
            ...order,
            items: orderProds
        };

    } catch (error) {
        logger.error(`FetchDetails Error: ${error.message}`);
        throw error;
    }
}

const fetchDetailsWithId=async(orderId)=>{
    try {
        const [order] = await db
            .select()
            .from(orders)
            .where(
                eq(orders.id, orderId),
            );

        if (!order) {
            throw new Error("Order not found or access denied.");
        }

        const orderProds = await db
            .select({
                id: orderItems.id,
                quantity: orderItems.quantity,
                price: orderItems.price_at_purchase,
                size: product_variants.size,
                productName: products.name,
                image: products.image
            })
            .from(orderItems)
            .leftJoin(product_variants, eq(orderItems.variant_id, product_variants.id))
            .leftJoin(products, eq(product_variants.product_id, products.id))
            .where(eq(orderItems.order_id, orderId));

        return {
            ...order,
            items: orderProds
        };

    } catch (error) {
        logger.error(`FetchDetails Error: ${error.message}`);
        throw error;
    }
}

const getAllOrdersAdmin = async (page, limit, email, orderId, status) => {
    try {
        const offset = (page - 1) * limit;

        const conditions = [];

        if (email) {
            conditions.push(ilike(orders.email, `%${email}%`));
        }

        if (orderId) {
            const parsedOrderId = Number(orderId);
            if (!isNaN(parsedOrderId)) {
                conditions.push(eq(orders.id, parsedOrderId));
            } else {
                throw new Error("ID-ul comenzii trebuie să fie un număr valid.");
            }
        }

        if (status) {
            const allowedStatuses = ['pending', 'shipping', 'cancelled'];
            
            if (!allowedStatuses.includes(status)) {
                throw new Error(`Status invalid. Valorile permise sunt: ${allowedStatuses.join(', ')}`);
            }
            
            conditions.push(eq(orders.status, status));
        }

        const result = await db
            .select()
            .from(orders)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(orders.created_at))
            .limit(limit)
            .offset(offset);

        return result;
        
    } catch (error) {
        logger.error(`Get Orders Error: ${error.message}`);
        throw error;
    }
}


const fetchDetailsAdmin = async (orderId) => {
    try {
        const [order] = await db
            .select()
            .from(orders)
            .where(
                eq(orders.id, orderId),
            );

        if (!order) {
            throw new Error("Order not found or access denied.");
        }

        const orderProds = await db
            .select({
                id: orderItems.id,
                quantity: orderItems.quantity,
                price: orderItems.price_at_purchase,
                size: product_variants.size,
                productName: products.name,
                image: products.image,
                cod:products.cod
            })
            .from(orderItems)
            .leftJoin(product_variants, eq(orderItems.variant_id, product_variants.id))
            .leftJoin(products, eq(product_variants.product_id, products.id))
            .where(eq(orderItems.order_id, orderId));

        return {
            ...order,
            items: orderProds
        };

    } catch (error) {
        logger.error(`FetchDetails Error: ${error.message}`);
        throw error;
    }
}

const updateOrderAdmin = async (orderId, status) => {
    const allowedStatuses = ['pending', 'cancelled', 'shipping'];

    try {
        if (!allowedStatuses.includes(status)) {
            throw new Error(`Status invalid. Valorile permise sunt: ${allowedStatuses.join(', ')}`);
        }

        const result = await db
            .update(orders)
            .set({ status: status })
            .where(eq(orders.id, orderId))
            .returning();

        if (result.length === 0) {
            throw new Error(`Comanda cu ID-ul ${orderId} nu a fost găsită.`);
        }

        return result[0];

    } catch (error) {
        logger.error(`Update Order Error (ID: ${orderId}): ${error.message}`);
        throw error;
    }
}

export { createOrder,getOrdersByUserId,verifyStock,fetchDetails,getAllOrdersAdmin,fetchDetailsAdmin,updateOrderAdmin,fetchDetailsWithId};