import { build } from 'esbuild';
import { join } from 'path';

const root = process.cwd();

build({
    bundle: true,
    entryPoints: [
        join(root, 'out/src/index.js'),
    ],
    format: 'esm',
    keepNames: true,
    outdir: 'out/bundle/',
    platform: 'node',
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
