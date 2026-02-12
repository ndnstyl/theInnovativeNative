const puppeteer = require('/Users/makwa/.nvm/versions/node/v22.18.0/lib/node_modules/md-to-pdf/node_modules/puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1280,
    height: 720,
    deviceScaleFactor: 2
  });

  const htmlPath = path.join(__dirname, 'thumbnail.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  await page.screenshot({
    path: path.join(__dirname, 'thumbnail.png'),
    type: 'png',
    clip: { x: 0, y: 0, width: 1280, height: 720 }
  });

  console.log('Thumbnail saved: thumbnail.png (1280x720 @2x = 2560x1440 actual pixels)');

  await browser.close();
})();
