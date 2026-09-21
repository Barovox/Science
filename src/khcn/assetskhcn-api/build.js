const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, 'dist-package');

// 1. Clean up target directory
console.log('Cleaning up target directory...');
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// 2. Run esbuild to bundle app.js
console.log('Bundling application code using esbuild...');
try {
  // Using the locally installed esbuild via npx
  execSync('npx esbuild app.js --bundle --platform=node --target=node22 --external:canvas --outfile=dist-package/app.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error bundling with esbuild:', error);
  process.exit(1);
}

// 3. Copy web.config
console.log('Copying web.config...');
const webConfigSrc = path.join(__dirname, 'web.config');
const webConfigDest = path.join(DIST_DIR, 'web.config');
if (fs.existsSync(webConfigSrc)) {
  fs.copyFileSync(webConfigSrc, webConfigDest);
  console.log('web.config copied successfully.');
} else {
  console.warn('Warning: web.config not found in root!');
}

// 4. Copy node_modules/canvas to dist-package/node_modules/canvas
console.log('Copying canvas native module...');
const canvasSrc = path.join(__dirname, 'node_modules', 'canvas');
const canvasDest = path.join(DIST_DIR, 'node_modules', 'canvas');

if (fs.existsSync(canvasSrc)) {
  fs.mkdirSync(path.join(DIST_DIR, 'node_modules'), { recursive: true });
  
  // Custom function to recursively copy files
  function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(childItem => {
        copyRecursive(path.join(src, childItem), path.join(dest, childItem));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
  
  copyRecursive(canvasSrc, canvasDest);
  console.log('Canvas native module copied successfully.');
} else {
  console.error('Error: node_modules/canvas not found. Please run npm install first.');
  process.exit(1);
}

console.log('Build process completed successfully! Package is ready in "dist-package".');
