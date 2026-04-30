import { db } from '../../db';
import { rencanaAksi } from '../../db/schema/rencana-aksi';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

/**
 * Handle CRUD operations for Rencana Aksi
 */
export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  try {
    // GET: Fetch plans with labels
    if (method === 'GET') {
      if (query.id) {
        return await db.select().from(rencanaAksi).where(eq(rencanaAksi.id, Number(query.id)));
      }
      
      return await db.select({
        id: rencanaAksi.id,
        indikatorId: rencanaAksi.indikatorId,
        rencanaAksi: rencanaAksi.namaRencanaAksi,
        target: rencanaAksi.target,
        indikator: indikatorKinerja.namaIndikator,
        sasaran: sasaranStrategis.sasaranText,
        unitKerja: indikatorKinerja.unitKerja
      })
      .from(rencanaAksi)
      .leftJoin(indikatorKinerja, eq(rencanaAksi.indikatorId, indikatorKinerja.id))
      .leftJoin(sasaranStrategis, eq(indikatorKinerja.sasaranId, sasaranStrategis.id));
    }

    // POST: Create new plan
    if (method === 'POST') {
      const body = await readBody(event);
      const [res] = await db.insert(rencanaAksi).values({
        indikatorId: body.indikatorId,
        namaRencanaAksi: body.rencanaAksi,
        target: body.target,
      }).returning();
      return { success: true, data: res };
    }

    // PUT: Update plan
    if (method === 'PUT') {
      const body = await readBody(event);
      if (!body.id) throw new Error('ID is required');
      
      const [res] = await db.update(rencanaAksi).set({
        indikatorId: body.indikatorId,
        namaRencanaAksi: body.rencanaAksi,
        target: body.target,
      }).where(eq(rencanaAksi.id, body.id)).returning();
      
      return { success: true, data: res };
    }

    // DELETE: Delete plan
    if (method === 'DELETE') {
      const body = await readBody(event);
      if (!body.id) throw new Error('ID is required');
      
      await db.delete(rencanaAksi).where(eq(rencanaAksi.id, body.id));
      return { success: true };
    }
  } catch (error: any) {
    console.error('API Error [rencana-aksi]:', error);
    return { success: false, message: error.message };
  }
});
