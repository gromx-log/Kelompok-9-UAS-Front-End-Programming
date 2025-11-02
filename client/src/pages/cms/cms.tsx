import React from 'react';
import Head from 'next/head';
import { FaChartBar, FaShoppingBag } from 'react-icons/fa';
import CmsLayout from '../../components/cmsLayout'; 

export default function CmsDashboardPage() {
  return (
    <CmsLayout>
      <Head>
        <title>Dashboard - KartiniAle CMS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="container-fluid p-4">
        {/* Header Dashboard */}
        <h1 className="display-5 fw-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Dashboard
        </h1>

        {/* Kartu Statistik */}
        <div className="row g-4 mb-5">
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex align-items-center">
                <span className="me-3"> 
                  <FaShoppingBag size={30} color="var(--color-accent)" />
                </span>
                <div>
                  <h5 className="card-title text-muted mb-1">Pesanan Baru (24 Jam)</h5>
                  <p className="card-text h3 fw-bold">7</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex align-items-center">
                <span className="me-3"> 
                  <FaChartBar size={30} color="var(--color-accent)" />
                </span>
                <div>
                  <h5 className="card-title text-muted mb-1">Total Produk</h5>
                  <p className="card-text h3 fw-bold">15</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex align-items-center">
                <span className="h2 me-3 mb-0" style={{ color: 'var(--color-accent)' }}>✉️</span>
                <div>
                  <h5 className="card-title text-muted mb-1">Pesan Masuk</h5>
                  <p className="card-text h3 fw-bold">3</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Tambahan */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-transparent border-0 pt-4 px-4">
            <h3 className="fw-bold">Pesanan Terbaru</h3>
          </div>
          <div className="card-body p-4">
            <p className="text-muted">Tabel pesanan terbaru akan muncul di sini...</p>
            
          </div>
        </div>

      </div>
    </CmsLayout>
  );
}
