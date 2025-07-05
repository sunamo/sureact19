#!/usr/bin/env node

// Wrapper script that ignores arguments and runs all tests
const { spawn } = require('child_process');

const child = spawn('jest', ['--coverage'], {
  stdio: 'inherit',
  shell: true,
});

child.on('close', code => {
  process.exit(code);
});
