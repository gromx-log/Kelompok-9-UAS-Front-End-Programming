import React from 'react';
import Head from 'next/head';
import CmsLayout from '../../components/cmsLayout';

export default function CmsOrdersPage() {
  return (
    <CmsLayout>
      <Head>
        <title>Manajemen Pesanan - KartiniAle CMS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="container-fluid p-4">
        {/* Header */}
        <h1 className="display-5 fw-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Pesanan Saya
        </h1>

        {/* Nav Tab  */}
        <ul className="nav nav-tabs cms-tabs mb-4">
          <li className="nav-item">
            <a className="nav-link" href="#">Semua</a>
          </li>
          <li className="nav-item">
            <a className="nav-link active" href="#">Perlu Dikirim (1)</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Dikirim (0)</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Selesai (127)</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Dibatalkan (2)</a>
          </li>
        </ul>

        {/* Tabel Pesanan */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            {/* Placeholder for now */}
            <div className="text-center p-5">
              <span className="h1">📋</span>
              <h5 className="mt-3">Belum ada pesanan di tab ini.</h5>
              <p className="text-muted">Data pesanan akan muncul di sini.</p>
            </div>
          </div>
        </div>
      </div>
    </CmsLayout>
  );
}
