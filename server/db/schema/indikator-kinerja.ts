import { integer, serial, numeric, text, varchar, pgTable} from "drizzle-orm/pg-core";

export const indikatorKinerja = pgTable("indikator_kinerja", {
  id: serial("id").primaryKey().notNull(),
  sasaranId: integer("sasaran_id"),
  kode: varchar("kode", { length: 20 }),
  namaIndikator: text("nama_indikator").notNull(),
  satuan: varchar("satuan", { length: 50 }),
  jenis: varchar("jenis", { length: 50 }),
  baseline: numeric("baseline"),
});
