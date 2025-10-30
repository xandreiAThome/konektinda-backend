import { integer, pgTable, varchar, boolean, pgEnum, decimal, timestamp} from "drizzle-orm/pg-core";

export const userRoles = pgEnum("UserRole", ["CONSUMER", "SUPPLIER"]);
export const orderStatuses = pgEnum("OrderStatus", ["PENDING", "CANCELLED", "COMPLETE"]);
export const paymentTypes = pgEnum("PaymentType", ["CARD", "GCASH", "BANK_TRANSFER", "COD"]);
export const paymentStatuses = pgEnum("PaymentStatus", ["PENDING", "COMPLETED", "FAILED", "PARTIAL"]);

export const users = pgTable("users", {
    user_id: integer("user_id").primaryKey().generatedAlwaysAsIdentity(),
    first_name: varchar("first_name", { length: 20 }).notNull(),
    last_name: varchar("last_name", { length: 20 }).notNull(),
    email: varchar("email", { length: 50 }).notNull().unique(),
    username: varchar("username", { length: 20 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 255 }).notNull(),
    phone_number: varchar("phone_number", { length: 20  }).notNull().unique(),
    email_verified: boolean("email_verified").notNull().default(false),
    role: userRoles().notNull().default("CONSUMER"),
    profile_picture_url: varchar("profile_picture_url", { length: 255  }).default(""),
    supplier_id: integer("supplier_id").references(() => suppliers.supplier_id),
});

export const user_addresses = pgTable("user_addresses", {
    address_id: integer("address_id").primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer("user_id").references(() => users.user_id).notNull(),
    region: varchar("region", { length: 50 }).notNull(),
    province: varchar("province", { length: 50 }).notNull(),
    city: varchar("city", { length: 50 }).notNull(),
    barangay: varchar("barangay", { length: 50 }).notNull(),
    zip_code: varchar("zip_code", { length: 10 }).notNull(),
});

export const carts = pgTable("carts", {
    cart_id: integer("cart_id").primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer("user_id").references(() => users.user_id).notNull(),
}); 

export const suppliers = pgTable("suppliers", {
    supplier_id: integer("supplier_id").primaryKey().generatedAlwaysAsIdentity(),
    supplier_name: varchar("supplier_name", { length: 50 }).notNull(),
    supplier_description: varchar("supplier_description", { length: 255 }),
});

 export const products = pgTable("products", {
    product_id: integer("product_id").primaryKey().generatedAlwaysAsIdentity(),
    product_category_id: integer("product_category_id").references(() => product_categories.product_category_id).notNull(),
    supplier_id: integer("supplier_id").references(() => suppliers.supplier_id).notNull(),
    product_name: varchar("product_name", { length: 100 }).notNull(),
    product_description: varchar("product_description", { length: 255 }),
    is_active: boolean("is_active").notNull().default(true),
});

export const product_categories = pgTable("product_categories", {
    product_category_id: integer("product_category_id").primaryKey().generatedAlwaysAsIdentity(),
    category_name: varchar("category_name", { length: 50 }).notNull(),
}); 

export const product_variants = pgTable("product_variants", {
    product_variant_id: integer("product_variant_id").primaryKey().generatedAlwaysAsIdentity(),
    product_id: integer("product_id").references(() => products.product_id).notNull(),
    variant_name: varchar("variant_name", { length: 100 }).notNull(),
    stock: integer("stock").notNull().default(0),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    discount: integer("discount").notNull().default(0),
    is_active: boolean("is_active").notNull().default(true),
});

export const cart_items = pgTable("cart_items", {
    cart_item_id: integer("cart_item_id").primaryKey().generatedAlwaysAsIdentity(),
    cart_id: integer("cart_id").references(() => carts.cart_id).notNull(),
    product_variant_id: integer("product_variant_id").references(() => product_variants.product_variant_id).notNull(),
    quantity: integer("quantity").notNull().default(1),
    unit_price: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    discount_applied: integer("discount_applied").notNull().default(0),
    date_priced: timestamp("date_priced").notNull().defaultNow(), 
}); 

export const order_items = pgTable("order_items", {
    order_item_id: integer("order_item_id").primaryKey().generatedAlwaysAsIdentity(),
    supplier_order_id: integer("supplier_order_id").references(() => supplier_orders.supplier_order_id).notNull(),
    product_variant_id: integer("product_variant_id").references(() => product_variants.product_variant_id).notNull(),
    quantity: integer("quantity").notNull().default(1),
    unit_price: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    discount_applied: integer("discount_applied").notNull().default(0),
});

 export const supplier_orders = pgTable("supplier_orders", {
    supplier_order_id: integer("supplier_order_id").primaryKey().generatedAlwaysAsIdentity(),
    order_id: integer("order_id").references(() => orders.order_id).notNull(),
    supplier_id: integer("supplier_id").references(() => suppliers.supplier_id).notNull(),
    supplier_order_num: varchar("supplier_order_number", { length: 50 }).notNull().unique(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    shipping: decimal("shipping_fee", { precision: 10, scale: 2 }).notNull(),
    total_price: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    status: orderStatuses().notNull().default("PENDING"),
});

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

export const payments = pgTable("payments", {
    ref_num: varchar("ref_num", { length: 100 }).primaryKey(),
    type: paymentTypes().notNull(),
    provider: varchar("provider", { length: 50 }).notNull(),
    status: paymentStatuses().notNull().default("PENDING"),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    payment_date: timestamp("payment_date").notNull().defaultNow(),
}); 

export const shipments = pgTable("shipments", {
    shipment_id: integer("shipment_id").primaryKey().generatedAlwaysAsIdentity(),
    courier_id: integer("courier_id").references(() => couriers.courier_id).notNull(),
    supplier_order_id: integer("supplier_order_id").references(() => supplier_orders.supplier_order_id).notNull(),
    tracking_num: varchar("tracking_num", { length: 100 }).notNull().unique(),
    date_shipped: timestamp("date_shipped").notNull().defaultNow(),
    date_delivered: timestamp("date_delivered"),
});

export const couriers = pgTable("couriers", {
    courier_id: integer("courier_id").primaryKey().generatedAlwaysAsIdentity(),
    courier_name: varchar("courier_name", { length: 50 }).notNull(),
    contact_number: varchar("contact_number", { length: 20 }).notNull(),
});     
     
     
 