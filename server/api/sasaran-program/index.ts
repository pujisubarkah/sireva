import { db } from '../../db';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(sasaranProgram).where(eq(sasaranProgram.id, Number(query.id)));
    }
    return await db.select().from(sasaranProgram);
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
});