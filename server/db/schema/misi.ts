import { integer, serial, text, varchar,  pgTable } from "drizzle-orm/pg-core";

export const misi = pgTable("misi", {
  id: serial("id").primaryKey().notNull(),
  visiId: integer("visi_id"),
  kode: varchar("kode", { length: 10 }),
  misiText: text("misi_text").notNull(),
});
