'use client'; 
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CmsLayout from '../cmslayout'; 
import { FaUpload } from 'react-icons/fa';
import api from '../../../lib/api'; 

export default function CmsAddProductPage() {
 const router = useRouter();
 const [error, setError] = useState('');
 
 // State untuk form
 const [name, setName] = useState('');
 const [category, setCategory] = useState('');
 const [startPrice, setStartPrice] = useState(0);
 const [description, setDescription] = useState('');
 
 const [imageFiles, setImageFiles] = useState<FileList | null>(null); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(e.target.files);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  // Validasi frontend (sesuai backend Anda)
  if (!name || !category || startPrice <= 0) {
   setError('Nama, Kategori, dan Harga wajib diisi.');
   return;
  }
    // Validasi gambar
    if (!imageFiles || imageFiles.length === 0) {
      setError('Minimal 1 gambar harus diupload.');
      return;
    }

    const dataToSubmit = new FormData();
  
    dataToSubmit.append('name', name);
    dataToSubmit.append('category', category);
    dataToSubmit.append('startPrice', startPrice.toString());
    dataToSubmit.append('description', description);
    
    // Buat 'slug'
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    dataToSubmit.append('slug', slug);

    // Append semua file gambar
    // Backend Anda menggunakan 'multiples: true' dan key 'images'
    for (let i = 0; i < imageFiles.length; i++) {
      dataToSubmit.append('images', imageFiles[i]);
    }

  try {
   // Kirim FormData. Axios akan otomatis mengatur Content-Type.
   await api.post('/api/products', dataToSubmit);
   
   alert('Produk baru berhasil ditambahkan!');
   router.push('/cms/products'); 

  } catch (err: any) {
   setError(err.response?.data?.message || 'Gagal menambahkan produk.');
  }
 };

 return (
  <CmsLayout>
   <Head>
    <title>Tambah Produk Baru - KartiniAle CMS</title>
    <meta name="robots" content="noindex, nofollow" />
   </Head>

   <div className="container-fluid p-4">
    <h1 className="display-5 fw-bold mb-4" style={{ color: 'var(--color-text)' }}>
     Tambah Produk Baru
    </h1>

    <form onSubmit={handleSubmit}>
     <div className="row g-4">
      {/* Kolom Form Kiri */}
      <div className="col-lg-8">
       {/* Card Informasi Produk */}
       <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-transparent border-0 pt-4 px-4">
         <h3 className="fw-bold">Informasi Produk</h3>
        </div>
        <div className="card-body p-4">
         <div className="mb-3">
          <label htmlFor="productName" className="form-label fw-bold">Nama Produk</label>
          <input 
           type="text" 
           className="form-control" 
           id="productName" 
           value={name}
           onChange={(e) => setName(e.target.value)}
           placeholder="Contoh: Kue Kustom Unicorn" 
           required
          />
         </div>
         <div className="mb-3">
          <label htmlFor="productCategory" className="form-label fw-bold">Kategori</label>
          <select 
           className="form-select" 
           id="productCategory"
           value={category}
           onChange={(e) => setCategory(e.target.value)}
           required
          >
           <option value="">Pilih Kategori...</option>
           <option value="Anak">Anak</option>
           <option value="Kue Ulang Tahun">Kue Ulang Tahun</option>
           <option value="Kue Kustom">Kue Kustom</option>
           <option value="Dessert Box">Dessert Box</option>
          </select>
         </div>
         <div className="mb-3">
          <label htmlFor="productDesc" className="form-label fw-bold">Deskripsi Produk</label>
          <textarea 
           className="form-control" 
           id="productDesc" 
           rows={5} 
           value={description}
           onChange={(e) => setDescription(e.target.value)}
           placeholder="Jelaskan detail produk..."
           required
          ></textarea>
         </div>
        </div>
       </div>

       {/* Card Informasi Penjualan */}
       <div className="card shadow-sm border-0">
        <div className="card-header bg-transparent border-0 pt-4 px-4">
         <h3 className="fw-bold">Informasi Penjualan</h3>
        </div>
        <div className="card-body p-4">
         <div className="mb-3">
          <label htmlFor="startPrice" className="form-label fw-bold">Harga Mulai (Start Price)</label>
          <div className="input-group">
           <span className="input-group-text">Rp</span>
           <input 
            type="number" 
            className="form-control" 
            id="startPrice" 
            value={startPrice}
            onChange={(e) => setStartPrice(parseFloat(e.target.value))}
            placeholder="Contoh: 350000" 
            required
           />
          </div>
         </div>
        </div>
       </div>
      </div>

      {/* Kolom Kanan (Upload & Preview) */}
      <div className="col-lg-4">
       <div className="card shadow-sm border-0">
        <div className="card-header bg-transparent border-0 pt-4 px-4">
         <h3 className="fw-bold">Foto Produk (Wajib)</h3>
        </div>
        <div className="card-body p-4">
                  <div className="mb-3">
                    <label htmlFor="images" className="form-label">Upload Gambar (Bisa lebih dari 1)</label>
                    <input 
                      className="form-control" 
                      type="file" 
                      id="images"
                      name="images" 
                      onChange={handleFileChange}
                      multiple 
                      accept="image/png, image/jpeg"
                      required 
                    />
                  </div>
                  <small className="text-muted">Maks 5MB per file.</small>
                  
                  {/* Tampilkan preview file yang dipilih */}
                  {imageFiles && imageFiles.length > 0 && (
                    <div className="mt-3">
                      <p className="text-muted mb-1">File dipilih:</p>
                      <ul className="list-group">
                        {Array.from(imageFiles).map((file, index) => (
                          <li key={index} className="list-group-item list-group-item-success">
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
        </div>
       </div>
      </div>
     </div>

     {error && <div className="alert alert-danger mt-3">{error}</div>}

     {/* Tombol Aksi di Bawah */}
     <div className="mt-4 pt-4 border-top d-flex justify-content-end gap-3">
      <Link href="/cms/products" className="btn btn-outline-secondary btn-lg">Batal</Link>
      <button type="submit" className="btn btn-primary btn-lg cms-btn-accent">Simpan & Tampilkan</button>
     </div>
    </form>
   </div>
  </CmsLayout>
 );
}