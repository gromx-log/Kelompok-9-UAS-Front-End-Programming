import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/navbar';
import CTA from '../../../components/callToAction';
import Footer from '../../../components/footer';

const dummyProducts = [
  {
    slug: 'red-velvet-classic', 
    name: 'Red Velvet Classic',
    description: 'Kue red velvet lembut dengan cream cheese frosting.',
    price: 'Rp 250.000',
    imageUrl: '/images/cake-placeholder.jpg',
  },
  {
    slug: 'chocolate-overload',
    name: 'Chocolate Overload',
    description: 'Bagi pecinta cokelat, kue ini penuh dengan ganache.',
    price: 'Rp 300.000',
    imageUrl: '/images/cake-placeholder.jpg',
  },
  {
    slug: 'unicorn-rainbow-cake',
    name: 'Unicorn Rainbow Cake',
    description: 'Kue pelangi lucu untuk ulang tahun anak.',
    price: 'Rp 350.000',
    imageUrl: '/images/cake-placeholder.jpg',
  },
];

export async function generateMetadata( { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = await params;
  const product = dummyProducts.find((p) => p.slug === slug);

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
      images: [product.imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = dummyProducts.find((p) => p.slug === slug);

  if (!product) return notFound();

  return (
    <>
    <Navbar/>
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
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
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
          ) : (
            <span className="text-muted">{product.name}</span>
          )}
        </div>

        <div className="col-md-6 text-center text-md-start">
          <h1 className="fw-bold mb-3">{product.name}</h1>
          <h4 className="text-muted mb-4">{product.price}</h4>
          <p className="mb-4">{product.description}</p>
          <a href="/order" className="btn btn-primary btn-lg">
            Pesan Sekarang
          </a>
        </div>
      </div>
    </div>
    <CTA/>
    <Footer/>
    </>
  );

}
