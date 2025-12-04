const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const { sendJSON, sendError } = require('../utils/responseHelper');

// ========================================
// OWNER ONLY: Manajemen Admin
// ========================================

// GET /api/admins - List semua admin (tidak termasuk owner)
async function getAllAdmins(req, res) {
  try {
    // Ambil semua admin kecuali owner
    const admins = await Admin.find({ role: 'admin' })
      .select('-password') // Jangan tampilkan password
      .sort({ createdAt: -1 });
    
    sendJSON(res, 200, {
      success: true,
      count: admins.length,
      admins: admins
    });
  } catch (error) {
    console.error('❌ Error get all admins:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

// POST /api/admins - Buat admin baru (owner only)
async function createAdmin(req, res, body) {
  try {
    const { username, password, fullName } = body;

    // Validasi input
    if (!username || !password) {
      return sendError(res, 400, 'Username dan password wajib diisi');
    }

    // Validasi panjang password
    if (password.length < 6) {
      return sendError(res, 400, 'Password minimal 6 karakter');
    }

    // Cek apakah username sudah ada
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return sendError(res, 400, 'Username sudah digunakan');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat admin baru
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      role: 'admin',
      fullName: fullName || username
    });

    await newAdmin.save();

    // Kirim response tanpa password
    const adminResponse = {
      id: newAdmin._id,
      username: newAdmin.username,
      role: newAdmin.role,
      fullName: newAdmin.fullName,
      createdAt: newAdmin.createdAt
    };

    sendJSON(res, 201, {
      success: true,
      message: 'Admin berhasil dibuat',
      admin: adminResponse
    });

  } catch (error) {
    console.error('❌ Error create admin:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

// GET /api/admins/:id - Detail satu admin
async function getAdminById(req, res, id) {
  try {
    const admin = await Admin.findById(id).select('-password');
    
    if (!admin) {
      return sendError(res, 404, 'Admin tidak ditemukan');
    }

    // Pastikan yang diakses bukan owner
    if (admin.role === 'owner') {
      return sendError(res, 403, 'Tidak dapat mengakses data owner melalui endpoint ini');
    }

    sendJSON(res, 200, {
      success: true,
      admin: admin
    });
  } catch (error) {
    console.error('❌ Error get admin by ID:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

// PUT /api/admins/:id - Update admin (username/password/fullName)
async function updateAdmin(req, res, id, body) {
  try {
    const admin = await Admin.findById(id);
    
    if (!admin) {
      return sendError(res, 404, 'Admin tidak ditemukan');
    }

    // Pastikan yang diupdate bukan owner
    if (admin.role === 'owner') {
      return sendError(res, 403, 'Tidak dapat mengubah data owner melalui endpoint ini');
    }

    const { username, password, fullName } = body;

    // Update username jika ada
    if (username && username !== admin.username) {
      // Cek apakah username baru sudah dipakai
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
        return sendError(res, 400, 'Username sudah digunakan');
      }
      admin.username = username;
    }

    // Update password jika ada
    if (password) {
      if (password.length < 6) {
        return sendError(res, 400, 'Password minimal 6 karakter');
      }
      admin.password = await bcrypt.hash(password, 10);
    }

    // Update fullName jika ada
    if (fullName !== undefined) {
      admin.fullName = fullName;
    }

    await admin.save();

    // Kirim response tanpa password
    const adminResponse = {
      id: admin._id,
      username: admin.username,
      role: admin.role,
      fullName: admin.fullName,
      updatedAt: admin.updatedAt
    };

    sendJSON(res, 200, {
      success: true,
      message: 'Admin berhasil diupdate',
      admin: adminResponse
    });

  } catch (error) {
    console.error('❌ Error update admin:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

// DELETE /api/admins/:id - Hapus admin
async function deleteAdmin(req, res, id) {
  try {
    const admin = await Admin.findById(id);
    
    if (!admin) {
      return sendError(res, 404, 'Admin tidak ditemukan');
    }

    // Pastikan yang dihapus bukan owner
    if (admin.role === 'owner') {
      return sendError(res, 403, 'Tidak dapat menghapus owner');
    }

    const deletedUsername = admin.username;
    await Admin.findByIdAndDelete(id);

    sendJSON(res, 200, {
      success: true,
      message: `Admin ${deletedUsername} berhasil dihapus`
    });

  } catch (error) {
    console.error('❌ Error delete admin:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

// ========================================
// OWNER SELF-MANAGEMENT
// ========================================

// GET /api/owner/profile - Lihat profil owner sendiri
async function getOwnerProfile(req, res) {
  try {
    const ownerId = req.admin.id; // Dari JWT token
    
    const owner = await Admin.findById(ownerId).select('-password');
    
    if (!owner) {
      return sendError(res, 404, 'Owner tidak ditemukan');
    }

    sendJSON(res, 200, {
      success: true,
      owner: owner
    });
  } catch (error) {
    console.error('❌ Error get owner profile:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

// PUT /api/owner/profile - Owner update profil sendiri
async function updateOwnerProfile(req, res, body) {
  try {
    const ownerId = req.admin.id; // Dari JWT token
    
    const owner = await Admin.findById(ownerId);
    
    if (!owner || owner.role !== 'owner') {
      return sendError(res, 403, 'Akses ditolak');
    }

    const { username, password, fullName } = body;

    // Update username jika ada
    if (username && username !== owner.username) {
      // Cek apakah username baru sudah dipakai
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
        return sendError(res, 400, 'Username sudah digunakan');
      }
      owner.username = username;
    }

    // Update password jika ada
    if (password) {
      if (password.length < 6) {
        return sendError(res, 400, 'Password minimal 6 karakter');
      }
      owner.password = await bcrypt.hash(password, 10);
    }

    // Update fullName jika ada
    if (fullName !== undefined) {
      owner.fullName = fullName;
    }

    await owner.save();

    // Kirim response tanpa password
    const ownerResponse = {
      id: owner._id,
      username: owner.username,
      role: owner.role,
      fullName: owner.fullName,
      updatedAt: owner.updatedAt
    };

    sendJSON(res, 200, {
      success: true,
      message: 'Profil owner berhasil diupdate',
      owner: ownerResponse
    });

  } catch (error) {
    console.error('❌ Error update owner profile:', error);
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

module.exports = {
  // Admin management (owner only)
  getAllAdmins,
  createAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  
  // Owner self-management
  getOwnerProfile,
  updateOwnerProfile
};