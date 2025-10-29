import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div
        className="container-fluid"
        style={{
          backgroundColor: 'var(--color-primary)', 
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold fade-in-up delay-1">
            Kue Kustom Sesuai Keinginan Anda
          </h1>
          <p className="lead col-lg-8 mx-auto fade-in-up delay-2">
            Dari ulang tahun hingga pernikahan, kami siap membuatkan kue impian Anda
            dengan bahan-bahan premium dan rasa yang tak terlupakan.
          </p>
          <div className="fade-in-up delay-3">
            <Link href="/products" legacyBehavior>
              <a className="btn btn-light btn-lg mt-3">Lihat Katalog Kami</a>
            </Link>
          </div>
        </div>

        {/* Indikator Scroll Down */}
        <div className="scroll-down-arrow"></div>
      </div>

      {/* Featured Products Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Produk Unggulan</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="text-center p-5 rounded" style={{backgroundColor: 'var(--color-bg-light)', border: '1px solid #eee'}}>Produk Unggulan 1</div>
          </div>
          <div className="col-md-4">
            <div className="text-center p-5 rounded" style={{backgroundColor: 'var(--color-bg-light)', border: '1px solid #eee'}}>Produk Unggulan 2</div>
          </div>
          <div className="col-md-4">
            <div className="text-center p-5 rounded" style={{backgroundColor: 'var(--color-bg-light)', border: '1px solid #eee'}}>Produk Unggulan 3</div>
          </div>
        </div>
      </div>
    </>
  );
}