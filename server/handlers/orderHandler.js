const Order = require('../models/orderModel');
const { sendJSON, sendError } = require('../utils/responseHelper');

// POST /api/orders
// Perhatikan: 'body' di-passing dari router kita setelah di-parse
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

    const newOrder = new Order(body);
    const savedOrder = await newOrder.save();
    
    sendJSON(res, 201, savedOrder); // 201 = Created
  } catch (error) {
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}
// GET /api/orders
async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Terbaru dulu
    sendJSON(res, 200, orders);
  } catch (error) {
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

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return updated document
    );

    if (!order) {
      return sendError(res, 404, 'Order tidak ditemukan');
    }

    sendJSON(res, 200, order);
  } catch (error) {
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus
};