'use client'; 
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import CmsLayout from '../cmslayout';
import api from '../../../lib/api'; 

interface Product {
  _id: string; 
  name: string;
  startPrice: number; 
  category: string;
  images: string[]; 
}

export default function CmsProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/api/products'); 
        setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Anda yakin ingin menghapus produk ini?')) {
      try {
        await api.delete(`/api/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (error) {
        alert("Gagal menghapus produk.");
      }
    }
  };

  return (
    <CmsLayout>
      <Head>
        <title>Manajemen Produk - KartiniAle CMS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="container-fluid p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-5 fw-bold" style={{ color: 'var(--color-text)' }}>
            Produk Saya
          </h1>
          <Link href="/cms/addProduct" className="btn btn-primary btn-lg cms-btn-accent">
            <span className="me-2"><FaPlus /></span>
            Tambah Produk Baru
          </Link>
        </div>

        {/* Nav Tab */}
        <ul className="nav nav-tabs cms-tabs mb-4">
          <li className="nav-item">
            <a className="nav-link active" href="#">Semua ({products.length})</a>
          </li>
        </ul>

        {/* Tabel Manajemen Produk */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle" style={{ minWidth: '700px' }}>
                <thead className="table-light">
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="text-center p-5">Memuat data produk...</td></tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <Image
                            // Ambil gambar pertama dari array
                            src={product.images[0] || 'https://picsum.photos/seed/placeholder/80/80'}
                            alt={product.name} width={80} height={80}
                            className="rounded" style={{ objectFit: 'cover' }}
                          />
                        </td>
                        <td className="fw-bold">{product.name}</td>
                        <td>{product.category}</td>
                        <td>{`Rp ${product.startPrice.toLocaleString('id-ID')}`}</td>
                        <td>
                          <Link href={`/cms/products/edit/${product._id}`} passHref
                                className="btn btn-outline-secondary btn-sm me-2" title="Edit">
                              <FaEdit />
                          </Link>
                          <button 
                            className="btn btn-outline-danger btn-sm" 
                            title="Hapus"
                            onClick={() => handleDelete(product._id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CmsLayout>
  );
}