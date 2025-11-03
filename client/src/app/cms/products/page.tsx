import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import CmsLayout from '../cmslayout'; 

export const metadata = {
  title: 'Manajemen Produk - KartiniAle CMS',
  robots: 'noindex, nofollow',
};

// Data dummy 
interface Product {
  id: number; name: string; price: string; category: string; imageUrl: string;
}
const dummyProducts: Product[] = [
  { id: 1, name: 'Red Velvet Classic', price: 'Rp 250.000', category: 'Kue Ulang Tahun', imageUrl: 'https://picsum.photos/seed/ogura/80/80' },
  { id: 2, name: 'Unicorn Rainbow', price: 'Rp 350.000', category: 'Kue Ulang Tahun', imageUrl: 'https://picsum.photos/seed/lapis/80/80' },
  { id: 3, name: 'Chocolate Overload', price: 'Rp 300.000', category: 'Kue Kustom', imageUrl: 'https://picsum.photos/seed/figurine1/80/80' },
];

export default function CmsProductsPage() {
  return (
    <CmsLayout>

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
            <a className="nav-link active" href="#">Semua (3)</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Stok Habis (0)</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Disembunyikan (0)</a>
          </li>
        </ul>

        {/* Tabel Manajemen Produk */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle" style={{ minWidth: '700px' }}>
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{ width: '10%' }}>Gambar</th>
                    <th scope="col" style={{ width: '30%' }}>Nama Produk</th>
                    <th scope="col" style={{ width: '20%' }}>Kategori</th>
                    <th scope="col" style={{ width: '20%' }}>Harga</th>
                    <th scope="col" style={{ width: '20%' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <Image
                          src={product.imageUrl} alt={product.name} width={80} height={80}
                          className="rounded" style={{ objectFit: 'cover' }}
                        />
                      </td>
                      <td className="fw-bold">{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.price}</td>
                      <td>
                        <button className="btn btn-outline-secondary btn-sm me-2" title="Edit">
                          <FaEdit />
                        </button>
                        <button className="btn btn-outline-danger btn-sm" title="Hapus">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CmsLayout>
  );
}
