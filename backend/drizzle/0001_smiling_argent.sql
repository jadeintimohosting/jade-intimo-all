CREATE TYPE "public"."category" AS ENUM('noutati', 'curvy-marimi-mari', 'sutiene', 'chiloti', 'lenjerie', 'pijamale', 'imbracaminte', 'costume-de-baie', 'sosete');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('women', 'men');--> statement-breakpoint
CREATE TYPE "public"."subcategory" AS ENUM('toate', 'toti', 'push-up', 'balconet', 'triunghi', 'bralette-bustiera', 'clasic-cupa-buretata', 'clasic-neburetat-sarma', 'multifunctional', 'cu-burete', 'fara-burete', 'cu-sarma', 'fara-sarma', 'brazilian', 'tanga', 'slip', 'talie-inalta', 'modelator', 'invizibili-fara-cusaturi', 'body', 'corset', 'portjartiera', 'halat', 'babydoll', 'top', 'maiou', 'accesorii', 'maneca-lunga-pantalon-lung', 'camasa-de-noapte', 'lenjerie-de-noapte', 'pijamale-premium', 'pijamale-pentru-copii', 'tricouri-polo', 'treninguri', 'tinute-de-casa', 'maiouri', 'sosete', 'dresuri', 'costume-intregi', 'costume-intregi-modelatoare', 'costume-2-piese', 'sutien-de-baie', 'slip-de-baie', 'tankini', 'tinute-de-plaja', 'scuba', 'costume-push-up', 'costume-chilot-brazilian', 'clasici', 'boxeri', 'pijamale-pentru-barbati', 'tricouri', 'short-uri', 'slipuri', 'body-si-corset', 'chiloti-curvy');--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"size" varchar(32) NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"gender" "gender" NOT NULL,
	"category" "category" NOT NULL,
	"subcategory" "subcategory",
	"name" varchar(255) NOT NULL,
	"image" text,
	"description" text,
	"material" varchar(100),
	"price" integer NOT NULL,
	"big_sizes" boolean DEFAULT false NOT NULL,
	"sold_pieces" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;