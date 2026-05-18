import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { indikatorStrategis } from '../../db/schema/indikator-strategis';
import { targetIndikatorStrategis } from '../../db/schema/target-indikator-strategis';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { laporanSasaranProgram } from '../../db/schema/laporan-sasaran-program';
import { indikatorProgram } from '../../db/schema/indikator-program';
import { targetIndikatorProgram } from '../../db/schema/target-indikator-program';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { indikatorKegiatan } from '../../db/schema/indikator-kegiatan';
import { targetIndiaktorKegiatan } from '../../db/schema/target-indikator-kegiatan';
import { laporanSasaranStrategis } from '../../db/schema/laporan-sasaran-strategis';
import { perjanjianKinerja } from '../../db/schema/perjanjian-kinerja';
import { eq, sql, inArray, or } from 'drizzle-orm';
import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
	const method = getMethod(event);
	const rawId = getRouterParam(event, 'id');
	const id = Number(rawId);

	if (!rawId || Number.isNaN(id)) {
		throw createError({ statusCode: 400, statusMessage: 'Parameter "id" harus berupa angka.' });
	}

	if (method === 'GET') {
		const [row] = await db.select({
			id: sasaranStrategis.id,
			kode: sasaranStrategis.kode,
			sasaranText: sasaranStrategis.sasaranText,
			unitKerjaId: sasaranStrategis.unitKerjaId,
			tujuanId: sasaranStrategis.tujuanId,
			ownerUnitName: sql<string>`(select nama from sireva.unit_kerja where id = ${sasaranStrategis.unitKerjaId})`,
			indikatorStrategis: sql<any[]>`
				coalesce(
					jsonb_agg(
						jsonb_build_object(
							'id', ${indikatorStrategis.id},
							'nama', ${indikatorStrategis.nama},
							'satuan', ${indikatorStrategis.satuan},
							'targets', coalesce(
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
						)
						order by ${indikatorStrategis.nama}
					) filter (where ${indikatorStrategis.id} is not null),
					'[]'::jsonb
				)
			`,
		})
			.from(sasaranStrategis)
			.leftJoin(indikatorStrategis, eq(sasaranStrategis.id, indikatorStrategis.sasaranStrategisId))
			.where(eq(sasaranStrategis.id, id))
			.groupBy(
				sasaranStrategis.id,
				sasaranStrategis.kode,
				sasaranStrategis.sasaranText,
				sasaranStrategis.unitKerjaId,
				sasaranStrategis.tujuanId,
			)
			.limit(1);

		if (!row) {
			throw createError({ statusCode: 404, statusMessage: 'Sasaran strategis tidak ditemukan.' });
		}

		return row;
	}

	if (method === 'PUT') {
		const body = await readBody(event);
		const { kode, sasaranText, unitKerjaId, tujuanId } = body ?? {};

		if (sasaranText !== undefined && (typeof sasaranText !== 'string' || sasaranText.trim() === '')) {
			throw createError({ statusCode: 400, statusMessage: 'Field "sasaranText" tidak boleh kosong.' });
		}

		const updateData: Record<string, unknown> = {};
		if (kode !== undefined) updateData.kode = kode;
		if (sasaranText !== undefined) updateData.sasaranText = sasaranText.trim();
		if (unitKerjaId !== undefined) updateData.unitKerjaId = unitKerjaId;
		if (tujuanId !== undefined) updateData.tujuanId = tujuanId;

		const [updated] = await db
			.update(sasaranStrategis)
			.set(updateData)
			.where(eq(sasaranStrategis.id, id))
			.returning();

		if (!updated) {
			throw createError({ statusCode: 404, statusMessage: 'Sasaran strategis tidak ditemukan.' });
		}

		return updated;
	}

	if (method === 'DELETE') {
		try {
			console.log(`[DELETE] Starting deletion for Sasaran Strategis ID: ${id}`);
			return await db.transaction(async (tx) => {
				// 1. Collect all IDs for children/descendants
				const indicators = await tx.select({ id: indikatorStrategis.id })
					.from(indikatorStrategis)
					.where(eq(indikatorStrategis.sasaranStrategisId, id));
				const indicatorIds = indicators.map(i => i.id);

				const sps = await tx.select({ id: sasaranProgram.id })
					.from(sasaranProgram)
					.where(eq(sasaranProgram.idSs, id));
				const spIds = sps.map(s => s.id);

				let skIds: number[] = [];
				let ipIds: number[] = [];
				if (spIds.length > 0) {
					const sks = await tx.select({ id: sasaranKegiatan.id })
						.from(sasaranKegiatan)
						.where(inArray(sasaranKegiatan.idSp, spIds));
					skIds = sks.map(s => s.id);

					const ips = await tx.select({ id: indikatorProgram.id })
						.from(indikatorProgram)
						.where(inArray(indikatorProgram.sasaranProgramId, spIds));
					ipIds = ips.map(i => i.id);
				}

				let ikIds: number[] = [];
				if (skIds.length > 0) {
					const iks = await tx.select({ id: indikatorKegiatan.id })
						.from(indikatorKegiatan)
						.where(inArray(indikatorKegiatan.idSk, skIds));
					ikIds = iks.map(i => i.id);
				}

				console.log(`[DELETE] Found: ${indicatorIds.length} indicators, ${spIds.length} programs, ${skIds.length} activities, ${ikIds.length} activity indicators.`);

				// 2. Delete Leaf Nodes (Depth 4/5)
				if (ikIds.length > 0) {
					await tx.delete(targetIndiaktorKegiatan).where(inArray(targetIndiaktorKegiatan.idIku, ikIds));
				}
				if (ipIds.length > 0) {
					await tx.delete(targetIndikatorProgram).where(inArray(targetIndikatorProgram.indikatorId, ipIds));
				}
				if (indicatorIds.length > 0) {
					await tx.delete(targetIndikatorStrategis).where(inArray(targetIndikatorStrategis.indikatorId, indicatorIds));
				}

				// 3. Delete Indicators & Reports (Depth 3)
				if (ikIds.length > 0) {
					await tx.delete(indikatorKegiatan).where(inArray(indikatorKegiatan.id, ikIds));
				}
				if (ipIds.length > 0) {
					await tx.delete(indikatorProgram).where(inArray(indikatorProgram.id, ipIds));
				}

				if (indicatorIds.length > 0) {
					await tx.delete(perjanjianKinerja)
						.where(or(
							eq(perjanjianKinerja.sasaranId, id),
							inArray(perjanjianKinerja.indikatorId, indicatorIds)
						));
				} else {
					await tx.delete(perjanjianKinerja).where(eq(perjanjianKinerja.sasaranId, id));
				}

				await tx.delete(laporanSasaranStrategis).where(eq(laporanSasaranStrategis.sasaranId, id));

				// 4. Delete Middle Nodes (Depth 2/1)
				if (skIds.length > 0) {
					await tx.delete(sasaranKegiatan).where(inArray(sasaranKegiatan.idSp, spIds));
				}

				if (spIds.length > 0) {
					// Also delete reports if any (though usually cascaded or handled)
					await tx.delete(laporanSasaranProgram).where(inArray(laporanSasaranProgram.idSp, spIds));
					await tx.delete(sasaranProgram).where(inArray(sasaranProgram.id, spIds));
				}

				// 5. Delete Indikator Strategis
				if (indicatorIds.length > 0) {
					await tx.delete(indikatorStrategis).where(eq(indikatorStrategis.sasaranStrategisId, id));
				}

				// 6. Finally delete the SS record
				const [deleted] = await tx
					.delete(sasaranStrategis)
					.where(eq(sasaranStrategis.id, id))
					.returning();

				if (!deleted) {
					throw createError({ statusCode: 404, statusMessage: 'Sasaran strategis tidak ditemukan.' });
				}

				console.log(`[DELETE] Successfully deleted SS ID: ${id}`);
				return { success: true, deleted };
			});
		} catch (error: any) {
			console.error('Delete Error Stack:', error);
			throw createError({ 
				statusCode: 500, 
				statusMessage: `Gagal menghapus data: ${error.message || 'Kesalahan database'}` 
			});
		}
	}

	throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
