import { db } from '../../db';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { unitKerja } from '../../db/schema/unit-kerja';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { eq, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select({
        id: sasaranKegiatan.id,
        idSp: sasaranKegiatan.idSp,
        kode: sasaranKegiatan.kode,
        sasaranText: sasaranKegiatan.sasaranText,
        unitKerjaId: sasaranKegiatan.unitKerjaId,
        unitKerjaNama: unitKerja.nama,
        namaIku: sql<string | null>`max(${indikatorKinerja.namaIku})`,
      })
      .from(sasaranKegiatan)
      .leftJoin(unitKerja, eq(sasaranKegiatan.unitKerjaId, unitKerja.id))
      .leftJoin(indikatorKinerja, eq(sasaranKegiatan.id, indikatorKinerja.idSk))
      .where(eq(sasaranKegiatan.id, Number(query.id)))
      .groupBy(
        sasaranKegiatan.id,
        sasaranKegiatan.idSp,
        sasaranKegiatan.kode,
        sasaranKegiatan.sasaranText,
        sasaranKegiatan.unitKerjaId,
        unitKerja.nama,
      );
    }

    return await db.select({
      id: sasaranKegiatan.id,
      idSp: sasaranKegiatan.idSp,
      kode: sasaranKegiatan.kode,
      sasaranText: sasaranKegiatan.sasaranText,
      unitKerjaId: sasaranKegiatan.unitKerjaId,
      unitKerjaNama: unitKerja.nama,
      namaIku: sql<string | null>`max(${indikatorKinerja.namaIku})`,
    })
    .from(sasaranKegiatan)
    .leftJoin(unitKerja, eq(sasaranKegiatan.unitKerjaId, unitKerja.id))
    .leftJoin(indikatorKinerja, eq(sasaranKegiatan.id, indikatorKinerja.idSk))
    .groupBy(
      sasaranKegiatan.id,
      sasaranKegiatan.idSp,
      sasaranKegiatan.kode,
      sasaranKegiatan.sasaranText,
      sasaranKegiatan.unitKerjaId,
      unitKerja.nama,
    );
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(sasaranKegiatan).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.update(sasaranKegiatan).set(body).where(eq(sasaranKegiatan.id, body.id)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(sasaranKegiatan).where(eq(sasaranKegiatan.id, body.id)).returning();
  }
});