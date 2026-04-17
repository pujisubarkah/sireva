import { serial, varchar, pgTable } from "drizzle-orm/pg-core";

export const sumberDana = pgTable("sumber_dana", {
  id: serial("id").primaryKey().notNull(),
  nama: varchar("nama", { length: 100 }),
});
