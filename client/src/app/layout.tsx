import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import '../styles/our-cakes.css';

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

        <main>{children}</main>

        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          defer
        />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
        />
      </body>
    </html>
  );
}
