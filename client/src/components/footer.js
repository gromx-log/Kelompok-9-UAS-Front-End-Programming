import Link from 'next/link';
import { FaFacebookF, FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer-container" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="container pt-5 pb-4">
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
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
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-heading">Kategori Kue</h6>
            <ul className="footer-links-list">
              <li><Link href="/products/birthday">Kue Ulang Tahun</Link></li>
              <li><Link href="/products/wedding">Kue Pernikahan</Link></li>
              <li><Link href="/products/custom">Kue Kustom</Link></li>
              <li><Link href="/products/cupcakes">Cupcakes</Link></li>
              <li><Link href="/products/dessert-box">Dessert Box</Link></li>
              <li><Link href="/products/cookies">Cookies</Link></li>
            </ul>
          </div>

          {/* Toko Kami */}
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-heading">Toko Kami</h6>
            <div 
              className="map-placeholder"
              style={{ backgroundColor: '#E0E0E0', height: '100px', borderRadius: '8px' }}
            ></div>
            <ul className="footer-contact-list mt-3">
              <li>Jl. Cendrawasih No. 123, Jakarta</li>
              <li>+62 812 3456 7890</li>
              <li>support@KartiniAle.id</li>
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