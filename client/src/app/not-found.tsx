import Link from "next/link";

export default function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '100vh' }}>
      <h1 className="display-4 fw-bold">404</h1>
      <p className="lead mb-4">Halaman yang Anda cari tidak ditemukan.</p>
      <Link href="/" className="btn btn-primary">Kembali ke Beranda</Link>
    </div>
  );
}
