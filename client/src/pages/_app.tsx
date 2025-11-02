import { useEffect } from 'react';
import type { AppProps } from 'next/app'; 
import { useRouter } from 'next/router'; 
import Layout from '../components/layout'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import '../styles/our-cakes.css'; 
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  const router = useRouter();

  const isCmsPage = router.pathname.startsWith('/cms');

  if (isCmsPage) {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;