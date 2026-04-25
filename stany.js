const { execSync, spawn } = require('child_process');
const fs = require('fs');

const IMAGE = 'stanytz/mia-khalifa:latest';
const CONTAINER_NAME = 'mia-khalifa';

// Hakikisha Docker ipo na image ipo local
try { execSync('docker --version', { stdio: 'ignore' }); } catch(e) {
  console.error('Docker haipo. Tafadhali weka Docker.');
  process.exit(1);
}

// Vuta image ikiwa haipo
if (execSync(`docker images -q ${IMAGE}`, { encoding: 'utf8' }).trim() === '') {
  console.log('📥 Downloading bot image...');
  execSync(`docker pull ${IMAGE}`, { stdio: 'inherit' });
}

// Check kama container inaendesha tayari, kama ndio, is-top
execSync(`docker rm -f ${CONTAINER_NAME} 2>/dev/null || true`, { stdio: 'ignore' });

// Endesha container
const child = spawn('docker', [
  'run', '--rm', '-i',
  `--name=${CONTAINER_NAME}`,
  '-v', `${process.cwd()}/data:/app/data`,  // kuweka session persistent
  IMAGE
], { stdio: 'inherit' });

child.on('exit', (code) => process.exit(code));