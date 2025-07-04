const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, '..', 'README.md');
const coverageSummaryPath = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');

if (!fs.existsSync(coverageSummaryPath)) {
  console.error('Coverage summary file not found!');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
const coverage = summary.total.statements.pct;

let color;
if (coverage < 50) {
  color = 'red';
} else if (coverage < 80) {
  color = 'yellow';
} else {
  color = 'brightgreen';
}

const badgeUrl = `https://img.shields.io/badge/coverage-${coverage}%25-${color}`;

let readmeContent = fs.readFileSync(readmePath, 'utf8');
readmeContent = readmeContent.replace(
  /https:\/\/img\.shields\.io\/badge\/coverage-.*-.*/,
  badgeUrl
);

fs.writeFileSync(readmePath, readmeContent);

console.log(`Coverage badge updated to ${coverage}%`);
