import { pgTable, serial } from "drizzle-orm/pg-core";
import { product_variants } from "./product-variant.model.js";
import { carts } from "./cart.model.js";
import { integer } from "drizzle-orm/gel-core";
import { products } from "./product.model.js";

export const cart_items = pgTable("cart_items", {
    id: serial("id").primaryKey(),
    
    cart_id: integer("cart_id")
        .notNull()
        .references(() => carts.id, { onDelete: "cascade" }),

    product_id:integer("product_id")
        .notNull()
        .references(()=>products.id)       
    ,
    variant_id: integer("variant_id")
        .notNull()
        .references(() => product_variants.id),

    quantity: integer("quantity").notNull().default(1),
});