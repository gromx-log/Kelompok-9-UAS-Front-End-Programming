import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/navbar';
import CTA from '../../../components/callToAction';
import Footer from '../../../components/footer';

const API_URL = 'https://kelompok-9-uas-front-end-programming-production.up.railway.app/api/products';

// Fetch all products
async function getProducts() {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

// Generate metadata
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const { slug } = await params;
    const products = await getProducts();
    const product = products.find((p: any) => p.slug === slug);

    if (!product) {
      return {
        title: 'Produk tidak ditemukan - KartiniAle',
        description: 'Produk yang Anda cari tidak tersedia.',
      };
    }

    return {
      title: `${product.name} - KartiniAle`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [product.images?.[0] ?? '/images/cake-placeholder.jpg'],
      },
    };
  } catch {
    return {
      title: 'Produk - KartiniAle',
      description: 'Temukan produk terbaik dari KartiniAle.',
    };
  }
}

// Page
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p: any) => p.slug === slug);

  if (!product) return notFound();

  return (
    <>
      <Navbar />
      <div
        className="container d-flex align-items-center justify-content-center"
        style={{
          minHeight: '100vh',
          paddingTop: '6rem',
          paddingBottom: '2rem',
        }}
      >
        <div className="row align-items-center w-100">
          <div className="col-md-6 text-center mb-4 mb-md-0">
            <Image
              src={product.images?.[0] ?? '/images/cake-placeholder.jpg'}
              alt={product.name}
              width={500}
              height={350}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: 'auto',
                borderRadius: '12px',
              }}
            />
          </div>

          <div className="col-md-6 text-center text-md-start">
            <h1 className="fw-bold mb-3">{product.name}</h1>
            <h4 className="text-muted mb-4">
              Mulai dari {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 2,
                          }).format(product.startPrice)}
            </h4>
            <p className="mb-4">{product.description}</p>
            <a href="/order" className="btn btn-primary btn-lg">
              Konsultasikan Sekarang
            </a>
          </div>
        </div>
      </div>
      <CTA />
      <Footer />
    </>
  );
}
