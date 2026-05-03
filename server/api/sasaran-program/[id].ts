import { db } from '../../db';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { sasaranProgramUnitKerja } from '../../db/schema/sasaran-program-unit-kerja';
import { indikatorProgram } from '../../db/schema/indikator-program';
import { targetIndikatorProgram } from '../../db/schema/target-indikator-program';
import { unitKerja } from '../../db/schema/unit-kerja';
import { eq, inArray, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
	const method = getMethod(event);
	const rawId = getRouterParam(event, 'id');
	const id = Number(rawId);

	if (!rawId || Number.isNaN(id)) {
		throw createError({ statusCode: 400, statusMessage: 'Parameter "id" harus berupa angka.' });
	}

	try {
		if (method === 'GET') {
			const rows = await db.select({
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
			.where(eq(sasaranProgram.id, id))
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

			if (!rows.length) {
				throw createError({ statusCode: 404, statusMessage: 'Sasaran program tidak ditemukan.' });
			}

			return rows;
		}

		if (method === 'PUT') {
			const body = await readBody<any>(event);
			const { unitKerjaIds, indikatorList, ...updateBody } = body ?? {};

			const [updated] = await db.update(sasaranProgram).set({
				idSs: updateBody.idSs,
				kode: updateBody.kode,
				sasaranText: updateBody.sasaranText,
			}).where(eq(sasaranProgram.id, id)).returning();

			if (!updated) {
				throw createError({ statusCode: 404, statusMessage: 'Sasaran program tidak ditemukan.' });
			}

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

			if (Array.isArray(indikatorList)) {
				const existingIndikator = await db
					.select({ id: indikatorProgram.id })
					.from(indikatorProgram)
					.where(eq(indikatorProgram.sasaranProgramId, id));

				const existingIds = existingIndikator.map((r) => r.id).filter(Boolean) as number[];
				if (existingIds.length > 0) {
					await db
						.delete(targetIndikatorProgram)
						.where(inArray(targetIndikatorProgram.indikatorId, existingIds));
				}

				await db.delete(indikatorProgram).where(eq(indikatorProgram.sasaranProgramId, id));

				for (const indikator of indikatorList) {
					if (!indikator?.nama || typeof indikator.nama !== 'string' || indikator.nama.trim() === '') continue;

					const createdInd = await db.insert(indikatorProgram).values({
						sasaranProgramId: id,
						nama: indikator.nama.trim(),
						satuan: indikator.satuan ?? null,
					}).returning({ id: indikatorProgram.id });

					const indId = createdInd[0]?.id;
					if (!indId || !Array.isArray(indikator.targets)) continue;

					const targetRows = indikator.targets
						.filter((t: any) => t && t.tahun != null && t.target !== '' && t.target != null)
						.map((t: any) => ({
							indikatorId: indId,
							tahun: Number(t.tahun),
							target: String(t.target),
						}));

					if (targetRows.length > 0) {
						await db.insert(targetIndikatorProgram).values(targetRows);
					}
				}
			}

			return updated;
		}

		if (method === 'DELETE') {
			const [deleted] = await db
				.delete(sasaranProgram)
				.where(eq(sasaranProgram.id, id))
				.returning();

			if (!deleted) {
				throw createError({ statusCode: 404, statusMessage: 'Sasaran program tidak ditemukan.' });
			}

			return { success: true, deleted };
		}

		throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
	} catch (error: any) {
		console.error('API Error:', error);
		throw createError({
			statusCode: error?.statusCode || 500,
			statusMessage: error?.statusMessage || error?.message || 'Internal Server Error',
		});
	}
});
