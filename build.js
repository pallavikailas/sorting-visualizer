// ============================================================
// SortViz — Simple Build Script
// Concatenates JS/CSS, inlines into a single HTML for deploy
// ============================================================

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..');
const DIST = path.join(SRC, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

console.log('📦 Building SortViz...');

// Read source files
const html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(SRC, 'src/style.css'), 'utf8');
const jsFiles = [
  'src/algorithms.js',
  'src/visualizer.js',
  'src/bigochart.js',
  'src/app.js',
];
const js = jsFiles.map(f => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n\n');

// Strip external font import (keep for prod) and inline assets
let output = html;

// Replace <link rel="stylesheet" href="src/style.css" /> with inline styles
output = output.replace(
  '<link rel="stylesheet" href="src/style.css" />',
  `<style>\n${css}\n</style>`
);

// Replace script tags with single inline bundle
const scriptTagPattern = /\s*<script src="src\/algorithms\.js"><\/script>[\s\S]*?<script src="src\/app\.js"><\/script>/;
output = output.replace(
  scriptTagPattern,
  `\n<script>\n${js}\n</script>`
);

// Write output
const outPath = path.join(DIST, 'index.html');
fs.writeFileSync(outPath, output);

// Copy any other static assets if they exist
const publicDir = path.join(SRC, 'public');
if (fs.existsSync(publicDir)) {
  fs.readdirSync(publicDir).forEach(file => {
    fs.copyFileSync(path.join(publicDir, file), path.join(DIST, file));
  });
}

// Stats
const size = fs.statSync(outPath).size;
console.log(`✅ Built successfully!`);
console.log(`   Output: dist/index.html`);
console.log(`   Size: ${(size / 1024).toFixed(1)} KB`);
console.log(`   JS files bundled: ${jsFiles.length}`);
