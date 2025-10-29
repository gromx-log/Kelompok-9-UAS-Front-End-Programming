export default function Footer() {
  return (
    <footer 
      className="text-center text-lg-start mt-5"
      style={{ backgroundColor: 'var(--color-bg)' }} // Gunakan warna dasar
    >
      <div className="container p-4">
        <p className="text-center" style={{ color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} KueManis. Dibuat dengan ❤️.
        </p>
      </div>
    </footer>
  );
}