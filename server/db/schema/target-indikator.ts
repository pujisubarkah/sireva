import { integer, serial, numeric, timestamp, unique, pgTable } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const targetIndikator = pgTable("target_indikator", {
  id: serial("id").primaryKey().notNull(),
  indikatorId: integer("indikator_id"),
  tahunId: integer("tahun_id"),
  target: numeric("target"),
  realisasi: numeric("realisasi"),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  unique("target_indikator_indikator_id_tahun_id_key").on(table.indikatorId, table.tahunId),
]);
