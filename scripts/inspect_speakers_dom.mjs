import fs from 'fs';

const html = fs.readFileSync('scripts/readymag_snippet.html', 'utf8');

// Look for speaker names and surrounding divs
const names = ['Giovanna Crise', 'Lino Di Maio', 'Helena Sciavarrello', 'Esenia Hortus'];
names.forEach(name => {
  const idx = html.indexOf(name);
  if (idx !== -1) {
    console.log(`\n=== Found ${name} at index ${idx} ===`);
    const slice = html.slice(Math.max(0, idx - 300), Math.min(html.length, idx + 600));
    console.log(slice);
  }
});
