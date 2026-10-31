import { readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

const [html, css, js] = await Promise.all([
  readFile(new URL('./dist/index.html', import.meta.url), 'utf8'),
  readFile(new URL('./dist/styles.css', import.meta.url), 'utf8'),
  readFile(new URL('./dist/app.js', import.meta.url), 'utf8')
]);

// Every guide needs a playable clip, an explicitly linked animation, and a still poster.
const guidedMediaPaths = ['marker', 'ease', 'smooth'].flatMap(guide => [
  `./media/retime-${guide}-guide.mp4`,
  `./media/retime-${guide}-guide.webp`,
  `./media/retime-${guide}-guide-poster.webp`
]);
// Preserve every original capture; the wide live capture also appears in the hero.
const originalMediaPaths = ['live', 'ease', 'smooth'].flatMap(capture => [
  `./media/retime-${capture}.mp4`,
  `./media/retime-${capture}-poster.webp`
]);
const mediaPattern = /\b(src|poster|href)\s*=\s*(["'])(\.\/media\/[^"']+)\2/g;
const mediaPaths = [...new Set([...html.matchAll(mediaPattern)].map(match => match[3]))];
for (const path of guidedMediaPaths) {
  if (!mediaPaths.includes(path)) throw new Error(`Cannot build standalone: required guided media is not referenced in HTML: ${path}`);
}
const requiredMediaPaths = [...new Set([...guidedMediaPaths, ...originalMediaPaths, ...mediaPaths])];
const mimeTypes = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
// Validate every guided triplet and preserved source before replacing the export.
const requiredAssets = new Map(await Promise.all(requiredMediaPaths.map(async path => {
  if (!/^\.\/media\/[\w.-]+$/.test(path)) throw new Error(`Unexpected media path: ${path}`);
  const mime = mimeTypes[extname(path).toLowerCase()];
  if (!mime) throw new Error(`Unsupported media type: ${path}`);
  let bytes;
  try { bytes = await readFile(new URL('./dist/' + path.slice(2), import.meta.url)); }
  catch (error) { throw new Error(`Cannot build standalone: required media is missing or unreadable: ${path}`, { cause: error }); }
  if (!bytes.length) throw new Error(`Cannot build standalone: empty media file: ${path}`);
  return [path, { mime, bytes }];
})));
const assets = new Map(mediaPaths.map(path => {
  const { mime, bytes } = requiredAssets.get(path);
  return [path, `data:${mime};base64,${bytes.toString('base64')}`];
}));

const standalone = html
  .replace(mediaPattern, (_, attribute, quote, path) => `${attribute}=${quote}${assets.get(path)}${quote}`)
  .replace('<link rel="stylesheet" href="./styles.css">', () => '<style>' + css.replace(/<\/style/gi, '<\\/style') + '</style>')
  .replace('<script src="./app.js" defer></script>', '')
  .replace('</body>', () => '<script>' + js.replace(/<\/script/gi, '<\\/script') + '</script></body>');

if (mediaPattern.test(standalone)) throw new Error('Cannot build standalone: unresolved local media reference.');

await writeFile(new URL('./retime-tool-standalone.html', import.meta.url), standalone);
console.log(`Built retime-tool-standalone.html with ${assets.size} embedded media assets (${(Buffer.byteLength(standalone) / 1024 / 1024).toFixed(2)} MB); validated ${guidedMediaPaths.length} guided assets and ${originalMediaPaths.length} preserved original assets.`);
