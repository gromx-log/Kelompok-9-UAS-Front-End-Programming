import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Definisikan tipe untuk state form Anda agar lebih aman
interface IFormData {
  [x: string]: string | number | readonly string[];
  customerName: string;
  customerPhone: string;
  deliveryDate: string;
  cakeType: 'Ogura' | 'Lapis Surabaya' | 'Dami Cake';
  cakeFlavor: string;
  cakeSize: string;
  themeDescription: string;
  referenceImageUrl: string;
}

export default function OrderPage() {
  const [formData, setFormData] = useState<IFormData>({
    customerName: '',
    customerPhone: '',
    deliveryDate: '',
    cakeType: 'Ogura', // Default ke Ogura agar flavor aktif
    cakeFlavor: '',
    cakeSize: '',
    themeDescription: '',
    referenceImageUrl: '',
  });

  // State untuk mengontrol status "freeze" pada input rasa
  const [isFlavorDisabled, setIsFlavorDisabled] = useState(false);

  // Efek ini akan berjalan setiap kali 'cakeType' berubah
  useEffect(() => {
    if (formData.cakeType !== 'Ogura') {
      setIsFlavorDisabled(true);
      setFormData((prev) => ({ ...prev, cakeFlavor: '' }));
    } else {
      setIsFlavorDisabled(false);
    }
  }, [formData.cakeType]);

  // Handler universal untuk semua input
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fungsi utama: HANYA mengubah data form menjadi pesan WhatsApp
  // (TIDAK 'async' dan TIDAK 'fetch')
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: GANTI DENGAN NOMOR WHATSAPP ADMIN ANDA (format 62)
    const adminPhoneNumber = '6281211365855';

    // 1. Buat template pesan
    let message = `Hai sayang, saya mau pesan kue custom:\n\n`;
    message += `*1. DATA PEMESAN*\n`;
    message += `Nama: ${formData.customerName}\n`;
    message += `No. HP/WA: ${formData.customerPhone}\n`;
    message += `Tanggal Pengiriman (diinginkan): ${formData.deliveryDate}\n`;
    message += `\n`;
    message += `*2. DETAIL KUE*\n`;
    message += `Base Cake: ${formData.cakeType}\n`;
    
    if (formData.cakeType === 'Ogura' && formData.cakeFlavor) {
      message += `Rasa Ogura: ${formData.cakeFlavor}\n`;
    }
    
    message += `Ukuran Kue: ${formData.cakeSize}\n`;
    message += `\n`;
    message += `*3. DESAIN & TEMA*\n`;
    message += `Deskripsi Tema:\n${formData.themeDescription}\n`;
    
    if (formData.referenceImageUrl) {
      message += `\nLink Referensi Gambar: ${formData.referenceImageUrl}\n`;
    }
    
    message += `\n---\n`;
    message += `Mohon info selanjutnya untuk harga dan konfirmasi. Terima kasih!`;

    // 2. Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(message);

    // 3. Buka link WhatsApp di tab baru
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // (Opsional) Reset form setelah berhasil
    setFormData({
      customerName: '',
      customerPhone: '',
      deliveryDate: '',
      cakeType: 'Ogura',
      cakeFlavor: '',
      cakeSize: '',
      themeDescription: '',
      referenceImageUrl: '',
    });
  };

  return (
    <>
      <Head>
        <title>Pesan Sekarang - KartiniAle</title>
      </Head>

      {/* Style banner dan 'freeze' tetap sama */}
      <style jsx>{`
        .page-header {
          background-color: var(--color-primary);
          color: #fff;
          padding-top: 9rem;
          padding-bottom: 3rem;
        }
        .breadcrumb { margin-bottom: 0.5rem; font-weight: 500; }
        :global(.breadcrumb-item a) { color: #fff; text-decoration: none; }
        :global(.breadcrumb-item a:hover) { text-decoration: underline; }
        :global(.breadcrumb-item.active) { color: rgba(255, 255, 255, 0.8); }
        :global(.breadcrumb-item + .breadcrumb-item::before) { color: rgba(255, 255, 255, 0.8); }
        
        .form-select:disabled,
        .form-control:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .page-header { padding-top: 7rem; padding-bottom: 2.5rem; }
        }
      `}</style>

      {/* === Banner Halaman === */}
      <section className="page-header">
        <div className="container text-center">
          <h1 className="display-5 display-lg-4 fade-in-up fw-bold" style={{ color: 'var(--color-text)' }}>
            Form Pemesanan
          </h1>
          <p className="lead fs-4 fade-in-up delay-1" style={{ color: 'var(--color-text-muted)' }}>
            Wujudkan kue impianmu bersama KartiniAle
          </p>
        </div>
      </section>

      {/* === Konten Form === */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0" style={{ backgroundColor: 'var(--color-bg-light)', borderRadius: '0.5rem' }}>
              <div className="card-body p-4 p-md-5">
                
                <p className="lead text-center mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  Isi form ini untuk terhubung dengan kami di WhatsApp.
                </p>

                <form onSubmit={handleSubmit}>
                  
                  {/* ... (Semua input form Anda tetap sama) ... */}

                  {/* === 1. Data Diri === */}
                  <h3 className="h4 mb-3">1. Data Diri Anda</h3>
                  <div className="mb-3">
                    <label htmlFor="customerName" className="form-label fw-600">Nama Lengkap</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="customerPhone" className="form-label fw-600">No. WhatsApp (Aktif)</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="Contoh: 08123456789"
                      required
                    />
                  </div>
                  <hr className="my-4" />

                  {/* === 2. Detail Kue === */}
                  <h3 className="h4 mb-3">2. Detail Pesanan</h3>
                  <div className="mb-3">
                    <label htmlFor="deliveryDate" className="form-label fw-600">Tanggal Pengiriman (yang Diinginkan)</label>
                    <p className="form-text mt-0 mb-2" style={{ color: 'var(--color-text-muted)' }}>
                      Ini adalah tanggal yang Anda inginkan. Ketersediaan slot akan kami konfirmasi via WhatsApp.
                    </p>
                    <input
                      type="date"
                      className="form-control"
                      id="deliveryDate"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cakeType" className="form-label fw-600">Tipe Base Cake</label>
                      <select
                        className="form-select"
                        id="cakeType"
                        name="cakeType"
                        value={formData.cakeType}
                        onChange={handleChange}
                        required
                      >
                        <option value="Ogura">Ogura</option>
                        <option value="Lapis Surabaya">Lapis Surabaya</option>
                        <option value="Dami Cake">Dami Cake</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cakeFlavor" className="form-label fw-600">Pilihan Rasa</label>
                      <select
                        className="form-select"
                        id="cakeFlavor"
                        name="cakeFlavor"
                        value={formData.cakeFlavor}
                        onChange={handleChange}
                        disabled={isFlavorDisabled}
                        required={!isFlavorDisabled}
                      >
                        <option value="">{isFlavorDisabled ? '(Hanya untuk Ogura)' : 'Pilih rasa Ogura...'}</option>
                        <option value="Vanilla">Cokelat</option>
                        <option value="Cokelat">Keju</option>
                        <option value="Keju">Stroberi</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cakeSize" className="form-label fw-600">Ukuran Kue</label>
                    <select
                      className="form-select"
                      id="cakeSize"
                      name="cakeSize"
                      value={formData.value}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih ukuran...</option>
                      <option value="16cm">Diameter 16cm</option>
                      <option value="18cm">Diameter 18cm</option>
                      <option value="20cm">Diameter 20cm</option>
                      <option value="Lainnya">Lainnya (tulis di deskripsi)</option>
                    </select>
                  </div>
                  <hr className="my-4" />

                  {/* === 3. Desain Tema === */}
                  <h3 className="h4 mb-3">3. Desain & Tema</h3>
                  <div className="mb-3">
                    <label htmlFor="themeDescription" className="form-label fw-600">Deskripsi Tema</label>
                    <textarea
                      className="form-control"
                      id="themeDescription"
                      name="themeDescription"
                      rows={5}
                      value={formData.themeDescription}
                      onChange={handleChange}
                      placeholder="Jelaskan desain yang Anda inginkan. Contoh: 'Tema Barbie, warna dominan pink & putih, ada tulisan Happy Birthday, boneka Barbie bawa sendiri'"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="referenceImageUrl" className="form-label fw-600">Link Referensi Gambar (Opsional)</label>
                    <p className="form-text mt-0 mb-2" style={{ color: 'var(--color-text-muted)' }}>
                      Punya contoh gambar? Upload ke Imgur / Pinterest / Google Drive dan tempel link-nya di sini.
                    </p>
                    <input
                      type="url"
                      className="form-control"
                      id="referenceImageUrl"
                      name="referenceImageUrl"
                      value={formData.referenceImageUrl}
                      onChange={handleChange}
                      placeholder="https://pinterest.com/link-gambar-anda"
                    />
                  </div>

                  {/* === Tombol Submit (Versi Simpel) === */}
                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary btn-lg py-3">
                      Lanjutkan ke WhatsApp
                    </button>
                  </div>

                  {/* Tidak ada lagi 'submitError' di sini */}

                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}