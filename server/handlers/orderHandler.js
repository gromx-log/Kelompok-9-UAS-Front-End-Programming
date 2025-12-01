const Order = require('../models/orderModel');
const { sendJSON, sendError } = require('../utils/responseHelper');
const { sendNewOrderEmail, sendStatusChangeEmail } = require('../utils/emailService');

// ========================================
// PUBLIC ENDPOINT: Customer Create Order
// ========================================

// POST /api/orders
async function createOrder(req, res, body) {
  try {
    
    const { 
      cakeModel,
      cakeBase,
      mixBase,
      cakeFlavor,
      cakeFilling,
      cakeText,
      age,
      deliveryDate,
      deliveryTime,
      cakeTiers,
      cakeDiameter,
      deliveryAddress,
      customerName,
      customerPhone,
      referenceImageUrl
    } = body;

    // Validasi required fields
    if (!cakeModel || !cakeBase || !deliveryDate 
      || !deliveryTime || !cakeTiers || !cakeDiameter || !cakeText
      || !deliveryAddress || !customerName || !customerPhone) {
      return sendError(res, 400, 'Semua field wajib diisi');
    }

    // Validasi Base Kue (cakeBase)
    // 3a. Validasi 'mixBase'
    if (cakeBase === 'Dummy + Mix' && !mixBase) {
      return sendError(res, 400, 'Pilih Mix Base (Ogura atau Lapis Surabaya) jika base cake adalah "Dummy + Mix"');
    }

    // 3b. Validasi 'cakeFlavor' (Wajib jika Ogura murni ATAU mix Ogura)
    const needsFlavor = (cakeBase === 'Ogura Cake') || (cakeBase === 'Dummy + Mix' && mixBase === 'Ogura Cake');
    if (needsFlavor && !cakeFlavor) {
      return sendError(res, 400, 'Flavor wajib diisi untuk Ogura Cake atau Mix Ogura');
    }

    // 3c. Validasi 'cakeFilling' (Wajib KECUALI Dummy Cake murni)
    const needsFilling = cakeBase !== 'Dummy Cake';
    if (needsFilling && !cakeFilling) {
      return sendError(res, 400, 'Filling wajib diisi untuk base cake ini');
    }

    // Validasi Delivery Date (!> today)
    const deliveryDateObj = new Date(deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deliveryDateObj < today) {
      return sendError(res, 400, 'Tanggal pengiriman tidak boleh di masa lalu');
    }

    // Validasi Tingkat Kue (pastikan ini adalah Angka)
    // Minimal tingkat 1, maksimal 10
    const tiersNum = parseInt(cakeTiers, 10);
    if (isNaN(tiersNum) || tiersNum < 1 || tiersNum > 10) {
      return sendError(res, 400, 'Jumlah tingkat kue (cakeTiers) harus angka valid antara 1-10');
    }

    // Buat order baru
    const newOrder = new Order({
      // Customer input
      cakeModel,
      cakeBase,
      mixBase: mixBase || null,     
      cakeFlavor: cakeFlavor || null, 
      cakeFilling: cakeFilling || null,
      cakeText,
      age: age || null,
      deliveryDate: deliveryDateObj,
      deliveryTime,
      cakeTiers: tiersNum,            
      cakeDiameter: (cakeDiameter || "").toString().trim(),
      deliveryAddress,
      customerName,
      customerPhone,

      // Default values (akan diupdate admin)
      price: 0,
      shippingCost: 0,
      totalPrice: 0,
      orderStatus: 'Pending',
      paymentStatus: 'Unpaid'
    });

    // Mongoose akan otomatis memvalidasi ENUM di sini saat .save()
    const savedOrder = await newOrder.save();
    
    // Kirim email ke seller
    sendNewOrderEmail(savedOrder).catch(err => {
      console.error('❌ Error mengirim email order baru:', err.message);
    });
    
    console.log(`✅ Order baru berhasil dibuat: #${savedOrder._id}`);
    console.log(`📧 Email notifikasi sedang dikirim ke penjual...`);
    
    sendJSON(res, 201, {
      success: true,
      message: 'Order berhasil dibuat! Kami akan menghubungi Anda untuk konfirmasi harga.',
      order: savedOrder
    });

  } catch (error) {
    console.error('❌ Error create order:', error);
    if (error.name === 'ValidationError') {
        return sendError(res, 400, `Validasi Gagal: ${error.message}`);
    }
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

// ========================================
// PROTECTED ENDPOINTS: Admin CMS
// ========================================

// GET /api/orders - List semua order (untuk CMS)
async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    
    // Add computed fields for easier frontend display
    const ordersWithExtras = orders.map(order => {
      const orderObj = order.toObject();
      return {
        ...orderObj,
        isPaid: order.paymentStatus === 'Paid',
        needsConfirmation: order.orderStatus === 'Pending',
        deliveryDateFormatted: order.formattedDeliveryDate,
        paymentProgress: order.paymentProgress
      };
    });
    
    sendJSON(res, 200, ordersWithExtras);
  } catch (error) {
    console.error('❌ Error get all orders:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

// GET /api/orders/:id - Detail order
async function getOrderById(req, res, id) {
  try {
    const order = await Order.findById(id);
    
    if (!order) {
      return sendError(res, 404, 'Order tidak ditemukan');
    }
    
    const orderObj = order.toObject();
    sendJSON(res, 200, {
      ...orderObj,
      deliveryDateFormatted: order.formattedDeliveryDate,
      paymentProgress: order.paymentProgress
    });
  } catch (error) {
    console.error('❌ Error get order by ID:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

// PUT /api/orders/:id - Update order (admin update pricing, status, dll)
async function updateOrder(req, res, id, body) {
  try {
    const order = await Order.findById(id);
    
    if (!order) {
      return sendError(res, 404, 'Order tidak ditemukan');
    }

    // Track old values untuk email notification
    const oldOrderStatus = order.orderStatus;
    const oldPaymentStatus = order.paymentStatus;

    // Update fields yang diizinkan admin
    const allowedUpdates = [
      'price',
      'shippingCost',
      'totalPrice',
      'orderStatus',
      'paymentStatus',
      'dpAmount',
      'adminNotes',
      'referenceImageUrl',
      'deliveryDate',
      'deliveryTime'
    ];

    allowedUpdates.forEach(field => {
      if (body[field] !== undefined) {
        order[field] = body[field];
      }
    });

    // Auto-calculate totalPrice jika price/shippingCost berubah
    if (body.price !== undefined || body.shippingCost !== undefined) {
      order.totalPrice = (body.price || order.price) + (body.shippingCost || order.shippingCost);
    }

    // Validasi DP amount
    if (order.paymentStatus === 'DP' && order.dpAmount > order.totalPrice) {
      return sendError(res, 400, 'Jumlah DP tidak boleh melebihi total harga');
    }

    // Validasi deliveryDate jika diupdate
    if (body.deliveryDate) {
      const deliveryDateObj = new Date(body.deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deliveryDateObj < today) {
        return sendError(res, 400, 'Tanggal pengiriman tidak boleh di masa lalu');
      }
      order.deliveryDate = deliveryDateObj;
    }

    // Validasi deliveryTime jika diupdate
    if (body.deliveryTime !== undefined && !body.deliveryTime.trim()) {
      return sendError(res, 400, 'Waktu pengiriman tidak boleh kosong');
    }

    const updatedOrder = await order.save();

    // Kirim email jika status berubah
    if (oldOrderStatus !== order.orderStatus) {
      sendStatusChangeEmail(updatedOrder, oldOrderStatus).catch(err => {
        console.error('❌ Error mengirim email status change:', err.message);
      });
      
      console.log(`✅ Status order #${order._id} berubah: ${oldOrderStatus} → ${order.orderStatus}`);
      console.log(`📧 Email notifikasi status change sedang dikirim...`);
    }

    sendJSON(res, 200, {
      success: true,
      message: 'Order berhasil diupdate',
      order: updatedOrder
    });

  } catch (error) {
    console.error('❌ Error update order:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

// PUT /api/orders/:id/status - Quick update status saja (backward compatibility)
async function updateOrderStatus(req, res, id, body) {
  try {
    const { status } = body;

    const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Ready', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return sendError(res, 400, 'Status tidak valid');
    }

    const oldOrder = await Order.findById(id);
    if (!oldOrder) {
      return sendError(res, 404, 'Order tidak ditemukan');
    }

    const oldStatus = oldOrder.orderStatus;

    // ✅ FIX: Gunakan findByIdAndUpdate dengan {new: true}
    // Tidak perlu .save() lagi karena sudah auto-save
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );

    // Kirim email jika status berubah
    if (oldStatus !== status) {
      sendStatusChangeEmail(order, oldStatus).catch(err => {
        console.error('❌ Error mengirim email status change:', err.message);
      });
      
      console.log(`✅ Status order #${order._id} berubah: ${oldStatus} → ${status}`);
      console.log(`📧 Email notifikasi status change sedang dikirim...`);
    }

    // ✅ FIX: Langsung return order, HAPUS baris .save()
    sendJSON(res, 200, order);

  } catch (error) {
    console.error('❌ Error update order status:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

// DELETE /api/orders/:id - Hapus order (jarang dipakai, hanya untuk cleanup)
async function deleteOrder(req, res, id) {
  try {
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return sendError(res, 404, 'Order tidak ditemukan');
    }
    
    console.log(`✅ Order #${id} berhasil dihapus`);
    
    sendJSON(res, 200, {
      success: true,
      message: 'Order berhasil dihapus'
    });
  } catch (error) {
    console.error('❌ Error delete order:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

module.exports = {
  createOrder,        // Public
  getAllOrders,       // Protected
  getOrderById,       // Protected
  updateOrder,        // Protected (main update)
  updateOrderStatus,  // Protected (quick status update)
  deleteOrder         // Protected
};