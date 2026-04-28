import { db } from '../server/db';
import { rencanaAksi } from '../server/db/schema/rencana-aksi';
import { indikatorKinerja } from '../server/db/schema/indikator-kinerja';
import { sasaranStrategis } from '../server/db/schema/sasaran-strategis';
import { eq } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.select({
      id: rencanaAksi.id,
      indikatorId: rencanaAksi.indikatorId,
      rencanaAksi: rencanaAksi.namaRencanaAksi,
      target: rencanaAksi.target,
      tw1: rencanaAksi.tw1,
      tw2: rencanaAksi.tw2,
      tw3: rencanaAksi.tw3,
      tw4: rencanaAksi.tw4,
      indikator: indikatorKinerja.namaIndikator,
      sasaran: sasaranStrategis.sasaranText
    })
    .from(rencanaAksi)
    .leftJoin(indikatorKinerja, eq(rencanaAksi.indikatorId, indikatorKinerja.id))
    .leftJoin(sasaranStrategis, eq(indikatorKinerja.sasaranId, sasaranStrategis.id));
    console.log(res);
  } catch (error) {
    console.error('RAW ERROR:');
    console.error(error);
  }
}
main();
