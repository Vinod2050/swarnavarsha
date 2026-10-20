import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DELETE FROM "navigation_items" WHERE "page" IN ('/home-2', '/home-3', '/home-4');
  ALTER TABLE "navigation_items" ALTER COLUMN "page" SET DATA TYPE text;
  DROP TYPE "public"."enum_navigation_items_page";
  CREATE TYPE "public"."enum_navigation_items_page" AS ENUM('/', '/about', '/services', '/sell-gold', '/release-pledged-gold', '/buy-gold', '/store', '/how-it-works', '/faq', '/contact');
  ALTER TABLE "navigation_items" ALTER COLUMN "page" SET DATA TYPE "public"."enum_navigation_items_page" USING "page"::"public"."enum_navigation_items_page";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_navigation_items_page" ADD VALUE '/home-2' BEFORE '/about';
  ALTER TYPE "public"."enum_navigation_items_page" ADD VALUE '/home-3' BEFORE '/about';
  ALTER TYPE "public"."enum_navigation_items_page" ADD VALUE '/home-4' BEFORE '/about';`)
}
