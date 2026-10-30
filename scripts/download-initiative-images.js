import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../public/images/initiatives');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const downloads = [
  {
    filename: 'entry-1-dehuroad-flyover.jpg',
    url: 'https://cf-images.assettype.com/esakal%2Fimport%2Fs3fs-public%2Fnews-story%2Fcover-images%2F0balabhegade_maval.jpg?w=800&auto=format%2Ccompress'
  },
  {
    filename: 'entry-2-rice-planting.jpg',
    url: 'https://images.tv9marathi.com/wp-content/uploads/2019/07/04185053/bala-bhegade-4.jpg?q=75&w=600'
  },
  {
    filename: 'entry-3-panchayat-samiti-review.jpg',
    url: 'https://dainikmaval.com/wp-content/uploads/2023/01/Bala-Bhegade-at-Panchayat-Samiti-Maval.jpg'
  },
  {
    filename: 'entry-5-ajivali-bhoomi-pujan.jpg',
    url: 'https://dainikmaval.com/wp-content/uploads/2023/06/Ajivali.jpg'
  }
];

async function downloadAll() {
  for (const item of downloads) {
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        const filePath = path.join(targetDir, item.filename);
        fs.writeFileSync(filePath, buffer);
        console.log(`Saved ${item.filename} (${buffer.length} bytes) to ${filePath}`);
      } else {
        console.error(`Failed to download ${item.url}: HTTP ${res.status}`);
      }
    } catch (err) {
      console.error(`Error downloading ${item.url}:`, err.message);
    }
  }
}

downloadAll();
