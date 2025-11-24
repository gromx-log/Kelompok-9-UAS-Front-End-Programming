const mongoose = require('mongoose');

// Product Schema akan jadi schema yang digunakan untuk menampilkan
// kue, pada bagian galeri, dan kemungkinan akan dipakai
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    images: [{ type: String, required: true }],
    category: {
        type: String,
        required: true,
        // TODO: Kategori Kue: MOHON DIGANTI SESUAI KEBUTUHAN
        enum: ['Anak', 'Dewasa', 'Hobby','Lainnya']
    },
    description: { type: String, required: true },
    startPrice: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);
