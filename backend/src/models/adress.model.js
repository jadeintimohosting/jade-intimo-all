import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'; // 1. Added integer
import { users } from './user.model.js';

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .references(() => users.id)
    .unique()
    .notNull(),

  address_line: varchar('adress_line', { length: 255 }).notNull(),
  city: varchar('city', { length: 128 }).notNull(),
  state: varchar('state', { length: 128 }).notNull(),
  postal_code: varchar('postal_code', { length: 16 }).notNull(),
  country: varchar('country', { length: 128 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
