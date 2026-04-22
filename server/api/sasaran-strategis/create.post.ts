import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { targetIndikator } from '../../db/schema/target-indikator';
import { tahun as tahunTable } from '../../db/schema/tahun';
import { eq, and } from 'drizzle-orm';
import { defineEventHandler, readBody } from 'h3';

/**
 * API Endpoint: POST /api/sasaran-strategis/create
 * Mengolah pembuatan Sasaran Strategis, Indikator, dan Target dalam satu transaksi.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { sasaranId, sasaranText, isNewSasaran, namaIndikator, satuan, targets, tujuanId } = body;

  try {
    return await db.transaction(async (tx) => {
      let finalSasaranId = sasaranId;

      // 1. Buat Sasaran Strategis Baru jika diminta
      if (isNewSasaran && sasaranText) {
        const [newSasaran] = await tx.insert(sasaranStrategis).values({
          sasaranText: sasaranText,
          tujuanId: tujuanId,
        }).returning();
        
        if (!newSasaran) {
          throw new Error('Gagal membuat Sasaran Strategis baru.');
        }
        
        finalSasaranId = newSasaran.id;
      }

      if (!finalSasaranId) {
        throw new Error('Sasaran ID tidak ditemukan atau tidak valid.');
      }

      // 2. Buat Indikator Kinerja
      const [newIndikator] = await tx.insert(indikatorKinerja).values({
        sasaranId: finalSasaranId,
        namaIndikator: namaIndikator,
        satuan: satuan,
        // jenis: 'Strategis' // Default jika diperlukan
      }).returning();

      if (!newIndikator) {
        throw new Error('Gagal membuat Indikator Kinerja.');
      }

      // 3. Buat Target Indikator untuk setiap tahun
      const yearValues = Object.keys(targets);
      if (yearValues.length > 0) {
        // Ambil ID tahun yang sesuai dari DB
        const dbTahun = await tx.select().from(tahunTable);
        const tahunMap = dbTahun.reduce((acc: any, t) => {
          acc[t.tahun] = t.id;
          return acc;
        }, {});

        const targetValues = yearValues.map(yearStr => {
          const year = parseInt(yearStr);
          const tid = tahunMap[year];
          if (tid) {
            return {
              indikatorId: newIndikator.id,
              tahunId: tid,
              target: targets[yearStr] || '0',
            };
          }
          return null;
        }).filter(t => t !== null) as any[];

        if (targetValues.length > 0) {
          await tx.insert(targetIndikator).values(targetValues);
        }
      }

      return {
        success: true,
        message: 'Data Sasaran Strategis berhasil disimpan.',
        data: {
          sasaranId: finalSasaranId,
          indikatorId: newIndikator.id
        }
      };
    });
  } catch (error: any) {
    console.error('API Error [sasaran-strategis/create]:', error);
    return {
      success: false,
      message: error.message || 'Terjadi kesalahan saat menyimpan data.'
    };
  }
});
