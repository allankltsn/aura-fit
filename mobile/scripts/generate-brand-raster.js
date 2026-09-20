// One-off generation script: renders the brand SVG sources in assets/brand/
// into the raster files app.json expects. Run with `node scripts/generate-brand-raster.js`
// after `npm install --no-save sharp` (sharp is not a project dependency).
const path = require('path');
const sharp = require('sharp');

const brand = (f) => path.join(__dirname, '..', 'assets', 'brand', f);
const out = (f) => path.join(__dirname, '..', 'assets', f);

async function run() {
  await sharp(brand('app-icon-source.svg')).resize(1024, 1024).png().toFile(out('icon.png'));
  await sharp(brand('splash-icon-source.svg')).resize(1024, 1024).png().toFile(out('splash-icon.png'));
  await sharp(brand('android-foreground-source.svg'))
    .resize(1024, 1024)
    .png()
    .toFile(out('android-icon-foreground.png'));
  await sharp(brand('android-monochrome-source.svg'))
    .resize(1024, 1024)
    .png()
    .toFile(out('android-icon-monochrome.png'));
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: '#1f1f1f' } })
    .png()
    .toFile(out('android-icon-background.png'));
  await sharp(brand('icon-tile-24-accent.svg')).resize(196, 196).png().toFile(out('favicon.png'));
  console.log('Brand raster assets generated.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
