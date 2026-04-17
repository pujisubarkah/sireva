import { db } from '../../db';
import { targetIndikator } from '../../db/schema/target-indikator';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(targetIndikator).where(eq(targetIndikator.id, Number(query.id)));
    }
    return await db.select().from(targetIndikator);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(targetIndikator).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.update(targetIndikator).set(body).where(eq(targetIndikator.id, body.id)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(targetIndikator).where(eq(targetIndikator.id, body.id)).returning();
  }
});