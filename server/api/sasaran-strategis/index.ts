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
      unitKerjaId: sasaranStrategis.unitKerjaId,
      tujuanId: sasaranStrategis.tujuanId,
      ownerUnitName: sql<string>`(select nama from sireva.unit_kerja where id = ${sasaranStrategis.unitKerjaId})`,
      unitKerjaNames: sql<string[]>`
        coalesce(
          (
            select jsonb_agg(distinct uk.nama)
            from sireva.sasaran_program sp
            join sireva.sasaran_program_unit_kerja spuk on sp.id = spuk.sasaran_program_id
            join sireva.unit_kerja uk on spuk.unit_kerja_id = uk.id
            where sp.id_ss = ${sasaranStrategis.id}
          ),
          '[]'::jsonb
        )
      `,
      unitKerjaIds: sql<number[]>`
        coalesce(
          (
            select jsonb_agg(distinct uk.id)
            from sireva.sasaran_program sp
            join sireva.sasaran_program_unit_kerja spuk on sp.id = spuk.sasaran_program_id
            join sireva.unit_kerja uk on spuk.unit_kerja_id = uk.id
            where sp.id_ss = ${sasaranStrategis.id}
          ),
          '[]'::jsonb
        )
      `,
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
    try {
      const body = await readBody(event);
      console.log('POST /api/sasaran-strategis body:', body);
      const result = await db.insert(sasaranStrategis).values(body).returning();
      console.log('POST /api/sasaran-strategis result:', result);
      return result;
    } catch (err: any) {
      console.error('POST /api/sasaran-strategis error:', err);
      throw createError({
        statusCode: 500,
        statusMessage: `Gagal menyimpan Sasaran Strategis: ${err.message}`
      });
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});