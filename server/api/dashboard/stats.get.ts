import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { laporanSasaranProgram } from '../../db/schema/laporan-sasaran-program';
import { laporanSasaranKegiatan } from '../../db/schema/laporan-sasaran-kegiatan';
import { laporanSasaranStrategis } from '../../db/schema/laporan-sasaran-strategis';
import { sql, isNull } from 'drizzle-orm';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // Fetch counts where deletedAt is null
    const ssCount = await db.select({ count: sql<number>`count(*)` })
      .from(sasaranStrategis)
      .where(isNull(sasaranStrategis.deletedAt));

    const spCount = await db.select({ count: sql<number>`count(*)` })
      .from(sasaranProgram)
      .where(isNull(sasaranProgram.deletedAt));

    const skCount = await db.select({ count: sql<number>`count(*)` })
      .from(sasaranKegiatan)
      .where(isNull(sasaranKegiatan.deletedAt));

    // Calculate achievement (capaian) average based on inputted realizations
    const programReports = await db.select({
      realisasi: laporanSasaranProgram.realisasi,
      target: sql<number>`MAX(tip.target)`
    })
    .from(laporanSasaranProgram)
    .leftJoin(sql`sireva.target_indikator_program tip`, sql`tip.indikator_id = ${laporanSasaranProgram.indikatorId}`)
    .groupBy(laporanSasaranProgram.id, laporanSasaranProgram.realisasi);

    const kegiatanReports = await db.select({
      realisasi: laporanSasaranKegiatan.realisasi,
      target: sql<number>`MAX(tik.target_nilai)`
    })
    .from(laporanSasaranKegiatan)
    .leftJoin(sql`sireva.target_indikator_kegiatan tik`, sql`tik.id_iku = ${laporanSasaranKegiatan.indikatorId}`)
    .groupBy(laporanSasaranKegiatan.id, laporanSasaranKegiatan.realisasi);

    const strategisReports = await db.select({
      capaian: laporanSasaranStrategis.capaian
    }).from(laporanSasaranStrategis);

    let totalCapaian = 0;
    let count = 0;

    for (const report of programReports) {
      const real = parseFloat(report.realisasi || '0');
      const tar = Number(report.target || 0);
      if (tar > 0) {
        totalCapaian += (real / tar) * 100;
        count++;
      }
    }

    for (const report of kegiatanReports) {
      const real = parseFloat(report.realisasi || '0');
      const tar = Number(report.target || 0);
      if (tar > 0) {
        totalCapaian += (real / tar) * 100;
        count++;
      }
    }

    for (const report of strategisReports) {
      const cap = parseFloat(report.capaian || '0');
      totalCapaian += cap;
      count++;
    }

    const averageCapaian = count > 0 ? parseFloat((totalCapaian / count).toFixed(2)) : 0;

    return {
      ss: Number(ssCount[0]?.count || 0),
      sp: Number(spCount[0]?.count || 0),
      sk: Number(skCount[0]?.count || 0),
      capaian: averageCapaian
    };
  } catch (error: any) {
    console.error('Dashboard Stats API Error:', error);
    return {
      ss: 0,
      sp: 0,
      sk: 0,
      capaian: 0
    };
  }
});

