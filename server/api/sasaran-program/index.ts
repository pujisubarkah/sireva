import { db } from '../../db';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { unitKerja } from '../../db/schema/unit-kerja';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.method;
  const query = getQuery(event);

  try {
    if (method === 'GET') {
      if (query.id) {
        return await db.select({
          id: sasaranProgram.id,
          idSs: sasaranProgram.idSs,
          kode: sasaranProgram.kode,
          sasaranText: sasaranProgram.sasaranText,
          unitKerjaId: sasaranProgram.unitKerjaId,
          unitKerjaNama: unitKerja.nama,
        })
        .from(sasaranProgram)
        .leftJoin(unitKerja, eq(sasaranProgram.unitKerjaId, unitKerja.id))
        .where(eq(sasaranProgram.id, Number(query.id)));
      }

      return await db.select({
        id: sasaranProgram.id,
        idSs: sasaranProgram.idSs,
        kode: sasaranProgram.kode,
        sasaranText: sasaranProgram.sasaranText,
        unitKerjaId: sasaranProgram.unitKerjaId,
        unitKerjaNama: unitKerja.nama,
      })
      .from(sasaranProgram)
      .leftJoin(unitKerja, eq(sasaranProgram.unitKerjaId, unitKerja.id));
    }
    if (method === 'POST') {
      const body = await readBody(event);
      return await db.insert(sasaranProgram).values(body).returning();
    }
    if (method === 'PUT') {
      const body = await readBody(event);
      if (!body.id) throw new Error('ID is required');
      return await db.update(sasaranProgram).set(body).where(eq(sasaranProgram.id, body.id)).returning();
    }
    if (method === 'DELETE') {
      const body = await readBody(event);
      if (!body.id) throw new Error('ID is required');
      return await db.delete(sasaranProgram).where(eq(sasaranProgram.id, body.id)).returning();
    }
  } catch (error: any) {
    console.error('API Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error'
    });
  }
});