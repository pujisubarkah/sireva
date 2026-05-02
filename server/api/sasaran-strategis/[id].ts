import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { indikatorStrategis } from '../../db/schema/indikator-strategis';
import { eq, sql } from 'drizzle-orm';
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
			)
			.limit(1);

		if (!row) {
			throw createError({ statusCode: 404, statusMessage: 'Sasaran strategis tidak ditemukan.' });
		}

		return row;
	}

	if (method === 'PUT') {
		const body = await readBody(event);
		const { kode, sasaranText } = body ?? {};

		if (sasaranText !== undefined && (typeof sasaranText !== 'string' || sasaranText.trim() === '')) {
			throw createError({ statusCode: 400, statusMessage: 'Field "sasaranText" tidak boleh kosong.' });
		}

		const updateData: Record<string, unknown> = {};
		if (kode !== undefined) updateData.kode = kode;
		if (sasaranText !== undefined) updateData.sasaranText = sasaranText.trim();

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
		const [deleted] = await db
			.delete(sasaranStrategis)
			.where(eq(sasaranStrategis.id, id))
			.returning();

		if (!deleted) {
			throw createError({ statusCode: 404, statusMessage: 'Sasaran strategis tidak ditemukan.' });
		}

		return { success: true, deleted };
	}

	throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
