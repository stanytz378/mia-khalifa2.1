const { execSync, spawn } = require('child_process');
const fs = require('fs');

const IMAGE = 'stanytz/mia-khalfa:latest';
const CONTAINER = 'mia-khalifa-bot';

// Check Docker
try { execSync('docker --version', { stdio: 'ignore' }); } catch(e) {
  console.error('Docker not found. Please install Docker.');
  process.exit(1);
}

// Pull latest image
if (!execSync(`docker images -q ${IMAGE}`, { encoding: 'utf8' }).trim()) {
  console.log('Pulling Docker image...');
  execSync(`docker pull ${IMAGE}`, { stdio: 'inherit' });
}

// Stop old container if exists
execSync(`docker rm -f ${CONTAINER} 2>/dev/null || true`, { stdio: 'ignore' });

// Run new container
spawn('docker', ['run', '--rm', '-i', `--name=${CONTAINER}`, '-v', `${process.cwd()}/data:/app/data`, IMAGE], { stdio: 'inherit' });