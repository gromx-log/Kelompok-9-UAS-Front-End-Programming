import Link from 'next/link';
import React from 'react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

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
        ${isScrolled ? 'bg-light shadow-sm scrolled' : 'bg-transparent'}
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
            <li className="nav-item">
              <Link href="/" legacyBehavior>
                <a className="nav-link active" aria-current="page">Home</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/products" legacyBehavior>
                <a className="nav-link">Produk</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/cart" legacyBehavior>
                <a className="nav-link">Keranjang</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}