const port = process.argv[2] || '3001';

async function main() {
  try {
    console.log(`--- Testing http://localhost:${port}/ ---`);
    const res = await fetch(`http://localhost:${port}/`);
    const html = await res.text();
    console.log('HTTP Status:', res.status);
    console.log('HTML Length:', html.length);
    
    // Look for all stylesheet links
    const cssLinks = [...html.matchAll(/href="(\/_next\/static\/css\/[^"]+)"/g)].map(m => m[1]);
    console.log('CSS links found:', cssLinks);
    
    for (const cssPath of cssLinks) {
      const cssRes = await fetch(`http://localhost:${port}` + cssPath);
      const cssText = await cssRes.text();
      console.log(`CSS link ${cssPath} returned status ${cssRes.status}, length: ${cssText.length} bytes`);
      if (cssRes.status === 200) {
        console.log('CSS starts with:', cssText.substring(0, 150));
      } else {
        console.log('CSS error output starts with:', cssText.substring(0, 150));
      }
    }
    
    // Also look for JS chunk errors
    const jsLinks = [...html.matchAll(/src="(\/_next\/static\/chunks\/[^"]+)"/g)].map(m => m[1]);
    console.log(`Found ${jsLinks.length} JS scripts`);
    if (jsLinks.length > 0) {
      const firstJs = await fetch(`http://localhost:${port}` + jsLinks[0]);
      console.log(`First JS script ${jsLinks[0]} returned status: ${firstJs.status}`);
    }
  } catch (err) {
    console.error('Error during test:', err.message);
  }
}

main();
