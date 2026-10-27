import http from 'http';

http.get('http://localhost:3000', (res) => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    console.log('HTML length:', html.length);
    const cssLinks = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map(m => m[1]);
    console.log('CSS links in HTML:', cssLinks);
    if (cssLinks.length > 0) {
      http.get('http://localhost:3000' + cssLinks[0], (cssRes) => {
        let css = '';
        cssRes.on('data', c => css += c);
        cssRes.on('end', () => {
          console.log('CSS file status:', cssRes.statusCode, 'length:', css.length);
          console.log('Sample CSS:', css.slice(0, 300));
        });
      });
    } else {
      console.log('No CSS links found in HTML! Checking <style> tags...');
      const styleTags = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);
      console.log('Style tags found:', styleTags.length);
    }
  });
});
