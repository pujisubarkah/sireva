import { integer, serial, varchar, numeric, timestamp, pgTable } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const realisasiIndikator = pgTable("realisasi_indikator", {
  id: serial("id").primaryKey().notNull(),
  indikatorKode: varchar("indikator_kode", { length: 50 }),
  unitId: integer("unit_id"),
  tahun: integer("tahun"),
  bulan: integer("bulan"),
  triwulan: integer("triwulan"),
  target: numeric("target"),
  realisasi: numeric("realisasi"),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});
