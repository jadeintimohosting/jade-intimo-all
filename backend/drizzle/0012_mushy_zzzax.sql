ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending';