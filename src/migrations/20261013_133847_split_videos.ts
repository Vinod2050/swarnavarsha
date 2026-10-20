import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "feedback_videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_name" varchar,
  	"consent_confirmed" boolean DEFAULT false,
  	"poster_id" integer,
  	"active" boolean DEFAULT true,
  	"order" numeric DEFAULT 10 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "feedback_videos_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP INDEX "videos_kind_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "feedback_videos_id" integer;
  ALTER TABLE "feedback_videos" ADD CONSTRAINT "feedback_videos_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "feedback_videos_locales" ADD CONSTRAINT "feedback_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."feedback_videos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "feedback_videos_poster_idx" ON "feedback_videos" USING btree ("poster_id");
  CREATE INDEX "feedback_videos_updated_at_idx" ON "feedback_videos" USING btree ("updated_at");
  CREATE INDEX "feedback_videos_created_at_idx" ON "feedback_videos" USING btree ("created_at");
  CREATE UNIQUE INDEX "feedback_videos_filename_idx" ON "feedback_videos" USING btree ("filename");
  CREATE UNIQUE INDEX "feedback_videos_locales_locale_parent_id_unique" ON "feedback_videos_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_feedback_videos_fk" FOREIGN KEY ("feedback_videos_id") REFERENCES "public"."feedback_videos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_feedback_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("feedback_videos_id");
  ALTER TABLE "videos" DROP COLUMN "kind";
  ALTER TABLE "videos" DROP COLUMN "customer_name";
  ALTER TABLE "videos" DROP COLUMN "consent_confirmed";
  DROP TYPE "public"."enum_videos_kind";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_videos_kind" AS ENUM('advert', 'feedback');
  ALTER TABLE "feedback_videos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "feedback_videos_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "feedback_videos" CASCADE;
  DROP TABLE "feedback_videos_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_feedback_videos_fk";
  
  DROP INDEX "payload_locked_documents_rels_feedback_videos_id_idx";
  ALTER TABLE "videos" ADD COLUMN "kind" "enum_videos_kind" DEFAULT 'advert' NOT NULL;
  ALTER TABLE "videos" ADD COLUMN "customer_name" varchar;
  ALTER TABLE "videos" ADD COLUMN "consent_confirmed" boolean DEFAULT false;
  CREATE INDEX "videos_kind_idx" ON "videos" USING btree ("kind");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "feedback_videos_id";`)
}
