import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const maximumGzipBytes = 2500;
const bundle = await readFile(new URL('../dist/tooltip.min.js', import.meta.url));
const gzipBytes = gzipSync(bundle).byteLength;

process.stdout.write(`Browser bundle: ${bundle.byteLength} B minified, ${gzipBytes} B gzip\n`);

if (gzipBytes > maximumGzipBytes) {
  throw new Error(`Browser bundle exceeds the ${maximumGzipBytes} B gzip limit.`);
}
