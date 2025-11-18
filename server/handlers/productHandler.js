const Product = require('../models/productModel');
const { formidable } = require('formidable');
const { sendJSON, sendError } = require('../utils/responseHelper');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');
const fs = require('fs').promises;

// Konstanta untuk limit gambar
const MAX_IMAGES = 8;

// For PUBLIC
// GET /api/products
async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    sendJSON(res, 200, products);
  } catch (error) {
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

// GET /api/products/:id
async function getProductById(req, res, id) {
  try {
    const product = await Product.findById(id);
    
    if (!product) {
      return sendError(res, 404, 'Produk tidak ditemukan');
    }
    
    sendJSON(res, 200, product);
  } catch (error) {
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

// =====================================================
// Admin Only (PROTECTED)
// POST /api/products
async function createProduct(req, res) {
  const form = formidable({ multiples: true, maxFileSize: 5 * 1024 * 1024 }); // Max 5MB

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return sendError(res, 400, 'Error parsing form: ' + err.message);
      }

      // 'fields' dari formidable mengembalikan array untuk setiap field
      const name = fields.name ? fields.name[0] : undefined;
      const slug = fields.slug ? fields.slug[0] : undefined;
      const category = fields.category ? fields.category[0] : undefined;
      const description = fields.description ? fields.description[0] : undefined;
      const startPrice = fields.startPrice ? fields.startPrice[0] : undefined;

      // Validate Input
      if (!name || !slug || !category || !description || !startPrice) {
        return sendError(res, 400, 'Semua field wajib diisi');
      }

      // Upload Img to Cloudinary
      const imageUrls = [];
      if (files.images) { 
        const imageFiles = Array.isArray(files.images) ? files.images : [files.images];

        // Validasi jumlah gambar
        if (imageFiles.length > MAX_IMAGES) {
          return sendError(res, 400, `Maksimal ${MAX_IMAGES} gambar yang dapat diupload`);
        }

        for (const file of imageFiles) {
          if (file && file.filepath) {
            const fileBuffer = await fs.readFile(file.filepath);
            const url = await uploadToCloudinary(fileBuffer, 'products');
            imageUrls.push(url);
          }
        }
      }

      if (imageUrls.length === 0) {
        return sendError(res, 400, 'Minimal 1 gambar harus diupload');
      }

      // Save to DB
      const newProduct = new Product({
        name,
        slug,
        images: imageUrls,
        category,
        description,
        startPrice: Number(startPrice)
      });

      const savedProduct = await newProduct.save();
      sendJSON(res, 201, savedProduct);

    } catch (error) {
      sendError(res, 500, 'Server Error: ' + error.message);
    }
  });
}

// PUT /api/products/:id
async function updateProduct(req, res, id) {
  const form = formidable({ multiples: true, maxFileSize: 5 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return sendError(res, 400, 'Error parsing form: ' + err.message);
      }

      const product = await Product.findById(id);
      if (!product) {
        return sendError(res, 404, 'Produk tidak ditemukan');
      }

      const name = fields.name ? fields.name[0] : undefined;
      const slug = fields.slug ? fields.slug[0] : undefined;
      const category = fields.category ? fields.category[0] : undefined;
      const description = fields.description ? fields.description[0] : undefined;
      const startPrice = fields.startPrice ? fields.startPrice[0] : undefined;

      // Update fields
      if (name) product.name = name;
      if (slug) product.slug = slug;
      if (category) product.category = category;
      if (description) product.description = description;
      if (startPrice) product.startPrice = Number(startPrice);

      // ========== LOGIKA BARU UNTUK UPDATE GAMBAR ==========
      
      // 1. Ambil existingImages dari form (URL gambar yang ingin dipertahankan)
      let existingImages = [];
      if (fields.existingImages) {
        // existingImages bisa berupa string JSON array
        const existingImagesRaw = fields.existingImages[0];
        try {
          existingImages = JSON.parse(existingImagesRaw);
          // Pastikan hasilnya array
          if (!Array.isArray(existingImages)) {
            existingImages = [];
          }
        } catch (parseError) {
          console.error('Error parsing existingImages:', parseError);
          existingImages = [];
        }
      }

      // 2. Upload gambar baru (jika ada)
      const newImageUrls = [];
      const imageFiles = files.images;
      if (imageFiles) {
        const filesToUpload = Array.isArray(imageFiles) ? imageFiles : [imageFiles];

        for (const file of filesToUpload) {
          if (file && file.filepath) {
            const fileBuffer = await fs.readFile(file.filepath);
            const url = await uploadToCloudinary(fileBuffer, 'products');
            newImageUrls.push(url);
          }
        }
      }

      // 3. Gabungkan: existingImages + newImageUrls
      const combinedImages = [...existingImages, ...newImageUrls];

      // 4. Validasi maksimal gambar
      if (combinedImages.length > MAX_IMAGES) {
        // Rollback: hapus gambar baru yang baru saja diupload
        for (const newUrl of newImageUrls) {
          await deleteFromCloudinary(newUrl);
        }
        return sendError(res, 400, `Maksimal ${MAX_IMAGES} gambar. Saat ini ada ${existingImages.length} gambar lama dan ${newImageUrls.length} gambar baru.`);
      }

      // 5. Validasi minimal 1 gambar
      if (combinedImages.length === 0) {
        return sendError(res, 400, 'Produk harus memiliki minimal 1 gambar');
      }

      // 6. Hapus gambar lama yang tidak ada di existingImages
      const imagesToDelete = product.images.filter(oldUrl => !existingImages.includes(oldUrl));
      for (const imageUrl of imagesToDelete) {
        await deleteFromCloudinary(imageUrl);
      }

      // 7. Update product images dengan gabungan baru
      product.images = combinedImages;

      const updatedProduct = await product.save();
      sendJSON(res, 200, updatedProduct);

    } catch (error) {
      sendError(res, 500, 'Server Error: ' + error.message);
    }
  });
}

// DELETE /api/products/:id
async function deleteProduct(req, res, id) {
  try {
    const product = await Product.findById(id);
    
    if (!product) {
      return sendError(res, 404, 'Produk tidak ditemukan');
    }

    // Delete the image from Cloudinary
    for (const imageUrl of product.images) {
      await deleteFromCloudinary(imageUrl);
    }

    // Delete the product from database
    await Product.findByIdAndDelete(id);

    sendJSON(res, 200, { message: 'Produk berhasil dihapus' });

  } catch (error) {
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
