import Link from 'next/link';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`
        navbar navbar-expand-lg fixed-top navbar-light
        ${isScrolled 
          ? 'bg-light shadow-sm scrolled navbar-small' 
          : 'bg-transparent navbar-large'
        }
      `}
    >
      <div className="container">
        <Link href="/" legacyBehavior>
          <a className="navbar-brand" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
            KartiniAle
          </a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            
            {/* 3. Terapkan Logika Dinamis */}
            <li className="nav-item">
              <Link href="/" legacyBehavior>
                <a 
                  className={`nav-link ${router.pathname === '/' ? 'active' : ''}`} 
                  aria-current={router.pathname === '/' ? 'page' : undefined}
                >
                  Home
                </a>
              </Link>
            </li>
            
            {/* Page Product */}
            <li className="nav-item">
              <Link href="/products" legacyBehavior>
                <a 
                  className={`nav-link ${router.pathname.startsWith('/products') ? 'active' : ''}`}
                  aria-current={router.pathname.startsWith('/products') ? 'page' : undefined}
                >
                  Produk
                </a>
              </Link>
            </li>
            
            {/* Page Galeri */}
            <li className="nav-item">
              <Link href="/gallery" legacyBehavior>
                <a
                  className={`nav-link ${router.pathname === '/gallery' ? 'active' : ''}`}
                  aria-current={router.pathname === '/gallery' ? 'page' : undefined}
                >
                  Galeri
                </a>
              </Link>
            </li>

            {/* Page Our Cakes */}
            <li className="nav-item">
              <Link href="/our-cakes" legacyBehavior>
                <a 
                  className={`nav-link ${router.pathname === '/our-cakes' ? 'active' : ''}`}
                >
                  Tentang Kue Kami
                </a>
              </Link>
            </li>

            {/* Page FAQ */}
            <li className="nav-item">
              <Link href="/faq" legacyBehavior>
                <a 
                  className={`nav-link ${router.pathname === '/faq' ? 'active' : ''}`}
                >
                  FAQ
                </a>
              </Link>
            </li>

            {/* CTA */}
            <li className="nav-item ms-lg-3">
              <Link href="/order" legacyBehavior>
                <a className="btn btn-primary">
                  Pesan Sekarang
                </a>
              </Link>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
  );
}