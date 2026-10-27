import fs from 'fs';

const html = fs.readFileSync('scripts/readymag_snippet.html', 'utf8');

console.log('Snippet length:', html.length);

// Extract text blocks
const textMatches = [...html.matchAll(/<div[^>]*class=\"[^\"]*text[^\"]*\"[^>]*>([\s\S]*?)<\/div>/gi)].map(m => m[1]);
console.log('Found text divs:', textMatches.length);

// Also look for widgets
const widgets = [...html.matchAll(/id=\"widget-([^\"]+)\"[^>]*class=\"([^\"]+)\"/g)].map(m => ({ id: m[1], class: m[2] }));
console.log('Found widgets:', widgets.length);

// Let's write all clean texts to a file
const cleanTexts = [];
const pMatches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
console.log('Found paragraphs count:', pMatches.length);

fs.writeFileSync('scripts/extracted_paragraphs.json', JSON.stringify([...new Set(pMatches)], null, 2));
console.log('Saved extracted paragraphs to scripts/extracted_paragraphs.json');

// Check for images
const imgMatches = [...html.matchAll(/<img[^>]+src=\"([^\"]+)\"/gi)].map(m => m[1]);
console.log('Images found:', imgMatches);

// Check for SVGs
const svgMatches = [...html.matchAll(/<svg[^>]*>[\s\S]*?<\/svg>/gi)];
console.log('SVGs found:', svgMatches.length);
