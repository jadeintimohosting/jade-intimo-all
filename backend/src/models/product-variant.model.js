import { 
  pgTable, 
  serial, 
  varchar,
  timestamp,
  integer,
  boolean
} from "drizzle-orm/pg-core";
import { products } from "./product.model.js";

export const product_variants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  
  product_id: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  size: varchar("size", { length: 32 }).notNull(),
  quantity: integer("quantity").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  
  is_deleted: boolean("is_deleted").default(false).notNull() 
});