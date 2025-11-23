import Link from 'next/link';
import React from 'react';
import { FaYoutube, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';

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
                <FaTiktok/>
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
              <li><Link href="/products?category=Anak">Kue Anak</Link></li>
              <li><Link href="/products?category=Dewasa">Kue Dewasa</Link></li>
              <li><Link href="/products?category=Hobby">Kue Hobby</Link></li>
              <li><Link href="/products?category=Lainnya">Lainnya</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-lg-4 col-md-6">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-links-list">
              <li><Link href="/our-cakes">Tentang Kue Kami</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/order">Pesan</Link></li>
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