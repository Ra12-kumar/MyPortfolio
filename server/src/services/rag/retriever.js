/**
 * In-memory BM25 retriever. The "vector store" is a plain array built once at
 * start-up from the approved knowledge chunks — no database, no embeddings API.
 */

const STOPWORDS = new Set(
  (
    'a an the and or but if of to in on at by for with about as is are was were be been being am do does did done can could would should will ' +
    'shall may might must i me my we our you your he she it its they them their this that these those there here what which who whom how why ' +
    'when where so than then too very just also not no yes any some more most other such own same from into over under again further once ' +
    'please tell want need like know give get have has had hi hello hey ram'
  ).split(' '),
);

/** Very light stemmer: enough to match plurals / -ing / -ed forms. */
function stem(word) {
  let w = word;
  if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith('ies')) w = `${w.slice(0, -3)}y`;
  else if (w.length > 4 && /(sses|ches|shes|xes)$/.test(w)) w = w.slice(0, -2);
  else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  // drop a trailing "e" so locate/located and integrate/integrated share a stem
  if (w.length > 4 && w.endsWith('e')) w = w.slice(0, -1);
  return w;
}

export function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, ' ')
    .split(' ')
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map(stem);
}

export function buildIndex(chunks) {
  const docs = chunks.map((chunk) => {
    // title and keywords are repeated so they weigh more than body text
    const tokens = tokenize(`${chunk.title} ${chunk.title} ${chunk.keywords} ${chunk.answer}`);
    const tf = new Map();
    tokens.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
    return { chunk, tf, length: tokens.length };
  });
  const avgLength = docs.reduce((n, d) => n + d.length, 0) / (docs.length || 1);
  const df = new Map();
  docs.forEach((d) => d.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
  return { docs, avgLength, df, size: docs.length };
}

const K1 = 1.4;
const B = 0.6;

/** Returns the top-k chunks for a query, best first, with their BM25 score. */
export function search(index, query, k = 3) {
  const terms = [...new Set(tokenize(query))];
  if (!terms.length) return [];

  const results = index.docs.map((d) => {
    let score = 0;
    let matched = 0;
    for (const term of terms) {
      const f = d.tf.get(term);
      if (!f) continue;
      matched += 1;
      const n = index.df.get(term) || 0;
      const idf = Math.log(1 + (index.size - n + 0.5) / (n + 0.5));
      score += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.length) / index.avgLength)));
    }
    return { chunk: d.chunk, score, matched, terms: terms.length };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
