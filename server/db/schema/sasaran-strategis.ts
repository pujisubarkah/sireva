import { serial, text, varchar, integer } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const sasaranStrategis = appSchema.table("sasaran_strategis", {
  id: serial("id").primaryKey().notNull(),
  kode: varchar("kode"),
  sasaranText: text("sasaran_text").notNull(),
  unitKerjaId: integer("unit_kerja_id"),
  tujuanId: integer("tujuan_id"),
});