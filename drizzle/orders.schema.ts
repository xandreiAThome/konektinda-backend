import { integer, pgTable, varchar, decimal, timestamp} from "drizzle-orm/pg-core";
import { users } from "./users.schema"
import { payments } from "./payments.schema"

export const orders = pgTable("orders", {
    order_id: integer("order_id").primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer("user_id").references(() => users.user_id).notNull(),
    grand_total: decimal("grand_total", { precision: 10, scale: 2 }).notNull(), // Calculated from all supplier orders
    region: varchar("region", { length: 50 }).notNull(),
    province: varchar("province", { length: 50 }).notNull(),
    city: varchar("city", { length: 50 }).notNull(),
    barangay: varchar("barangay", { length: 50 }).notNull(),
    zip_code: varchar("zip_code", { length: 10 }).notNull(),
    payment_id: varchar("payment_id", { length: 100 }).references(() => payments.ref_num).notNull().unique(), 
    order_date: timestamp("order_date").notNull().defaultNow(),
}); 