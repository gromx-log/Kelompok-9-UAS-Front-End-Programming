import Image from 'next/image';
import React from 'react';

export default function ProductCard({ title, description, price, imageUrl }) {
  return (
    <div 
      className="card h-100 shadow-sm border-0" 
      style={{ backgroundColor: 'var(--color-bg-light)' }}
    >
      <Image
        src={imageUrl}
        className="card-img-top"
        alt={title}
        width={400}
        height={300}
        style={{ objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <p className="card-text" style={{ color: 'var(--color-text-muted)' }}>
          {description}
        </p>
        <h6 className="card-subtitle mb-2 fw-bold">{price}</h6>
        
        <a href="#" className="btn btn-primary w-100 mt-auto">
          Pesan Sekarang
        </a>
      </div>
    </div>
  );
}