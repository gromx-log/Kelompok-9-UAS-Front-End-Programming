/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter, useParams } from 'next/navigation'; 
import CmsLayout from '../../../cmslayout';
import api from '../../../../../lib/api';
import Link from 'next/link';

interface ProductForm {
 name: string;
 startPrice: number;
 category: string;
 description: string;
 images: string[];
}

interface ExistingImage {
 url: string;
}

export default function CmsEditProductPage() {
 const router = useRouter();
 const params = useParams(); 
 const id = Array.isArray(params.id) ? params.id[0] : params.id; 
 
 const [formData, setFormData] = useState<ProductForm | null>(null);
 const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
 const [imageFile, setImageFile] = useState<File | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');

 useEffect(() => {
  if (id) {
   const fetchProduct = async () => {
    try {
     const { data } = await api.get(`https://kelompok-9-uas-front-end-programming-production.up.railway.app/api/products/${id}`);
     setFormData({
      name: data.name,
      startPrice: data.startPrice,
      category: data.category,
      description: data.description || '',
      images: data.images || [],
     });
     setExistingImages((data.images || []).map((url: string) => ({ url })));
    } catch (err) {
     setError('Gagal mengambil data produk.');
    } finally {
     setLoading(false);
    }
   };
   fetchProduct();
  }
 }, [id]);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  if (formData) {
   const { name, value } = e.target;
   setFormData({
    ...formData,
    [name]: name === 'startPrice' ? parseFloat(value) : value,
   });
  }
 };

 // Handle perubahan file
 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
   setImageFile(e.target.files[0]);
  }
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData) return;

  const dataToSubmit = new FormData();

    // Append data teks
  dataToSubmit.append('name', formData.name);
  dataToSubmit.append('category', formData.category);
  dataToSubmit.append('startPrice', formData.startPrice.toString());
  dataToSubmit.append('description', formData.description);

    // 'slug' opsional di update, tapi kita update juga agar konsisten
  const slug = formData.name.toLowerCase().replace(/\s+/g, '-');
  dataToSubmit.append('slug', slug);

    // Append existingImages sebagai JSON string
  dataToSubmit.append('existingImages', JSON.stringify(existingImages.map(img => img.url)));

    // Append file gambar HANYA jika ada file baru dipilih
  if (imageFile) {
   dataToSubmit.append('images', imageFile);
  }

  try {
      // Panggil API dengan FormData
   await api.put(`https://kelompok-9-uas-front-end-programming-production.up.railway.app/api/products/${id}`, dataToSubmit); 
   alert('Produk berhasil diperbarui!');
   router.push('/cms/products'); 
  } catch (err: any) {
   setError(err.response?.data?.message || 'Gagal memperbarui produk.');
  }
 };

 if (loading) {
  return <CmsLayout><div className="container p-4">Memuat data...</div></CmsLayout>;
 }
 
 if (error && !formData) {
  return <CmsLayout><div className="container p-4"><p className="text-danger">{error}</p></div></CmsLayout>;
 }

 return (
  <CmsLayout>
   <Head>
    <title>Edit Produk - KartiniAle CMS</title>
   </Head>
   <div className="container-fluid p-4">
    <h1 className="display-5 fw-bold mb-4" style={{ color: 'var(--color-text)' }}>
     Edit Produk: {formData?.name}
    </h1>

    <form onSubmit={handleSubmit}>
     <div className="row g-4">
      <div className="col-lg-8">
       {/* Card Informasi Produk */}
       <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
         <div className="mb-3">
          <label htmlFor="name" className="form-label fw-bold">Nama Produk</label>
          <input type="text" className="form-control" id="name" name="name"
            value={formData?.name || ''} onChange={handleChange} required />
         </div>
         <div className="mb-3">
          <label htmlFor="category" className="form-label fw-bold">Kategori</label>
          <select className="form-select" id="category" name="category"
            value={formData?.category || ''} onChange={handleChange} required>
           <option value="">Pilih Kategori...</option>
           <option value="Anak">Anak</option> 
           <option value="Dewasa">Dewasa</option>
           <option value="Hobby">Hobby</option>
           <option value="Lainnya">Lainnya</option>
          </select>
         </div>
         <div className="mb-3">
          <label htmlFor="startPrice" className="form-label fw-bold">Harga Mulai (Start Price)</label>
          <div className="input-group">
           <span className="input-group-text">Rp</span>
           <input type="number" className="form-control" id="startPrice" name="startPrice"
              value={formData?.startPrice || 0} onChange={handleChange} required />
          </div>
         </div>
         <div className="mb-3">
          <label htmlFor="description" className="form-label fw-bold">Deskripsi Produk</label>
          <textarea className="form-control" id="description" name="description" rows={5}
             value={formData?.description || ''} onChange={handleChange}></textarea>
         </div>
        </div>
       </div>
      </div>

      {/* Kolom Kanan untuk Upload Gambar */}
      <div className="col-lg-4">
       <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-transparent border-0 pt-4 px-4">
         <h3 className="fw-bold">Gambar Produk</h3>
        </div>
        <div className="card-body p-4">
         {/* Tampilkan gambar yang sudah ada */}
         {existingImages.length > 0 && (
          <div className="mb-3">
           <h5>Gambar Saat Ini:</h5>
           <div className="d-flex flex-wrap gap-2">
            {existingImages.map((img, index) => (
             <div key={index} className="position-relative">
              <img
               src={img.url}
               alt={`Gambar ${index + 1}`}
               style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <button
               type="button"
               className="btn btn-sm btn-danger position-absolute top-0 end-0"
               style={{ fontSize: '10px', padding: '2px 4px' }}
               onClick={() => setExistingImages(existingImages.filter((_, i) => i !== index))}
              >
               ×
              </button>
             </div>
            ))}
           </div>
          </div>
         )}

         <h5>Tambah Gambar Baru (Opsional):</h5>
         <p className="text-muted">Upload gambar baru untuk menambah atau mengganti gambar yang ada.</p>
         <input
          type="file"
          className="form-control"
          id="images"
          name="images"
          onChange={handleFileChange}
          accept="image/png, image/jpeg"
         />
         {imageFile && (
          <p className="mt-2 text-success">File dipilih: {imageFile.name}</p>
         )}
        </div>
       </div>
      </div>
     </div>
     
     {error && <div className="alert alert-danger">{error}</div>}
     
     <div className="mt-4 pt-4 border-top d-flex justify-content-end gap-3">
      <Link href="/cms/products" className="btn btn-outline-secondary btn-lg">Batal</Link>
      <button type="submit" className="btn btn-primary btn-lg cms-btn-accent">Simpan Perubahan</button>
     </div>
    </form>
   </div>
  </CmsLayout>
 );
}
