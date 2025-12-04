import React from 'react';
import Navbar from '../../components/navbar';
import CTA from '../../components/callToAction';
import Footer from '../../components/footer';
import ProductList from '../../components/ProductList';
import CustomHeader from '../../components/customHeader';

export const metadata = {
  title: 'Produk Kami - KartiniAle',
};

export default async function ProductsPage() {
  const res = await fetch(
    'https://kartini-ale-public.up.railway.app/api/products',
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  const products = await res.json();

  return (
    <>
      <Navbar />
      <CustomHeader title= 'Katalog Kue Kami'/>

      <div className="container my-5">
        <ProductList products={products} />
      </div>
      <CTA />
      <Footer />
    </>
  );
}
