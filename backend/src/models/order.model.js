import { integer, pgTable, serial, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./user.model.js";

export const orderStatusEnum = pgEnum('order_status', ['pending','shipping','cancelled']);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  
  user_id: integer('user_id')
    .references(() => users.id),

  status: orderStatusEnum('status').default('pending').notNull(),

  total_ammount: integer('total_ammount').notNull(),
  shipping_cost:integer('shipping_cost').default(0),

  email: varchar('email', { length: 255 }).notNull(),
  first_name: varchar('first_name', { length: 128 }).notNull(),
  last_name: varchar('last_name', { length: 128 }).notNull(),

  address_line: varchar('address_line', { length: 255 }).notNull(),
  city: varchar('city', { length: 128 }).notNull(),
  state: varchar('state', { length: 128 }).notNull(),
  postal_code: varchar('postal_code', { length: 16 }).notNull(),
  country: varchar('country', { length: 128 }).notNull(),
  stripe_payment_id: varchar("stripe_payment_id", { length: 255 }),

  created_at: timestamp('created_at').defaultNow().notNull(),
});