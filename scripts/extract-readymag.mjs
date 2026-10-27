import fs from 'fs';
import https from 'https';

const content = fs.readFileSync('C:\\Users\\kusha\\.gemini\\antigravity-ide\\brain\\3ea9134d-5c45-4e2c-bc55-e288370526f9\\.system_generated\\steps\\502\\content.md', 'utf8');

// Find Window.ServerData or data-content
const serverDataIdx = content.indexOf('window.ServerData =');
if (serverDataIdx !== -1) {
  console.log('Found window.ServerData!');
  const rest = content.slice(serverDataIdx + 'window.ServerData ='.length).trim();
  // Find where it ends
  const scriptEnd = rest.indexOf('</script>');
  const jsonStr = rest.slice(0, scriptEnd).trim().replace(/;$/, '');
  try {
    const data = JSON.parse(jsonStr);
    console.log('Parsed window.ServerData successfully!');
    fs.writeFileSync('scripts/readymag_server_data.json', JSON.stringify(data, null, 2));
    console.log('Saved server data to scripts/readymag_server_data.json');
  } catch (e) {
    console.error('Error parsing JSON:', e.message);
  }
}

// Fetch html snippet:
const htmlUrl = "https://c-p.rmcdn.net/50dad5df6b52d70000000006/5577714/HtmlSnippet-ab91b2dd-9b36-41ca-8724-03fbd6447da6.html";
https.get(htmlUrl, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    fs.writeFileSync('scripts/readymag_snippet.html', body);
    console.log('Saved HTML snippet to scripts/readymag_snippet.html! Length:', body.length);
  });
});
