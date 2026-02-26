ALTER TYPE "public"."order_status" ADD VALUE 'pending' BEFORE 'shipping';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "cod" varchar(64) DEFAULT 0;