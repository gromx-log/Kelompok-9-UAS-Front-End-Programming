'use client';

import Image from 'next/image';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/productCard.module.css';

interface ProductCardProps {
  slug: string;
  title: string;
  description: string;
  price: string;
  images?: string[];
}

export default function ProductCard({
  slug,
  title,
  description,
  price,
  images = [],
}: ProductCardProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [slideClass, setSlideClass] = useState("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const hasImages = images.length > 0;

  const handleMouseEnter = () => {
    if (images.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setSlideClass(styles.slideInRight); // animate right

      setIndex(prev => (prev + 1) % images.length);

      // remove class after animation finishes
      setTimeout(() => setSlideClass(""), 350);
    }, 1500);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (images.length > 1 && index !== 0) {
      setSlideClass(styles.slideInLeft); // slide back left

      setIndex(0);

      setTimeout(() => setSlideClass(""), 350);
    }
  };

  return (
    <div
      className={`card h-100 shadow-sm border-0 ${styles.productCard}`}
      onClick={() => router.push(`/products/${slug}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ backgroundColor: 'var(--color-bg-light)', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease', }}
    >
      <div className={styles.imageContainer}>
        {hasImages && (
          <Image
            src={images[index]}
            alt={title}
            fill
            className={slideClass}
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>

        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="badge" style={{ fontSize: "0.7rem", backgroundColor: 'var(--color-accent)', color: "white" }}>
            Mulai dari
          </span>
          <span className="fw-bold" style={{ fontSize: "1.3rem" }}>
            {price}
          </span>
        </div>

        <p className="card-text text-muted">{description}</p>

        <Link href="/order" className="btn btn-primary w-100 mt-auto">
          Konsultasikan Sekarang
        </Link>
      </div>


      
    </div>
  );
}
