import { db } from './server/db';
import { sasaranStrategis } from './server/db/schema/sasaran-strategis';
import { indikatorKinerja } from './server/db/schema/indikator-kinerja';
import { sql, eq } from 'drizzle-orm';

async function restore() {
  try {
    // 1. Get all current sasaran strategis to map text to valid ID
    const validSasaran = await db.select().from(sasaranStrategis);
    const textToIdMap = new Map();
    validSasaran.forEach(s => textToIdMap.set(s.sasaranText, s.id));
    
    console.log('Valid Sasaran Map:', Array.from(textToIdMap.entries()));

    // 2. We need to find indicators that were linked to deleted sasaran.
    // Since they are deleted, we can't easily know which text they belonged to
    // UNLESS we check if there are any orphans.
    
    // Check for indicators with sasaranId that no longer exists
    const orphans = await db.execute(sql`
      SELECT ik.id, ik.sasaran_id, ik.nama_indikator 
      FROM sireva.indikator_kinerja ik
      LEFT JOIN sireva.sasaran_strategis ss ON ik.sasaran_id = ss.id
      WHERE ss.id IS NULL
    `);
    
    const orphanList = (Array.isArray(orphans) ? orphans : (orphans as any).rows);
    console.log('Found Orphans:', orphanList.length);

    if (orphanList.length > 0) {
        // This is tricky because we don't know the text of the deleted sasaran.
        // Wait! I might have deleted sasaran that HAD indicators.
        
        // I will look at the previous IDs I kept: [ 4, 1, 2, 5, 3 ]
        // I'll try to find any indicators that are NOT linked to these and re-link them 
        // to the one with the same text if possible.
        
        // BUT how to know the text of the deleted one?
        // Maybe I can find it from other tables?
        
        // Actually, most of the time, the text is the same.
        // I'll check if there's any other table that links to these orphans that has text.
        
        // Wait! If the user just inputted them, they might still be in the database but with null/invalid SS.
        
        // Actually, I'll check if there are any other Sasaran Strategis that I missed.
        const allSS = await db.select().from(sasaranStrategis);
        console.log('Current SS IDs:', allSS.map(s => s.id));
    }

  } catch (err) {
    console.error('Error during restore:', err);
  }
  process.exit(0);
}

restore();
