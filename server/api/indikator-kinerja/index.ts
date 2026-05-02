import { db } from '../../db';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(indikatorKinerja).where(eq(indikatorKinerja.id, Number(query.id)));
    }
    
    const { sasaranKegiatan } = await import('../../db/schema/sasaran-kegiatan');
    
    return await db.select({
      id: indikatorKinerja.id,
      idSk: indikatorKinerja.idSk,
      namaIku: indikatorKinerja.namaIku,
      satuanPengukuran: indikatorKinerja.satuanPengukuran,
      definisi: indikatorKinerja.definisi,
      formulaPenghitungan: indikatorKinerja.formulaPenghitungan,
      tujuan: indikatorKinerja.tujuan,
      tingkatKendali: indikatorKinerja.tingkatKendali,
      tingkatValiditas: indikatorKinerja.tingkatValiditas,
      polarisasiCapaian: indikatorKinerja.polarisasiCapaian,
      unitPenyediaData: indikatorKinerja.unitPenyediaData,
      unitTerlibat: indikatorKinerja.unitTerlibat,
      sumberData: indikatorKinerja.sumberData,
      waktuKetersediaanData: indikatorKinerja.waktuKetersediaanData,
      periodePelaporan: indikatorKinerja.periodePelaporan,
      risiko: indikatorKinerja.risiko,
      mitigasiRisiko: indikatorKinerja.mitigasiRisiko,
      createdAt: indikatorKinerja.createdAt,
      updatedAt: indikatorKinerja.updatedAt,
      sasaranText: sasaranKegiatan.sasaranText
    })
    .from(indikatorKinerja)
    .leftJoin(sasaranKegiatan, eq(indikatorKinerja.idSk, sasaranKegiatan.id));
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(indikatorKinerja).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.update(indikatorKinerja).set(body).where(eq(indikatorKinerja.id, body.id)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(indikatorKinerja).where(eq(indikatorKinerja.id, body.id)).returning();
  }
});