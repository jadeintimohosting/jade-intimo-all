import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { orders } from "./order.model.js";
import { product_variants } from "./product-variant.model.js"; 

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  
  order_id: integer("order_id")
    .references(() => orders.id)
    .notNull(),

  variant_id: integer("variant_id")
    .references(() => product_variants.id)
    .notNull(),

  quantity: integer("quantity").notNull(),

  price_at_purchase: integer("price_at_purchase").notNull(),
});