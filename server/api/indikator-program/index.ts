import { db } from '../../db';
import { indikatorProgram } from '../../db/schema/indikator-program';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  if (method === 'GET') {
    if (query.sasaranProgramId) {
      return await db.select().from(indikatorProgram)
        .where(eq(indikatorProgram.sasaranProgramId, Number(query.sasaranProgramId)));
    }
    return await db.select().from(indikatorProgram);
  }

  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(indikatorProgram).values(body).returning();
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.update(indikatorProgram).set(body).where(eq(indikatorProgram.id, body.id)).returning();
  }

  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(indikatorProgram).where(eq(indikatorProgram.id, body.id)).returning();
  }
});
