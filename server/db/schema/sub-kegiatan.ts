import { integer, serial, varchar, text, pgTable } from "drizzle-orm/pg-core";

export const subKegiatan = pgTable("sub_kegiatan", {
  id: serial("id").primaryKey().notNull(),
  kegiatanId: integer("kegiatan_id"),
  kode: varchar("kode", { length: 20 }),
  namaSubKegiatan: text("nama_sub_kegiatan"),
  output: text("output"),
});
