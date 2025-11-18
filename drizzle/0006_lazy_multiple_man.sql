CREATE TABLE "product_images" (
	"product_image_id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "product_variant_img" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "product_img" integer;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_variant_img_product_images_product_image_id_fk" FOREIGN KEY ("product_variant_img") REFERENCES "public"."product_images"("product_image_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_product_img_product_images_product_image_id_fk" FOREIGN KEY ("product_img") REFERENCES "public"."product_images"("product_image_id") ON DELETE no action ON UPDATE no action;