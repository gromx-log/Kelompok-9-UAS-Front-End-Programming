'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import CTA from '../components/callToAction';
import Footer from '../components/footer';

export default function Home() {
  // state buat flip gambar
  const [isFlipped, setIsFlipped] = useState(false)

  const handleImageFlip = () => {
    setIsFlipped(!isFlipped);
  }

  return (
    <>
      <Navbar/>
      {/* HERO SECTION */}
      <section className="hero-illustration-section">
        <div className="container">
          <div className="row align-items-center g-5 py-5">
            
            {/* Teks (Kiri) */}
            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="display-4 fw-bold fade-in-up delay-1">
                Wujudkan Kue Impianmu Bersama Kartiniale
              </h1>
              <p 
                className="lead col-lg-10 fs-4 fade-in-up delay-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Spesialis kue custom dengan base cake Ogura dan Lapis Surabaya Premium.
              </p>
              <div className="fade-in-up delay-3">
                <Link href="/products" className="btn btn-primary btn-lg mt-3" style={{ padding: '0.75rem 2rem' }}>
                    Lihat Katalog Kami
                </Link>
              </div>
            </div>

            {/* Ilustrasi (Kanan) */}
            <div className="col-lg-6 fade-in-up delay-2">
              <Image 
                src="/birthday_girl.svg" 
                alt="Ilustrasi Kue Ulang Tahun Kartiniale"
                width={600}
                height={500}
                style={{ width: '100%', height: 'auto' }}
                priority 
              />
            </div>

          </div>
        </div>
      </section>

      {/* KUALITAS SECTION */}
      <section className="py-5" style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            
            {/* Teks Kiri */}
            <div className="col-lg-6 fade-in-up">
              <h2 className="display-5 fw-bold mb-3">Base Cake Premium</h2>
              <p className="lead fs-5 mb-4" style={{ color: 'var(--color-text-muted)' }}>
                Kami percaya rasa adalah fondasi utama. Semua kue kami dibuat
                fresh to order menggunakan bahan terbaik:
              </p>
              <ul className="list-unstyled fs-5 value-prop-list">
                <li>
                  <strong>Ogura Cake:</strong> Tekstur selembut kapas, ringan, dan tidak seret.
                </li>
                <li>
                  <strong>Lapis Surabaya:</strong> Resep premium 40 kuning telur dengan 100% butter Wijsman.
                </li>
              </ul>
              <Link href="/our-cakes" className="btn btn-primary mt-3">
                  Lihat Selengkapnya
              </Link>
            </div>

            {/* Gambar Kanan*/}
            <div className="col-lg-6 fade-in-up delay-1">
              <div className="flip-card-container" onClick={handleImageFlip}>
                <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                  
                  {/* Sisi Depan (Ogura) */}
                  <div className="flip-card-front">
                    <Image 
                      src="https://picsum.photos/seed/ogura/600/500" // foto ogura
                      width={600} 
                      height={500} 
                      className="img-fluid" 
                      alt="Kue Ogura (Klik untuk ganti)" 
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Sisi Belakang (Lapis Surabaya) */}
                  <div className="flip-card-back">
                    <Image 
                      src="https://picsum.photos/seed/lapis/600/500" // foto lapis surabaya
                      width={600} 
                      height={500} 
                      className="img-fluid" 
                      alt="Kue Lapis Surabaya (Klik untuk ganti)" 
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                </div>
              </div>
              <p className="text-center text-muted mt-2">
                <i className="bi bi-arrow-repeat"></i> Klik gambar untuk melihat base cake lainnya
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KEAHLIAN SECTION */}
      <section className="py-5" style={{ backgroundColor: 'var(--color-bg)' }}> 
        <div className="container">
          <div className="row g-5 align-items-center">
            {/* gambar kiri */}
            <div className="col-lg-6 fade-in-up">
              <div className="row g-3">
                <div className="col-6">
                  <Image 
                    src="https://picsum.photos/seed/figurine1/400/400" 
                    width={400} 
                    height={400} 
                    className="img-fluid rounded shadow-sm" 
                    alt="Figurin Fondant 1" 
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  />
                </div>
                <div className="col-6">
                  <Image 
                    src="https://picsum.photos/seed/figurine2/400/400" 
                    width={400} 
                    height={400} 
                    className="img-fluid rounded shadow-sm" 
                    alt="Figurin Fondant 2" 
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            </div>

            {/* Teks Kanan */}
            <div className="col-lg-6 fade-in-up delay-1">
              <h2 className="display-5 fw-bold mb-3">Dekorasi Fondant Handmade</h2>
              <p className="lead fs-5 mb-4" style={{ color: 'var(--color-text-muted)' }}>
                Setiap figurin dan hiasan kami buat 100% dengan tangan (handmade).
                Kami tidak menggunakan topper mainan, memastikan seluruh kue Anda
                adalah karya seni yang personal.
              </p>
              {/* Tombol CTA untuk ke galeri */}
              <Link href="/products" className="btn btn-outline-primary mt-3">
                  Lihat Galeri Kami
              </Link>
            </div>

          </div>
        </div>
      </section>

      <CTA/>
      <Footer/>
    </>
  );
}