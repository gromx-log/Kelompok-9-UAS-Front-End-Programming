import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaTachometerAlt, FaShoppingBag, FaBoxOpen, FaUser } from 'react-icons/fa';

interface CmsLayoutProps {
  children: React.ReactNode;
}

export default function CmsLayout({ children }: CmsLayoutProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  // Logika untuk men-highlight tab "Produk" bahkan saat di "Tambah Produk"
  const isProductsActive = currentPath.startsWith('/cms/products') || currentPath.startsWith('/cms/add-product');
  const isOrdersActive = currentPath.startsWith('/cms/orders');

  const navItems = [
    { name: 'Dashboard', href: '/cms', icon: FaTachometerAlt, active: currentPath === '/cms' },
    { name: 'Pesanan', href: '/cms/orders', icon: FaShoppingBag, active: isOrdersActive },
    { name: 'Produk', href: '/cms/products', icon: FaBoxOpen, active: isProductsActive },
  ];

  return (
    <>
      <div className="cms-layout">
        {/* CMS Sidebar */}
        <nav className="cms-sidebar">
          <div className="cms-sidebar-header">
            <Link href="/" legacyBehavior>
              <a className="cms-brand">KartiniAle</a>
            </Link>
          </div>
          <ul className="cms-nav-list">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} legacyBehavior>
                  <a className={`cms-nav-link ${item.active ? 'active' : ''}`}>
                    <span className="me-3"><item.icon /></span>
                    <span>{item.name}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          <div className="cms-sidebar-footer">
            <Link href="/" legacyBehavior>
              <a className="cms-nav-link">
                <span className="me-3"><FaUser /></span>                
                <span>Admin</span>
              </a>
            </Link>
          </div>
        </nav>

        {/* Main content CMS */}
        <main className="cms-main-content">
          {children}
        </main>
      </div>
    </>
  );
}