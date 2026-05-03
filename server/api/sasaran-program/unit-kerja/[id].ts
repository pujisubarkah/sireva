import { db } from '../../../db';
import { sasaranProgram } from '../../../db/schema/sasaran-program';
import { sasaranProgramUnitKerja } from '../../../db/schema/sasaran-program-unit-kerja';
import { indikatorProgram } from '../../../db/schema/indikator-program';
import { unitKerja } from '../../../db/schema/unit-kerja';
import { eq, sql } from 'drizzle-orm';
import { defineEventHandler, getQuery, createError, type H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const unitKerjaId = Number(event.context.params?.id);
  if (!unitKerjaId || isNaN(unitKerjaId)) {
    throw createError({ statusCode: 400, statusMessage: 'id unit kerja harus berupa angka' });
  }

  const query = getQuery(event);

  try {
    const baseSelect = {
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
      realisasi: sql<any[]>`
        coalesce(
          (
            select jsonb_agg(
              jsonb_build_object(
                'tahun', r.tahun,
                'realisasi', r.total_realisasi
              )
              order by r.tahun
            )
            from (
              select
                ri.tahun,
                coalesce(sum(ri.realisasi), 0) as total_realisasi
              from sireva.realisasi_indikator ri
              where ri.indikator_kode = ${indikatorProgram.kode}
                and ri.unit_id = ${unitKerjaId}
              group by ri.tahun
            ) r
          ),
          '[]'::jsonb
        )
      `,
    };

    const groupByColumns = [
      sasaranProgram.id,
      sasaranProgram.idSs,
      sasaranProgram.kode,
      sasaranProgram.sasaranText,
      indikatorProgram.id,
      indikatorProgram.kode,
      indikatorProgram.nama,
      indikatorProgram.satuan,
    ];

    const baseQuery = db
      .select(baseSelect)
      .from(sasaranProgram)
      .innerJoin(sasaranProgramUnitKerja, eq(sasaranProgram.id, sasaranProgramUnitKerja.sasaranProgramId))
      .leftJoin(unitKerja, eq(sasaranProgramUnitKerja.unitKerjaId, unitKerja.id))
      .leftJoin(indikatorProgram, eq(sasaranProgram.id, indikatorProgram.sasaranProgramId));

    if (query.sasaranId) {
      return await baseQuery
        .where(
          sql`${sasaranProgramUnitKerja.unitKerjaId} = ${unitKerjaId}
            and ${sasaranProgram.id} = ${Number(query.sasaranId)}`
        )
        .groupBy(...groupByColumns);
    }

    return await baseQuery
      .where(eq(sasaranProgramUnitKerja.unitKerjaId, unitKerjaId))
      .groupBy(...groupByColumns);
  } catch (error: any) {
    console.error('API Error [sasaran-program/unit-kerja/:id]:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error',
    });
  }
});
