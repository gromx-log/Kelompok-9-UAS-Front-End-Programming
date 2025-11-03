'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaShoppingBag, FaBoxOpen, FaUser } from 'react-icons/fa';

export default function CmsLayout({ children }) {
  const pathname = usePathname();

  // Determine active routes
  const isProductsActive =
    pathname?.startsWith('/cms/products') || pathname.startsWith('/cms/addProduct');
  const isOrdersActive = pathname?.startsWith('/cms/orders');

  const navItems = [
    { name: 'Dashboard', href: '/cms/dashboard', icon: FaTachometerAlt, active: pathname === '/cms/dashboard' || pathname === '/cms' },
    { name: 'Pesanan', href: '/cms/orders', icon: FaShoppingBag, active: isOrdersActive },
    { name: 'Produk', href: '/cms/products', icon: FaBoxOpen, active: isProductsActive },
  ];

  return (
    <div className="cms-layout d-flex">
      {/* === Sidebar === */}
      <nav className="cms-sidebar">
        <div className="cms-sidebar-header">
          <Link href="/" className="cms-brand">
            KartiniAle
          </Link>
        </div>

        <ul className="cms-nav-list list-unstyled">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`cms-nav-link ${item.active ? 'active' : ''}`}
              >
                <span className="me-3">
                  <item.icon />
                </span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="cms-sidebar-footer mt-auto">
          <Link href="/" className="cms-nav-link">
            <span className="me-3">
              <FaUser />
            </span>
            <span>Admin</span>
          </Link>
        </div>
      </nav>

      {/* === Main Content === */}
      <main className="cms-main-content flex-grow-1">{children}</main>
    </div>
  );
}
