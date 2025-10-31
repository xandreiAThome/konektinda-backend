CREATE TYPE "public"."OrderStatus" AS ENUM('PENDING', 'CANCELLED', 'COMPLETE');--> statement-breakpoint
CREATE TYPE "public"."PaymentStatus" AS ENUM('PENDING', 'COMPLETED', 'FAILED', 'PARTIAL');--> statement-breakpoint
CREATE TYPE "public"."PaymentTypes" AS ENUM('CARD', 'GCASH', 'BANK_TRANSFER', 'COD');--> statement-breakpoint
CREATE TYPE "public"."UserRole" AS ENUM('CONSUMER', 'SUPPLIER');--> statement-breakpoint
CREATE TABLE "cart_items" (
	"cart_item_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cart_items_cart_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cart_id" integer NOT NULL,
	"product_variant_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"discount_applied" integer DEFAULT 0 NOT NULL,
	"date_priced" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"cart_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "carts_cart_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "couriers" (
	"courier_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "couriers_courier_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"courier_name" varchar(50) NOT NULL,
	"contact_number" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"order_item_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_items_order_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"supplier_order_id" integer NOT NULL,
	"product_variant_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"discount_applied" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"order_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"grand_total" numeric(10, 2) NOT NULL,
	"region" varchar(50) NOT NULL,
	"province" varchar(50) NOT NULL,
	"city" varchar(50) NOT NULL,
	"barangay" varchar(50) NOT NULL,
	"zip_code" varchar(10) NOT NULL,
	"payment_id" varchar(100) NOT NULL,
	"order_date" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_payment_id_unique" UNIQUE("payment_id")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"ref_num" varchar(100) PRIMARY KEY NOT NULL,
	"type" "PaymentTypes" NOT NULL,
	"provider" varchar(50) NOT NULL,
	"status" "PaymentStatus" DEFAULT 'PENDING' NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"product_category_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_categories_product_category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"category_name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"product_variant_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_variants_product_variant_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer NOT NULL,
	"variant_name" varchar(100) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"product_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_category_id" integer NOT NULL,
	"supplier_id" integer NOT NULL,
	"product_name" varchar(100) NOT NULL,
	"product_description" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipments" (
	"shipment_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shipments_shipment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"courier_id" integer NOT NULL,
	"supplier_order_id" integer NOT NULL,
	"tracking_num" varchar(100) NOT NULL,
	"date_shipped" timestamp DEFAULT now() NOT NULL,
	"date_delivered" timestamp,
	CONSTRAINT "shipments_tracking_num_unique" UNIQUE("tracking_num")
);
--> statement-breakpoint
CREATE TABLE "supplier_orders" (
	"supplier_order_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "supplier_orders_supplier_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order_id" integer NOT NULL,
	"supplier_id" integer NOT NULL,
	"supplier_order_number" varchar(50) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"shipping_fee" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"status" "OrderStatus" DEFAULT 'PENDING' NOT NULL,
	CONSTRAINT "supplier_orders_supplier_order_number_unique" UNIQUE("supplier_order_number")
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"supplier_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "suppliers_supplier_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"supplier_name" varchar(50) NOT NULL,
	"supplier_description" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "user_addresses" (
	"address_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_addresses_address_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"region" varchar(50) NOT NULL,
	"province" varchar(50) NOT NULL,
	"city" varchar(50) NOT NULL,
	"barangay" varchar(50) NOT NULL,
	"zip_code" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar(20) NOT NULL,
	"last_name" varchar(20) NOT NULL,
	"email" varchar(50) NOT NULL,
	"username" varchar(20) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"role" "UserRole" DEFAULT 'CONSUMER' NOT NULL,
	"profile_picture_url" varchar(255) DEFAULT '',
	"supplier_id" integer,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_carts_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("cart_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_variant_id_product_variants_product_variant_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("product_variant_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_supplier_order_id_supplier_orders_supplier_order_id_fk" FOREIGN KEY ("supplier_order_id") REFERENCES "public"."supplier_orders"("supplier_order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_variant_id_product_variants_product_variant_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("product_variant_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_payments_ref_num_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("ref_num") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_product_category_id_product_categories_product_category_id_fk" FOREIGN KEY ("product_category_id") REFERENCES "public"."product_categories"("product_category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_suppliers_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("supplier_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_courier_id_couriers_courier_id_fk" FOREIGN KEY ("courier_id") REFERENCES "public"."couriers"("courier_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_supplier_order_id_supplier_orders_supplier_order_id_fk" FOREIGN KEY ("supplier_order_id") REFERENCES "public"."supplier_orders"("supplier_order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_orders" ADD CONSTRAINT "supplier_orders_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_orders" ADD CONSTRAINT "supplier_orders_supplier_id_suppliers_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("supplier_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_supplier_id_suppliers_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("supplier_id") ON DELETE no action ON UPDATE no action;