const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // ========================================
  // SECTION 1: CUSTOMER INPUT (dari form public)
  // ========================================
  
  // Model kue (tema/karakter)
  cakeModel: { 
    type: String, 
    required: true,
    trim: true
    // Contoh: "Unicorn", "SpongeBob", "Frozen", "Simple Elegant"
  },
  
  // URL Gambar Referensi (opsional)
  referenceImageUrl: {
  type: String,
  trim: true,
 },

  // Base kue (jenis kue)
  cakeBase: {
    type: String,
    required: true,
    enum: ['Dummy Cake', 'Ogura Cake', 'Lapis Surabaya', 'Dummy + Mix']
  },
  
  // Mix Base (HANYA untuk Dummy + Mix)
  mixBase: {
    type: String,
    enum: ['Ogura Cake', 'Lapis Surabaya']
    // Tidak required karena hanya diisi jika cakeBase = "Dummy + Mix"
    // Akan divalidasi di handler
  },
  
  // Flavor kue (conditional berdasarkan base/mixBase)
  cakeFlavor: {
    type: String,
    enum: ['Vanilla', 'Mocca', 'Keju', 'Coklat', 'Pandan']
    // Wajib jika:
    // - cakeBase = "Ogura Cake", ATAU
    // - cakeBase = "Dummy + Mix" DAN mixBase = "Ogura Cake"
  },
  
  // Filling/Selai (conditional berdasarkan base/mixBase)
  cakeFilling: {
    type: String,
    enum: ['Blueberry', 'Strawberry', 'Mocca', 'Coklat']
    // Wajib jika cakeBase BUKAN "Dummy Cake"
    // Validasi detail di handler
  },
  
  // Nama/Tulisan di kue
  cakeText: { 
    type: String, 
    required: true,
    trim: true
    // Contoh: "Happy Birthday Sarah", "Selamat Ulang Tahun"
  },
  
  // Umur (untuk tulisan di kue)
  age: { 
    type: Number,
    min: 0
    // Opsional, bisa null jika tidak ada umur
  },
  
  // Tanggal & Jam pengiriman
  deliveryDate: { 
    type: Date, 
    required: true 
  },
  deliveryTime: { 
    type: String,
    required: true
    // Format: "09:00", "14:30", dll
  },
  
  // Ukuran kue (custom input dari user)
  cakeTiers: {
    type: Number,
    required: true,
    min: 1,
    max: 10
    // Jumlah tingkat kue (1-10 tingkat)
    // Input number dari customer
  },
  
  cakeDiameter: {
    type: String,
    required: true,
    trim: true
    // Diameter kue dalam cm (free text)
    // Contoh: "20cm", "15cm", "20cm + 15cm" (untuk multi-tier)
    // Customer bisa input format apa saja
  },
  
  // Alamat pengiriman
  deliveryAddress: { 
    type: String, 
    required: true,
    trim: true
  },
  
  // Kontak customer
  customerName: { 
    type: String, 
    required: true,
    trim: true
  },
  customerPhone: { 
    type: String, 
    required: true,
    trim: true
  },
  
  // ========================================
  // SECTION 2: ADMIN INPUT (dari CMS)
  // ========================================
  
  // Pricing
  price: { 
    type: Number,
    default: 0,
    min: 0
    // Harga kue (diisi admin setelah kalkulasi)
  },
  
  shippingCost: { 
    type: Number,
    default: 0,
    min: 0
    // Ongkos kirim (diisi admin)
  },
  
  totalPrice: { 
    type: Number,
    default: 0,
    min: 0
    // Total = price + shippingCost (auto-calculated atau manual)
  },
  
  // Status Pesanan
  orderStatus: {
    type: String,
    default: 'Pending',
    enum: [
      'Pending',      // Menunggu konfirmasi admin
      'Confirmed',    // Admin sudah konfirmasi & tentukan harga
      'In Progress',  // Sedang dikerjakan
      'Ready',        // Kue sudah siap untuk dikirim
      'Delivered',    // Sudah dikirim/diambil customer
      'Cancelled'     // Dibatalkan
    ]
  },
  
  // Status Pembayaran
  paymentStatus: {
    type: String,
    default: 'Unpaid',
    enum: [
      'Unpaid',       // Belum bayar sama sekali
      'DP',           // Sudah bayar DP (sebagian)
      'Paid'          // Sudah lunas
    ]
  },
  
  // Jumlah DP (jika payment status = DP)
  dpAmount: { 
    type: Number,
    default: 0,
    min: 0
    // Berapa yang sudah dibayar sebagai DP
  },
  
  // Sisa pembayaran (calculated field)
  remainingPayment: {
    type: Number,
    default: 0,
    min: 0
    // totalPrice - dpAmount
  },
  
  // ========================================
  // SECTION 3: METADATA
  // ========================================
  
  // Catatan internal admin (opsional)
  adminNotes: { 
    type: String,
    trim: true
    // Untuk catatan khusus dari admin
  },
  
  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware: Auto-update timestamps
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware: Auto-calculate remainingPayment
orderSchema.pre('save', function(next) {
  if (this.paymentStatus === 'DP') {
    this.remainingPayment = this.totalPrice - this.dpAmount;
  } else if (this.paymentStatus === 'Paid') {
    this.remainingPayment = 0;
  } else {
    this.remainingPayment = this.totalPrice;
  }
  next();
});

// Virtual: Untuk format tanggal lebih readable
orderSchema.virtual('formattedDeliveryDate').get(function() {
  return this.deliveryDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual: Payment progress percentage
orderSchema.virtual('paymentProgress').get(function() {
  if (this.totalPrice === 0) return 0;
  const paid = this.totalPrice - this.remainingPayment;
  return Math.round((paid / this.totalPrice) * 100);
});

// Enable virtuals in JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);