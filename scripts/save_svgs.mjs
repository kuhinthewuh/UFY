import fs from 'fs';

const html = fs.readFileSync('scripts/readymag_snippet.html', 'utf8');

const svgs = [...html.matchAll(/<svg([\s\S]*?)<\/svg>/gi)].map(m => m[0]);
console.log(`Extracting ${svgs.length} SVGs...`);

fs.mkdirSync('public/readymag_assets', { recursive: true });

svgs.forEach((svg, idx) => {
  const filename = `public/readymag_assets/svg_${idx + 1}.svg`;
  fs.writeFileSync(filename, svg);
  console.log(`Saved SVG #${idx + 1} (${svg.length} bytes) to ${filename}`);
});
