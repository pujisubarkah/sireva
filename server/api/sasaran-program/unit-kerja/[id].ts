import { db } from '../../../db';
import { sasaranProgram } from '../../../db/schema/sasaran-program';
import { unitKerja } from '../../../db/schema/unit-kerja';
import { eq, sql } from 'drizzle-orm';
import { defineEventHandler, createError, type H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const unitKerjaId = Number(event.context.params?.id);
  if (!unitKerjaId || isNaN(unitKerjaId)) {
    throw createError({ statusCode: 400, statusMessage: 'id unit kerja harus berupa angka' });
  }

  try {
    // We join with unit_kerja table to filter by its ID while matching the unit_kerja name in sasaran_program
    const rows = await db.select({
      id: sasaranProgram.id,
      id_ss: sasaranProgram.id_ss,
      kode: sasaranProgram.kode,
      unit_kerja: sasaranProgram.unit_kerja,
      kode_iku: sasaranProgram.kode_iku,
      sasaran_program_text: sasaranProgram.sasaran_program_text,
      satuan: sasaranProgram.satuan,
      target_1: sasaranProgram.target_1,
      target_2: sasaranProgram.target_2,
      target_3: sasaranProgram.target_3,
      target_4: sasaranProgram.target_4,
      target_5: sasaranProgram.target_5,
    })
    .from(sasaranProgram)
    .innerJoin(unitKerja, eq(sasaranProgram.unit_kerja, unitKerja.nama))
    .where(eq(unitKerja.id, unitKerjaId));

    return rows;
  } catch (error: any) {
    console.error('API Error [sasaran-program/unit-kerja/:id]:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error',
    });
  }
});
