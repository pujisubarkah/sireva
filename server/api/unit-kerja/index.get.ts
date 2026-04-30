import { db } from '../../db';
import { unitKerja } from '../../db/schema/unit-kerja';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const data = await db.select().from(unitKerja).orderBy(unitKerja.nama);
    
    // Deduplicate by name to prevent doubles in UI
    const uniqueMap = new Map();
    data.forEach(item => {
      if (item.nama && !uniqueMap.has(item.nama)) {
        uniqueMap.set(item.nama, item);
      }
    });
    
    return Array.from(uniqueMap.values());
  } catch (error) {
    console.error('Error fetching unit-kerja:', error);
    return [];
  }
});
