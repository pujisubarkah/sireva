import { db } from '../../db';
import { targetIndikatorStrategis } from '../../db/schema/target-indikator-strategis';
import { eq } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  if (method === 'GET') {
    if (query.indikatorId) {
      return await db.select().from(targetIndikatorStrategis)
        .where(eq(targetIndikatorStrategis.indikatorId, Number(query.indikatorId)));
    }
    return await db.select().from(targetIndikatorStrategis);
  }

  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(targetIndikatorStrategis).values(body).returning();
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.update(targetIndikatorStrategis).set(body).where(eq(targetIndikatorStrategis.id, body.id)).returning();
  }

  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) throw new Error('ID is required');
    return await db.delete(targetIndikatorStrategis).where(eq(targetIndikatorStrategis.id, body.id)).returning();
  }
});
