const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Data terkait customer (nama dan nomor telpon)
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },

    // Waktu pengiriman
    deliveryDate: { type: Date, required: true },

    // Total Price (bisa diedit admin)
    totalPrice: {
      type: Number,
      default: 0
    },

    // Status pembayaran
    paymentStatus: {
      type: String,
      default: 'Belum Bayar',
      enum: ['Belum Bayar', 'DP', 'Lunas']
    },

    // Kue yang di-order
    cakeType: {
        type: String,
        required: true,
        enum: ['Ogura', 'Lapis Surabaya', 'Dami Cake']
    },
    // Opsional, karena rasa kue hanya bisa dipilih saat memilih menggunakan base cake Ogura
    cakeFlavor: { type: String }, 
    cakeSize: { type: String, required: true },
    themeDescription: { type: String, required: true },
    referenceImageUrl: { type: String },

    // Others: detail status pembuatan dan timestamp untuk pencatatan order
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'In Progress', 'Shipped', 'Done', 'Cancelled']
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);