import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import '../styles/our-cakes.css';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import CTA from '../components/callToAction';

export const metadata = {
  title: 'KartiniAle',
  description: 'kue kustom terbaik',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main>{children}</main>

        <CTA />
        <Footer />

        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          defer
        />
      </body>
    </html>
  );
}
