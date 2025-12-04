// Pada file ini kita akan mengkonfigurasikan bagian email
// Email inilah yang akan berperan sebagai pemberi pesan terkait
// 1. Orderan yang masuk
// 2. Pengingat H-1 pengiriman
require('dotenv').config();

const emailConfig = {
  // Email provider type
  provider: process.env.EMAIL_PROVIDER || 'resend', // 'resend' or 'smtp'
  
  // Resend configuration (RECOMMENDED for Railway)
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
  },
  
  // SMTP configuration (Backup/Alternative)
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  },
  
  // Email penerima (penjual)
  sellerEmail: process.env.SELLER_EMAIL || 'seller@example.com',
  
  // Nama pengirim yang muncul di email
  fromName: process.env.EMAIL_FROM_NAME || 'Custom Cake Order System',
  
  // Validasi konfigurasi
  isConfigured() {
    if (this.provider === 'resend') {
      if (!this.resend.apiKey) {
        console.error('❌ Resend API key tidak ditemukan! Set RESEND_API_KEY di .env');
        return false;
      }
      return true;
    } else {
      if (!this.smtp.auth.user || !this.smtp.auth.pass) {
        console.error('❌ SMTP credentials tidak lengkap! Set SMTP_USER dan SMTP_PASS di .env');
        return false;
      }
      return true;
    }
  }
};

module.exports = emailConfig;