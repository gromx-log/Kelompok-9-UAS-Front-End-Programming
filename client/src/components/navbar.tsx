import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
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

  const isScrolledOrOpen = isScrolled || isMenuOpen;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`
        navbar navbar-expand-lg fixed-top navbar-light
        ${isScrolledOrOpen
          ? 'bg-light shadow scrolled navbar-small'
          : 'bg-transparent navbar-large' 
        }
      `}
    >
      <div className="container">
        
        <Link href="/" legacyBehavior>
          <a 
            className="navbar-brand" 
            onClick={closeMenu} 
          >
            KartiniAle
          </a>
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

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            
            <li className="nav-item">
              <Link href="/" legacyBehavior>
                <a
                  className={`nav-link ${router.pathname === '/' ? 'active' : ''}`}
                  aria-current={router.pathname === '/' ? 'page' : undefined}
                  onClick={closeMenu} 
                >
                  Home
                </a>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/products" legacyBehavior>
                <a
                  className={`nav-link ${router.pathname.startsWith('/products') ? 'active' : ''}`}
                  aria-current={router.pathname.startsWith('/products') ? 'page' : undefined}
                  onClick={closeMenu} 
                >
                  Produk
                </a>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/gallery" legacyBehavior>
                <a
                  className={`nav-link ${router.pathname === '/gallery' ? 'active' : ''}`}
                  aria-current={router.pathname === '/gallery' ? 'page' : undefined}
                  onClick={closeMenu} 
                >
                  Galeri
                </a>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/our-cakes" legacyBehavior>
                <a
                  className={`nav-link ${router.pathname === '/our-cakes' ? 'active' : ''}`}
                  onClick={closeMenu} 
                >
                  Tentang Kue Kami
                </a>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/faq" legacyBehavior>
                <a
                  className={`nav-link ${router.pathname === '/faq' ? 'active' : ''}`}
                  onClick={closeMenu} 
                >
                  FAQ
                </a>
              </Link>
            </li>

            <li className="nav-item ms-lg-3 ">
              <Link href="/order" legacyBehavior>
                <a className="btn btn-primary" onClick={closeMenu}> 
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