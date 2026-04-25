const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const BIN_URL = 'https://github.com/Stanytz378/mia-khalifa2.1/releases/latest/download/core.bin';
const BIN_PATH = path.join(__dirname, 'core.bin');

if (!fs.existsSync(BIN_PATH)) {
    console.log('📥 Downloading bot binary...');
    const file = fs.createWriteStream(BIN_PATH);
    https.get(BIN_URL, (res) => {
        if (res.statusCode !== 200) {
            console.error(`Download failed: HTTP ${res.statusCode}`);
            process.exit(1);
        }
        res.pipe(file);
        file.on('finish', () => {
            file.close();
            fs.chmodSync(BIN_PATH, 0o755);
            startBot();
        });
    }).on('error', (err) => {
        fs.unlinkSync(BIN_PATH);
        console.error('Download error:', err);
        process.exit(1);
    });
} else {
    startBot();
}

function startBot() {
    const child = spawn(BIN_PATH, process.argv.slice(2), { stdio: 'inherit' });
    child.on('exit', (code) => process.exit(code));
}