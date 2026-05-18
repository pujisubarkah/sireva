import { db } from '../../db';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.method;

  try {
    if (method === 'GET') {
      const query = getQuery(event);
      const id = query.id;

      if (id) {
        const result = await db.select().from(sasaranProgram).where(eq(sasaranProgram.id, Number(id)));
        return result[0];
      }

      return await db.select().from(sasaranProgram).orderBy(sasaranProgram.id).limit(Number(query.limit || 100));
    }

    if (method === 'POST') {
      const body = await readBody<any>(event);
      console.log('DEBUG: Received POST body:', JSON.stringify(body, null, 2));

      const id_ss = body.id_ss ? Number(body.id_ss) : null;
      if (!id_ss) {
        throw new Error('id_ss is required and cannot be null');
      }

      // Prepare target values from either flat keys or targets array
      const t1 = body.target_1 != null ? String(body.target_1) : (body.targets?.[0] != null ? String(body.targets[0]) : '0');
      const t2 = body.target_2 != null ? String(body.target_2) : (body.targets?.[1] != null ? String(body.targets[1]) : '0');
      const t3 = body.target_3 != null ? String(body.target_3) : (body.targets?.[2] != null ? String(body.targets[2]) : '0');
      const t4 = body.target_4 != null ? String(body.target_4) : (body.targets?.[3] != null ? String(body.targets[3]) : '0');
      const t5 = body.target_5 != null ? String(body.target_5) : (body.targets?.[4] != null ? String(body.targets[4]) : '0');

      return await db.transaction(async (tx) => {
        // Main insert
        const [sp] = await tx.insert(sasaranProgram).values({
          id_ss: id_ss,
          kode: body.kode || null,
          unit_kerja: body.unit_kerja || null,
          kode_iku: body.kode_iku || null,
          sasaran_program_text: body.sasaran_program_text || null,
          satuan: body.satuan || null,
          target_1: t1,
          target_2: t2,
          target_3: t3,
          target_4: t4,
          target_5: t5,
        }).returning();

        // Handle Additional Indicators if any
        if (Array.isArray(body.indikatorTambahan) && body.indikatorTambahan.length > 0) {
          for (const ind of body.indikatorTambahan) {
            if (ind.nama) {
              await tx.insert(sasaranProgram).values({
                id_ss: id_ss,
                kode: body.kode || null,
                unit_kerja: body.unit_kerja || null,
                kode_iku: ind.nama, // Use the additional indicator text here
                sasaran_program_text: body.sasaran_program_text || null,
                satuan: body.satuan || null,
                target_1: t1,
                target_2: t2,
                target_3: t3,
                target_4: t4,
                target_5: t5,
              });
            }
          }
        }

        return { id: sp?.id };
      });
    }

    if (method === 'PUT') {
      const body = await readBody<any>(event);
      if (!body.id) throw new Error('ID is required');

      const t1 = body.target_1 != null ? String(body.target_1) : (body.targets?.[0] != null ? String(body.targets[0]) : '0');
      const t2 = body.target_2 != null ? String(body.target_2) : (body.targets?.[1] != null ? String(body.targets[1]) : '0');
      const t3 = body.target_3 != null ? String(body.target_3) : (body.targets?.[2] != null ? String(body.targets[2]) : '0');
      const t4 = body.target_4 != null ? String(body.target_4) : (body.targets?.[3] != null ? String(body.targets[3]) : '0');
      const t5 = body.target_5 != null ? String(body.target_5) : (body.targets?.[4] != null ? String(body.targets[4]) : '0');

      const updated = await db.update(sasaranProgram).set({
        id_ss: body.id_ss ? Number(body.id_ss) : null,
        kode: body.kode || null,
        unit_kerja: body.unit_kerja || null,
        kode_iku: body.kode_iku || null,
        sasaran_program_text: body.sasaran_program_text || null,
        satuan: body.satuan || null,
        target_1: t1,
        target_2: t2,
        target_3: t3,
        target_4: t4,
        target_5: t5,
      }).where(eq(sasaranProgram.id, Number(body.id))).returning();

      return { success: true, data: updated[0] };
    }

    if (method === 'DELETE') {
      const body = await readBody(event);
      if (!body.id) throw new Error('ID is required');
      return await db.delete(sasaranProgram).where(eq(sasaranProgram.id, body.id)).returning();
    }
  } catch (error: any) {
    console.error('API Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error'
    });
  }
});