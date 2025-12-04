ALTER TABLE "couriers" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "couriers" CASCADE;--> statement-breakpoint
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_tracking_num_unique";--> statement-breakpoint
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_courier_id_couriers_courier_id_fk";
--> statement-breakpoint
ALTER TABLE "shipments" ALTER COLUMN "shipment_id" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "shipments" ALTER COLUMN "shipment_id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "carrier_id" varchar(25) NOT NULL;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "service_code" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "shipment_status" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "tracking_number" varchar(100);--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "label_id" varchar(25);--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "label_url" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "ship_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "region";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "province";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "barangay";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "zip_code";--> statement-breakpoint
ALTER TABLE "shipments" DROP COLUMN "courier_id";--> statement-breakpoint
ALTER TABLE "shipments" DROP COLUMN "tracking_num";--> statement-breakpoint
ALTER TABLE "shipments" DROP COLUMN "date_shipped";--> statement-breakpoint
ALTER TABLE "shipments" DROP COLUMN "date_delivered";