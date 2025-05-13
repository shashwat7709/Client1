const https = require('https');
const fs = require('fs');
const path = require('path');

const fonts = [
  {
    name: 'playfair-display',
    files: [
      {
        url: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgA.woff2',
        filename: 'playfair-display-regular.woff2'
      },
      {
        url: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwc.woff2',
        filename: 'playfair-display-italic.woff2'
      },
      {
        url: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwc.woff2',
        filename: 'playfair-display-bold.woff2'
      }
    ]
  },
  {
    name: 'lora',
    files: [
      {
        url: 'https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkq18ndeY9Z6JTg.woff2',
        filename: 'lora-regular.woff2'
      },
      {
        url: 'https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0gvTJPa787z5vBJBkq18ndeY9Z6JTg.woff2',
        filename: 'lora-italic.woff2'
      },
      {
        url: 'https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0gvTJPa787z5vBJBkq18ndeY9Z6JTg.woff2',
        filename: 'lora-bold.woff2'
      }
    ]
  },
  {
    name: 'eb-garamond',
    files: [
      {
        url: 'https://fonts.gstatic.com/s/ebgaramond/v28/SlGDmQSNjdsmc35Jdf1O5WX5F-8zR7z.woff2',
        filename: 'eb-garamond-regular.woff2'
      },
      {
        url: 'https://fonts.gstatic.com/s/ebgaramond/v28/SlGFmQSNjdsmc35Jdf1O5WX5F-8zR7z.woff2',
        filename: 'eb-garamond-italic.woff2'
      },
      {
        url: 'https://fonts.gstatic.com/s/ebgaramond/v28/SlGFmQSNjdsmc35Jdf1O5WX5F-8zR7z.woff2',
        filename: 'eb-garamond-bold.woff2'
      }
    ]
  },
  {
    name: 'petit-formal-script',
    files: [
      {
        url: 'https://fonts.gstatic.com/s/petitformalscript/v20/B50W7poP6FI7jLnUPEg9hZ8pZgQUzRN.woff2',
        filename: 'petit-formal-script-regular.woff2'
      }
    ]
  }
];

function downloadFont(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download font: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function downloadAllFonts() {
  for (const font of fonts) {
    const fontDir = path.join(__dirname, 'public', 'fonts', font.name);
    
    if (!fs.existsSync(fontDir)) {
      fs.mkdirSync(fontDir, { recursive: true });
    }

    for (const file of font.files) {
      const filepath = path.join(fontDir, file.filename);
      console.log(`Downloading ${file.filename}...`);
      try {
        await downloadFont(file.url, filepath);
        console.log(`Successfully downloaded ${file.filename}`);
      } catch (error) {
        console.error(`Error downloading ${file.filename}:`, error);
      }
    }
  }
}

downloadAllFonts().then(() => {
  console.log('All fonts downloaded successfully!');
}).catch((error) => {
  console.error('Error downloading fonts:', error);
}); 