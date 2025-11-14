"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// Head dan Link tidak terpakai di file ini, tetapi saya biarkan
import Head from 'next/head'; 
import Link from 'next/link';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import CustomHeader from '../../components/customHeader';
import styles from './order.module.css';
// CmsLayout tidak terpakai di halaman ini
// import CmsLayout from '../../components/cmsLayout';

// Definisikan tipe untuk state form Anda agar lebih aman
interface IFormData {
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

  // State untuk loading dan error handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  // Fungsi utama: Menyimpan ke DB EKSTERNAL, LALU membuka WhatsApp
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // --- LANGKAH 1: KIRIM KE BACKEND (SESUAI DOKUMENTASI FRANZ) ---
    try {
      // Siapkan data untuk dikirim.
      // Hapus cakeFlavor jika tidak relevan (sesuai skema backend)
      const payload: Partial<IFormData> = { ...formData };
      if (payload.cakeType !== 'Ogura') {
        delete payload.cakeFlavor;
      }

      const response = await fetch('https://kelompok-9-uas-front-end-programming-production.up.railway.app/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // WAJIB
        },
        body: JSON.stringify(payload), // WAJIB di-stringify
      });

      const data = await response.json();

      if (!response.ok) {
        // Menangani error validasi dari server (sesuai doc Franz/orderHandler.js)
        // 'message' dari sendError atau 'error' dari Mongoose
        throw new Error(data.message || data.error || 'Gagal menyimpan pesanan');
      }

      console.log('Sukses tersimpan di DB:', data);

      // --- LANGKAH 2: JIKA SUKSES, BARU BUKA WHATSAPP ---

      const adminPhoneNumber = '6281211365855'; // Nomor Filbert

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

    } catch (error) {
      // Tampilkan error di frontend jika fetch gagal
      console.error('Error saat menyimpan ke DB:', (error as Error).message);
      setSubmitError((error as Error).message);
    } finally {
      // Hentikan status loading
      setIsSubmitting(false);
    }
  };
  
  // SEMUA JSX (TAMPILAN) KEMBALI KE SINI
  return (
    <>
      <Navbar />

      {/* === Banner Halaman === */}
      <section className={styles.pageHeader}>
        <CustomHeader title='Form Pemesanan' subtitle='Wujudkan kue impianmu bersama KartiniAle' />
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
                        <option value="Cokelat">Cokelat</option>
                        <option value="Keju">Keju</option>
                        <option value="Stroberi">Stroberi</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cakeSize" className="form-label fw-600">Ukuran Kue</label>
                    <select
                      className="form-select"
                      id="cakeSize"
                      name="cakeSize"
                      value={formData.cakeSize}
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

                  {/* === Tombol Submit (Dengan Loading & Error) === */}
                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary btn-lg py-3" disabled={isSubmitting}>
                      {isSubmitting ? 'Menyimpan...' : 'Lanjutkan ke WhatsApp'}
                    </button>
                  </div>

                  {/* Tampilkan pesan error jika ada */}
                  {submitError && (
                    <div className="alert alert-danger mt-3" role="alert">
                      <strong>Terjadi Kesalahan:</strong> {submitError}
                    </div>
                  )}

                </form>

              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}