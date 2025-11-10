// jobs/reminderCron.js
// Cron job untuk mengecek dan mengirim reminder H-1 pengiriman

const cron = require('node-cron');
const Order = require('../models/orderModel');
const { sendDeliveryReminderEmail } = require('../utils/emailService');

/**
 * Cek apakah tanggal adalah besok
 * @param {Date} date - Tanggal yang akan dicek
 * @returns {Boolean}
 */
function isTomorrow(date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate.getTime() === tomorrow.getTime();
}

/**
 * Fungsi utama untuk cek order yang perlu reminder
 */
async function checkOrdersForReminder() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 Menjalankan cron job - Cek order H-1 pengiriman');
    console.log(`⏰ Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`);
    console.log('='.repeat(60));

    // Ambil semua order dengan status Confirmed
    const confirmedOrders = await Order.find({ 
      status: 'Confirmed' 
    }).sort({ deliveryDate: 1 });

    if (confirmedOrders.length === 0) {
      console.log('✓ Tidak ada order dengan status Confirmed.');
      console.log('='.repeat(60) + '\n');
      return;
    }

    console.log(`📦 Total order Confirmed: ${confirmedOrders.length}`);

    // Filter order yang pengirimannya besok
    const tomorrowOrders = confirmedOrders.filter(order => 
      isTomorrow(order.deliveryDate)
    );

    if (tomorrowOrders.length === 0) {
      console.log('✓ Tidak ada order yang perlu dikirim besok.');
      console.log('='.repeat(60) + '\n');
      return;
    }

    console.log(`🚨 Ditemukan ${tomorrowOrders.length} order yang perlu dikirim BESOK:`);
    console.log('-'.repeat(60));

    // Kirim email reminder untuk setiap order
    let successCount = 0;
    let failCount = 0;

    for (const order of tomorrowOrders) {
      console.log(`\n📋 Order #${order._id}`);
      console.log(`   Customer: ${order.customerName}`);
      console.log(`   Kue: ${order.cakeType} - ${order.cakeSize}`);
      console.log(`   Pengiriman: ${order.deliveryDate.toLocaleDateString('id-ID')}`);
      
      const sent = await sendDeliveryReminderEmail(order);
      
      if (sent) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log('\n' + '-'.repeat(60));
    console.log(`✅ Berhasil: ${successCount} email`);
    if (failCount > 0) {
      console.log(`❌ Gagal: ${failCount} email`);
    }
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Error saat menjalankan reminder cron:', error.message);
    console.log('='.repeat(60) + '\n');
  }
}

/**
 * Setup dan jalankan cron job
 * @param {String} schedule - Cron schedule (default: setiap hari jam 9 pagi)
 */
function startReminderCron(schedule = '0 9 * * *') {
  // Validasi schedule
  if (!cron.validate(schedule)) {
    console.error(`❌ Invalid cron schedule: ${schedule}`);
    return;
  }

  // Setup cron job
  const job = cron.schedule(schedule, checkOrdersForReminder, {
    scheduled: true,
    timezone: "Asia/Jakarta"
  });

  console.log('✅ Reminder cron job berhasil disetup');
  console.log(`📅 Schedule: ${schedule} (Zona Waktu: Asia/Jakarta)`);
  console.log(`💡 Interpretasi: ${interpretCronSchedule(schedule)}`);
  
  return job;
}

/**
 * Helper untuk menjelaskan cron schedule dalam bahasa natural
 * @param {String} schedule 
 */
function interpretCronSchedule(schedule) {
  const scheduleMap = {
    '0 9 * * *': 'Setiap hari jam 9:00 pagi',
    '0 8 * * *': 'Setiap hari jam 8:00 pagi',
    '0 */6 * * *': 'Setiap 6 jam sekali',
    '0 9,17 * * *': 'Setiap hari jam 9:00 pagi dan 5:00 sore',
    '* * * * *': 'Setiap menit (untuk testing)',
    '*/5 * * * *': 'Setiap 5 menit (untuk testing)'
  };
  
  return scheduleMap[schedule] || 'Custom schedule';
}

/**
 * Jalankan cron job secara manual (untuk testing)
 */
async function runManualCheck() {
  console.log('🔧 Menjalankan pengecekan manual...');
  await checkOrdersForReminder();
}

module.exports = {
  startReminderCron,
  runManualCheck,
  checkOrdersForReminder
};