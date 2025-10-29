import { useEffect } from 'react';
import Layout from '../components/layout';

// 1. Impor Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. Impor Global CSS Anda (yang baru saja kita edit)
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  // 3. Impor Bootstrap JS
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;