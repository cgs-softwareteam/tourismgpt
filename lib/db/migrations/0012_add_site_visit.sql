CREATE TABLE IF NOT EXISTS "SiteVisit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
