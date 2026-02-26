ALTER TABLE "products" ALTER COLUMN "cod" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "cod" SET NOT NULL;