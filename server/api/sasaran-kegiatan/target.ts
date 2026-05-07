import { db } from '../../db';
import { targetIndiaktorKegiatan } from '../../db/schema/target-indikator-kegiatan';
import { and, eq } from 'drizzle-orm';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.method;

  try {
    if (method === 'POST') {
      const body = await readBody<{ idIku: number; tahun: number; targetNilai: string | number }>(event);
      
      if (!body || !body.idIku || !body.tahun || body.targetNilai === undefined || body.targetNilai === null || body.targetNilai === '') {
        throw createError({ statusCode: 400, statusMessage: 'Data tidak lengkap' });
      }

      const { idIku, tahun, targetNilai } = body;

      const existing = await db
        .select()
        .from(targetIndiaktorKegiatan)
        .where(
          and(
            eq(targetIndiaktorKegiatan.idIku, idIku),
            eq(targetIndiaktorKegiatan.tahun, tahun)
          )
        )
        .limit(1);

      if (existing && existing.length > 0 && existing[0]) {
        const updated = await db
          .update(targetIndiaktorKegiatan)
          .set({ targetNilai: String(targetNilai) })
          .where(eq(targetIndiaktorKegiatan.id, existing[0].id))
          .returning();
        return updated[0];
      } else {
        const inserted = await db
          .insert(targetIndiaktorKegiatan)
          .values({
            idIku,
            tahun,
            targetNilai: String(targetNilai)
          })
          .returning();
        return inserted[0];
      }
    }

    if (method === 'DELETE') {
      const body = await readBody<{ idIku: number; tahun: number }>(event);
      if (!body || !body.idIku || !body.tahun) {
        throw createError({ statusCode: 400, statusMessage: 'ID Iku dan Tahun diperlukan' });
      }

      const deleted = await db
        .delete(targetIndiaktorKegiatan)
        .where(
          and(
            eq(targetIndiaktorKegiatan.idIku, body.idIku),
            eq(targetIndiaktorKegiatan.tahun, body.tahun)
          )
        )
        .returning();
      
      return deleted[0] || { success: true };
    }

    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });

  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || error?.message || 'Internal Server Error',
    });
  }
});
