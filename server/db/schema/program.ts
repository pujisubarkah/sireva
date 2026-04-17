import { integer, serial, varchar, text, pgTable } from "drizzle-orm/pg-core";

export const program = pgTable("program", {
  id: serial("id").primaryKey().notNull(),
  sasaranId: integer("sasaran_id"),
  kode: varchar("kode", { length: 20 }),
  namaProgram: text("nama_program").notNull(),
});
