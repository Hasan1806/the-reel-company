const http = require('http');
const fs = require('fs');
const path = require('path');

const mime = {
  'html': 'text/html',
  'css': 'text/css',
  'js': 'application/javascript',
  'mp4': 'video/mp4',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'svg': 'image/svg+xml',
  'ico': 'image/x-icon'
};

const ROOT = 'c:/office/thereelcompany';

const server = http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(filePath)) filePath = path.join(ROOT, 'index.html');
  const ext = path.extname(filePath).slice(1);
  res.setHeader('Content-Type', mime[ext] || 'text/plain');
  res.setHeader('Cache-Control', 'no-cache');
  fs.createReadStream(filePath).on('error', () => res.end('')).pipe(res);
});

server.listen(3000, () => console.log('Server running at http://localhost:3000'));
