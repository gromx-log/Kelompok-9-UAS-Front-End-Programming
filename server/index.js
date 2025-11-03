// File utama buat menjalankan servernya
require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');

// Import handlers (../handler) dan helpers (../utils)
const { getAllProducts } = require('./handlers/productHandler');
const { createOrder } = require('./handlers/orderHandler');
const { sendError, handleOptions } = require('./utils/responseHelper');
const bodyParser = require('./utils/bodyParser');

// 1. Hubungkan ke Database
connectDB();

// 2. Buat Server
const server = http.createServer(async(req, res) => {
  const { url, method } = req;

  // Routers
  // 1. CORS
  if (method === 'OPTIONS') {
    return handleOptions(req, res);
  }

  // 2. Routing untuk GET
  if (url === '/api/products' && method === 'GET') {
    return getAllProducts(req, res);
  }

  // 3. Routing untuk POST
  if (url === '/api/orders' && method === 'POST') {
    try {
      // 3a. Gunakan bodyParser kita
      const body = await bodyParser(req);
      // 3b. Panggil handler dengan body
      return createOrder(req, res, body);
    } catch (error) {
      return sendError(res, 400, error.message); // 400 Bad Request (Invalid JSON)
    }
  }
  
  // 4. Jika tidak ada route yang cocok
  return sendError(res, 404, 'Endpoint Not Found');
});

// 3. Jalankan Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server murni berjalan di port ${PORT}`));