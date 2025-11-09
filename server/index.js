// File utama buat menjalankan servernya
require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');

// Import handlers
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('./handlers/productHandler');
const { createOrder, getAllOrders, updateOrderStatus } = require('./handlers/orderHandler');
const { login } = require('./handlers/authHandler');

// Import utils
const { sendError, handleOptions } = require('./utils/responseHelper');
const bodyParser = require('./utils/bodyParser');
const { protect } = require('./utils/authMiddleware');
const { matchRoute } = require('./utils/routeMatcher');

// 1. Hubungkan ke Database
connectDB();

// 2. Helper untuk handle protected routes
async function handleProtectedRoute(req, res, handler, ...args) {
  // Jalankan middleware protect dulu
  protect(req, res, () => {
    // Jika lolos, jalankan handler
    handler(req, res, ...args);
  });
}

// 3. Buat Server
const server = http.createServer(async(req, res) => {
  const { url, method } = req;

  // ===== CORS =====
  if (method === 'OPTIONS') {
    return handleOptions(req, res);
  }

  // ===== PUBLIC ROUTES =====
  
  // GET /api/products - Ambil semua produk (untuk galeri)
  if (url === '/api/products' && method === 'GET') {
    return getAllProducts(req, res);
  }

  // POST /api/orders - Customer buat order
  if (url === '/api/orders' && method === 'POST') {
    try {
      const body = await bodyParser(req);
      return createOrder(req, res, body);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  // POST /api/auth/login - Admin login
  if (url === '/api/auth/login' && method === 'POST') {
    try {
      const body = await bodyParser(req);
      return login(req, res, body);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  // ===== PROTECTED ROUTES (Perlu Token) =====

  // GET /api/products/:id - Detail produk
  const getProductMatch = matchRoute('/api/products/:id', url);
  if (getProductMatch && method === 'GET') {
    return handleProtectedRoute(req, res, getProductById, getProductMatch.id);
  }

  // POST /api/products - Tambah produk baru (dengan upload gambar)
  if (url === '/api/products' && method === 'POST') {
    return handleProtectedRoute(req, res, createProduct);
  }

  // PUT /api/products/:id - Update produk
  const updateProductMatch = matchRoute('/api/products/:id', url);
  if (updateProductMatch && method === 'PUT') {
    return handleProtectedRoute(req, res, updateProduct, updateProductMatch.id);
  }

  // DELETE /api/products/:id - Hapus produk
  const deleteProductMatch = matchRoute('/api/products/:id', url);
  if (deleteProductMatch && method === 'DELETE') {
    return handleProtectedRoute(req, res, deleteProduct, deleteProductMatch.id);
  }

  // GET /api/orders - Lihat semua order (untuk CMS)
  if (url === '/api/orders' && method === 'GET') {
    return handleProtectedRoute(req, res, getAllOrders);
  }

  // PUT /api/orders/:id/status - Update status order
  const updateOrderMatch = matchRoute('/api/orders/:id/status', url);
  if (updateOrderMatch && method === 'PUT') {
    try {
      const body = await bodyParser(req);
      return handleProtectedRoute(req, res, updateOrderStatus, updateOrderMatch.id, body);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  // ===== 404 - Route not found =====
  return sendError(res, 404, 'Endpoint Not Found');
});

// 4. Jalankan Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server murni berjalan di port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});