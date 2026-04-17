import { integer, serial, text, varchar, pgTable } from "drizzle-orm/pg-core";

export const sasaranStrategis = pgTable("sasaran_strategis", {
  id: serial("id").primaryKey().notNull(),
  tujuanId: integer("tujuan_id"),
  kode: varchar("kode", { length: 10 }),
  sasaranText: text("sasaran_text").notNull(),
});
