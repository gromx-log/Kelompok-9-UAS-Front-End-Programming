import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

// Tipe data untuk item di keranjang
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

// Data dummy (gantil pake state global nanti, misal: Context atau Zustand)
const dummyCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Red Velvet Classic',
    price: 250000,
    quantity: 1,
    imageUrl: '/images/cake-placeholder.jpg', 
  },
  {
    id: 2,
    name: 'Chocolate Overload',
    price: 300000,
    quantity: 2,
    imageUrl: '/images/cake-placeholder.jpg',
  },
];

// Helper untuk format Rupiah
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState(dummyCartItems);

  // --- Logika untuk mengelola keranjang ---
  // (Ini placeholder, idealnya logika itu ada di state management)

  const handleQuantityChange = (id: number, amount: number) => {
    setCartItems(
      cartItems
        .map((item) => {
          if (item.id === id) {
            return { ...item, quantity: Math.max(1, item.quantity + amount) }; // minimal 1
          }
          return item;
        })
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  // --- Render ---

  // Tampilan jika keranjang kosong
  if (cartItems.length === 0) {
    return (
      <>
        <Head>
          <title>Keranjang - KartiniAle</title>
        </Head>
        <div className="container text-center" style={{ padding: '10rem 0' }}>
          <h1 className="mb-3">Keranjang Anda Kosong</h1>
          <p className="lead text-muted mb-4">
            Sepertinya Anda belum menambahkan kue apapun ke keranjang.
          </p>
          <Link href="/products" legacyBehavior>
            <a className="btn btn-primary btn-lg">Lihat Katalog Kami</a>
          </Link>
        </div>
      </>
    );
  }

  // Tampilan jika keranjang ada isi
  return (
    <>
      <Head>
        <title>Keranjang - KartiniAle</title>
      </Head>

      {/* Style kustom khusus untuk halaman ini */}
      <style jsx>{`
        .cart-item-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 0.5rem;
        }
        @media (min-width: 768px) {
          .cart-item-image {
            width: 100px;
            height: 100px;
          }
        }
        .cart-quantity-input {
          max-width: 50px;
          text-align: center;
          border-left: 0;
          border-right: 0;
        }
        .btn-remove {
          color: var(--color-text-muted);
          background: transparent;
          border: none;
        }
        .btn-remove:hover {
          color: #dc3545; /* Bootstrap danger color */
        }
      `}</style>

      <div className="container my-5 pt-5">
        <h1 className="text-center mb-4">Keranjang Anda</h1>

        <div className="row g-4">
          {/* Kolom Kiri: Daftar Item */}
          <div className="col-lg-8">
            <div
              className="card shadow-sm border-0"
              style={{ backgroundColor: 'var(--color-bg-light)' }}
            >
              <div className="list-group list-group-flush">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="list-group-item p-3"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <div className="row align-items-center g-3">
                      
                      {/* Gambar */}
                      <div className="col-12 col-md-auto">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="cart-item-image"
                        />
                      </div>
                      
                      {/* Nama & Harga Satuan */}
                      <div className="col col-md">
                        <h6 className="mb-1">{item.name}</h6>
                        <small className="text-muted">
                          {formatCurrency(item.price)}
                        </small>
                      </div>

                      {/* Kuantitas */}
                      <div className="col-12 col-md-auto">
                        <div className="input-group">
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <FaMinus />
                          </button>
                          <input
                            type="text"
                            className="form-control cart-quantity-input"
                            value={item.quantity}
                            readOnly
                            aria-label="Quantity"
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal Item & Tombol Hapus */}
                      <div className="col col-md-auto text-end">
                        <h6 className="mb-1">
                          {formatCurrency(item.price * item.quantity)}
                        </h6>
                        <button
                          className="btn-remove p-0"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="Hapus item"
                        >
                          <small><FaTrash /> Hapus</small>
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Ringkasan Pesanan */}
          <div className="col-lg-4">
            <div
              className="card shadow-sm border-0"
              style={{ backgroundColor: 'var(--color-bg-light)' }}
            >
              <div className="card-body">
                <h5 className="card-title mb-3">Ringkasan Pesanan</h5>
                <ul className="list-group list-group-flush">
                  <li
                    className="list-group-item d-flex justify-content-between px-0"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </li>
                  <li
                    className="list-group-item d-flex justify-content-between px-0"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <span>Pengiriman</span>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                      (dihitung di checkout)
                    </span>
                  </li>
                  <li
                    className="list-group-item d-flex justify-content-between px-0 fw-bold"
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: '1.1rem',
                    }}
                  >
                    <span>Total</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </li>
                </ul>
                <Link href="/checkout" legacyBehavior>
                  <a className="btn btn-primary w-100 mt-3">
                    Lanjut ke Pembayaran
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}