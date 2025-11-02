import Navbar from './navbar';
import Footer from './footer';
import CTA from './callToAction';
import Head from 'next/head';
import React from 'react';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>KartiniAle</title>
        <meta name="description" content="kue kustom terbaik" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      
      <main>
        {children}
      </main>

      <CTA/>

      <Footer />
    </>
  );
}