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
      // Email gagal tidak menghalangi order tetap tersimpan
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

    const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Done'];
    if (!validStatuses.includes(status)) {
      return sendError(res, 400, 'Status tidak valid');
    }

    // Ambil order lama untuk mendapatkan status sebelumnya
    const oldOrder = await Order.findById(id);
    if (!oldOrder) {
      return sendError(res, 404, 'Order tidak ditemukan');
    }

    const oldStatus = oldOrder.status;

    // Update order
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return updated document
    );

    // Kirim email terkait perubahan status pada order
    // 'Pending', 'Confirmed', 'In Progress', 'Done'
    if (oldStatus !== status) {
      sendStatusChangeEmail(order, oldStatus).catch(err => {
        console.error('Error mengirim email status change:', err.message);
      });
      
      console.log(`✅ Status order #${order._id} berubah: ${oldStatus} → ${status}`);
      console.log(`📧 Email notifikasi status change sedang dikirim...`);
    }

    sendJSON(res, 200, order);
  } catch (error) {
    console.error('Error update order status:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus
};