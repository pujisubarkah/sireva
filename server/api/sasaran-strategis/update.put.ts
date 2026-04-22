import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { targetIndikator } from '../../db/schema/target-indikator';
import { tahun as tahunTable } from '../../db/schema/tahun';
import { eq, and } from 'drizzle-orm';
import { defineEventHandler, readBody } from 'h3';

/**
 * API Endpoint: PUT /api/sasaran-strategis/update
 * Memperbarui data Indikator dan Target dalam satu transaksi.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, sasaranId, namaIndikator, satuan, targets } = body;

  if (!id) {
    throw new Error('Indikator ID is required for update.');
  }

  try {
    return await db.transaction(async (tx) => {
      // 1. Update Indikator Kinerja
      await tx.update(indikatorKinerja)
        .set({
          sasaranId: sasaranId,
          namaIndikator: namaIndikator,
          satuan: satuan
        })
        .where(eq(indikatorKinerja.id, id));

      // 2. Update Target Indikator
      // Untuk mempermudah, kita bisa menghapus target lama dan memasukkan yang baru
      // atau melakukan update per tahun. Di sini kita gunakan update/upsert logic.
      
      const yearValues = Object.keys(targets);
      if (yearValues.length > 0) {
        const dbTahun = await tx.select().from(tahunTable);
        const tahunMap = dbTahun.reduce((acc: any, t) => {
          acc[t.tahun] = t.id;
          return acc;
        }, {});

        for (const yearStr of yearValues) {
          const year = parseInt(yearStr);
          const tid = tahunMap[year];
          if (tid) {
            const val = targets[yearStr] || '0';
            
            // Cek apakah target sudah ada
            const [existingRecord] = await tx.select()
              .from(targetIndikator)
              .where(and(
                eq(targetIndikator.indikatorId, id),
                eq(targetIndikator.tahunId, tid)
              ))
              .limit(1);

            if (existingRecord) {
              // Update
              await tx.update(targetIndikator)
                .set({ target: val })
                .where(eq(targetIndikator.id, existingRecord.id));
            } else {
              // Insert
              await tx.insert(targetIndikator)
                .values({
                  indikatorId: id,
                  tahunId: tid,
                  target: val
                });
            }
          }
        }
      }

      return {
        success: true,
        message: 'Data Sasaran Strategis berhasil diperbarui.'
      };
    });
  } catch (error: any) {
    console.error('API Error [sasaran-strategis/update]:', error);
    return {
      success: false,
      message: error.message || 'Terjadi kesalahan saat memperbarui data.'
    };
  }
});
