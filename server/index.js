require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');

// Import handlers
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('./handlers/productHandler');
const { createOrder, getAllOrders, getOrderById, updateOrder, updateOrderStatus, deleteOrder } = require('./handlers/orderHandler');
const { login } = require('./handlers/authHandler');
const { getAllAdmins, createAdmin, getAdminById, updateAdmin, deleteAdmin, getOwnerProfile, updateOwnerProfile } = require('./handlers/adminManagementHandler');

// Import utils
const { sendJSON, sendError, handleOptions } = require('./utils/responseHelper');
const bodyParser = require('./utils/bodyParser');
const { protect } = require('./utils/authMiddleware');
const { ownerOnly, ownerOrAdmin } = require('./utils/roleMiddleware');
const { matchRoute } = require('./utils/routeMatcher');

// Import jobs (cron) untuk reminder
const { startReminderCron, runManualCheck } = require('./jobs/reminderCron');

// 1. Hubungkan ke Database
connectDB();

// 2. Helper untuk handle protected routes
async function handleProtectedRoute(req, res, handler, ...args) {
  // Jalankan middleware protect dulu (cek JWT valid)
  protect(req, res, () => {
    // Jika lolos, jalankan handler
    handler(req, res, ...args);
  });
}

// 3. Helper untuk handle owner-only routes
async function handleOwnerOnlyRoute(req, res, handler, ...args) {
  ownerOnly(req, res, () => {
    handler(req, res, ...args);
  });
}

// 4. Helper untuk handle owner or admin routes
async function handleOwnerOrAdminRoute(req, res, handler, ...args) {
  ownerOrAdmin(req, res, () => {
    handler(req, res, ...args);
  });
}

// 5. Buat Server
const server = http.createServer(async(req, res) => {
  const { url, method } = req;
  
  // ===== CORS =====
  if (method === 'OPTIONS') {
    return handleOptions(req, res);
  }

  // ===== PUBLIC ROUTES =====
  
  // GET / - Health Check Endpoint
  if (url === '/' && method === 'GET') {
    return sendJSON(res, 200, { 
      status: 'OK', 
      message: 'Welcome to Custom Cake Order API with Role-based Access Control' 
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

  // POST /api/auth/login - Admin/Owner login
  if (url === '/api/auth/login' && method === 'POST') {
    try {
      const body = await bodyParser(req);
      return login(req, res, body);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  // ===== PROTECTED ROUTES (Owner or Admin) =====

  // GET /api/products/:id - Detail produk
  const getProductMatch = matchRoute('/api/products/:id', url);
  if (getProductMatch && method === 'GET') {
    return handleOwnerOrAdminRoute(req, res, getProductById, getProductMatch.id);
  }

  // POST /api/products - Tambah produk baru
  if (url === '/api/products' && method === 'POST') {
    return handleOwnerOrAdminRoute(req, res, createProduct);
  }

  // PUT /api/products/:id - Update produk
  const updateProductMatch = matchRoute('/api/products/:id', url);
  if (updateProductMatch && method === 'PUT') {
    return handleOwnerOrAdminRoute(req, res, updateProduct, updateProductMatch.id);
  }

  // DELETE /api/products/:id - Hapus produk
  const deleteProductMatch = matchRoute('/api/products/:id', url);
  if (deleteProductMatch && method === 'DELETE') {
    return handleOwnerOrAdminRoute(req, res, deleteProduct, deleteProductMatch.id);
  }

  // ===== ORDER MANAGEMENT ROUTES (Owner or Admin) =====

  // GET /api/orders - Lihat semua order
  if (url === '/api/orders' && method === 'GET') {
    return handleOwnerOrAdminRoute(req, res, getAllOrders);
  }

  // GET /api/orders/:id - Detail satu order
  const getOrderDetailMatch = matchRoute('/api/orders/:id', url);
  if (getOrderDetailMatch && method === 'GET' && !url.includes('/status')) {
    return handleOwnerOrAdminRoute(req, res, getOrderById, getOrderDetailMatch.id);
  }

  // PUT /api/orders/:id/status - Quick update status
  const updateOrderStatusMatch = matchRoute('/api/orders/:id/status', url);
  if (updateOrderStatusMatch && method === 'PUT') {
    try {
      const body = await bodyParser(req);
      return handleOwnerOrAdminRoute(req, res, updateOrderStatus, updateOrderStatusMatch.id, body);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  // PUT /api/orders/:id - Update order lengkap
  const updateOrderFullMatch = matchRoute('/api/orders/:id', url);
  if (updateOrderFullMatch && method === 'PUT' && !url.includes('/status')) {
    try {
      const body = await bodyParser(req);
      return handleOwnerOrAdminRoute(req, res, updateOrder, updateOrderFullMatch.id, body);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  // DELETE /api/orders/:id - Hapus order
  const deleteOrderMatch = matchRoute('/api/orders/:id', url);
  if (deleteOrderMatch && method === 'DELETE') {
    return handleOwnerOrAdminRoute(req, res, deleteOrder, deleteOrderMatch.id);
  }

  // ===== ADMIN MANAGEMENT ROUTES (Owner Only) =====

  // GET /api/admins - List semua admin
  if (url === '/api/admins' && method === 'GET') {
    return handleOwnerOnlyRoute(req, res, getAllAdmins);
  }

  // POST /api/admins - Buat admin baru
  if (url === '/api/admins' && method === 'POST') {
    try {
      const body = await bodyParser(req);
      return handleOwnerOnlyRoute(req, res, createAdmin, body);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  // GET /api/admins/:id - Detail satu admin
  const getAdminMatch = matchRoute('/api/admins/:id', url);
  if (getAdminMatch && method === 'GET') {
    return handleOwnerOnlyRoute(req, res, getAdminById, getAdminMatch.id);
  }

  // PUT /api/admins/:id - Update admin
  const updateAdminMatch = matchRoute('/api/admins/:id', url);
  if (updateAdminMatch && method === 'PUT') {
    try {
      const body = await bodyParser(req);
      return handleOwnerOnlyRoute(req, res, updateAdmin, updateAdminMatch.id, body);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  // DELETE /api/admins/:id - Hapus admin
  const deleteAdminMatch = matchRoute('/api/admins/:id', url);
  if (deleteAdminMatch && method === 'DELETE') {
    return handleOwnerOnlyRoute(req, res, deleteAdmin, deleteAdminMatch.id);
  }

  // ===== OWNER SELF-MANAGEMENT ROUTES =====

  // GET /api/owner/profile - Lihat profil owner
  if (url === '/api/owner/profile' && method === 'GET') {
    return handleOwnerOnlyRoute(req, res, getOwnerProfile);
  }

  // PUT /api/owner/profile - Update profil owner
  if (url === '/api/owner/profile' && method === 'PUT') {
    try {
      const body = await bodyParser(req);
      return handleOwnerOnlyRoute(req, res, updateOwnerProfile, body);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  // ===== TESTING ROUTES =====

  // GET /api/test-reminder - Test reminder manual
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

// 6. Jalankan Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🎂 CUSTOM CAKE ORDER SYSTEM - CMS EDITION with RBAC');
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
  console.log('🌐 Public Routes:');
  console.log('  GET    /api/products              - List semua produk (galeri)');
  console.log('  POST   /api/orders                - Buat order baru (+ email notif)');
  console.log('  POST   /api/auth/login            - Admin/Owner login (get JWT token)');
  
  console.log('\n🔐 Protected Routes - Products (Owner/Admin):');
  console.log('  GET    /api/products/:id          - Detail produk');
  console.log('  POST   /api/products              - Tambah produk (+ upload gambar)');
  console.log('  PUT    /api/products/:id          - Update produk');
  console.log('  DELETE /api/products/:id          - Hapus produk');
  
  console.log('\n🔐 Protected Routes - Orders (Owner/Admin):');
  console.log('  GET    /api/orders                - List semua order');
  console.log('  GET    /api/orders/:id            - Detail satu order');
  console.log('  PUT    /api/orders/:id/status     - Quick update status');
  console.log('  PUT    /api/orders/:id            - Update order lengkap');
  console.log('  DELETE /api/orders/:id            - Hapus order');
  
  console.log('\n👑 Owner Only Routes - Admin Management:');
  console.log('  GET    /api/admins                - List semua admin');
  console.log('  POST   /api/admins                - Buat admin baru');
  console.log('  GET    /api/admins/:id            - Detail satu admin');
  console.log('  PUT    /api/admins/:id            - Update admin (username/password)');
  console.log('  DELETE /api/admins/:id            - Hapus admin');
  
  console.log('\n👑 Owner Self-Management:');
  console.log('  GET    /api/owner/profile         - Lihat profil owner');
  console.log('  PUT    /api/owner/profile         - Update profil owner sendiri');
  
  console.log('\n🧪 Testing Routes:');
  console.log('  GET    /api/test-reminder         - Test cron job manual');
  
  console.log('-'.repeat(70));
  
  console.log('\n💡 TIPS:');
  console.log('  - Jalankan script: npm run create-owner untuk membuat akun owner');
  console.log('  - Owner dapat membuat akun admin melalui endpoint /api/admins');
  console.log('  - Admin tidak bisa membuat admin lain atau mengakses endpoint owner');
  console.log('  - JWT token mengandung role (owner/admin) untuk authorization');
  
  console.log('\n🔑 ROLE-BASED ACCESS CONTROL:');
  console.log('  • OWNER: Full access ke semua endpoint');
  console.log('           - Bisa CRUD products & orders');
  console.log('           - Bisa CRUD admin accounts');
  console.log('           - Bisa edit profil sendiri');
  console.log('  • ADMIN: Limited access');
  console.log('           - Bisa CRUD products & orders');
  console.log('           - TIDAK bisa manage admin accounts');
  console.log('           - TIDAK bisa edit owner profile');
  
  console.log('='.repeat(70) + '\n');
});