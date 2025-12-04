// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Menghubungkan MongoDB
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error('Koneksi GAGAL:', err.message);
    // Keluar dari proses dengan kegagalan
    process.exit(1);
  }
};

module.exports = connectDB;