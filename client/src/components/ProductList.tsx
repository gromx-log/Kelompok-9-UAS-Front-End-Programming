'use client';
import React, { useState } from 'react';
import ProductCard from './productCard';

interface Product {
  slug: string;
  name: string;
  description: string;
  startPrice: number;
  images: string[];
  category: string;
}

export default function ProductList({ products }: { products: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Anak', 'Dewasa', 'Olahraga', 'Musik', 'Lainnya'];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <>
      <div className="d-flex justify-content-center mb-4 flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn ${
              selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="row g-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="col-md-6 col-lg-4" key={product.slug}>
              <ProductCard
                slug={product.slug}
                title={product.name}
                description={product.description}
                price={new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 2,
                }).format(product.startPrice)}
                images={product.images}
              />
            </div>
          ))
        ) : (
          <p className="text-center">Tidak ada produk dalam kategori ini.</p>
        )}
      </div>
    </>
  );
}
