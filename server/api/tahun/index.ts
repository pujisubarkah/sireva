import { db } from '../../db';
import { tahun } from '../../db/schema/tahun';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(tahun).where(eq(tahun.id, Number(query.id)));
    }
    return await db.select().from(tahun);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(tahun).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.update(tahun).set(body).where(eq(tahun.id, body.id)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(tahun).where(eq(tahun.id, body.id)).returning();
  }
});