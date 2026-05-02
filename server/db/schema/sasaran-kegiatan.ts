import { integer, serial, varchar, text } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const sasaranKegiatan = appSchema.table("sasaran_kegiatan", {
  id: serial("id").primaryKey().notNull(),
  idSp: integer("id_sp"),
  kode: varchar("kode"),
  sasaranText: text("sasaran_text").notNull(),
  unitKerjaId: integer("unit_kerja_id"),
});