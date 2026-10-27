import { readFile, writeFile } from 'node:fs/promises';
const html = await readFile(new URL('./dist/index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('./dist/styles.css', import.meta.url), 'utf8');
const js = await readFile(new URL('./dist/app.js', import.meta.url), 'utf8');
const standalone = html.replace('<link rel="stylesheet" href="./styles.css">', () => '<style>' + css + '</style>').replace('<script src="./app.js" defer></script>', '').replace('</body>', () => '<script>' + js + '</script></body>');
await writeFile(new URL('./retime-tool-standalone.html', import.meta.url), standalone);
console.log('Built retime-tool-standalone.html');
