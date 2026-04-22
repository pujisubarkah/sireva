import { integer, serial, numeric, text, foreignKey } from "drizzle-orm/pg-core";
import { appSchema } from "./base";
import { indikatorKinerja } from "./indikator-kinerja";

export const rencanaAksi = appSchema.table("rencana_aksi", {
  id: serial("id").primaryKey().notNull(),
  indikatorId: integer("indikator_id").notNull(),
  namaRencanaAksi: text("nama_rencana_aksi").notNull(),
  target: numeric("target"),
  tw1: numeric("tw1"),
  tw2: numeric("tw2"),
  tw3: numeric("tw3"),
  tw4: numeric("tw4"),
}, (table) => [
  foreignKey({
    columns: [table.indikatorId],
    foreignColumns: [indikatorKinerja.id],
    name: "rencana_aksi_indikator_id_fkey"
  }).onDelete("cascade"),
]);
