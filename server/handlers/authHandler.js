const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendJSON, sendError } = require('../utils/responseHelper');

// POST /api/auth/login
async function login(req, res, body) {
  try {
    const { username, password } = body;

    // Input Validation
    if (!username || !password) {
      return sendError(res, 400, 'Username dan password wajib diisi');
    }

    // Check Admin/Owner Existence
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return sendError(res, 401, 'Username atau password salah');
    }

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Username atau password salah');
    }

    // Generate JWT token dengan role
    // Token berlaku 7 hari
    const token = jwt.sign(
      { 
        id: admin._id, 
        username: admin.username,
        role: admin.role
      },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' } 
    );

    console.log(`✅ Login berhasil: ${admin.username} (${admin.role})`);

    sendJSON(res, 200, { 
      token,
      message: 'Login berhasil',
      admin: { 
        id: admin._id,
        username: admin.username,
        role: admin.role,
        fullName: admin.fullName
      }
    });

  } catch (error) {
    console.error('❌ Error login:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

module.exports = {
  login
};