const jwt = require('jsonwebtoken');
const { sendError } = require('./responseHelper');

// Middleware ini berguna untuk protected route
// Yakni route yang hanya bisa diakses admin
function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Akses ditolak. Token tidak ditemukan.');
    }

    // Extract & Verify Token (format: "Bearer TOKEN_HERE")
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
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

module.exports = { protect };