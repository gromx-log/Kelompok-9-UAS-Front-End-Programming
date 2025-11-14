const mongoose = require('mongoose');

// This will be a model for Admin
// Admin is the only user who can access the CMS
const adminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // Password akan di-hash dengan bcrypt
  password: { 
    type: String, 
    required: true 
  }, 
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Admin', adminSchema);