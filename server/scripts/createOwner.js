// Script untuk membuat akun Owner
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');

async function createOwner() {
  try {
    // 1. Connect ke database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // 2. Cek apakah owner sudah ada
    const existingOwner = await Admin.findOne({ role: 'owner' });
    if (existingOwner) {
      console.log('⚠️  Owner sudah ada!');
      console.log(`   Username: ${existingOwner.username}`);
      console.log('   Hanya boleh ada 1 owner dalam sistem.');
      console.log('   Jika ingin mengganti, hapus owner lama terlebih dahulu dari database.');
      process.exit(0);
    }

    // 3. Input data owner
    const ownerData = {
      username: 'owner',
      password: 'OwnerKartiniAle2024', // Password default
      role: 'owner',
      fullName: 'Bu Kartini (Owner)'
    };

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(ownerData.password, 10);

    // 5. Buat owner baru
    const newOwner = new Admin({
      username: ownerData.username,
      password: hashedPassword,
      role: ownerData.role,
      fullName: ownerData.fullName
    });

    await newOwner.save();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ OWNER BERHASIL DIBUAT!');
    console.log('='.repeat(60));
    console.log(`📌 Username: ${ownerData.username}`);
    console.log(`📌 Password: ${ownerData.password}`);
    console.log(`📌 Role: ${ownerData.role}`);
    console.log('='.repeat(60));
    console.log('⚠️  PENTING:');
    console.log('   - SEGERA GANTI PASSWORD setelah login pertama kali!');
    console.log('   - Simpan kredensial ini dengan AMAN');
    console.log('   - Owner memiliki akses PENUH ke semua fitur');
    console.log('='.repeat(60) + '\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createOwner();