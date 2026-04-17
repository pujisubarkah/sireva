import { integer, serial, varchar, numeric, timestamp, pgTable } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const pendanaan = pgTable("pendanaan", {
  id: serial("id").primaryKey().notNull(),
  programId: integer("program_id"),
  kegiatanId: integer("kegiatan_id"),
  tahunId: integer("tahun_id"),
  sumberDana: varchar("sumber_dana", { length: 50 }),
  pagu: numeric("pagu"),
  realisasi: numeric("realisasi"),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});
