import { db } from '../../db';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(sasaranKegiatan).where(eq(sasaranKegiatan.id, Number(query.id)));
    }
    
    const { kegiatan } = await import('../../db/schema/kegiatan');
    
    return await db.select({
      id: sasaranKegiatan.id,
      kegiatanId: sasaranKegiatan.kegiatanId,
      kode: sasaranKegiatan.kode,
      sasaranText: sasaranKegiatan.sasaranText,
      namaIndikator: sasaranKegiatan.namaIndikator,
      satuan: sasaranKegiatan.satuan,
      target: sasaranKegiatan.target,
      unitKerja: sasaranKegiatan.unitKerja,
      anggaran: sasaranKegiatan.anggaran,
      kegiatanName: kegiatan.namaKegiatan
    })
    .from(sasaranKegiatan)
    .leftJoin(kegiatan, eq(sasaranKegiatan.kegiatanId, kegiatan.id));
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