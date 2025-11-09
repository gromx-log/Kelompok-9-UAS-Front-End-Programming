// Script for making the admin
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');

async function createAdmin() {
  try {
    // 1. Connect ke database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // 2. Cek apakah admin sudah ada
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin sudah ada! Username: admin');
      process.exit(0);
    }

    // 3. Hash password
    // Password default
    const plainPassword = 'Kartini Ale Jaya'; 
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 4. Buat admin baru
    const newAdmin = new Admin({
      username: 'admin',
      password: hashedPassword
    });

    await newAdmin.save();
    
    console.log('✅ Admin berhasil dibuat!');
    console.log('📌 Username: admin');
    console.log('📌 Password: Kartini Ale Jaya');
    console.log('⚠️  SEGERA GANTI PASSWORD SETELAH LOGIN PERTAMA KALI!');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();