CREATE TABLE IF NOT EXISTS "SavedRecommendation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"chatId" uuid NOT NULL,
	"recommendationName" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"location" text NOT NULL,
	"description" text,
	"price" varchar(50),
	"rating" varchar(20),
	"hours" text,
	"address" text,
	"bestFor" text,
	"tips" text,
	"savedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SavedRecommendation" ADD CONSTRAINT "SavedRecommendation_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SavedRecommendation" ADD CONSTRAINT "SavedRecommendation_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
