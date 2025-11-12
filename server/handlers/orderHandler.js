const Order = require('../models/orderModel');
const { sendJSON, sendError } = require('../utils/responseHelper');
const { sendNewOrderEmail, sendStatusChangeEmail } = require('../utils/emailService');

// POST /api/orders
async function createOrder(req, res, body) {
 try {
  const { 
   customerName, 
   customerPhone, 
   deliveryDate, 
   cakeType, 
   cakeSize, 
   themeDescription 
  } = body;

  // Validasi sederhana
  if (!customerName || !customerPhone || !deliveryDate || !cakeType || !cakeSize || !themeDescription) {
   return sendError(res, 400, 'Semua data wajib diisi');
  }

  // Buat order baru
  const newOrder = new Order(body);
  const savedOrder = await newOrder.save();
  
  // Kirim email terkait order yang baru dibuat
  sendNewOrderEmail(savedOrder).catch(err => {
   console.error('Error mengirim email order baru:', err.message);
  });
  
  console.log(`✅ Order baru berhasil dibuat: #${savedOrder._id}`);
  console.log(`📧 Email notifikasi sedang dikirim ke penjual...`);
  
  sendJSON(res, 201, savedOrder);
 } catch (error) {
  console.error('Error create order:', error);
  sendError(res, 500, 'Server Error: ' + error.message);
 }
}

// GET /api/orders
async function getAllOrders(req, res) {
 try {
  const orders = await Order.find().sort({ createdAt: -1 }); // Terbaru dulu
  sendJSON(res, 200, orders);
 } catch (error) {
  console.error('Error get all orders:', error);
  sendError(res, 500, 'Server Error: ' + error.message);
 }
}

// PUT /api/orders/:id/status
async function updateOrderStatus(req, res, id, body) {
 try {
  const { status } = body;

    // 1. Cek jika status ada
    if (!status) {
      return sendError(res, 400, 'Status wajib diisi');
    }

    // 2. HAPUS validasi array yang lama
    // const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Done']; // <-- DIHAPUS
    // if (!validStatuses.includes(status)) { // <-- DIHAPUS
    //  return sendError(res, 400, 'Status tidak valid'); // <-- DIHAPUS
    // }

  // 3. Ambil order
  const order = await Order.findById(id);
  if (!order) {
   return sendError(res, 404, 'Order tidak ditemukan');
  }

  const oldStatus = order.status;
    
    // 4. Update status dan simpan
    // Biarkan Mongoose/Model yang melakukan validasi enum
    order.status = status;
  const updatedOrder = await order.save(); // .save() akan memvalidasi enum

  // 5. Kirim email (logika Anda sudah benar)
  if (oldStatus !== status) {
   sendStatusChangeEmail(updatedOrder, oldStatus).catch(err => {
    console.error('Error mengirim email status change:', err.message);
   });
   
   console.log(`✅ Status order #${updatedOrder._id} berubah: ${oldStatus} → ${status}`);
   console.log(`📧 Email notifikasi status change sedang dikirim...`);
  }

  sendJSON(res, 200, updatedOrder);

 } catch (error) {
    // 6. Tangkap error jika Mongoose GAGAL validasi enum
    if (error.name === 'ValidationError') {
      // Kirim pesan error "Status tidak valid" dari sini
      return sendError(res, 400, 'Status tidak valid: ' + error.message);
    }
  console.error('Error update order status:', error);
  sendError(res, 500, 'Server Error: ' + error.message);
 }
}

module.exports = {
 createOrder,
 getAllOrders,
 updateOrderStatus
};