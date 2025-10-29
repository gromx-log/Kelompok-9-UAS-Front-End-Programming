import Link from 'next/link';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'; // <-- 1. IMPORT NEXT/IMAGE

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
        ${
          isScrolled
            ? 'bg-light shadow-sm scrolled navbar-small'
            : 'bg-transparent navbar-large'
        }
      `}
    >
      <div className="container">
        <Link href="/" legacyBehavior>
          <a className="navbar-brand d-flex align-items-center">
            <Image
              src="/KartiniAle.png" // 
              alt="KartiniAle Logo"
              width={90} 
              height={90} 
              className="me-2" 
            />
            <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>
              KartiniAle
            </span>

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
                  className={`nav-link ${
                    router.pathname === '/' ? 'active' : ''
                  }`}
                  aria-current={router.pathname === '/' ? 'page' : undefined}
                >
                  Home
                </a>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/products" legacyBehavior>
                <a
                  className={`nav-link ${
                    router.pathname.startsWith('/products') ? 'active' : ''
                  }`}
                  aria-current={
                    router.pathname.startsWith('/products') ? 'page' : undefined
                  }
                >
                  Produk
                </a>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/cart" legacyBehavior>
                <a
                  className={`nav-link ${
                    router.pathname.startsWith('/cart') ? 'active' : ''
                  }`}
                  aria-current={
                    router.pathname.startsWith('/cart') ? 'page' : undefined
                  }
                >
                  Keranjang
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}