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
    
    const { sasaranStrategis } = await import('../../db/schema/sasaran-strategis');
    
    return await db.select({
      id: indikatorKinerja.id,
      sasaranId: indikatorKinerja.sasaranId,
      namaIndikator: indikatorKinerja.namaIndikator,
      unitKerja: indikatorKinerja.unitKerja,
      kode: indikatorKinerja.kode,
      sasaranText: sasaranStrategis.sasaranText
    })
    .from(indikatorKinerja)
    .leftJoin(sasaranStrategis, eq(indikatorKinerja.sasaranId, sasaranStrategis.id));
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