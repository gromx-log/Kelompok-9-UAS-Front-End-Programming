'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; 

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const isScrolledOrOpen = isScrolled || isMenuOpen;

  return (
    <nav
      className={`
        navbar navbar-expand-lg fixed-top navbar-light
        ${
          isScrolledOrOpen
            ? 'bg-light shadow scrolled navbar-small'
            : 'bg-transparent navbar-large'
        }
      `}
    >
      <div className="container">
        <Link href="/" className="navbar-brand" onClick={closeMenu}>
          KartiniAle
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={`custom-toggler ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <div
          className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${pathname === '/' ? 'active' : ''}`}
                aria-current={pathname === '/' ? 'page' : undefined}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/products"
                className={`nav-link ${
                  pathname.startsWith('/products') ? 'active' : ''
                }`}
                aria-current={
                  pathname.startsWith('/products') ? 'page' : undefined
                }
                onClick={closeMenu}
              >
                Produk
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/our-cakes"
                className={`nav-link ${
                  pathname === '/our-cakes' ? 'active' : ''
                }`}
                onClick={closeMenu}
              >
                Tentang Kue Kami
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/faq"
                className={`nav-link ${pathname === '/faq' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                FAQ
              </Link>
            </li>

            <li className="nav-item ms-lg-3">
              <Link href="/order" className="btn btn-primary" onClick={closeMenu}>
                Pesan Sekarang
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
