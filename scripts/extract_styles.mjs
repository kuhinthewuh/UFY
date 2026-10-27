import fs from 'fs';

const html = fs.readFileSync('scripts/readymag_snippet.html', 'utf8');

// Find all colors in html
const colorMatches = [...html.matchAll(/(rgb\([^)]+\)|#[0-9a-fA-F]{3,8})/g)].map(m => m[0]);
const uniqueColors = [...new Set(colorMatches)];
console.log('Unique colors in snippet:', uniqueColors);

// Inspect style tag #7 (length: 13686)
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
if (styles.length >= 7) {
  fs.writeFileSync('scripts/snippet_style7.css', styles[6]);
  console.log('Saved snippet style #7 to scripts/snippet_style7.css');
}

// Inspect how widgets are placed
const widgetDivs = [...html.matchAll(/<div[^>]*style=\"([^\"]*position:\s*absolute[^\"]*)\"[^>]*>/gi)].slice(0, 25);
console.log(`Found ${widgetDivs.length} absolute divs. First 5 styles:`);
widgetDivs.slice(0, 5).forEach((w, i) => console.log(`#${i+1}: ${w[1]}`));
