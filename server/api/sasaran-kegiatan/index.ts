import { db } from '../../db';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { indikatorKinerja } from '../../db/schema/indikator-kinerja';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, getMethod, getQuery, createError } from 'h3';
import { generateKodeSK } from '../../utils/kode-helper';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    try {
      const query = getQuery(event);
      const spId = query.sp_id ? Number(query.sp_id) : null;
      const id = query.id ? Number(query.id) : null;

      const selectFields = {
        id: sasaranKegiatan.id,
        spId: sasaranKegiatan.spId,
        nomorUrut: sasaranKegiatan.nomorUrut,
        kode: sasaranKegiatan.kodeSk,
        sasaranText: sasaranKegiatan.namaSk,
        sasaran_kegiatan_text: sasaranKegiatan.namaSk,
        unit_kerja: sasaranKegiatan.pengampu,
        unitKerjaNama: sasaranKegiatan.pengampu,
        instansiTerkait: sasaranKegiatan.instansiTerkait,
        indikatorId: indikatorKinerja.id,
        indikatorNama: indikatorKinerja.namaIku,
        indikator_kinerja: indikatorKinerja.namaIku,
        satuan: indikatorKinerja.satuan,
        indikatorSatuan: indikatorKinerja.satuan,
        target_1: sql<string>`(select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = ${indikatorKinerja.id} and tik.tahun = 2025 limit 1)`,
        target_2: sql<string>`(select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = ${indikatorKinerja.id} and tik.tahun = 2026 limit 1)`,
        target_3: sql<string>`(select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = ${indikatorKinerja.id} and tik.tahun = 2027 limit 1)`,
        target_4: sql<string>`(select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = ${indikatorKinerja.id} and tik.tahun = 2028 limit 1)`,
        target_5: sql<string>`(select target_nilai from sireva.target_indikator_kegiatan tik where tik.id_iku = ${indikatorKinerja.id} and tik.tahun = 2029 limit 1)`,
      };

      if (id && !isNaN(id)) {
        const result = await db.select(selectFields)
          .from(sasaranKegiatan)
          .leftJoin(indikatorKinerja, and(eq(sasaranKegiatan.id, indikatorKinerja.skId), isNull(indikatorKinerja.deletedAt)))
          .where(and(eq(sasaranKegiatan.id, id), isNull(sasaranKegiatan.deletedAt)));
        return result[0] || null;
      }

      const conditions = [isNull(sasaranKegiatan.deletedAt)];
      if (spId && !isNaN(spId)) {
        conditions.push(eq(sasaranKegiatan.spId, spId));
      }

      return await db.select(selectFields)
        .from(sasaranKegiatan)
        .leftJoin(indikatorKinerja, and(eq(sasaranKegiatan.id, indikatorKinerja.skId), isNull(indikatorKinerja.deletedAt)))
        .where(and(...conditions))
        .orderBy(sasaranKegiatan.nomorUrut);
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

      // Validation
      if (!body.sp_id) {
        throw createError({ statusCode: 400, statusMessage: 'sp_id wajib diisi' });
      }
      if (!body.nama_sk) {
        throw createError({ statusCode: 400, statusMessage: 'nama_sk wajib diisi' });
      }
      if (body.kode_sk || body.nomor_urut || body.kodeSk || body.nomorUrut) {
        throw createError({ statusCode: 400, statusMessage: 'Kode and nomor_urut tidak boleh dikirim dari frontend' });
      }

      const parentId = Number(body.sp_id);

      // Concurrency locking and code generation in a transaction
      const result = await db.transaction(async (tx) => {
        // SELECT ... FOR UPDATE on parent
        const parentResult = await tx.execute(
          sql`SELECT id, kode_sp FROM sireva.sasaran_program WHERE id = ${parentId} AND deleted_at IS NULL FOR UPDATE`
        );
        const parent = parentResult.rows[0];
        if (!parent) {
          throw createError({ statusCode: 404, statusMessage: 'Parent Sasaran Program tidak ditemukan' });
        }

        const kodeSp = parent.kode_sp as string;
 
         // Calculate MAX(nomor_urut) for this spId
         const maxResult = await tx.execute(
           sql`SELECT coalesce(max(nomor_urut), 0) as max_val FROM sireva.sasaran_kegiatan WHERE sp_id = ${parentId}`
         );
         const maxVal = Number(maxResult.rows[0]?.max_val || 0);
         const nextNomorUrut = maxVal + 1;
         const generatedCode = generateKodeSK(kodeSp, nextNomorUrut);
 
         const inserted = await tx.insert(sasaranKegiatan)
           .values({
             spId: parentId,
             nomorUrut: nextNomorUrut,
             kodeSk: generatedCode,
             namaSk: body.nama_sk,
             pengampu: body.pengampu || null,
             instansiTerkait: body.instansi_terkait || null,
           })
           .returning();
 
         return inserted[0];
       });
 
       if (!result) {
         throw createError({ statusCode: 500, statusMessage: 'Gagal menambahkan data' });
       }
 
       return {
         success: true,
         message: 'Data berhasil ditambahkan',
         data: {
           id: result.id,
           kode: result.kodeSk,
           nama: result.namaSk
         }
       };

    } catch (error: any) {
      console.error('Error in POST /api/sasaran-kegiatan:', error);
      return {
        success: false,
        message: error.statusMessage || error.message || 'Internal Server Error'
      };
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
});
