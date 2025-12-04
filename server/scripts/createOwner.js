// Script untuk membuat akun Owner
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');

async function createOwner() {
  try {
    // 1. Connect ke database
    await mongoose.connect(process.env.MONGO_URI);

    // 2. Cek apakah owner sudah ada
    const existingOwner = await Admin.findOne({ role: 'owner' }); 
    if (existingOwner) {
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

    // Owner berhasil dibuat
    await newOwner.save();

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createOwner();