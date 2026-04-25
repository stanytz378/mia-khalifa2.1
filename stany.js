#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// fuck
const BINARY_URL = 'https://github.com/Stanytz378/mia-khalifa/releases/download/latest/core.bin';
const BINARY_PATH = path.join(__dirname, 'mia_khalifa.bin');

if (!fs.existsSync(BINARY_PATH)) {
  console.log('📥 Downloading bot core (binary)...');
  const file = fs.createWriteStream(BINARY_PATH);
  https.get(BINARY_URL, (res) => {
    if (res.statusCode !== 200) {
      console.error(`❌ HTTP ${res.statusCode}`);
      process.exit(1);
    }
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      fs.chmodSync(BINARY_PATH, 0o755);
      console.log('✅ Core downloaded. Starting bot...');
      startBot();
    });
  }).on('error', (err) => {
    fs.unlink(BINARY_PATH, () => {});
    console.error('Download failed:', err);
    process.exit(1);
  });
} else {
  startBot();
}

function startBot() {
  const child = spawn(BINARY_PATH, process.argv.slice(2), { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code));
}