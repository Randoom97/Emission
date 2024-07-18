import esbuild from 'esbuild';
import { createBuildSettings } from './settings.js';

const settings = createBuildSettings({
    sourcemap: true,
    banner: {
        js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
    }
});

const ctx = await esbuild.context(settings);

await ctx.watch();

const { host, port } = await ctx.serve({
    port: 8080,
    servedir: 'out',
    fallback: 'out/index.html',
});

console.log(`Serving app at http://${host === "0.0.0.0" ? "localhost" : host}:${port}.`);