CREATE TABLE IF NOT EXISTS "repo_posts" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "repo_posts" ADD CONSTRAINT "repo_posts_user_id_repo_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."repo_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
