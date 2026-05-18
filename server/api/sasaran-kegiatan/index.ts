import { db } from '../../db';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { eq, desc, sql } from 'drizzle-orm';
import { defineEventHandler, readBody, createError, getQuery, getMethod } from 'h3';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  try {
    if (method === 'GET') {
      const query = getQuery(event);
      const id = query.id;

      if (id) {
        const result = await db.select().from(sasaranKegiatan).where(eq(sasaranKegiatan.id, Number(id)));
        return result[0];
      }

      return await db.select().from(sasaranKegiatan).orderBy(desc(sasaranKegiatan.id)).limit(100);
    }

    if (method === 'POST') {
      const body = await readBody(event);
      console.log('DEBUG POST SK body:', body);

      const payload = {
        id_ss: body.id_ss ? Number(body.id_ss) : null,
        id_is: body.id_is ? Number(body.id_is) : null,
        id_sp: body.id_sp ? Number(body.id_sp) : null,
        id_ip: body.id_ip ? Number(body.id_ip) : null,
        kode: body.kode ? String(body.kode) : null,
        unit_kerja: body.unit_kerja ? String(body.unit_kerja) : null,
        indikator_kinerja: body.indikator_kinerja ? String(body.indikator_kinerja) : null,
        sasaran_kegiatan_text: body.sasaran_kegiatan_text ? String(body.sasaran_kegiatan_text) : null,
        satuan: body.satuan ? String(body.satuan) : null,
        target_1: body.target_1 ? String(body.target_1) : '0',
        target_2: body.target_2 ? String(body.target_2) : '0',
        target_3: body.target_3 ? String(body.target_3) : '0',
        target_4: body.target_4 ? String(body.target_4) : '0',
        target_5: body.target_5 ? String(body.target_5) : '0'
      };

      console.log('DEBUG POST SK payload:', payload);

      const result = await db.insert(sasaranKegiatan).values(payload).returning();
      return result;
    }

    if (method === 'PUT') {
      const body = await readBody(event);
      if (!body.id) throw createError({ statusCode: 400, statusMessage: 'ID is required for update' });

      const payload = {
        id_ss: body.id_ss ? Number(body.id_ss) : null,
        id_is: body.id_is ? Number(body.id_is) : null,
        id_sp: body.id_sp ? Number(body.id_sp) : null,
        id_ip: body.id_ip ? Number(body.id_ip) : null,
        kode: body.kode ? String(body.kode) : null,
        unit_kerja: body.unit_kerja ? String(body.unit_kerja) : null,
        indikator_kinerja: body.indikator_kinerja ? String(body.indikator_kinerja) : null,
        sasaran_kegiatan_text: body.sasaran_kegiatan_text ? String(body.sasaran_kegiatan_text) : null,
        satuan: body.satuan ? String(body.satuan) : null,
        target_1: body.target_1 ? String(body.target_1) : '0',
        target_2: body.target_2 ? String(body.target_2) : '0',
        target_3: body.target_3 ? String(body.target_3) : '0',
        target_4: body.target_4 ? String(body.target_4) : '0',
        target_5: body.target_5 ? String(body.target_5) : '0'
      };

      const result = await db.update(sasaranKegiatan)
        .set(payload)
        .where(eq(sasaranKegiatan.id, Number(body.id)))
        .returning();
      return result;
    }

    if (method === 'DELETE') {
      const body = await readBody(event);
      const id = body.id || getQuery(event).id;
      if (!id) throw createError({ statusCode: 400, statusMessage: 'ID is required for deletion' });

      await db.delete(sasaranKegiatan).where(eq(sasaranKegiatan.id, Number(id)));
      return { success: true };
    }

    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('SK API Error:', error);
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || error?.message || 'Internal Server Error',
    });
  }
});
