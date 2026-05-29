import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

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

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log(`Vào http://localhost:${PORT}/api/fetch để gọi script thủ công.`);
});
