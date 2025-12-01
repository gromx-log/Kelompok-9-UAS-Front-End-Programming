const mongoose = require('mongoose');

// Admin Model dengan Role-based Access
const adminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  // Password akan di-hash dengan bcrypt
  password: { 
    type: String, 
    required: true 
  },
  // Role: 'owner' atau 'admin'
  role: {
    type: String,
    required: true,
    enum: ['owner', 'admin'],
    default: 'admin'
  },
  // Informasi tambahan (opsional)
  fullName: {
    type: String,
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware: Auto-update timestamps
adminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Admin', adminSchema);