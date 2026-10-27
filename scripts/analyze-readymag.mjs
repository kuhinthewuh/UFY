import fs from 'fs';

const serverData = JSON.parse(fs.readFileSync('scripts/readymag_server_data.json', 'utf8'));

console.log('=== READYMAG MAG DETAILS ===');
const mag = serverData.mags?.mag || {};
console.log('Title:', mag.title);
console.log('Desktop width:', mag.desktopWidth);
console.log('Pages count:', mag.pages_count);
console.log('Widgets count:', mag.widgets?.length || (mag.pages?.[0]?.widgets?.length));

// Inspect pages and widgets
if (mag.pages && mag.pages.length > 0) {
  const p = mag.pages[0];
  console.log('Page height:', p.height);
}

// Let's inspect widgets in serverData
console.log('\nKeys in serverData.mags.mag:');
console.log(Object.keys(mag));

// Let's inspect widgets in detail
if (mag.widgets) {
  console.log(`\nFound ${mag.widgets.length} widgets!`);
  const widgetTypes = {};
  mag.widgets.forEach(w => {
    widgetTypes[w.type] = (widgetTypes[w.type] || 0) + 1;
  });
  console.log('Widget types:', widgetTypes);
}

// Let's inspect fonts and styles
console.log('\nText styles:');
if (mag.textStyles) {
  console.log(mag.textStyles);
}
