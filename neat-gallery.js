import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'fs';
import { extname, join, resolve } from 'path';
import sizeOf from 'image-size';
import minimist from 'minimist';
import sharp from 'sharp';

// change this to use a different PhotoSwipe version
const psVersion = '5';

// default thumbnail width
const defaultWidth = 500;

// default layout
const defaultLayout = 'grid';

let args = minimist(process.argv.slice(2), {
    string: [
        'input', 'i', 'title', 't', 'p', 'width', 'w', 'r', 'nocss', 'nojs', 'nohtml', 'layout', 'l'
    ],
});

const dir = args.input || args.i;

if (!dir) {
  console.error('Missing required argument: input');
  process.exit();
}
const title = args.title || args.t || "Gallery";
let path = args.p || '.';
path = path.replace(/\/+$/, '');
const width = parseInt(args.width) || parseInt(args.w) || defaultWidth;
let layout = ( args.layout === 'masonry' || 
               args.l === 'masonry') ? 'masonry' : defaultLayout;

const regen = args.r !== undefined;
const noCss = args.nocss !== undefined;
const noJs = args.nojs !== undefined;
const noHTML = args.nohtml !== undefined;

const outputFilename = `gallery.html`;
const outputJsonFileName = `gallery.json`;
const thumbDir = join(dir, 'thumbnails');
const thumbURLPrefix = join(path, 'thumbnails');
let jsonFile = {};

if (!existsSync(dir)) {
  console.error(`Input directory not found: ${dir}`);
  process.exit();
}

[dir, thumbDir].forEach(dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

const jsonFilePath = join(dir, outputJsonFileName);
const jsonExists = existsSync(jsonFilePath)

if (jsonExists) {
  const buf = readFileSync(jsonFilePath);
  jsonFile = JSON.parse(buf);
}

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const files = readdirSync(dir);
const imageFiles = files.filter(file => 
  imageExtensions.includes(extname(file).toLowerCase())
);

if (imageFiles.length === 0) {
  console.error(`No image files found in ${dir}`);
  process.exit();
}

const htmlCss = `
  <style>
    body {
      max-width: 900px;
      margin: auto;
    }
    .neat-gallery {
      list-style: none;
      margin: auto;
      padding: 0;
    }

    .neat-gallery-layout-masonry {
      display: block;
      column-fill: balance;
      columns: 5 auto;
      max-inline-size: 90vw;

      & .neat-gallery-img {
        inline-size: 100%;
      }
    }
    @media only screen and (max-device-width: 520px) {
      .neat-gallery-layout-masonry {
        column-count: 3;
      }
    }

    .neat-gallery-layout-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(
        auto-fit,
        minmax(min(15ch, 100%), 1fr)
      );

      & .neat-gallery-img {
        aspect-ratio: 1;
        object-fit: cover;
        inline-size: 100%;
        block-size: 100%;
      }
    }
  </style>`;

const htmlPhotoSwipeJs = `
    <script type="module">
      import PhotoSwipeLightbox from 'https://unpkg.com/photoswipe@${psVersion}/dist/photoswipe-lightbox.esm.js';

      const lightbox = new PhotoSwipeLightbox({
        gallery: '.neat-gallery',
        children: 'a',
        pswpModule: () => import('https://unpkg.com/photoswipe@${psVersion}/dist/photoswipe.esm.js')
      });

    lightbox.init();
    </script>

    <link rel="stylesheet" href="https://unpkg.com/photoswipe@${psVersion}/dist/photoswipe.css">`;

const htmlHeader = noHTML ? '' : `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${title}</title>
    ${ noCss ? '' : htmlCss }
  </head>
  <body>
		<h1>${title}</h1>
`;

const htmlFooter = noHTML ? '' : `
  ${ noJs ? '' : htmlPhotoSwipeJs }
  </body>
</html>`;

let html = `<ul class="neat-gallery neat-gallery-layout-${ layout }">`;

for (const file of imageFiles) {
  const fullPath = join(dir, file);
  const thumbPath = join(thumbDir, file);

  const imageURL = `${path}/${encodeURIComponent(file)}`;
  const thumbURL = `${thumbURLPrefix}/${encodeURIComponent(file)}`;

  let dimensions;

  try {
    const buffer = readFileSync(fullPath);
    dimensions = sizeOf(buffer);

    // Generate thumbnail if it doesn't already exist
    if (!existsSync(thumbPath) || regen || width !== defaultWidth) {
      await sharp(buffer)
        .keepMetadata()
        .resize({ width })
        .toFile(thumbPath);
    }

  } catch (err) {
    console.warn(`Skipping "${file}": ${err.message}`);
    continue; // skip this file
  }

  if (!jsonFile[file]) {
    jsonFile[file] = {
      alt: ""
    }
  }

  html += `
  <li>
    <a href="${imageURL}" 
       data-pswp-width="${dimensions.width}" 
       data-pswp-height="${dimensions.height}" 
       target="_blank">
      <img src="${thumbURL}" 
        alt="${jsonFile[file].alt}" 
        class="neat-gallery-img" 
      >
    </a>
  </li>\n`;
};

html += '</ul>\n';

html = htmlHeader + html + htmlFooter;


// Write to file
const outputPath = join(dir, outputFilename);

try {
  writeFileSync(outputPath, html, 'utf8');
} catch (err) {
  console.error(`Error writing file ${outputPath}`, err);
  process.exit();
}

console.log(`Gallery HTML page written to ${outputPath}`);

if (!jsonExists || regen) {
  try {
    writeFileSync(jsonFilePath, JSON.stringify(jsonFile, null, '\t'), 'utf8');
  } catch (err) {
    console.error(`Error writing file ${jsonFilePath}`, err);
    process.exit();
  }
  console.log(`Gallery metadata written to ${jsonFilePath}`);
}
