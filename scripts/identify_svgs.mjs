import fs from 'fs';

for (let i = 1; i <= 14; i++) {
  const content = fs.readFileSync(`public/readymag_assets/svg_${i}.svg`, 'utf8');
  const viewBox = content.match(/viewBox=\"([^\"]+)\"/)?.[1];
  const width = content.match(/width=\"([^\"]+)\"/)?.[1];
  const height = content.match(/height=\"([^\"]+)\"/)?.[1];
  
  // Find colors in this SVG
  const colors = [...content.matchAll(/(#[0-9a-fA-F]{3,8}|rgb\([^)]+\))/g)].map(m => m[0]);
  console.log(`SVG #${i}: viewBox=${viewBox || (width + 'x' + height)}, length=${content.length}, colors:`, [...new Set(colors)]);
}
