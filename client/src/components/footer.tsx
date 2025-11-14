import Link from 'next/link';
import React from 'react';
import { FaFacebookF, FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa';

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
              <a href="#" className="social-icon" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="social-icon" aria-label="YouTube">
                <FaYoutube />
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-icon" aria-label="Whatsapp">
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
              <li><Link href="/about">Tentang Kami</Link></li>
              <li><Link href="/contact">Kontak</Link></li>
              <li><Link href="/how-to-order">Cara Pesan</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/login">Login / Daftar</Link></li>
              <li><Link href="/cart">Keranjang</Link></li>
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