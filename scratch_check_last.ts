import { db } from './server/db';
import { sasaranStrategis } from './server/db/schema/sasaran-strategis';
import { indikatorKinerja } from './server/db/schema/indikator-kinerja';
import { desc, eq } from 'drizzle-orm';

async function checkLast() {
  const lastSS = await db.select().from(sasaranStrategis).orderBy(desc(sasaranStrategis.id)).limit(1);
  console.log('Last Sasaran Strategis:', lastSS[0]);
  
  if (lastSS[0]) {
    const indicators = await db.select().from(indikatorKinerja).where(eq(indikatorKinerja.sasaranId, lastSS[0].id));
    console.log('Indicators for this Sasaran:', indicators);
  }
  process.exit(0);
}

checkLast();
