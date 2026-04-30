import { integer, serial, varchar, text, numeric, foreignKey } from "drizzle-orm/pg-core";
import { appSchema } from "./base";
import { program } from "./program";

export const sasaranProgram = appSchema.table("sasaran_program", {
  id: serial("id").primaryKey().notNull(),
  programId: integer("program_id"),
  kode: varchar("kode", { length: 20 }),
  sasaranText: text("sasaran_text").notNull(),
  namaIndikator: text("nama_indikator"),
  satuan: varchar("satuan", { length: 100 }),
  target2025: numeric("target_2025"),
  target2026: numeric("target_2026"),
  target2027: numeric("target_2027"),
  target2028: numeric("target_2028"),
  target2029: numeric("target_2029"),
  unitKerja: varchar("unit_kerja", { length: 255 }),
}, (table) => [
  foreignKey({
    columns: [table.programId],
    foreignColumns: [program.id],
    name: "sasaran_program_program_id_fkey"
  }).onDelete("cascade"),
]);