import { db } from '../../db';
import { indikatorStrategis } from '../../db/schema/indikator-strategis';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  if (method === 'GET') {
    if (query.sasaranStrategisId) {
      return await db.select().from(indikatorStrategis)
        .where(eq(indikatorStrategis.sasaranStrategisId, Number(query.sasaranStrategisId)));
    }
    return await db.select().from(indikatorStrategis);
  }

  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(indikatorStrategis).values(body).returning();
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.update(indikatorStrategis).set(body).where(eq(indikatorStrategis.id, body.id)).returning();
  }

  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(indikatorStrategis).where(eq(indikatorStrategis.id, body.id)).returning();
  }
});
