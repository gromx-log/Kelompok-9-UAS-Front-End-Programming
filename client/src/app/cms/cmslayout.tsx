'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaTachometerAlt, FaShoppingBag, FaBoxOpen, FaUserShield } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  // Load token + role
  useEffect(() => {
    if (pathname === '/cms/login') {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) {
      router.push('/cms/login');
      return;
    }

    setRole(userRole);
    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (pathname === '/cms/login') return <>{children}</>;

  const navItems = [
    { name: 'Dashboard', href: '/cms/dashboard', icon: FaTachometerAlt },
    { name: 'Pesanan', href: '/cms/orders', icon: FaShoppingBag },
    { name: 'Produk', href: '/cms/products', icon: FaBoxOpen }
  ];

  return (
    <div className="cms-layout d-flex">
      {/* Sidebar */}
      <nav className="cms-sidebar">
        <div className="cms-sidebar-header">
          <Link href="/" className="cms-brand">KartiniAle</Link>
        </div>

        <ul className="cms-nav-list list-unstyled">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href} 
                className={`cms-nav-link ${pathname.startsWith(item.href) ? 'active' : ''}`}
              >
                <span className="me-3"><item.icon /></span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}

          {/* Hanya Owner yg bisa melihat menu ini */}
          {role === 'owner' && (
            <li>
              <Link 
                href="/cms/admins" 
                className={`cms-nav-link ${pathname.startsWith('/cms/admins') ? 'active' : ''}`}
              >
                <span className="me-3"><FaUserShield /></span>
                <span>Kelola Admin</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <main className="cms-main-content flex-grow-1">
        {children}
      </main>
    </div>
  );
}
