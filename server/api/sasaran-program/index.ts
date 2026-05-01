import { db } from '../../db';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.method;
  const query = getQuery(event);

  try {
    if (method === 'GET') {
      if (query.id) {
        return await db.select().from(sasaranProgram).where(eq(sasaranProgram.id, Number(query.id)));
      }
      
      const { program } = await import('../../db/schema/program');
      
      return await db.select({
        id: sasaranProgram.id,
        programId: sasaranProgram.programId,
        kode: sasaranProgram.kode,
        sasaranText: sasaranProgram.sasaranText,
        namaIndikator: sasaranProgram.namaIndikator,
        satuan: sasaranProgram.satuan,
        target2025: sasaranProgram.target2025,
        target2026: sasaranProgram.target2026,
        target2027: sasaranProgram.target2027,
        target2028: sasaranProgram.target2028,
        target2029: sasaranProgram.target2029,
        unitKerja: sasaranProgram.unitKerja,
        programName: program.namaProgram
      })
      .from(sasaranProgram)
      .leftJoin(program, eq(sasaranProgram.programId, program.id));
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