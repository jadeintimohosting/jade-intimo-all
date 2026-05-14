import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.model.js";

export const carts=pgTable("carts",{
    id:serial("id").primaryKey(),
    user_id:integer('user_id')
        .references(()=>users.id)
        .unique()
        .notNull()    
    ,
    created_at:timestamp().defaultNow().notNull()
})