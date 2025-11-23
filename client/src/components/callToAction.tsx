import React from 'react';
import Link from 'next/link';

const CallToAction: React.FC = () => {
  return (
    <section className="py-5 text-center" style={{ backgroundColor: 'var(--color-bg-light)' }}>
      <style jsx>{`
        .btn-primary:hover, .btn-outline-primary:hover {
          background-image: none !important;
          background-color: #f79b9b !important;
          border-color: #f79b9b !important;
          color: var(--color-bg-light) !important;
          box-shadow: 0 4px 15px var(--color-accent) !important;
          transform: translateY(-3px) !important;
        }
      `}</style>
      <div className="container">
        <h2 className="fw-bold h1 mb-4 fade-in-up">
          Tertarik dengan Kualitas Kami?
        </h2>
        <p className="lead fs-5 mb-4 fade-in-up delay-1" style={{ color: 'var(--color-text-muted)' }}>
          Lihat karya-karya kami atau mulai konsultasi untuk wujudkan kue impian Anda.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3 fade-in-up delay-2">
          <Link href="/products" className='btn btn-outline-primary btn-lg' style={{ padding: '0.75rem 2rem' }}>
              Lihat Galeri Kami
          </Link>
          <Link href="/order" className="btn btn-primary btn-lg" style={{ padding: '0.75rem 2rem' }} >
              Konsultasikan Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
