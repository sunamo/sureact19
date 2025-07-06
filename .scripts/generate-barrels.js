const fs = require('fs');
const path = require('path');

/**
 * Rekurzivně načte všechny podsložky v dané cestě, kromě složek s názvem '__tests__'.
 * @param {string} srcDir Cesta, ze které se mají načítat podsložky.
 * @param {string} relativePath Relativní cesta od původní srcDir (pro rekurzi).
 * @returns {string[]} Pole relativních cest všech rekurzivně nalezených podsložek.
 */
function getAllSubdirectoriesRecursive(srcDir, relativePath = '') {
  let allSubdirs = [];
  const currentDir = relativePath ? path.join(srcDir, relativePath) : srcDir;
  const filesAndDirs = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const dirent of filesAndDirs) {
    if (dirent.isDirectory() && dirent.name !== '__tests__') {
      const relativeSubdirPath = relativePath ? path.join(relativePath, dirent.name) : dirent.name;
      allSubdirs.push(relativeSubdirPath); // Přidáme relativní cestu k podsložce

      // Rekurzivně voláme pro vnořené podsložky
      const nestedSubdirs = getAllSubdirectoriesRecursive(srcDir, relativeSubdirPath);
      allSubdirs = allSubdirs.concat(nestedSubdirs);
    }
  }
  return allSubdirs;
}

// Příklad použití:
// const sourceDirectory = './my-project'; // Nahraďte cestou ke své složce
// const allSubdirectories = ;
// console.log(allSubdirectories);

function generateBarrels() {
  const srcDir = path.join(__dirname, '..', 'src');
  const indexFile = path.join(srcDir, 'index.ts');

  // Get all .ts and .tsx files in src directory (excluding test files and index.ts)
  const files = fs
    .readdirSync(srcDir, { withFileTypes: true })
    .filter(
      dirent => dirent.isFile() && (dirent.name.endsWith('.ts') || dirent.name.endsWith('.tsx'))
    )
    .filter(
      dirent =>
        !dirent.name.includes('.d.ts') &&
        !dirent.name.includes('.test.') &&
        !dirent.name.includes('.spec.') &&
        dirent.name !== 'index.ts'
    )
    .map(dirent => dirent.name.replace(/\.(ts|tsx)$/, ''));

  // Get all subdirectories
  const subdirs = getAllSubdirectoriesRecursive(srcDir);

  // Generate export statements - only named exports, no default exports
  const exports = [];

  // Add file exports
  files.forEach(file => {
    exports.push(`export * from './${file}';`);
  });

  console.log('subdirs: ', subdirs);

  // Add subdirectory exports
  subdirs.forEach(subdir => {
    const subdirPath = path.join(srcDir, subdir);
    const subdirFiles = fs
      .readdirSync(subdirPath, { withFileTypes: true })
      .filter(
        dirent => dirent.isFile() && (dirent.name.endsWith('.ts') || dirent.name.endsWith('.tsx'))
      )
      .filter(
        dirent =>
          !dirent.name.includes('.test.') &&
          !dirent.name.includes('.spec.') &&
          !dirent.name.includes('.d.ts')
      )
      .map(dirent => dirent.name.replace(/\.(ts|tsx)$/, ''));

    subdirFiles.forEach(file => {
      exports.push(`export * from './${subdir.replace(/\\/g, '/')}/${file}';`);
    });
  });

  // Write to index.ts
  const content = exports.join('\n') + '\n';
  fs.writeFileSync(indexFile, content);

  console.log('Generated barrel exports without default exports:');
  console.log(content);
}

generateBarrels();
