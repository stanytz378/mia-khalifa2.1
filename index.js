const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BIN_URL = 'https://github.com/Stanytz378/mia-khalifa2.1/releases/latest/download/core.bin';
const BIN_PATH = path.join(__dirname, 'core.bin');

function downloadFile(url, dest, callback) {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
            const redirectUrl = res.headers.location;
            console.log(`Redirecting to: ${redirectUrl}`);
            downloadFile(redirectUrl, dest, callback);
        } else if (res.statusCode !== 200) {
            callback(new Error(`HTTP ${res.statusCode}`));
        } else {
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                callback(null);
            });
            file.on('error', callback);
        }
    }).on('error', callback);
}

if (!fs.existsSync(BIN_PATH)) {
    console.log('📥 Downloading bot binary...');
    downloadFile(BIN_URL, BIN_PATH, (err) => {
        if (err) {
            console.error('Download failed:', err.message);
            process.exit(1);
        }
        fs.chmodSync(BIN_PATH, 0o755);
        console.log('✅ Binary downloaded. Starting bot...');
        startBot();
    });
} else {
    startBot();
}

function startBot() {
    const child = spawn(BIN_PATH, process.argv.slice(2), { stdio: 'inherit' });
    child.on('exit', (code) => process.exit(code));
}