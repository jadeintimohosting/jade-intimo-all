import { orders } from "#models/order.model.js";
import { products } from "#models/product.model.js";
import { product_variants } from "#models/product-variant.model.js";
import { db } from "#config/database.js";
import { sql, gte,eq,lte, desc, and } from "drizzle-orm";

export const getRecentOrders = async (days) => {
        
    const parsedDays = parseInt(days, 10) || 7; 
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parsedDays);

    const dailyData = await db
        .select({
            date: sql`TO_CHAR(${orders.created_at}, 'YYYY-MM-DD')`.as('date'),
            orderCount: sql`COUNT(${orders.id})::int`.as('order_count'),
            dailyRevenue: sql`SUM(${orders.total_ammount} + COALESCE(${orders.shipping_cost}, 0))::int`.as('daily_revenue'),
        })
        .from(orders)
        .where(gte(orders.created_at, startDate))
        .groupBy(sql`TO_CHAR(${orders.created_at}, 'YYYY-MM-DD')`)
        .orderBy(sql`TO_CHAR(${orders.created_at}, 'YYYY-MM-DD')`);

    const totalOrders = dailyData.reduce((sum, day) => sum + day.orderCount, 0);
    const totalRevenue = dailyData.reduce((sum, day) => sum + (day.dailyRevenue || 0), 0);

    return {
        data: dailyData,
        totalOrders,
        totalRevenue
    }; 
};

export const getLowStockProducts = async () => {
    try {
        const lowStockItems = await db
            .select({
                variant_id: product_variants.id, 
                name: products.name,
                cod: products.cod,
                image: products.image,
                size: product_variants.size,
                quantity: product_variants.quantity
            })
            .from(product_variants)
            .innerJoin(products, eq(product_variants.product_id, products.id))
            .where(and(
                lte(product_variants.quantity, 5),
                eq(product_variants.is_deleted,false),
                eq(products.is_deleted, false)
            ))
            .orderBy(product_variants.quantity);

        return {
            items: lowStockItems,
            total: lowStockItems.length
        };
        
    } catch (error) {
        throw new Error(`A apărut o problemă la preluarea produselor cu stoc limitat: ${error.message}`);
    }
};

export const getPendingOrdersFunction=async ()=>{
    try {
        const pendingOrders=await db
            .select()
            .from(orders)
            .where(eq(orders.status,"pending"))
            .orderBy(desc(orders.created_at))
            .limit(7)

        return {
            orderArr:pendingOrders,
            total:pendingOrders.length
        }
    } catch (error) {
        throw new Error(`A apărut o problemă la preluarea comenzilor in asteptare: ${error.message}`);
    }
}