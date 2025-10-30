import { integer, pgTable } from "drizzle-orm/pg-core"
import { users } from "./users.schema"

export const carts = pgTable("carts", {
    cart_id: integer("cart_id").primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer("user_id").references(() => users.user_id).notNull(),
}); 