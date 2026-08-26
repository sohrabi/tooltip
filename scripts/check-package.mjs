import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const esm = await import('../dist/index.js');
const commonJs = createRequire(import.meta.url)('../dist/index.cjs');

if (typeof esm.initTooltip !== 'function' || typeof commonJs.initTooltip !== 'function') {
  throw new Error('The ESM or CommonJS entry point does not export initTooltip.');
}

const browserBundle = await readFile(new URL('../dist/tooltip.min.js', import.meta.url), 'utf8');
const browserContext = {};
browserContext.window = browserContext;
runInNewContext(browserBundle, browserContext);

if (
  typeof browserContext.initTooltip !== 'function'
  || typeof browserContext.SohrabiTooltip?.initTooltip !== 'function'
) {
  throw new Error('The browser bundle does not expose its global APIs.');
}

process.stdout.write('ESM, CommonJS and browser entry points are valid.\n');
