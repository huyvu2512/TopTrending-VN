import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/fetch', (req, res) => {
    console.log('Đang kích hoạt script cào dữ liệu (fetch_data.js)...');
    const fetchProcess = spawn('node', ['scripts/fetch_data.js']);
    
    let output = '';
    
    fetchProcess.stdout.on('data', (data) => {
        output += data.toString();
        console.log(`[Fetch]: ${data}`);
    });
    
    fetchProcess.stderr.on('data', (data) => {
        console.error(`[Fetch Lỗi]: ${data}`);
    });
    
    fetchProcess.on('close', (code) => {
        if (code === 0) {
            res.json({ success: true, message: 'Cập nhật dữ liệu thành công', log: output });
        } else {
            res.status(500).json({ success: false, message: 'Cập nhật dữ liệu thất bại', code });
        }
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

app.listen(PORT, '0.0.0.0', () => {
    const localIp = getLocalIp();
    console.log(`Server đang chạy tại:`);
    console.log(`  - Local:    http://localhost:${PORT}`);
    console.log(`  - Network:  http://${localIp}:${PORT}`);
    console.log(`Vào http://localhost:${PORT}/api/fetch để gọi script thủ công.`);
});
