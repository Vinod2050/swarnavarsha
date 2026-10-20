import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "daily_rates" ADD COLUMN "label" varchar;`)
  // Existing rows get the same "15 Oct 2026 · Buying" label the save hook writes
  await db.execute(sql`
   UPDATE "daily_rates" SET "label" =
     to_char("rate_date" AT TIME ZONE 'Asia/Kolkata', 'FMDD Mon YYYY') || ' · ' || initcap("type"::text);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "daily_rates" DROP COLUMN "label";`)
}
