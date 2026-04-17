import { integer, serial, pgTable } from "drizzle-orm/pg-core";

export const kegiatanUnit = pgTable("kegiatan_unit", {
  id: serial("id").primaryKey().notNull(),
  kegiatanId: integer("kegiatan_id"),
  unitId: integer("unit_id"),
});
