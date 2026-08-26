import { rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const rootDirectory = join(dirname(fileURLToPath(import.meta.url)), '..');
const distributionDirectory = join(rootDirectory, 'dist');
const entryPoint = join(rootDirectory, 'src', 'index.ts');

await rm(distributionDirectory, { force: true, recursive: true });

const commonOptions = {
  bundle: true,
  entryPoints: [entryPoint],
  legalComments: 'none',
  minify: true,
  target: ['es2021']
};

await Promise.all([
  build({
    ...commonOptions,
    format: 'esm',
    outfile: join(distributionDirectory, 'index.js')
  }),
  build({
    ...commonOptions,
    format: 'cjs',
    outfile: join(distributionDirectory, 'index.cjs')
  }),
  build({
    ...commonOptions,
    footer: {
      js: 'typeof window!=="undefined"&&(window.initTooltip=SohrabiTooltip.initTooltip);'
    },
    format: 'iife',
    globalName: 'SohrabiTooltip',
    outfile: join(distributionDirectory, 'tooltip.min.js')
  })
]);

const typeScriptCompiler = join(rootDirectory, 'node_modules', 'typescript', 'bin', 'tsc');
execFileSync(process.execPath, [typeScriptCompiler, '--project', 'tsconfig.build.json'], {
  cwd: rootDirectory,
  stdio: 'inherit'
});
