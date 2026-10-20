import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_access_request" AS ENUM('reset', 'unlock');
  ALTER TYPE "public"."enum_audit_logs_action" ADD VALUE 'request';
  ALTER TABLE "users" ADD COLUMN "access_request" "enum_users_access_request";
  ALTER TABLE "users" ADD COLUMN "access_requested_at" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "audit_logs" ALTER COLUMN "action" SET DATA TYPE text;
  DROP TYPE "public"."enum_audit_logs_action";
  CREATE TYPE "public"."enum_audit_logs_action" AS ENUM('login', 'create', 'update', 'delete', 'export');
  ALTER TABLE "audit_logs" ALTER COLUMN "action" SET DATA TYPE "public"."enum_audit_logs_action" USING "action"::"public"."enum_audit_logs_action";
  ALTER TABLE "users" DROP COLUMN "access_request";
  ALTER TABLE "users" DROP COLUMN "access_requested_at";
  DROP TYPE "public"."enum_users_access_request";`)
}
