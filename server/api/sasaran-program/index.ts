import { db } from '../../db';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { sasaranProgramUnitKerja } from '../../db/schema/sasaran-program-unit-kerja';
import { indikatorProgram } from '../../db/schema/indikator-program';
import { unitKerja } from '../../db/schema/unit-kerja';
import { eq, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.method;
  const query = getQuery(event);

  try {
    if (method === 'GET') {
      if (query.id) {
        return await db.select({
          id: sasaranProgram.id,
          idSs: sasaranProgram.idSs,
          kode: sasaranProgram.kode,
          sasaranText: sasaranProgram.sasaranText,
          unitKerjaNames: sql<string[]>`coalesce(array_agg(distinct ${unitKerja.nama}) filter (where ${unitKerja.nama} is not null), '{}'::text[])`,
          indikatorId: indikatorProgram.id,
          indikatorKode: indikatorProgram.kode,
          indikatorNama: indikatorProgram.nama,
          indikatorSatuan: indikatorProgram.satuan,
          targets: sql<any[]>`
            coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'tahun', tip.tahun,
                    'target', tip.target
                  )
                  order by tip.tahun
                )
                from sireva.target_indikator_program tip
                where tip.indikator_id = ${indikatorProgram.id}
              ),
              '[]'::jsonb
            )
          `,
        })
        .from(sasaranProgram)
        .leftJoin(sasaranProgramUnitKerja, eq(sasaranProgram.id, sasaranProgramUnitKerja.sasaranProgramId))
        .leftJoin(unitKerja, eq(sasaranProgramUnitKerja.unitKerjaId, unitKerja.id))
        .leftJoin(indikatorProgram, eq(sasaranProgram.id, indikatorProgram.sasaranProgramId))
        .where(eq(sasaranProgram.id, Number(query.id)))
        .groupBy(
          sasaranProgram.id,
          sasaranProgram.idSs,
          sasaranProgram.kode,
          sasaranProgram.sasaranText,
          indikatorProgram.id,
          indikatorProgram.kode,
          indikatorProgram.nama,
          indikatorProgram.satuan,
        );
      }

      return await db.select({
        id: sasaranProgram.id,
        idSs: sasaranProgram.idSs,
        kode: sasaranProgram.kode,
        sasaranText: sasaranProgram.sasaranText,
        unitKerjaNames: sql<string[]>`coalesce(array_agg(distinct ${unitKerja.nama}) filter (where ${unitKerja.nama} is not null), '{}'::text[])`,
        indikatorId: indikatorProgram.id,
        indikatorKode: indikatorProgram.kode,
        indikatorNama: indikatorProgram.nama,
        indikatorSatuan: indikatorProgram.satuan,
        targets: sql<any[]>`
          coalesce(
            (
              select jsonb_agg(
                jsonb_build_object(
                  'tahun', tip.tahun,
                  'target', tip.target
                )
                order by tip.tahun
              )
              from sireva.target_indikator_program tip
              where tip.indikator_id = ${indikatorProgram.id}
            ),
            '[]'::jsonb
          )
        `,
      })
      .from(sasaranProgram)
      .leftJoin(sasaranProgramUnitKerja, eq(sasaranProgram.id, sasaranProgramUnitKerja.sasaranProgramId))
      .leftJoin(unitKerja, eq(sasaranProgramUnitKerja.unitKerjaId, unitKerja.id))
      .leftJoin(indikatorProgram, eq(sasaranProgram.id, indikatorProgram.sasaranProgramId))
      .groupBy(
        sasaranProgram.id,
        sasaranProgram.idSs,
        sasaranProgram.kode,
        sasaranProgram.sasaranText,
        indikatorProgram.id,
        indikatorProgram.kode,
        indikatorProgram.nama,
        indikatorProgram.satuan,
      );
    }
    if (method === 'POST') {
      const body = await readBody<any>(event);
      const { unitKerjaIds, ...sasaranBody } = body;

      const created = await db.insert(sasaranProgram).values({
        idSs: sasaranBody.idSs ?? null,
        kode: sasaranBody.kode ?? null,
        sasaranText: sasaranBody.sasaranText,
      }).returning();

      const spId = created[0]?.id;
      if (spId && Array.isArray(unitKerjaIds) && unitKerjaIds.length > 0) {
        await db.insert(sasaranProgramUnitKerja).values(
          unitKerjaIds.map((unitId: number) => ({
            sasaranProgramId: spId,
            unitKerjaId: Number(unitId),
          }))
        );
      }

      return created;
    }
    if (method === 'PUT') {
      const body = await readBody<any>(event);
      if (!body.id) throw new Error('ID is required');

      const { id, unitKerjaIds, ...updateBody } = body;

      const updated = await db.update(sasaranProgram).set({
        idSs: updateBody.idSs,
        kode: updateBody.kode,
        sasaranText: updateBody.sasaranText,
      }).where(eq(sasaranProgram.id, id)).returning();

      if (Array.isArray(unitKerjaIds)) {
        await db.delete(sasaranProgramUnitKerja).where(eq(sasaranProgramUnitKerja.sasaranProgramId, id));
        if (unitKerjaIds.length > 0) {
          await db.insert(sasaranProgramUnitKerja).values(
            unitKerjaIds.map((unitId: number) => ({
              sasaranProgramId: id,
              unitKerjaId: Number(unitId),
            }))
          );
        }
      }

      return updated;
    }
    if (method === 'DELETE') {
      const body = await readBody(event);
      if (!body.id) throw new Error('ID is required');
      return await db.delete(sasaranProgram).where(eq(sasaranProgram.id, body.id)).returning();
    }
  } catch (error: any) {
    console.error('API Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error'
    });
  }
});