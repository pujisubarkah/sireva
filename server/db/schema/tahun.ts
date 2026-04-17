import { integer, serial, pgTable } from "drizzle-orm/pg-core";

export const tahun = pgTable("tahun", {
  id: serial("id").primaryKey().notNull(),
  tahun: integer("tahun").notNull(),
  periodeId: integer("periode_id"),
});
