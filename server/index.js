// File utama buat menjalankan servernya
require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');

// 1. Hubungkan ke Database
connectDB();

// 2. Buat Server
const server = http.createServer((req, res) => {
  // TODO: Nanti kita akan isi router manual kita di sini
  
  // Untuk sementara, kita tes
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Server backend Kartiniale berjalan!' }));
});

// 3. Jalankan Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server murni berjalan di port ${PORT}`));