import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findTsxFiles(dir, baseDir = dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip test directories and node_modules
      if (!file.startsWith('__') && file !== 'node_modules') {
        results = results.concat(findTsxFiles(fullPath, baseDir));
      }
    } else if (file.endsWith('.tsx') || (file.endsWith('.ts') && !file.endsWith('.d.ts'))) {
      // Skip test files, index files, and .d.ts files
      if (!file.includes('.test.') && !file.includes('.spec.') && file !== 'index.ts' && file !== 'setupTests.ts') {
        const relativePath = path.relative(baseDir, fullPath);
        const exportPath = './' + relativePath.replace(/\\/g, '/').replace(/\.(tsx?|js)$/, '');
        results.push(exportPath);
      }
    }
  }
  
  return results;
}

// Find all TypeScript files in src directory
const srcDir = path.join(__dirname, '..', 'src');
const files = findTsxFiles(srcDir);

// Generate barrel exports - only export * from
const exports = files.map(file => `export * from '${file}';`).join('\n');

// Write to index.ts
const indexPath = path.join(srcDir, 'index.ts');
fs.writeFileSync(indexPath, exports + '\n');

console.log(`Generated barrel exports for ${files.length} files`);
console.log('Files:', files);
