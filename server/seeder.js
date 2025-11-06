const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Muat .env
dotenv.config();

// Impor model kita
const Product = require('./models/productModel');

// -----------------------------------------------------------------
// DATA DUMMY (SESUAIKAN DENGAN IMAJINASIMU)
//
// Catatan: 'images' adalah placeholder. Tim Frontend harus
// menaruh gambar asli di 'client/public/images/placeholders/...'
// agar ini berfungsi di UI nanti.
// -----------------------------------------------------------------
const products = [
  {
    name: "Kue Fondant Spiderman",
    slug: "kue-fondant-spiderman",
    images: ["/images/placeholders/kue-spiderman.jpg"],
    category: "Anak",
    description: "Kue custom tema Spiderman dengan base cake Ogura yang lembut.",
    startPrice: 450000
  },
  {
    name: "Kue Elegant 2-Tingkat",
    slug: "kue-elegant-2-tingkat",
    images: ["/images/placeholders/kue-wedding.jpg"],
    category: "Dewasa",
    description: "Kue 2 tingkat minimalis, cocok untuk lamaran atau wedding.",
    startPrice: 1200000
  },
  {
    name: "Kue Tema Basket NBA",
    slug: "kue-tema-basket-nba",
    images: ["/images/placeholders/kue-basket.jpg"],
    category: "Olahraga",
    description: "Kue custom tema bola basket, bisa request tim favorit.",
    startPrice: 600000
  },
  {
    name: "Kue Tema Gitar Akustik",
    slug: "kue-tema-gitar-akustik",
    images: ["/images/placeholders/kue-gitar.jpg"],
    category: "Musik",
    description: "Kue dengan figurin gitar handmade, base Lapis Surabaya.",
    startPrice: 750000
  },
  {
    name: "Kue Ulang Tahun Anak (CARS)",
    slug: "kue-ultah-anak-cars",
    images: ["/images/placeholders/kue-cars.jpg"],
    category: "Anak",
    description: "Kue tema Lightning McQueen dari film CARS.",
    startPrice: 550000
  }
];

// -----------------------------------------------------------------
// FUNGSI SCRIPT
// -----------------------------------------------------------------

// Fungsi untuk terhubung ke DB (khusus untuk script ini)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Terhubung untuk Seeding...');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

// Fungsi untuk memasukkan data
const importData = async () => {
  try {
    // 1. Hapus semua data produk yang ada
    await Product.deleteMany();

    // 2. Masukkan data dummy yang baru
    await Product.insertMany(products);

    console.log('Data Berhasil Ditambahkan! 🌱');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Keluar dengan error
  }
};

// Fungsi untuk menghapus data
const destroyData = async () => {
  try {
    // Hapus semua data produk
    await Product.deleteMany();

    console.log('Data Berhasil Dihapus! 🗑️');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// -----------------------------------------------------------------
// LOGIKA UNTUK MENJALANKAN SCRIPT
// -----------------------------------------------------------------

// Hubungkan ke DB dulu
connectDB().then(() => {
  // Cek apakah ada argumen '-d' (untuk destroy)
  if (process.argv[2] === '-d') {
    destroyData();
  } else {
    // Jika tidak, jalankan import
    importData();
  }
});