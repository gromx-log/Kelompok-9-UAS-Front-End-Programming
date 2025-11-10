'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/productCard.module.css';

interface ProductCardProps {
  slug: string;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
}

export default function ProductCard({ slug, title, description, price, imageUrl }: ProductCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/products/${slug}`); 
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation(); 
  };

  return (
    <div 
      className={`card h-100 shadow-sm border-0 ${styles.productCard}`} 
      style={{ backgroundColor: 'var(--color-bg-light)', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease', }}
      onClick={handleCardClick}
    >
      <div
        className="card-img-top d-flex align-items-center justify-content-center"
        style={{
          height: 300,
          backgroundColor: 'white',
          overflow: 'hidden',
          borderTopLeftRadius: '0.375rem',
          borderTopRightRadius: '0.375rem',
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={300}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        ) : (
          <span className="text-muted">{title}</span>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 fw-bold">{price}</h6>
        <p className="card-text" style={{ color: 'var(--color-text-muted)' }}>
          {description}
        </p>
        
        <Link
          href={`/order`} 
          className="btn btn-primary w-100 mt-auto"
          onClick={handleButtonClick}
        >
          Pesan Sekarang
        </Link>
      </div>
    </div>
  );
}