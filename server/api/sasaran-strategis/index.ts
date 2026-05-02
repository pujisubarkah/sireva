import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { indikatorStrategis } from '../../db/schema/indikator-strategis';
import { eq, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getMethod, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    // Flat list: one row per indikator
    return await db.select({
      ssId: sasaranStrategis.id,
      kode: sasaranStrategis.kode,
      sasaranText: sasaranStrategis.sasaranText,
      indikatorId: indikatorStrategis.id,
      indikatorNama: indikatorStrategis.nama,
      indikatorSatuan: indikatorStrategis.satuan,
      targets: sql<any[]>`
        coalesce(
          (
            select jsonb_agg(
              jsonb_build_object(
                'tahun', tis.tahun,
                'target', tis.target
              )
              order by tis.tahun
            )
            from sireva.target_indikator_strategis tis
            where tis.indikator_id = ${indikatorStrategis.id}
          ),
          '[]'::jsonb
        )
      `,
    })
    .from(sasaranStrategis)
    .leftJoin(indikatorStrategis, eq(sasaranStrategis.id, indikatorStrategis.sasaranStrategisId))
    .orderBy(sasaranStrategis.id, indikatorStrategis.nama);
  }
  if (method === 'POST') {
    const body = await readBody(event);
    return await db.insert(sasaranStrategis).values(body).returning();
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});