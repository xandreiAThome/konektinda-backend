import { integer, pgTable, varchar} from "drizzle-orm/pg-core";

export const couriers = pgTable("couriers", {
    courier_id: integer("courier_id").primaryKey().generatedAlwaysAsIdentity(),
    courier_name: varchar("courier_name", { length: 50 }).notNull(),
    contact_number: varchar("contact_number", { length: 20 }).notNull(),
});     