import { db } from '../../db';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { unitKerja } from '../../db/schema/unit-kerja';
import { indikatorKegiatan } from '../../db/schema/indikator-kegiatan';
import { targetIndiaktorKegiatan } from '../../db/schema/target-indikator-kegiatan';
import { eq, sql, desc } from 'drizzle-orm';
import { defineEventHandler, readBody, createError, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.method;

  try {
    if (method === 'GET') {
      const query = getQuery(event);
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 20;
      const offset = (page - 1) * limit;

      const hasIndikatorCondition = sql`exists (
        select 1 from sireva.indikator_kegiatan ik
        where ik.id_sk = ${sasaranKegiatan.id}
      )`;

      const data = await db
        .select({
          id: sasaranKegiatan.id,
          idSp: sasaranKegiatan.idSp,
          kode: sasaranKegiatan.kode,
          sasaranText: sasaranKegiatan.sasaranText,
          unitKerjaId: sasaranKegiatan.unitKerjaId,
          unitKerjaNama: unitKerja.nama,
          indikators: sql<any[]>`
            coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'id', ik.id,
                    'nama', ik.nama_iku,
                    'satuan', ik.satuan_pengukuran,
                    'targets', coalesce(
                      (
                        select jsonb_agg(
                          jsonb_build_object('tahun', tik.tahun, 'target', tik.target_nilai)
                          order by tik.tahun
                        )
                        from sireva.target_indikator_kegiatan tik
                        where tik.id_iku = ik.id
                      ),
                      '[]'::jsonb
                    )
                  )
                  order by ik.id
                )
                from sireva.indikator_kegiatan ik
                where ik.id_sk = ${sasaranKegiatan.id}
              ),
              '[]'::jsonb
            )
          `,
        })
        .from(sasaranKegiatan)
        .leftJoin(unitKerja, eq(sasaranKegiatan.unitKerjaId, unitKerja.id))
        .where(hasIndikatorCondition)
        .orderBy(desc(sasaranKegiatan.id))
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(sasaranKegiatan)
        .where(hasIndikatorCondition);
      const total = Number(totalResult[0]?.count || 0);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    }

    if (method === 'POST') {
      const body = await readBody<any>(event);
      const { indikatorList, ...insertBody } = body ?? {};

      const created = await db
        .insert(sasaranKegiatan)
        .values({
          idSp: insertBody.idSp ?? null,
          kode: insertBody.kode ?? null,
          sasaranText: insertBody.sasaranText,
          unitKerjaId: insertBody.unitKerjaId ?? null,
        })
        .returning();

      const newId = created[0]?.id;

      if (newId && Array.isArray(indikatorList)) {
        for (const indikator of indikatorList) {
          if (!indikator?.nama?.trim()) continue;

          const createdInd = await db.insert(indikatorKegiatan).values({
            idSk: newId,
            namaIku: indikator.nama.trim(),
            satuanPengukuran: indikator.satuan ?? null,
          }).returning({ id: indikatorKegiatan.id });

          const indId = createdInd[0]?.id;
          if (indId && Array.isArray(indikator.targets)) {
            const targetRows = indikator.targets
              .filter((t: any) => t && t.tahun != null && t.target !== '' && t.target != null)
              .map((t: any) => ({
                idIku: indId,
                tahun: Number(t.tahun),
                targetNilai: String(t.target),
              }));

            if (targetRows.length > 0) {
              await db.insert(targetIndiaktorKegiatan).values(targetRows);
            }
          }
        }
      }

      return created;
    }

    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || error?.message || 'Internal Server Error',
    });
  }
});
