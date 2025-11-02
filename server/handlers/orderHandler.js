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

module.exports = {
  createOrder
};