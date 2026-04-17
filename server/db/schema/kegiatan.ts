import { integer, serial, varchar, text, pgTable } from "drizzle-orm/pg-core";


export const kegiatan = pgTable("kegiatan", {
  id: serial("id").primaryKey().notNull(),
  programId: integer("program_id"),
  kode: varchar("kode", { length: 20 }),
  namaKegiatan: text("nama_kegiatan").notNull(),
});
