ALTER TABLE "users" DROP CONSTRAINT "users_phone_number_unique";--> statement-breakpoint
ALTER TABLE "suppliers" ALTER COLUMN "supplier_description" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "status" "OrderStatus" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "firebase_uid" varchar(128);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_firebase_uid_unique" UNIQUE("firebase_uid");