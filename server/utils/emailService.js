const emailConfig = require('../config/email');

// Dynamic import based on provider
let emailClient = null;

function getEmailClient() {
  if (!emailClient && emailConfig.isConfigured()) {
    if (emailConfig.provider === 'resend') {
      const { Resend } = require('resend');
      emailClient = new Resend(emailConfig.resend.apiKey);
    } else {
      const nodemailer = require('nodemailer');
      emailClient = nodemailer.createTransport(emailConfig.smtp);
    }
  }
  return emailClient;
}

// Helper untuk format tanggal Indonesia
function formatDate(date) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  };
  return new Date(date).toLocaleDateString('id-ID', options);
}

// Helper untuk format rupiah
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Kirim email menggunakan provider yang dipilih
 */
async function sendEmail(mailOptions) {
  const client = getEmailClient();
  if (!client) {
    console.log('⚠️  Email service tidak aktif. Lewati pengiriman email.');
    return false;
  }

  try {
    if (emailConfig.provider === 'resend') {
      // Resend API format
      const result = await client.emails.send({
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html
      });
      console.log('✅ Email berhasil dikirim via Resend:', result.id);
      return true;
    } else {
      // Nodemailer SMTP format
      await client.sendMail(mailOptions);
      console.log('✅ Email berhasil dikirim via SMTP');
      return true;
    }
  } catch (error) {
    console.error('❌ Gagal mengirim email:', error.message);
    if (error.response) {
      console.error('Error details:', error.response);
    }
    return false;
  }
}

/**
 * Kirim email notifikasi order baru ke penjual
 */
async function sendNewOrderEmail(order) {
  console.log('📧 Mempersiapkan email order baru...');
  
  // Determine sender based on provider
  const fromEmail = emailConfig.provider === 'resend' 
    ? `${emailConfig.fromName} <${emailConfig.resend.fromEmail}>`
    : `"${emailConfig.fromName}" <${emailConfig.smtp.auth.user}>`;

  const mailOptions = {
    from: fromEmail,
    to: emailConfig.sellerEmail,
    subject: `🎂 Order Baru Masuk - ${order.customerName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-box { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 20px 0; }
          .order-box h2 { color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
          .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e9ecef; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: bold; width: 180px; color: #495057; }
          .detail-value { flex: 1; color: #212529; white-space: pre-wrap; }
          .status-badge { display: inline-block; padding: 6px 12px; background: #ffc107; color: #000; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎂 Order Baru Masuk!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Ada pesanan kue custom yang perlu segera diproses</p>
          </div>
          
          <div class="content">
            <div class="order-box">
              <h2>📋 Detail Order</h2>
              
              <div class="detail-row">
                <div class="detail-label">Order ID:</div>
                <div class="detail-value"><strong>#${order._id}</strong></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div class="detail-value"><span class="status-badge">${order.orderStatus || 'Pending'}</span></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Tanggal Order:</div>
                <div class="detail-value">${formatDate(order.createdAt)}</div>
              </div>
            </div>
            
            <div class="order-box">
              <h2>👤 Informasi Customer</h2>
              
              <div class="detail-row">
                <div class="detail-label">Nama:</div>
                <div class="detail-value">${order.customerName}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">No. Telepon:</div>
                <div class="detail-value"><a href="tel:${order.customerPhone}">${order.customerPhone}</a></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Alamat Kirim:</div>
                <div class="detail-value">${order.deliveryAddress}</div>
              </div>
            </div>
            
            <div class="order-box">
              <h2>🚚 Detail Pengiriman</h2>
              
              <div class="detail-row">
                <div class="detail-label">Tanggal Kirim:</div>
                <div class="detail-value"><strong style="color: #dc3545;">${formatDate(order.deliveryDate)}</strong></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Waktu Kirim:</div>
                <div class="detail-value"><strong style="color: #dc3545;">${order.deliveryTime}</strong></div>
              </div>
            </div>
            
            <div class="order-box">
              <h2>🎂 Detail Kue</h2>
              
              <div class="detail-row">
                <div class="detail-label">Model Kue:</div>
                <div class="detail-value"><strong>${order.cakeModel}</strong></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Base Cake:</div>
                <div class="detail-value"><strong>${order.cakeBase}</strong></div>
              </div>

              ${order.mixBase ? `
              <div class="detail-row">
                <div class="detail-label">Mix dengan:</div>
                <div class="detail-value">${order.mixBase}</div>
              </div>
              ` : ''}
              
              ${order.cakeFlavor ? `
              <div class="detail-row">
                <div class="detail-label">Rasa:</div>
                <div class="detail-value">${order.cakeFlavor}</div>
              </div>
              ` : ''}

              ${order.cakeFilling ? `
              <div class="detail-row">
                <div class="detail-label">Filling:</div>
                <div class="detail-value">${order.cakeFilling}</div>
              </div>
              ` : ''}
              
              <div class="detail-row">
                <div class="detail-label">Tingkat Kue:</div>
                <div class="detail-value">${order.cakeTiers} tingkat</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Diameter:</div>
                <div class="detail-value">${order.cakeDiameter}</div>
              </div>
              
              ${order.cakeText ? `
              <div class="detail-row">
                <div class="detail-label">Tulisan di Kue:</div>
                <div class="detail-value">${order.cakeText}</div>
              </div>
              ` : ''}
              
              ${order.age ? `
              <div class="detail-row">
                <div class="detail-label">Umur:</div>
                <div class="detail-value">${order.age} tahun</div>
              </div>
              ` : ''}
            </div>
            
            <div class="footer">
              <p>Silakan segera hubungi customer untuk konfirmasi harga dan detail pengiriman.</p>
              <p style="font-size: 12px; color: #adb5bd;">Notifikasi otomatis dari Custom Cake Order System</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  const result = await sendEmail(mailOptions);
  if (result) {
    console.log(`✅ Email order baru berhasil dikirim untuk Order #${order._id}`);
  }
  return result;
}

/**
 * Kirim email reminder H-1 pengiriman
 */
async function sendDeliveryReminderEmail(order) {
  console.log('📧 Mempersiapkan email reminder H-1...');
  
  const fromEmail = emailConfig.provider === 'resend' 
    ? `${emailConfig.fromName} <${emailConfig.resend.fromEmail}>`
    : `"${emailConfig.fromName}" <${emailConfig.smtp.auth.user}>`;

  const mailOptions = {
    from: fromEmail,
    to: emailConfig.sellerEmail,
    subject: `⏰ REMINDER: Pengiriman Besok - ${order.customerName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: #fff3cd; padding: 30px; border-radius: 0 0 10px 10px; }
          .urgent-box { background: white; padding: 25px; border-radius: 8px; border-left: 5px solid #dc3545; margin: 20px 0; }
          .urgent-box h2 { color: #dc3545; margin-top: 0; }
          .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e9ecef; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: bold; width: 180px; color: #495057; }
          .detail-value { flex: 1; color: #212529; }
          .highlight { background: #dc3545; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
          .checklist { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .checklist li { padding: 8px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ REMINDER PENGIRIMAN</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">Order ini harus dikirim BESOK!</p>
          </div>
          
          <div class="content">
            <div class="highlight">
              🚚 PENGIRIMAN: ${formatDate(order.deliveryDate)} - ${order.deliveryTime}
            </div>
            
            <div class="urgent-box">
              <h2>📋 Detail Order Urgent</h2>
              
              <div class="detail-row">
                <div class="detail-label">Order ID:</div>
                <div class="detail-value"><strong>#${order._id}</strong></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Customer:</div>
                <div class="detail-value"><strong>${order.customerName}</strong></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">No. Telepon:</div>
                <div class="detail-value"><a href="tel:${order.customerPhone}">${order.customerPhone}</a></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Model Kue:</div>
                <div class="detail-value">${order.cakeModel}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Base:</div>
                <div class="detail-value">${order.cakeBase}${order.cakeFlavor ? ' - ' + order.cakeFlavor : ''}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Ukuran:</div>
                <div class="detail-value">${order.cakeTiers} tingkat - ${order.cakeDiameter}</div>
              </div>
            </div>
            
            <div class="checklist">
              <h3 style="color: #28a745; margin-top: 0;">✅ Checklist Sebelum Pengiriman:</h3>
              <ul style="list-style: none; padding: 0;">
                <li>☐ Pastikan kue sudah selesai dibuat</li>
                <li>☐ Cek kualitas dan kesesuaian dengan pesanan</li>
                <li>☐ Packaging sudah aman dan rapi</li>
                <li>☐ Hubungi customer untuk konfirmasi pengiriman</li>
                <li>☐ Siapkan alat transportasi/kurir</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Jangan lupa update status order!</strong></p>
            <p style="font-size: 12px; color: #adb5bd;">Reminder otomatis dari Custom Cake Order System</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  const result = await sendEmail(mailOptions);
  if (result) {
    console.log(`✅ Email reminder berhasil dikirim untuk Order #${order._id}`);
  }
  return result;
}

/**
 * Kirim email notifikasi saat status order berubah
 */
async function sendStatusChangeEmail(order, oldStatus) {
  console.log('📧 Mempersiapkan email status change...');
  
  const fromEmail = emailConfig.provider === 'resend' 
    ? `${emailConfig.fromName} <${emailConfig.resend.fromEmail}>`
    : `"${emailConfig.fromName}" <${emailConfig.smtp.auth.user}>`;

  // Tentukan warna dan emoji berdasarkan status
  const statusConfig = {
    'Pending': { color: '#ffc107', emoji: '⏳', bgColor: '#fff3cd' },
    'Confirmed': { color: '#28a745', emoji: '✅', bgColor: '#d4edda' },
    'In Progress': { color: '#17a2b8', emoji: '🔨', bgColor: '#d1ecf1' },
    'Ready': { color: '#6f42c1', emoji: '🎁', bgColor: '#e2d9f3' },
    'Delivered': { color: '#28a745', emoji: '🎉', bgColor: '#d4edda' },
    'Cancelled': { color: '#dc3545', emoji: '❌', bgColor: '#f8d7da' }
  };

  const config = statusConfig[order.orderStatus] || statusConfig['Pending'];

  const mailOptions = {
    from: fromEmail,
    to: emailConfig.sellerEmail,
    subject: `${config.emoji} Status Berubah: ${oldStatus} → ${order.orderStatus}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${config.color}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: ${config.bgColor}; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-change { background: white; padding: 25px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .status-flow { display: flex; align-items: center; justify-content: center; font-size: 18px; margin: 20px 0; }
          .old-status { background: #6c757d; color: white; padding: 10px 20px; border-radius: 20px; }
          .arrow { margin: 0 15px; font-size: 24px; }
          .new-status { background: ${config.color}; color: white; padding: 10px 20px; border-radius: 20px; font-weight: bold; }
          .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #dee2e6; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: bold; width: 150px; }
          .detail-value { flex: 1; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${config.emoji} Status Order Berubah</h1>
          </div>
          
          <div class="content">
            <div class="status-change">
              <h2 style="margin-top: 0;">Perubahan Status Order</h2>
              <div class="status-flow">
                <span class="old-status">${oldStatus}</span>
                <span class="arrow">→</span>
                <span class="new-status">${order.orderStatus}</span>
              </div>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 8px;">
              <h3 style="margin-top: 0;">Detail Order:</h3>
              
              <div class="detail-row">
                <div class="detail-label">Order ID:</div>
                <div class="detail-value">#${order._id}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Customer:</div>
                <div class="detail-value">${order.customerName}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Model Kue:</div>
                <div class="detail-value">${order.cakeModel}</div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">Tanggal Kirim:</div>
                <div class="detail-value">${formatDate(order.deliveryDate)}</div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Update otomatis dari Custom Cake Order System</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  const result = await sendEmail(mailOptions);
  if (result) {
    console.log(`✅ Email status change berhasil dikirim untuk Order #${order._id}`);
  }
  return result;
}

module.exports = {
  sendNewOrderEmail,
  sendDeliveryReminderEmail,
  sendStatusChangeEmail
};