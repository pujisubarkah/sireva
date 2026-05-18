import { integer, serial, varchar, text, numeric } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const sasaranProgram = appSchema.table("sasaran_program", {
  id: serial("id").primaryKey().notNull(),
  id_ss: integer("id_ss"),
  kode: varchar("kode"),
  unit_kerja: varchar("unit_kerja"),
  kode_iku: varchar("kode_iku"),
  sasaran_program_text: varchar("sasaran_program_text"),
  satuan: varchar("satuan"),
  target_1: numeric("target_1"),
  target_2: numeric("target_2"),
  target_3: numeric("target_3"),
  target_4: numeric("target_4"),
  target_5: numeric("target_5"),
});