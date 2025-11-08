ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_cart_id_carts_cart_id_fk";
--> statement-breakpoint
ALTER TABLE "suppliers" ALTER COLUMN "supplier_description" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_carts_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("cart_id") ON DELETE cascade ON UPDATE no action;