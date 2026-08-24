const http = require('http');
const fs = require('fs');
const path = require('path');

const mime = {
  'html': 'text/html',
  'css': 'text/css',
  'js': 'application/javascript',
  'mp4': 'video/mp4',
  'webm': 'video/webm',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'webp': 'image/webp',
  'avif': 'image/avif',
  'svg': 'image/svg+xml',
  'ico': 'image/x-icon',
  'json': 'application/json'
};

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let relativePath = req.url === '/' ? 'index.html' : req.url.split('?')[0].replace(/^\//, '');
  let filePath = path.join(ROOT, relativePath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(ROOT, 'index.html');
  }

  const ext = path.extname(filePath).slice(1).toLowerCase();
  res.setHeader('Content-Type', mime[ext] || 'text/plain');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  fs.createReadStream(filePath).on('error', () => res.end('')).pipe(res);
});

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

