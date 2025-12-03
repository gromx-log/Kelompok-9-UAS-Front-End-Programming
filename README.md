# Kelompok-9-UAS-Front-End-Programming
Sebuah repository sederhana yang akan menyimpan hasil dari projek UTS mata kuliah Front End Programming

Berikut adalah penjelasan lengkap dan langsung mengenai fungsi setiap folder utama dalam struktur proyek kita.

## Penjelasan Struktur Folder Backend (/server)
Backend ini dirancang dengan pola yang memisahkan antara definisi rute (URL), logika bisnis, dan struktur data.

/models: Folder ini adalah cetak biru (blueprint) data kita. Setiap file di dalamnya (misal, productModel.js) mendefinisikan sebuah Schema menggunakan Mongoose. Schema ini menentukan struktur dokumen yang akan disimpan di database MongoDB, termasuk tipe data (String, Number, dll.), validasi, dan nilai default.

/routes: Folder ini berfungsi sebagai peta URL atau endpoint API kita. Setiap file di sini (misal, productRoutes.js) mendefinisikan URL yang bisa diakses oleh frontend. File ini memetakan setiap URL dan metode HTTP (GET, POST, PUT, DELETE) ke fungsi controller yang sesuai.

/controllers: Folder ini adalah otak dari backend. File di dalam controllers (misal, productController.js) berisi fungsi-fungsi yang mengeksekusi logika bisnis. Ketika sebuah route diakses, fungsi di controller inilah yang akan dipanggil untuk memproses permintaan, berinteraksi dengan model untuk mengambil atau menyimpan data ke database, dan mengirimkan kembali respons (biasanya dalam format JSON) ke frontend.

/middlewares: Folder ini berisi fungsi-fungsi perantara atau penjaga gerbang. Sebuah middleware adalah kode yang dieksekusi setelah server menerima permintaan tetapi sebelum permintaan itu sampai ke controller. Fungsinya antara lain untuk otentikasi (memeriksa token login), otorisasi (memeriksa hak akses pengguna), validasi input, atau logging.

/config: Folder ini digunakan untuk menyimpan file-file konfigurasi, seperti logika untuk koneksi ke database (db.js). Memisahkan konfigurasi di sini membuat file utama server lebih bersih.

index.js: Ini adalah titik masuk (entry point) aplikasi backend. File ini bertanggung jawab untuk:

Menginisialisasi aplikasi Express.

Menerapkan middlewares global (seperti cors dan express.json).

Menghubungkan aplikasi ke semua file di folder /routes.

Menjalankan koneksi ke database.

Membuka port dan memulai server agar bisa menerima permintaan.

Alur Kerja Backend:
Frontend mengirim request ke URL -> Routes menangkap URL dan memanggil fungsi yang sesuai -> Middlewares (jika ada) melakukan validasi -> Controllers menjalankan logika, berinteraksi dengan Models -> Models berinteraksi dengan Database -> Controllers mengirim respons kembali ke frontend.

## Penjelasan Struktur Folder Frontend (/client/src)
Frontend ini menggunakan struktur bawaan Next.js (dengan Pages Router) yang diperkaya dengan folder untuk organisasi kode yang lebih baik.

/pages: Ini adalah folder inti untuk routing di Next.js. Setiap file React di sini secara otomatis menjadi sebuah halaman atau rute pada website.

index.js menjadi halaman utama (/).

products.js menjadi halaman (/products).

Folder /api di dalamnya adalah fitur Next.js untuk membuat serverless functions, namun tidak kita gunakan secara ekstensif karena kita punya backend terpisah.

_app.js adalah file global yang membungkus semua halaman, ideal untuk menempatkan layout, provider, dan CSS global.

/components: Folder ini berisi komponen UI yang dapat digunakan kembali. Semua elemen seperti tombol, form input, kartu produk, navbar, dan footer ditempatkan di sini. Tujuannya adalah untuk menghindari duplikasi kode dan menjaga agar kode di dalam /pages tetap bersih dan fokus pada tata letak halaman.

/styles: Folder ini berisi semua file styling. globals.css digunakan untuk gaya global yang berlaku di seluruh aplikasi, sementara CSS Modules (*.module.css) digunakan untuk gaya yang cakupannya hanya berlaku pada komponen tertentu.

/lib atau /utils: Folder ini untuk menyimpan fungsi-fungsi non-UI (helper functions). Contohnya adalah fungsi untuk memformat tanggal, mengelola cookie, atau membuat satu file terpusat (api.js) yang berisi semua logika untuk melakukan panggilan ke backend API kita. OK

/public: Folder ini berada di luar /src dan berfungsi untuk menyimpan aset statis seperti gambar, ikon, dan font. File di sini dapat diakses langsung dari URL root website.
