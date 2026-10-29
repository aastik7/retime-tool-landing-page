import { readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

const [html, css, js] = await Promise.all([
  readFile(new URL('./dist/index.html', import.meta.url), 'utf8'),
  readFile(new URL('./dist/styles.css', import.meta.url), 'utf8'),
  readFile(new URL('./dist/app.js', import.meta.url), 'utf8')
]);

// Embed the actual recordings and posters so the export also works offline.
const mediaPattern = /\b(src|poster|href)="(\.\/media\/[^"?#]+)"/g;
const mediaPaths = [...new Set([...html.matchAll(mediaPattern)].map(match => match[2]))];
const mimeTypes = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
const assets = new Map(await Promise.all(mediaPaths.map(async path => {
  if (!/^\.\/media\/[\w.-]+$/.test(path)) throw new Error(`Unexpected media path: ${path}`);
  const mime = mimeTypes[extname(path).toLowerCase()];
  if (!mime) throw new Error(`Unsupported media type: ${path}`);
  let bytes;
  try { bytes = await readFile(new URL('./dist/' + path.slice(2), import.meta.url)); }
  catch (error) { throw new Error(`Cannot build standalone: required media is missing or unreadable: ${path}`, { cause: error }); }
  if (!bytes.length) throw new Error(`Cannot build standalone: empty media file: ${path}`);
  return [path, `data:${mime};base64,${bytes.toString('base64')}`];
})));

const standalone = html
  .replace(mediaPattern, (_, attribute, path) => `${attribute}="${assets.get(path)}"`)
  .replace('<link rel="stylesheet" href="./styles.css">', () => '<style>' + css.replace(/<\/style/gi, '<\\/style') + '</style>')
  .replace('<script src="./app.js" defer></script>', '')
  .replace('</body>', () => '<script>' + js.replace(/<\/script/gi, '<\\/script') + '</script></body>');

await writeFile(new URL('./retime-tool-standalone.html', import.meta.url), standalone);
console.log(`Built retime-tool-standalone.html with ${assets.size} local media assets (${(Buffer.byteLength(standalone) / 1024 / 1024).toFixed(2)} MB).`);
