import { db } from '../../db';
import { sasaranProgram } from '../../db/schema/sasaran-program';
import { eq, sql } from 'drizzle-orm';
import { defineEventHandler, createError, getMethod, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const rawId = getRouterParam(event, 'id');
  const id = Number(rawId);

  if (!rawId || Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Parameter "id" harus berupa angka.' });
  }

  try {
    if (method === 'GET') {
      const [row] = await db.select().from(sasaranProgram).where(eq(sasaranProgram.id, id));
      if (!row) {
        throw createError({ statusCode: 404, statusMessage: 'Sasaran program tidak ditemukan.' });
      }
      return row;
    }

    if (method === 'DELETE') {
      const [deleted] = await db.delete(sasaranProgram).where(eq(sasaranProgram.id, id)).returning();
      if (!deleted) {
        throw createError({ statusCode: 404, statusMessage: 'Sasaran program tidak ditemukan.' });
      }
      return { success: true, deleted };
    }

    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || error?.message || 'Internal Server Error',
    });
  }
});
