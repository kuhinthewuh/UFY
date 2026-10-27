import fs from 'fs';

const html = fs.readFileSync('scripts/readymag_snippet.html', 'utf8');

// Inspect SVGs
const svgs = [...html.matchAll(/<svg([\s\S]*?)<\/svg>/gi)].map(m => m[0]);
console.log(`Found ${svgs.length} SVGs:`);
svgs.forEach((s, idx) => {
  console.log(`\n--- SVG #${idx + 1} (length: ${s.length}) ---`);
  console.log(s.slice(0, 300));
});

// Inspect style tags
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
console.log(`\nFound ${styles.length} style tags`);
styles.forEach((st, idx) => {
  console.log(`Style tag #${idx + 1} length: ${st.length}`);
});
