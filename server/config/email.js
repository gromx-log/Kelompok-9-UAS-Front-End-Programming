// Pada file ini kita akan mengkonfigurasikan bagian email
// Email inilah yang akan berperan sebagai pemberi pesan terkait
// 1. Orderan yang masuk
// 2. Pengingat H-1 pengiriman
require('dotenv').config();

const emailConfig = {
  // Konfigurasi SMTP
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true untuk port 465, false untuk port lainnya
    auth: {
      user: process.env.SMTP_USER, // Email pengirim
      pass: process.env.SMTP_PASS  // App password (bukan password email biasa)
    }
  },
  
  // Email penerima (penjual)
  sellerEmail: process.env.SELLER_EMAIL || 'seller@example.com',
  
  // Nama pengirim yang muncul di email
  fromName: process.env.EMAIL_FROM_NAME || 'Custom Cake Order System',
  
  // Validasi konfigurasi
  isConfigured() {
    if (!this.smtp.auth.user || !this.smtp.auth.pass) {
      console.error('Email belum dikonfigurasi! Pastikan SMTP_USER dan SMTP_PASS ada di .env');
      return false;
    }
    return true;
  }
};

module.exports = emailConfig;