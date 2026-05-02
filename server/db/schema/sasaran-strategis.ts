import { serial, text, varchar } from "drizzle-orm/pg-core";
import { appSchema } from "./base";

export const sasaranStrategis = appSchema.table("sasaran_strategis", {
  id: serial("id").primaryKey().notNull(),
  kode: varchar("kode"),
  sasaranText: text("sasaran_text").notNull(),
});