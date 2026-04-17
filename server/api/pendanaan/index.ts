import { db } from '../../db';
import { pendanaan } from '../../db/schema/pendanaan';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(pendanaan).where(eq(pendanaan.id, Number(query.id)));
    }
    return await db.select().from(pendanaan);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(pendanaan).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.update(pendanaan).set(body).where(eq(pendanaan.id, body.id)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(pendanaan).where(eq(pendanaan.id, body.id)).returning();
  }
});