import { Metadata } from 'next';
import ProductImages from "../../../components/ProductImages";
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/navbar';
import CTA from '../../../components/callToAction';
import Footer from '../../../components/footer';

const API_URL = 'https://kartini-ale-public.up.railway.app/api/products';
const whatsappNumber = "6281211365855";
const whatsappMessage = encodeURIComponent("Halo Kartini Ale, saya ingin konsultasi tentang pemesanan kue custom.");
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

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
        className="container"
        style={{
          paddingTop: "8rem",
          paddingBottom: "4rem",
          maxWidth: "1200px",
        }}
      >
        <div className="row g-5 align-items-start">
          
          <div className="col-md-6">
            <ProductImages images={product.images} />
          </div>

          <div className="col-md-6">
            <div
              className="p-4"
              style={{
                background: "var(--color-bg-light)",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <h1 className="fw-bold mb-3">{product.name}</h1>

              <div className="mb-3">
                <small className="text-muted d-block">Mulai dari</small>
                <span
                  className="fw-bold"
                  style={{ fontSize: "1.7rem", lineHeight: "1" }}
                >
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 2,
                  }).format(product.startPrice)}
                </span>
              </div>

              <p
                className="text-muted mb-4"
                style={{ fontSize: "1.05rem", lineHeight: "1.6" }}
              >
                {product.description}
              </p>

              <a
                href={whatsappLink}
                target="_blank"
                className="btn btn-primary btn-lg w-100"
              >
                Konsultasikan Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>

      <CTA />
      <Footer />
    </>
  );
}
