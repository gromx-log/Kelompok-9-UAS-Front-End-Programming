"use client";
import React from 'react';
import Link from 'next/link';

const CallToAction: React.FC = () => {
  const whatsappNumber = "6281211365855";
  const whatsappMessage = encodeURIComponent("Halo Kartini Ale, saya ingin konsultasi tentang pemesanan kue custom.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  return (
    <section className="call-to-action-section py-5 text-center">
      <div className="container">
        <h2 className="fw-bold h1 mb-4 fade-in-up">
          Tertarik dengan Kualitas Kami?
        </h2>
        <p className="lead fs-5 mb-4 fade-in-up delay-1" style={{ color: 'var(--color-text-muted)' }}>
          Lihat karya-karya kami atau mulai konsultasi untuk wujudkan kue impian Anda.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3 fade-in-up delay-2">
          <Link href="/products" className="btn btn-outline-primary btn-lg btn-lg-custom">
              Lihat Galeri Kami
          </Link>
          <a href={whatsappLink}  target="_blank" className="btn btn-primary btn-lg" style={{ padding: '0.75rem 2rem' }}>
              Konsultasikan Sekarang
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;