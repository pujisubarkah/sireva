import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  if (method === 'GET') {
    if (query.id) {
      return await db.select().from(sasaranStrategis).where(eq(sasaranStrategis.id, Number(query.id)));
    }
    return await db.select().from(sasaranStrategis);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(sasaranStrategis).values(body).returning();
  }
  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.update(sasaranStrategis).set(body).where(eq(sasaranStrategis.id, body.id)).returning();
  }
  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(sasaranStrategis).where(eq(sasaranStrategis.id, body.id)).returning();
  }
});