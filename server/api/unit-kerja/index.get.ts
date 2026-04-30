import { db } from '../../db';
import { unitKerja } from '../../db/schema/unit-kerja';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    return await db.select().from(unitKerja).orderBy(unitKerja.nama);
  } catch (error) {
    console.error('Error fetching unit-kerja:', error);
    return [];
  }
});
