import { integer, serial, varchar, text, pgTable } from "drizzle-orm/pg-core";

export const sasaranProgram = pgTable("sasaran_program", {
  id: serial("id").primaryKey().notNull(),
  programId: integer("program_id"),
  kode: varchar("kode", { length: 20 }),
  sasaranText: text("sasaran_text").notNull(),
});
