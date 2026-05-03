import { db } from '../../../db';
import { sasaranKegiatan } from '../../../db/schema/sasaran-kegiatan';
import { indikatorKegiatan } from '../../../db/schema/indikator-kegiatan';
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
			id: sasaranKegiatan.id,
			idSp: sasaranKegiatan.idSp,
			kode: sasaranKegiatan.kode,
			sasaranText: sasaranKegiatan.sasaranText,
			unitKerjaId: sasaranKegiatan.unitKerjaId,
			unitKerjaNama: unitKerja.nama,
			indikatorId: indikatorKegiatan.id,
			indikatorNama: indikatorKegiatan.namaIku,
			indikatorSatuan: indikatorKegiatan.satuanPengukuran,
			targets: sql<any[]>`
				coalesce(
					(
						select jsonb_agg(
							jsonb_build_object(
								'tahun', tik.tahun,
								'target', tik.target_nilai
							)
							order by tik.tahun
						)
						from sireva.target_indikator_kegiatan tik
						where tik.id_iku = ${indikatorKegiatan.id}
					),
					'[]'::jsonb
				)
			`,
		};

		const baseQuery = db
			.select(baseSelect)
			.from(sasaranKegiatan)
			.leftJoin(unitKerja, eq(sasaranKegiatan.unitKerjaId, unitKerja.id))
			.leftJoin(indikatorKegiatan, eq(sasaranKegiatan.id, indikatorKegiatan.idSk));

		if (query.sasaranId) {
			return await baseQuery
				.where(
					sql`${sasaranKegiatan.unitKerjaId} = ${unitKerjaId}
						and ${sasaranKegiatan.id} = ${Number(query.sasaranId)}`
				)
				.orderBy(sasaranKegiatan.id, indikatorKegiatan.id);
		}

		return await baseQuery
			.where(eq(sasaranKegiatan.unitKerjaId, unitKerjaId))
			.orderBy(sasaranKegiatan.id, indikatorKegiatan.id);
	} catch (error: any) {
		console.error('API Error [sasaran-kegiatan/unit-kerja/:id]:', error);
		throw createError({
			statusCode: 500,
			statusMessage: error.message || 'Internal Server Error',
		});
	}
});
