import { db } from '../../db';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { unitKerja } from '../../db/schema/unit-kerja';
import { indikatorKegiatan } from '../../db/schema/indikator-kegiatan';
import { targetIndiaktorKegiatan } from '../../db/schema/target-indikator-kegiatan';
import { eq, inArray, sql, desc, asc } from 'drizzle-orm';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.method;
  const id = event.context.params?.id;

  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });
  }

  const numericId = Number(id);

  try {
    if (method === 'GET') {
      const data = await db
        .select({
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
        })
        .from(sasaranKegiatan)
        .leftJoin(unitKerja, eq(sasaranKegiatan.unitKerjaId, unitKerja.id))
        .leftJoin(indikatorKegiatan, eq(sasaranKegiatan.id, indikatorKegiatan.idSk))
        .where(eq(sasaranKegiatan.id, numericId))
        .orderBy(desc(sasaranKegiatan.id), desc(indikatorKegiatan.id));

      return data;
    }

    if (method === 'PUT') {
      const body = await readBody<any>(event);
      const { indikatorList, ...updateBody } = body ?? {};

      const updated = await db
        .update(sasaranKegiatan)
        .set({
          idSp: updateBody.idSp ?? null,
          kode: updateBody.kode ?? null,
          sasaranText: updateBody.sasaranText,
          unitKerjaId: updateBody.unitKerjaId ?? null,
        })
        .where(eq(sasaranKegiatan.id, numericId))
        .returning();
      
      if (Array.isArray(indikatorList)) {
        // Find existing indicators
        const existingIndikator = await db
          .select({ id: indikatorKegiatan.id })
          .from(indikatorKegiatan)
          .where(eq(indikatorKegiatan.idSk, numericId));

        const existingIds = existingIndikator.map((r) => r.id).filter(Boolean) as number[];
        
        if (existingIds.length > 0) {
          await db
            .delete(targetIndiaktorKegiatan)
            .where(inArray(targetIndiaktorKegiatan.idIku, existingIds));
        }

        await db.delete(indikatorKegiatan).where(eq(indikatorKegiatan.idSk, numericId));

        for (const indikator of indikatorList) {
          if (!indikator?.nama || typeof indikator.nama !== 'string' || indikator.nama.trim() === '') continue;

          const createdInd = await db.insert(indikatorKegiatan).values({
            idSk: numericId,
            namaIku: indikator.nama.trim(),
            satuanPengukuran: indikator.satuan ?? null,
          }).returning({ id: indikatorKegiatan.id });

          const indId = createdInd[0]?.id;
          if (!indId || !Array.isArray(indikator.targets)) continue;

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

      return updated[0] || null;
    }

    if (method === 'DELETE') {
      const deleted = await db
        .delete(sasaranKegiatan)
        .where(eq(sasaranKegiatan.id, numericId))
        .returning();
      
      return deleted[0] || null;
    }

    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || error?.message || 'Internal Server Error',
    });
  }
});
