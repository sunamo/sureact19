const fs = require("fs");
const path = require("path");

function generateBarrels() {
  const srcDir = path.join(__dirname, "../src");
  const indexFile = path.join(srcDir, "index.ts");

  // Get all .ts files in src directory (excluding test files and index.ts)
  const files = fs
    .readdirSync(srcDir, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".ts"))
    .filter(
      (dirent) =>
        !dirent.name.includes(".test.") &&
        !dirent.name.includes(".spec.") &&
        dirent.name !== "index.ts"
    )
    .map((dirent) => dirent.name.replace(".ts", ""));

  // Get all subdirectories
  const subdirs = fs
    .readdirSync(srcDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== "__tests__")
    .map((dirent) => dirent.name);

  // Generate export statements - only named exports, no default exports
  const exports = [];

  // Add file exports
  files.forEach((file) => {
    exports.push(`export * from './${file}';`);
  });

  // Add subdirectory exports
  subdirs.forEach((subdir) => {
    const subdirPath = path.join(srcDir, subdir);
    const subdirFiles = fs
      .readdirSync(subdirPath, { withFileTypes: true })
      .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".ts"))
      .filter(
        (dirent) =>
          !dirent.name.includes(".test.") && !dirent.name.includes(".spec.")
      )
      .map((dirent) => dirent.name.replace(".ts", ""));

    subdirFiles.forEach((file) => {
      exports.push(`export * from './${subdir}/${file}';`);
    });
  });

  // Write to index.ts
  const content = exports.join("\n") + "\n";
  fs.writeFileSync(indexFile, content);

  console.log("Generated barrel exports without default exports:");
  console.log(content);
}

generateBarrels();
