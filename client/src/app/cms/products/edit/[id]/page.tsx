'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import CmsLayout from '../../../cmslayout'; // Sesuaikan path
import api from '../../../../../lib/api'; // Sesuaikan path

interface ProductForm {
  name: string;
  price: number;
  category: string;
  description: string;
}

export default function CmsEditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params; // Ambil [id] dari URL
  
  const [formData, setFormData] = useState<ProductForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Ambil data produk yang ada
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          // Panggil GET /api/products/:id 
          const { data } = await api.get(`/api/products/${id}`);
          setFormData({
            name: data.name,
            price: data.price,
            category: data.category,
            description: data.description || '',
          });
        } catch (err) {
          setError('Gagal mengambil data produk.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  // Handle perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      // Panggil PUT /api/products/:id (terproteksi)
      await api.put(`/api/products/${id}`, formData);
      alert('Produk berhasil diperbarui!');
      router.push('/cms/products'); // Kembali ke tabel
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
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-bold">Nama Produk</label>
                <input type="text" className="form-control" id="name" name="name"
                        value={formData?.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label fw-bold">Kategori</label>
                <select className="form-select" id="category" name="category"
                        value={formData?.category} onChange={handleChange} required>
                  <option value="">Pilih Kategori...</option>
                  <option value="Kue Ulang Tahun">Kue Ulang Tahun</option>
                  <option value="Kue Kustom">Kue Kustom</option>
                  <option value="Dessert Box">Dessert Box</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label fw-bold">Harga</label>
                <div className="input-group">
                  <span className="input-group-text">Rp</span>
                  <input type="number" className="form-control" id="price" name="price"
                          value={formData?.price} onChange={handleChange} required />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label fw-bold">Deskripsi Produk</label>
                <textarea className="form-control" id="description" name="description" rows={5}
                          value={formData?.description} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="mt-4 pt-4 border-top d-flex justify-content-end gap-3">
            <button type="button" className="btn btn-outline-secondary btn-lg" onClick={() => router.push('/cms/products')}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary btn-lg cms-btn-accent">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </CmsLayout>
  );
}