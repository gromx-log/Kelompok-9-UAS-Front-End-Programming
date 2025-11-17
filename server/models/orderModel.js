const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Data terkait customer (nama dan nomor telpon)
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },

    // Waktu pengiriman
    deliveryDate: { type: Date, required: true },
    deliveryTime: { type: String, required: true },

    // Kue yang di-order
    cakeType: {
        type: String,
        required: true,
        enum: ['Ogura', 'Lapis Surabaya', 'Dummy Cake', 'Dummy + Mix'] 
    },
    // Opsional, karena rasa kue hanya bisa dipilih saat memilih menggunakan base cake Ogura
    mixBase: { type: String },
    cakeFlavor: { type: String }, 
    cakeSize: { type: String, required: true },
    cakeFilling: { type: String },
    themeDescription: { type: String, required: true },
    referenceImageUrl: { type: String },
    cakeText: { type: String },
    age: { type: String },

    // Others: detail status pembuatan dan timestamp untuk pencatatan order
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'In Progress', 'Shipped', 'Done', 'Cancelled']
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);