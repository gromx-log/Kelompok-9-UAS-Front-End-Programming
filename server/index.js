require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');

// Import handlers
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('./handlers/productHandler');
// --- PERUBAHAN: Impor handler 'updateOrderDetails' ---
const { createOrder, getAllOrders, updateOrderStatus, updateOrderDetails } = require('./handlers/orderHandler');
const { login } = require('./handlers/authHandler');

// Import utils
// --- PERUBAHAN: Impor 'sendJSON' (dibutuhkan untuk /api/test-reminder) ---
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

  // PUT /api/orders/:id - Update detail order (harga, tgl kirim, status bayar)
  // Route ini harus DIBELAKANG /api/orders/:id/status agar tidak menimpa
  const updateDetailsMatch = matchRoute('/api/orders/:id', url);
  if (updateDetailsMatch && method === 'PUT') {
    try {
      const body = await bodyParser(req);
      return handleProtectedRoute(req, res, updateOrderDetails, updateDetailsMatch.id, body);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

 // GET /api/test-reminder - Test reminder manual (untuk testing)
 // TODO: DELETE SOON AFTER TESTING
 if (url === '/api/test-reminder' && method === 'GET') {
  try {
   await runManualCheck();
   return sendJSON(res, 200, { // Menggunakan sendJSON yang sudah diimpor
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
 console.log('🎂 CUSTOM CAKE ORDER SYSTEM');
 console.log('='.repeat(70));
 console.log(`✅ Server berjalan di port ${PORT}`);
 console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
 console.log(`🕐 Waktu server: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`);
 
 // Start cron job untuk reminder
 console.log('\n' + '-'.repeat(70));
 console.log('⏰ CRON JOB CONFIGURATION');
 console.log('-'.repeat(70));
 
 const cronSchedule = process.env.REMINDER_CRON_SCHEDULE || '0 9 * * *';
 startReminderCron(cronSchedule);
 
 console.log('-'.repeat(70));
 
 // Tampilkan endpoint yang tersedia
 console.log('\n📌 AVAILABLE ENDPOINTS:');
 console.log('-'.repeat(70));
 console.log('Public Routes:');
 console.log(' GET  /api/products       - List semua produk');
 console.log(' POST  /api/orders        - Buat order baru (+ email)');
 console.log(' POST  /api/auth/login      - Admin login');
 console.log('\nProtected Routes (butuh token):');
 console.log(' GET  /api/products/:id     - Detail produk');
 console.log(' POST  /api/products       - Tambah produk');
 console.log(' PUT  /api/products/:id     - Update produk');
 console.log(' DELETE /api/products/:id     s- Hapus produk');
 console.log(' GET  /api/orders        - List semua order');
 console.log(' PUT  /api/orders/:id/status   - Update status (+ email)');
 console.log(' PUT  /api/orders/:id      - Update detail order (harga, dll)');
 console.log('\nTesting:');
 console.log(' GET  /api/test-reminder     - Test cron job manual');
 console.log('-'.repeat(70));
 
 console.log('\n💡 TIPS:');
 console.log(' - Pastikan .env sudah dikonfigurasi dengan benar');
 console.log(' - Email notifikasi akan dikirim otomatis saat:');
 console.log('  1. Ada order baru masuk');
 console.log('  2. Status order berubah');
 console.log('  3. H-1 sebelum pengiriman (via cron job)');
 console.log(' - Gunakan /api/test-reminder untuk test cron secara manual');
 console.log('='.repeat(70) + '\n');
});