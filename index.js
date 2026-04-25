const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const bin = path.join(__dirname, 'core.bin');
if (!fs.existsSync(bin)) { console.error('core.bin missing'); process.exit(1); }
fs.chmodSync(bin, 0o755);
spawn(bin, process.argv.slice(2), { stdio: 'inherit' }).on('exit', process.exit);