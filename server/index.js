require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');

// Import handlers
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('./handlers/productHandler');
const { createOrder, getAllOrders, getOrderById, updateOrder, updateOrderStatus, deleteOrder } = require('./handlers/orderHandler');
const { login } = require('./handlers/authHandler');

// Import utils
const { sendJSON, sendError, handleOptions } = require('./utils/responseHelper');
const bodyParser = require('./utils/bodyParser');
const { protect } = require('./utils/authMiddleware');
const { matchRoute } = require('./utils/routeMatcher');

// Import jobs (cron) untuk reminder
const { startReminderCron, runManualCheck } = require('./jobs/reminderCron');

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
  
  // GET / - Health Check Endpoint
  if (url === '/' && method === 'GET') {
    // Kirim respons 200 OK sederhana
    return sendJSON(res, 200, { 
      status: 'OK', 
      message: 'Welcome to Custom Cake Order API' 
    });
  }
    
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

  // ===== ORDER MANAGEMENT ROUTES (Protected) =====

  // GET /api/orders - Lihat semua order (untuk CMS)
  if (url === '/api/orders' && method === 'GET') {
    return handleProtectedRoute(req, res, getAllOrders);
  }

  // GET /api/orders/:id - Detail satu order (untuk edit form di CMS)
  // PENTING: Route ini harus SEBELUM /api/orders/:id/status agar tidak bentrok
  const getOrderDetailMatch = matchRoute('/api/orders/:id', url);
  if (getOrderDetailMatch && method === 'GET' && !url.includes('/status')) {
    return handleProtectedRoute(req, res, getOrderById, getOrderDetailMatch.id);
  }

  // PUT /api/orders/:id/status - Quick update status saja (harus SEBELUM route generic)
  const updateOrderStatusMatch = matchRoute('/api/orders/:id/status', url);
  if (updateOrderStatusMatch && method === 'PUT') {
    try {
      const body = await bodyParser(req);
      return handleProtectedRoute(req, res, updateOrderStatus, updateOrderStatusMatch.id, body);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  // PUT /api/orders/:id - Update order lengkap (pricing, payment, status, dll)
  const updateOrderFullMatch = matchRoute('/api/orders/:id', url);
  if (updateOrderFullMatch && method === 'PUT' && !url.includes('/status')) {
    try {
      const body = await bodyParser(req);
      return handleProtectedRoute(req, res, updateOrder, updateOrderFullMatch.id, body);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  // DELETE /api/orders/:id - Hapus order
  const deleteOrderMatch = matchRoute('/api/orders/:id', url);
  if (deleteOrderMatch && method === 'DELETE') {
    return handleProtectedRoute(req, res, deleteOrder, deleteOrderMatch.id);
  }

  // ===== TESTING ROUTES =====

  // GET /api/test-reminder - Test reminder manual (untuk testing)
  // TODO: DELETE SOON AFTER TESTING
  if (url === '/api/test-reminder' && method === 'GET') {
    try {
      await runManualCheck();
      return sendJSON(res, 200, { 
        success: true, 
        message: 'Reminder check selesai. Lihat console untuk detail.' 
      });
    } catch (error) {
      return sendError(res, 500, 'Error: ' + error.message);
    }
  }

  // ===== 404 - Route not found =====
  return sendError(res, 404, 'Endpoint Not Found');
});

// 4. Jalankan Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🎂 CUSTOM CAKE ORDER SYSTEM - CMS EDITION');
  console.log('='.repeat(70));
  console.log(`✅ Server berjalan di port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🕐 Waktu server: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`);
  
  // 🆕 Start cron job untuk reminder
  console.log('\n' + '-'.repeat(70));
  console.log('⏰ CRON JOB CONFIGURATION');
  console.log('-'.repeat(70));
  
  const cronSchedule = process.env.REMINDER_CRON_SCHEDULE || '0 9 * * *';
  startReminderCron(cronSchedule);
  
  console.log('-'.repeat(70));
  
  // Tampilkan endpoint yang tersedia
  console.log('\n📌 AVAILABLE ENDPOINTS:');
  console.log('-'.repeat(70));
  console.log('🌐 Public Routes:');
  console.log('  GET    /api/products              - List semua produk (galeri)');
  console.log('  POST   /api/orders                - Buat order baru (+ email notif)');
  console.log('  POST   /api/auth/login            - Admin login (get JWT token)');
  
  console.log('\n🔐 Protected Routes - Products (butuh token):');
  console.log('  GET    /api/products/:id          - Detail produk');
  console.log('  POST   /api/products              - Tambah produk (+ upload gambar)');
  console.log('  PUT    /api/products/:id          - Update produk');
  console.log('  DELETE /api/products/:id          - Hapus produk');
  
  console.log('\n🔐 Protected Routes - Orders (butuh token):');
  console.log('  GET    /api/orders                - List semua order');
  console.log('  GET    /api/orders/:id            - Detail satu order');
  console.log('  PUT    /api/orders/:id/status     - Quick update status saja');
  console.log('  PUT    /api/orders/:id            - Update order lengkap');
  console.log('                                      (pricing, payment, status, notes)');
  console.log('  DELETE /api/orders/:id            - Hapus order');
  
  console.log('\n🧪 Testing Routes:');
  console.log('  GET    /api/test-reminder         - Test cron job manual');
  
  console.log('-'.repeat(70));
  
  console.log('\n💡 TIPS:');
  console.log('  - Pastikan .env sudah dikonfigurasi dengan benar');
  console.log('  - Email notifikasi akan dikirim otomatis saat:');
  console.log('    1. Ada order baru masuk (ke seller)');
  console.log('    2. Status order berubah (ke seller)');
  console.log('    3. H-1 sebelum pengiriman (via cron job ke seller)');
  console.log('  - Gunakan /api/test-reminder untuk test cron secara manual');
  console.log('  - Order baru dari customer hanya berisi data kue, pricing diisi admin');
  
  console.log('\n📋 Order Schema Updates:');
  console.log('  Base Cake Options:');
  console.log('    • Dummy Cake (pajangan only)');
  console.log('    • Ogura Cake (custom flavor + filling)');
  console.log('    • Lapis Surabaya (fixed flavor + custom filling)');
  console.log('    • Dummy + Mix (kombinasi dummy + edible base)');
  
  console.log('\n🎨 Admin CMS Features:');
  console.log('  • Update pricing (harga kue, ongkir, total)');
  console.log('  • Track payment (Unpaid / DP / Paid)');
  console.log('  • Manage order status (Pending → Confirmed → In Progress → Ready → Delivered)');
  console.log('  • Add internal notes');
  console.log('  • Auto-calculate remaining payment & progress');
  
  console.log('='.repeat(70) + '\n');
});