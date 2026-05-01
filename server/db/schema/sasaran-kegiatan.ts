import { integer, serial, varchar, text, numeric, foreignKey } from "drizzle-orm/pg-core";
import { appSchema } from "./base";
import { kegiatan } from "./kegiatan";

export const sasaranKegiatan = appSchema.table("sasaran_kegiatan", {
  id: serial("id").primaryKey().notNull(),
  kegiatanId: integer("kegiatan_id"),
  kode: varchar("kode", { length: 20 }),
  sasaranText: text("sasaran_text").notNull(),
  namaIndikator: text("nama_indikator"),
  satuan: varchar("satuan", { length: 100 }),
  target: numeric("target"),
  unitKerja: varchar("unit_kerja", { length: 255 }),
  anggaran: varchar("anggaran", { length: 255 }),
}, (table) => [
  foreignKey({
    columns: [table.kegiatanId],
    foreignColumns: [kegiatan.id],
    name: "sasaran_kegiatan_kegiatan_id_fkey"
  }).onDelete("cascade"),
]);