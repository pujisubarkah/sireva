import { integer, serial, varchar, text } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const sasaranProgram = appSchema.table("sasaran_program", {
  id: serial("id").primaryKey().notNull(),
  idSs: integer("id_ss"),
  kode: varchar("kode"),
  sasaranText: text("sasaran_text").notNull(),
  unitKerjaId: integer("unit_kerja_id"),
});