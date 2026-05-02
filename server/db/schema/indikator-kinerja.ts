import { integer, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const indikatorKinerja = appSchema.table("indikator_kinerja", {
  id: serial("id").primaryKey().notNull(),
  idSk: integer("id_sk"),
  namaIku: text("nama_iku"),
  satuanPengukuran: varchar("satuan_pengukuran"),
  definisi: text("definisi"),
  formulaPenghitungan: text("formula_penghitungan"),
  tujuan: text("tujuan"),
  tingkatKendali: varchar("tingkat_kendali"),
  tingkatValiditas: varchar("tingkat_validitas"),
  polarisasiCapaian: varchar("polarisasi_capaian"),
  unitPenyediaData: text("unit_penyedia_data"),
  unitTerlibat: text("unit_terlibat"),
  sumberData: text("sumber_data"),
  waktuKetersediaanData: varchar("waktu_ketersediaan_data"),
  periodePelaporan: varchar("periode_pelaporan"),
  risiko: text("risiko"),
  mitigasiRisiko: text("mitigasi_risiko"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});