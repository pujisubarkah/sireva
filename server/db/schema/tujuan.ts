import { integer, serial, text, varchar, pgTable } from "drizzle-orm/pg-core";

export const tujuan = pgTable("tujuan", {
  id: serial("id").primaryKey().notNull(),
  misiId: integer("misi_id"),
  kode: varchar("kode", { length: 10 }),
  tujuanText: text("tujuan_text").notNull(),
});
