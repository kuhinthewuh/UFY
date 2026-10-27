import fs from 'fs';
import https from 'https';

const images = [
  { name: 'speaker_1_giovanna.png', url: 'https://i-p.rmcdn.net/67692731b91ef9dcf7e7bad0/5577714/image-3c30107b-6a6b-4568-be0c-d1587e0c6034.png' },
  { name: 'speaker_2_lino_laura.png', url: 'https://i-p.rmcdn.net/67692731b91ef9dcf7e7bad0/5577714/image-9e0a8966-e44a-4b08-8623-e0e45c6b761f.png' },
  { name: 'speaker_3_helena.png', url: 'https://i-p.rmcdn.net/67692731b91ef9dcf7e7bad0/5577714/image-3e245ef4-e73f-4c97-95f4-a891c010ab5d.png' },
  { name: 'speaker_4_esenia.png', url: 'https://i-p.rmcdn.net/67692731b91ef9dcf7e7bad0/5577714/image-ae5408ff-7361-4f88-a32f-1df3bd842130.png' }
];

images.forEach(img => {
  const dest = `public/readymag_assets/${img.name}`;
  const file = fs.createWriteStream(dest);
  https.get(img.url, (res) => {
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${img.name} to ${dest}`);
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error(`Error downloading ${img.name}:`, err.message);
  });
});
