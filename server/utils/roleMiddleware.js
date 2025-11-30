const jwt = require('jsonwebtoken');
const { sendError } = require('./responseHelper');

/**
 * Middleware untuk cek apakah user adalah Owner
 * Hanya owner yang bisa akses endpoint tertentu
 */
function ownerOnly(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Akses ditolak. Token tidak ditemukan.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Cek apakah role adalah 'owner'
    if (decoded.role !== 'owner') {
      return sendError(res, 403, 'Akses ditolak. Hanya owner yang dapat mengakses fitur ini.');
    }

    req.admin = decoded;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Token tidak valid');
    }
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token sudah kadaluarsa. Silakan login kembali.');
    }
    return sendError(res, 500, 'Server Error: ' + error.message);
  }
}

/**
 * Middleware untuk cek apakah user adalah Owner atau Admin
 * Owner dan Admin bisa akses endpoint ini
 */
function ownerOrAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Akses ditolak. Token tidak ditemukan.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Cek apakah role adalah 'owner' atau 'admin'
    if (decoded.role !== 'owner' && decoded.role !== 'admin') {
      return sendError(res, 403, 'Akses ditolak. Anda tidak memiliki izin.');
    }

    req.admin = decoded;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Token tidak valid');
    }
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token sudah kadaluarsa. Silakan login kembali.');
    }
    return sendError(res, 500, 'Server Error: ' + error.message);
  }
}

module.exports = { 
  ownerOnly,
  ownerOrAdmin 
};