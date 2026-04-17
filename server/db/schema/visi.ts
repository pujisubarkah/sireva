import { integer, serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const visi = pgTable("visi", {
  id: serial("id").primaryKey().notNull(),
  periodeId: integer("periode_id"),
  visiText: text("visi_text").notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});
