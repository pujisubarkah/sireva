import { db } from '../../db';
import { sasaranStrategis } from '../../db/schema/sasaran-strategis';
import { indikatorStrategis } from '../../db/schema/indikator-strategis';
import { targetIndikatorStrategis } from '../../db/schema/target-indikator-strategis';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getMethod, getQuery, createError } from 'h3';
import { generateKodeSS, getStringHash } from '../../utils/kode-helper';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    try {
      const query = getQuery(event);
      const id = query.id ? Number(query.id) : null;

      if (id && !isNaN(id)) {
        const result = await db.select()
          .from(sasaranStrategis)
          .where(
            and(
              eq(sasaranStrategis.id, id),
              isNull(sasaranStrategis.deletedAt)
            )
          );
        return result[0] || null;
      }

      // Fetch all strategic objectives
      const sasaranList = await db.select()
        .from(sasaranStrategis)
        .where(isNull(sasaranStrategis.deletedAt))
        .orderBy(sasaranStrategis.nomorUrut);

      // Fetch all indicators
      const allIndicators = await db.select()
        .from(indikatorStrategis);

      // Fetch all targets
      const allTargets = await db.select()
        .from(targetIndikatorStrategis);

      // Map targets by indikatorId
      const targetsMap = new Map<number, any[]>();
      allTargets.forEach((t) => {
        if (t.indikatorId && t.tahun !== null && t.target !== null) {
          const list = targetsMap.get(t.indikatorId) || [];
          list.push({
            tahun: Number(t.tahun),
            target: Number(t.target)
          });
          targetsMap.set(t.indikatorId, list);
        }
      });

      // Map indicators by sasaranStrategisId
      const indicatorsMap = new Map<number, any[]>();
      allIndicators.forEach((ind) => {
        if (ind.sasaranStrategisId) {
          const list = indicatorsMap.get(ind.sasaranStrategisId) || [];
          list.push(ind);
          indicatorsMap.set(ind.sasaranStrategisId, list);
        }
      });

      // Format flat list containing both schema naming properties
      const formatted: any[] = [];
      sasaranList.forEach((ss) => {
        const list = indicatorsMap.get(ss.id) || [];
        if (list.length === 0) {
          formatted.push({
            // Format 1 (master-sasaran-strategis list)
            id: ss.id,
            kodeSs: ss.kodeSs,
            namaSs: ss.namaSs,

            // Format 2 (sasaran-strategis monitor list)
            ssId: ss.id,
            kode: ss.kodeSs,
            sasaranText: ss.namaSs,
            indikatorId: null,
            indikatorNama: null,
            indikatorSatuan: null,
            targets: []
          });
        } else {
          list.forEach((ind) => {
            formatted.push({
              // Format 1
              id: ss.id,
              kodeSs: ss.kodeSs,
              namaSs: ss.namaSs,

              // Format 2
              ssId: ss.id,
              kode: ss.kodeSs,
              sasaranText: ss.namaSs,
              indikatorId: ind.id,
              indikatorNama: ind.nama,
              indikatorSatuan: ind.satuan,
              targets: targetsMap.get(ind.id) || []
            });
          });
        }
      });

      return formatted;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Internal Server Error'
      };
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event);

      // Support either nama_ss or sasaranText or nama
      const namaSs = body.nama_ss || body.sasaranText || body.nama;
      const tahun = body.tahun || '2026';
      const providedCode = body.kode_ss || body.kode || body.kodeSs || null;

      // Validation Rules
      if (!namaSs) {
        throw createError({ statusCode: 400, statusMessage: 'nama_ss atau sasaranText wajib diisi' });
      }

      // Execute transaction with Advisory Lock
      const result = await db.transaction(async (tx) => {
        // Hashing tahun string to an integer for pg_advisory_xact_lock
        const lockId = getStringHash(tahun.toString());
        await tx.execute(sql`SELECT pg_advisory_xact_lock(${lockId})`);

        // Calculate MAX(nomor_urut) including soft-deleted ones so numbers are not reused
        const maxResult = await tx.execute(
          sql`SELECT coalesce(max(nomor_urut), 0) as max_val FROM sireva.sasaran_strategis WHERE tahun = ${tahun}`
        );
        const maxVal = Number(maxResult.rows[0]?.max_val || 0);
        const nextNomorUrut = maxVal + 1;
        const generatedCode = generateKodeSS(nextNomorUrut);

        const inserted = await tx.insert(sasaranStrategis)
          .values({
            tahun: tahun.toString(),
            nomorUrut: nextNomorUrut,
            kodeSs: providedCode || generatedCode,
            namaSs: namaSs,
            pengampu: body.pengampu || null,
            instansiTerkait: body.instansi_terkait || null,
          })
          .returning();

        return inserted[0];
      });

      return {
        success: true,
        message: 'Data berhasil ditambahkan',
        data: {
          id: result.id,
          kode: result.kodeSs,
          nama: result.namaSs
        }
      };

    } catch (error: any) {
      console.error('Error in POST /api/sasaran-strategis:', error);
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});