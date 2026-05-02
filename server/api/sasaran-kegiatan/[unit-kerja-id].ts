import { db } from '../../db';
import { sasaranKegiatan } from '../../db/schema/sasaran-kegiatan';
import { eq } from 'drizzle-orm';
import { createError, defineEventHandler, getMethod, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method !== 'GET') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }

  const rawUnitKerjaId = getRouterParam(event, 'unit-kerja-id');
  const unitKerjaId = Number(rawUnitKerjaId);

  if (!rawUnitKerjaId || Number.isNaN(unitKerjaId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Parameter "unit-kerja-id" harus berupa angka.'
    });
  }

  return await db
    .select({
      id: sasaranKegiatan.id,
      idSp: sasaranKegiatan.idSp,
      kode: sasaranKegiatan.kode,
      sasaranText: sasaranKegiatan.sasaranText,
      unitKerjaId: sasaranKegiatan.unitKerjaId,
    })
    .from(sasaranKegiatan)
    .where(eq(sasaranKegiatan.unitKerjaId, unitKerjaId));
});
