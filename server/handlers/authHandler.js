// NOTE:
// Dikarenakan pengguna CMS hanya merupakan Bu Kartini selaku
// Pemilik Kartini Ale, maka tidak akan dibuat lagi akun selain milik Bu Kartini

const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendJSON, sendError } = require('../utils/responseHelper');

// POST /api/auth/login
async function login(req, res, body) {
  try {
    const { username, password } = body;

    // Input Validation (Username and Password)
    if (!username || !password) {
      return sendError(res, 400, 'Username dan password wajib diisi');
    }

    // Check Admin Existence
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return sendError(res, 401, 'Username atau password salah');
    }

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Username atau password salah');
    }

    // Generate JWT token
    // Token lasted for 1 week only
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' } 
    );

    sendJSON(res, 200, { 
      token,
      message: 'Login berhasil',
      admin: { username: admin.username }
    });

  } catch (error) {
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

module.exports = {
  login
};