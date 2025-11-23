'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from './productCard';
import { useSearchParams, useRouter } from 'next/navigation';

interface Product {
  slug: string;
  name: string;
  description: string;
  startPrice: number;
  images: string[];
  category: string;
}

export default function ProductList({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams.get('category');

  const categories = ['All', 'Anak', 'Dewasa','Hobby', 'Lainnya'];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (urlCategory && categories.includes(urlCategory)) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);

    if (cat === 'All') {
      router.push('/products');
    } else {
      router.push(`/products?category=${cat}`);
    }
  };

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
            onClick={() => handleCategoryClick(cat)}
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
