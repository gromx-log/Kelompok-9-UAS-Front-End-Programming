import Navbar from './navbar';
import Footer from './footer';
import Head from 'next/head';
import React from 'react';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Toko Kue Kustom</title>
        <meta name="description" content="Jual beli kue kustom terbaik" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      
      <main>
        {children}
      </main>

      <Footer />
    </>
  );
}