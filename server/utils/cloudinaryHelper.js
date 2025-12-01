const cloudinary = require('cloudinary').v2;
const { sendError } = require('./responseHelper');

// File ini akan diguanakn untuk mengupload image ke Cloudinary
// Sehingga kita bisa menambahkan foto produk ke galeri atau halaman "Product"

if (!process.env.CLOUDINARY_URL) {
  throw new Error('CLOUDINARY_URL tidak ditemukan di .env');
}

// Upload single image ke Cloudinary
async function uploadToCloudinary(fileBuffer, folder = 'cakes') {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    throw new Error('Upload gagal: ' + error.message);
  }
}

// Delete Image (Jika ada gambar produk yang ingin dihapus)
async function deleteFromCloudinary(imageUrl) {
  try {
    // Extract public_id dari URL Cloudinary
    const publicId = imageUrl
      .split('/')
      .slice(-2)
      .join('/')
      .split('.')[0];
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Gagal hapus gambar:', error.message);
  }
}

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};