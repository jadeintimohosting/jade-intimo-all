ALTER TABLE "orders" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "first_name" varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "last_name" varchar(128) NOT NULL;