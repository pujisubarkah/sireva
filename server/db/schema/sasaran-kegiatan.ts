import { integer, serial, varchar, text, numeric } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const sasaranKegiatan = appSchema.table("sasaran_kegiatan", {
  id: serial("id").primaryKey().notNull(),
  id_ss: integer("id_ss"),
  id_is: integer("id_is"),
  id_sp: integer("id_sp"),
  id_ip: integer("id_ip"),
  kode: varchar("kode", { length: 255 }),
  unit_kerja: varchar("unit_kerja", { length: 1000 }),
  indikator_kinerja: varchar("indikator_kinerja", { length: 1000 }),
  sasaran_kegiatan_text: text("sasaran_kegiatan_text"),
  satuan: varchar("satuan", { length: 255 }),
  target_1: numeric("target_1"),
  target_2: numeric("target_2"),
  target_3: numeric("target_3"),
  target_4: numeric("target_4"),
  target_5: numeric("target_5"),
});