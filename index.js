const { execSync, spawn } = require('child_process');
const fs = require('fs');

const IMAGE = 'stanytz/mia-khalfa:latest';
const CONTAINER = 'mia-khalifa2.1';

try { execSync('docker --version', { stdio: 'ignore' }); } catch(e) {
  console.error('Docker not found. Please install Docker.');
  process.exit(1);
}

if (!execSync(`docker images -q ${IMAGE}`, { encoding: 'utf8' }).trim()) {
  console.log('Pulling bot image...');
  execSync(`docker pull ${IMAGE}`, { stdio: 'inherit' });
}

execSync(`docker rm -f ${CONTAINER} 2>/dev/null || true`, { stdio: 'ignore' });

spawn('docker', ['run', '--rm', '-i', `--name=${CONTAINER}`, '-v', `${process.cwd()}/data:/app/data`, IMAGE], { stdio: 'inherit' });