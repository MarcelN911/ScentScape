import { getCatalog } from '../../scripts/catalog/load.js';
import { bestsellers } from '../../scripts/catalog/queries.js';
import { quizEntryOf } from '../../scripts/catalog/quiz-entry.js';

/* Beliebteste zuerst, damit der Test bei Gleichstand die bekannteren Parfums zeigt. */
export async function GET() {
  const catalog = await getCatalog();
  const entries = bestsellers(catalog, catalog.length).map(quizEntryOf);
  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json' },
  });
}
