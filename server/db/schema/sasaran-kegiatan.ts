import { integer, serial, text, varchar, pgTable } from "drizzle-orm/pg-core";

export const sasaranKegiatan = pgTable("sasaran_kegiatan", {
  id: serial("id").primaryKey().notNull(),
  kegiatanId: integer("kegiatan_id"),
  kode: varchar("kode", { length: 10 }),
  sasaranText: text("sasaran_text").notNull(),
});
