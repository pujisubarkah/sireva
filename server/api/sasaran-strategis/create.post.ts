import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { targetIndikator } from '../../db/schema/target-indikator';
import { tahun as tahunTable } from '../../db/schema/tahun';
import { tujuan as tujuanTable } from '../../db/schema/tujuan';
import { misi as misiTable } from '../../db/schema/misi';
import { eq, and } from 'drizzle-orm';
import { defineEventHandler, readBody } from 'h3';

/**
 * API Endpoint: POST /api/sasaran-strategis/create
 * Mengolah pembuatan Sasaran Strategis, Indikator, dan Target dalam satu transaksi.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { 
    sasaranId, sasaranText, isNewSasaran, 
    namaIndikator, satuan, targets, 
    tujuanId, newTujuanText, isNewTujuan,
    unitKerja, kode 
  } = body;

  try {
    return await db.transaction(async (tx) => {
      let finalTujuanId = tujuanId;
      let finalSasaranId = sasaranId;

      // 0. Buat Tujuan Strategis Baru jika diminta
      if (isNewTujuan && newTujuanText) {
        try {
          console.log('Creating new Tujuan:', newTujuanText);
          
          // Gunakan misiId dari body jika ada. 
          // Jika misiId === null, maka biarkan null (berarti kegiatan mandiri)
          // Jika misiId tidak ada (undefined), baru cari misi pertama sebagai fallback
          let targetMisiId = body.misiId;
          if (targetMisiId === undefined) {
            const [firstMisi] = await tx.select().from(misiTable).limit(1);
            targetMisiId = firstMisi?.id || 1;
          }
          
          const [newTujuan] = await tx.insert(tujuanTable).values({
            tujuanText: newTujuanText,
            misiId: targetMisiId, 
            kode: 'K-' + Math.floor(Math.random() * 1000)
          }).returning();
          
          if (!newTujuan) throw new Error('Gagal membuat Tujuan Strategis baru.');
          finalTujuanId = newTujuan.id;
          console.log('New Tujuan created with ID:', finalTujuanId);
        } catch (err: any) {
          console.error('Error in Tujuan insert:', err.message);
          throw err;
        }
      }

      // 1. Buat Sasaran Strategis Baru jika diminta
      if (isNewSasaran && sasaranText) {
        try {
          console.log('Creating new Sasaran under Tujuan ID:', finalTujuanId);
          const [newSasaran] = await tx.insert(sasaranStrategis).values({
            sasaranText: sasaranText,
            tujuanId: finalTujuanId,
            unitKerja: unitKerja,
            kode: 'SS-' + Math.floor(Math.random() * 1000)
          }).returning();
          
          if (!newSasaran) throw new Error('Gagal membuat Sasaran Strategis baru.');
          finalSasaranId = newSasaran.id;
          console.log('New Sasaran created with ID:', finalSasaranId);
        } catch (err: any) {
          console.error('Error in Sasaran insert:', err.message);
          throw err;
        }
      }

      if (!finalSasaranId) {
        throw new Error('Sasaran ID tidak ditemukan atau tidak valid.');
      }

      // 2. Buat Indikator Kinerja
      try {
        console.log('Creating Indikator for Sasaran ID:', finalSasaranId);
        const [newIndikator] = await tx.insert(indikatorKinerja).values({
          sasaranId: finalSasaranId,
          namaIndikator: namaIndikator,
          satuan: satuan,
          unitKerja: unitKerja,
          kode: kode,
        }).returning();

        if (!newIndikator) throw new Error('Gagal membuat Indikator Kinerja.');
        console.log('New Indikator created with ID:', newIndikator.id);

        // 3. Buat Target Indikator untuk setiap tahun
        const yearValues = Object.keys(targets);
        if (yearValues.length > 0) {
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
            console.log('Targets inserted');
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
      } catch (err: any) {
        console.error('Error in Indikator/Target insert:', err.message);
        throw err;
      }
    });
  } catch (error: any) {
    console.error('API Error [sasaran-strategis/create]:', error);
    return {
      success: false,
      message: error.message || 'Terjadi kesalahan saat menyimpan data.'
    };
  }
});
