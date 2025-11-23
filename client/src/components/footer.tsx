import Link from 'next/link';
import React from 'react';
import { FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer-container" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="container pt-5 pb-4">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="footer-brand">
              KartiniAle
            </h5>
            <p className="footer-text-muted">
              Membuat setiap momen Anda lebih manis dengan kue kustom
              berkualitas premium.
            </p>
            <h6 className="footer-heading">Ikuti Kami</h6>
            <div className="d-flex gap-3">
              <a href="https://www.instagram.com/kartiniale" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://www.youtube.com/@rracake" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
                <FaYoutube />
              </a>
              <a href="https://www.tiktok.com/@kartiniale" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tiktok" viewBox="0 0 16 16">
                  <path d="M9.25 0h2.44v4.25h-2.44zM6.515 4.33c-.93 0-1.783-.3-2.474-.812v6.597c0 2.37 1.46 3.362 3.823 3.362a4 4 0 0 0 2.79-1.028v-3.814a3.256 3.256 0 0 1-2.139.808c-1.286 0-2.323-.66-2.45-2.4 0 0 .009-3.52 0-3.52a3.97 3.97 0 0 0 2.462.603v-3.32z" />
                </svg>
              </a>
                <a href="https://api.whatsapp.com/send/?phone=6282111078050&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Whatsapp">
                  <FaWhatsapp />
                </a>
            </div>
          </div>

          {/* Kategori Kue */}
          <div className="col-lg-4 col-md-6">
            <h6 className="footer-heading">Kategori Kue</h6>
            <ul className="footer-links-list">
              <li><Link href="/products/">Kue Anak</Link></li>
              <li><Link href="/products/">Kue Dewasa</Link></li>
              <li><Link href="/products/">Kue Olahraga</Link></li>
              <li><Link href="/products/">Kue Musik</Link></li>
              <li><Link href="/products/">Lainnya</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-lg-4 col-md-6">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-links-list">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/products">Produk</Link></li>
              <li><Link href="/our-cakes">Tentang Kue Kami</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/order">Pesan Sekarang</Link></li>
            </ul>
          </div>

        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="footer-copyright" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container text-center py-3">
          <p className="mb-0" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            KartiniAle © {new Date().getFullYear()} - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}