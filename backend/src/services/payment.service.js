import { db } from "#config/database.js";
import { orders } from "#models/order.model.js";
import { orderItems } from "#models/order-items.model.js";
import { product_variants } from "#models/product-variant.model.js";
import { products } from "#models/product.model.js";
import Stripe from "stripe"
import logger from "#config/logger.js";
import { eq,inArray } from "drizzle-orm";

const stripe=new Stripe(process.env.STRIPE_API_KEY)


const getProductsFromDb = async (items) => {
    const variantIds = items.map((item) => item.variant_id);
    if (variantIds.length === 0) return new Map();

    const dbItems = await db
        .select({
            variantId: product_variants.id,
            size: product_variants.size,
            productName: products.name,
            price: products.price, // Assumed to be in BANI (e.g., 5000 for 50 RON)
        })
        .from(product_variants)
        .leftJoin(products, eq(product_variants.product_id, products.id))
        .where(inArray(product_variants.id, variantIds));

    return new Map(dbItems.map((item) => [item.variantId, item]));
};

export const createPaymentSession = async ({ items }) => {
    try {
        const dbItemsMap = await getProductsFromDb(items);
        let calculatedSubtotal = 0;

        // 1. Build Product Line Items & Calculate Subtotal
        const line_items = items.map((item) => {
            const dbItem = dbItemsMap.get(item.variant_id);

            if (!dbItem) throw new Error(`Product ${item.variant_id} not found`);
            if (!dbItem.price) throw new Error(`Price missing for: ${dbItem.productName}`);

            // Add to running total for shipping calculation
            calculatedSubtotal += dbItem.price * item.quantity;

            return {
                price_data: {
                    currency: 'ron',
                    product_data: {
                        name: dbItem.productName,
                        description: `Size: ${dbItem.size}`,
                    },
                    unit_amount: dbItem.price,
                },
                quantity: item.quantity,
            };
        });

        const SHIPPING_THRESHOLD = 50000; 
        const STANDARD_SHIPPING_COST = 2500;

        if (calculatedSubtotal < SHIPPING_THRESHOLD) {
            line_items.push({
                price_data: {
                    currency: 'ron',
                    product_data: {
                        name: 'Delivery Fee',
                        description: 'Standard Shipping',
                    },
                    unit_amount: STANDARD_SHIPPING_COST,
                },
                quantity: 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "payment",
            line_items: line_items,
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`
        });

        return session.url;

    } catch (error) {
        logger.error("Stripe Service Error:", error);
        throw error;
    }
};