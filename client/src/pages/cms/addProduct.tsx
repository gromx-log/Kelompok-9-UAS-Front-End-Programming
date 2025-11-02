import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CmsLayout from '../../components/cmsLayout'; 
import { FaUpload } from 'react-icons/fa';

export default function CmsAddProductPage() {
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

        <div className="row g-4">
          <div className="col-lg-8">
            {/* Card Informasi Produk */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-transparent border-0 pt-4 px-4">
                <h3 className="fw-bold">Informasi Produk</h3>
              </div>
              <div className="card-body p-4">
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label fw-bold">Nama Produk</label>
                  <input type="text" className="form-control" id="productName" placeholder="Contoh: Kue Kustom Unicorn" />
                </div>
                <div className="mb-3">
                  <label htmlFor="productCategory" className="form-label fw-bold">Kategori</label>
                  <select className="form-select" id="productCategory">
                    <option value="">Pilih Kategori...</option>
                    <option value="kue-ulang-tahun">Kue Ulang Tahun</option>
                    <option value="kue-kustom">Kue Kustom</option>
                    <option value="dessert-box">Dessert Box</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="productDesc" className="form-label fw-bold">Deskripsi Produk</label>
                  <textarea className="form-control" id="productDesc" rows={5} placeholder="Jelaskan detail produk..."></textarea>
                </div>
              </div>
            </div>

            {/* Card Informasi Penjualan */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent border-0 pt-4 px-4">
                <h3 className="fw-bold">Informasi Penjuran</h3>
              </div>
              <div className="card-body p-4">
                <div className="mb-3">
                  <label htmlFor="productPrice" className="form-label fw-bold">Harga</label>
                  <div className="input-group">
                    <span className="input-group-text">Rp</span>
                    <input type="number" className="form-control" id="productPrice" placeholder="Contoh: 350000" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan (Upload & Preview) */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent border-0 pt-4 px-4">
                <h3 className="fw-bold">Foto Produk</h3>
              </div>
              <div className="card-body p-4 text-center">
                <div className="cms-upload-box">
                  <span className="text-muted">
                    <FaUpload size={40} />
                  </span>                  
                  <p className="mt-3 text-muted">Klik untuk upload foto (1:1)</p>
                </div>
                <small className="text-muted">Rasio 1:1, maks. 2MB, format JPG/PNG</small>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi di Bawah */}
        <div className="mt-4 pt-4 border-top d-flex justify-content-end gap-3">
          <button type="button" className="btn btn-outline-secondary btn-lg">Batal</button>
          <button type="button" className="btn btn-primary btn-lg cms-btn-accent">Simpan & Tampilkan</button>
        </div>
      </div>
    </CmsLayout>
  );
}