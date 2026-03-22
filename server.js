const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();

// 🔹 Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🔹 Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/Icons', express.static(path.join(__dirname, 'Icons')));

// 🔹 Config
const HOST = '192.168.1.2';
const PORT = 3003;

// 🔹 HTTPS using mkcert certificates
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, '192.168.1.6-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '192.168.1.6.pem')),
};

// 🔹 Start server
https.createServer(sslOptions, app).listen(PORT, HOST, () => {
  console.log(`🚀 HTTPS Server running at https://${HOST}:${PORT}`);
});