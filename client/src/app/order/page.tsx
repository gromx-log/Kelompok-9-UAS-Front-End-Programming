"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import CustomHeader from '../../components/customHeader';
import styles from './order.module.css';

// --- Tipe Data Form yang Baru (sesuai permintaan) ---
interface IFormData {
  customerName: string;
  customerPhone: string;
  deliveryDate: string;
  deliveryTime: string; // BARU
  deliveryAddress: string; // BARU
  cakeBase: 'Ogura' | 'Lapis Surabaya' | 'Dummy Cake' | 'Dummy + Mix'; // Opsi diubah
  mixBase: 'Ogura' | 'Lapis Surabaya' | ''; // BARU (untuk Dummy + Mix)
  cakeFlavor: string; // Opsi akan diubah
  cakeFilling: string; // BARU
  cakeSize: string;
  cakeText: string; // BARU
  age: string; // BARU
  themeDescription: string; // Label akan diubah
  referenceImageUrl: string;
}

export default function OrderPage() {
  const [formData, setFormData] = useState<IFormData>({
    customerName: '',
    customerPhone: '',
    deliveryDate: '',
    deliveryTime: '',
    deliveryAddress: '',
    cakeBase: 'Ogura', // Default ke Ogura
    mixBase: '',
    cakeFlavor: '',
    cakeFilling: '',
    cakeSize: '',
    cakeText: '',
    age: '',
    themeDescription: '',
    referenceImageUrl: '',
  });

  // --- State untuk Logika Form Dinamis ---
  const [isMixBaseVisible, setIsMixBaseVisible] = useState(false);
  const [isFlavorDisabled, setIsFlavorDisabled] = useState(false);
  const [isFillingDisabled, setIsFillingDisabled] = useState(false);

  // --- State untuk submit (loading dan error) ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // --- Efek Utama: Otak dari Form Dinamis ---
  useEffect(() => {
    const { cakeBase, mixBase } = formData;

    // 1. Logika 'Mix Base' (Muncul/Sembunyi)
    const showMixBase = cakeBase === 'Dummy + Mix';
    setIsMixBaseVisible(showMixBase);
    if (!showMixBase) {
      setFormData((prev) => ({ ...prev, mixBase: '' })); // Reset jika disembunyikan
    }

    // 2. Logika 'Flavor' (Aktif/Nonaktif)
    const disableFlavor =
      cakeBase === 'Lapis Surabaya' ||
      cakeBase === 'Dummy Cake' ||
      (cakeBase === 'Dummy + Mix' && mixBase === 'Lapis Surabaya') ||
      (cakeBase === 'Dummy + Mix' && mixBase === '');
    setIsFlavorDisabled(disableFlavor);
    if (disableFlavor) {
      setFormData((prev) => ({ ...prev, cakeFlavor: '' })); // Reset jika nonaktif
    }

    // 3. Logika 'Filling' (Aktif/Nonaktif)
    const disableFilling = cakeBase === 'Dummy Cake';
    setIsFillingDisabled(disableFilling);
    if (disableFilling) {
      setFormData((prev) => ({ ...prev, cakeFilling: '' })); // Reset jika nonaktif
    }

  }, [formData.cakeBase, formData.mixBase]);

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

  try {
   // --- LANGKAH 1: Buat Payload yang Diterjemahkan untuk Backend ---
   // Ini harus SINKRON 100% dengan orderModel.js
   
   // Tentukan cakeType berdasarkan cakeBase
   let cakeType = formData.cakeBase;
   if (formData.cakeBase === 'Dummy Cake' || formData.cakeBase === 'Dummy + Mix') {
    cakeType = 'Dummy Cake';
   }

   const payload: any = {
    // Data Customer & Pengiriman (WAJIB)
    customerName: formData.customerName,
    customerPhone: formData.customerPhone,
    deliveryAddress: formData.deliveryAddress, // WAJIB ADA
    deliveryDate: formData.deliveryDate,
    deliveryTime: formData.deliveryTime, // WAJIB ADA

    // Penerjemahan Nama Field (WAJIB)
    cakeType: formData.cakeBase, // Terjemahkan 'cakeBase' -> 'cakeType'

    // Detail Kue Lainnya (WAJIB)
    mixBase: formData.mixBase,
    cakeFilling: formData.cakeFilling,
    cakeSize: formData.cakeSize,
    themeDescription: formData.themeDescription,
    referenceImageUrl: formData.referenceImageUrl,
    cakeText: formData.cakeText,
    age: formData.age,
    cakeFlavor: formData.cakeFlavor,
   };

   // Logika Kondisional (Opsional, tapi bagus)
   if (isFlavorDisabled) {
    payload.cakeFlavor = ''; // Set string kosong jika di-disable
   }
   if (isFillingDisabled) {
    payload.cakeFilling = ''; // Set string kosong jika di-disable
   }
   if (!isMixBaseVisible) {
    payload.mixBase = ''; // Set string kosong jika disembunyikan
   }

   // --- DEBUG: Lihat payload final ---
   console.log("Payload FINAL yang dikirim ke backend:", payload);

   const response = await fetch('https://kelompok-9-uas-front-end-programming-production.up.railway.app/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), // Kirim payload yang LENGKAP
   });

   const data = await response.json();

   if (!response.ok) {
    // 'data.error' akan berisi pesan error dari Mongoose/Backend
    throw new Error(data.message || data.error || 'Gagal menyimpan pesanan');
   }

   console.log('Sukses tersimpan di DB:', data);

   // --- LANGKAH 2: Buka WhatsApp (SEMUA KODE DI BAWAH INI SAMA) ---
// ... (sisa kode WA Anda) ...
   const adminPhoneNumber = '6281211365855'; // Nomor Filbert

   // 1. Buat template pesan BARU (Logika ini sudah benar)
   let message = `Hai sayang, saya mau pesan kue custom:\n\n`;
   message += `*1. DATA PEMESAN*\n`;
   message += `Nama: ${formData.customerName}\n`;
   message += `No. HP/WA: ${formData.customerPhone}\n`;
   message += `Alamat Pengiriman:\n${formData.deliveryAddress}\n`;
   message += `\n`;
   message += `*2. JADWAL PENGIRIMAN (diinginkan)*\n`;
   message += `Tanggal: ${formData.deliveryDate}\n`;
   message += `Waktu: ${formData.deliveryTime}\n`;
   message += `\n`;
   message += `*3. DETAIL KUE*\n`;
   message += `Base Cake: ${formData.cakeBase}\n`;
   
   if (isMixBaseVisible && formData.mixBase) {
    message += `Mix dengan: ${formData.mixBase}\n`;
   }
   if (!isFlavorDisabled && formData.cakeFlavor) {
    message += `Rasa Kue: ${formData.cakeFlavor}\n`;
   if (isMixBaseVisible && formData.mixBase) {
    message += `Mix dengan: ${formData.mixBase}\n`;
   }
   }
   
   message += `Ukuran Kue: ${formData.cakeSize}\n`;
   message += `\n`;
   message += `*4. DESAIN & TEMA*\n`;
   message += `Model/Tema:\n${formData.themeDescription}\n`;

   if (formData.cakeText) {
    message += `\nTulisan di Kue: ${formData.cakeText}\n`;
   }
   if (formData.age) {
    message += `Umur: ${formData.age}\n`;
   }
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
    customerName: '', customerPhone: '', deliveryDate: '',
    deliveryTime: '', deliveryAddress: '', cakeBase: 'Ogura',
    mixBase: '', cakeFlavor: '', cakeFilling: '',
    cakeSize: '', cakeText: '', age: '',
    themeDescription: '', referenceImageUrl: '',
   });

  } catch (error) {
   console.error('Error saat menyimpan ke DB:', (error as Error).message);
   // Error.message sekarang akan berisi pesan dari backend
   // cth: "Order validation failed: deliveryAddress: Path `deliveryAddress` is required."
   setSubmitError((error as Error).message);
  } finally {
   setIsSubmitting(false);
  };
 }
  
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
                      type="text" className="form-control" id="customerName"
                      name="customerName" value={formData.customerName}
                      onChange={handleChange} required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="customerPhone" className="form-label fw-600">No. WhatsApp (Aktif)</label>
                    <input
                      type="tel" className="form-control" id="customerPhone"
                      name="customerPhone" value={formData.customerPhone}
                      onChange={handleChange} placeholder="Contoh: 08123456789" required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="deliveryAddress" className="form-label fw-600">Alamat Pengiriman</label>
                    <textarea
                      className="form-control" id="deliveryAddress"
                      name="deliveryAddress" rows={3}
                      value={formData.deliveryAddress} onChange={handleChange}
                      placeholder="Masukkan alamat lengkap untuk estimasi ongkir." required
                    ></textarea>
                  </div>
                  <hr className="my-4" />

                  {/* === 2. Detail Pesanan === */}
                  <h3 className="h4 mb-3">2. Detail Pesanan</h3>
                  <div className="row">
                    <div className="col-md-7 mb-3">
                      <label htmlFor="deliveryDate" className="form-label fw-600">Tanggal Pengiriman (diinginkan)</label>
                      <input
                        type="date" className="form-control" id="deliveryDate"
                        name="deliveryDate" value={formData.deliveryDate}
                        onChange={handleChange} required
                      />
                    </div>
                    <div className="col-md-5 mb-3">
                      <label htmlFor="deliveryTime" className="form-label fw-600">Waktu Pengiriman (diinginkan)</label>
                      <input
                        type="time" className="form-control" id="deliveryTime"
                        name="deliveryTime" value={formData.deliveryTime}
                        onChange={handleChange} required
                      />
                    </div>
                  </div>
                  <p className="form-text mt-0 mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Ketersediaan slot akan kami konfirmasi ulang via WhatsApp.
                  </p>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cakeBase" className="form-label fw-600">Tipe Base Cake</label>
                      <select
                        className="form-select" id="cakeBase" name="cakeBase"
                        value={formData.cakeBase} onChange={handleChange} required
                      >
                        <option value="Ogura">Ogura Cake</option>
                        <option value="Lapis Surabaya">Lapis Surabaya</option>
                        <option value="Dummy Cake">Dummy Cake (Pajangan)</option>
                        <option value="Dummy + Mix">Dummy + Mix</option>
                      </select>
                    </div>

                    {/* --- Field Kondisional: Mix Base --- */}
                    {isMixBaseVisible && (
                      <div className="col-md-6 mb-3">
                        <label htmlFor="mixBase" className="form-label fw-600">Mix dengan Base Apa?</label>
                        <select
                          className="form-select" id="mixBase" name="mixBase"
                          value={formData.mixBase} onChange={handleChange}
                          required={isMixBaseVisible} // Wajib diisi jika muncul
                        >
                          <option value="">Pilih base edible...</option>
                          <option value="Ogura">Ogura</option>
                          <option value="Lapis Surabaya">Lapis Surabaya</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cakeFlavor" className="form-label fw-600">Rasa Kue</label>
                      <select
                        className="form-select" id="cakeFlavor" name="cakeFlavor"
                        value={formData.cakeFlavor} onChange={handleChange}
                        disabled={isFlavorDisabled} // Dinamis
                        required={!isFlavorDisabled} // Dinamis
                      >
                        <option value="">{isFlavorDisabled ? '(Tidak tersedia u/ base ini)' : 'Pilih rasa...'}</option>
                        <option value="Vanilla">Vanilla</option>
                        <option value="Moka">Moka</option>
                        <option value="Keju">Keju</option>
                        <option value="Coklat">Coklat</option>
                        <option value="Pandan">Pandan</option>
                        <option value="Moka Ceres">Moka Ceres</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cakeFilling" className="form-label fw-600">Filling / Selai Kue</label>
                      <select
                        className="form-select" id="cakeFilling" name="cakeFilling"
                        value={formData.cakeFilling} onChange={handleChange}
                        disabled={isFillingDisabled} // Dinamis
                        required={!isFillingDisabled} // Dinamis
                      >
                        <option value="">{isFillingDisabled ? '(Tidak tersedia u/ base ini)' : 'Pilih filling...'}</option>
                        <option value="Blueberry">Blueberry</option>
                        <option value="Strawberry">Strawberry</option>
                        <option value="Mocca">Mocca</option>
                        <option value="Coklat">Coklat</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cakeSize" className="form-label fw-600">Ukuran Kue (Diameter)</label>
                    <select
                      className="form-select" id="cakeSize" name="cakeSize"
                      value={formData.cakeSize} onChange={handleChange} required
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
                    <label htmlFor="themeDescription" className="form-label fw-600">Model Kue / Deskripsi Tema</label>
                    <textarea
                      className="form-control" id="themeDescription" name="themeDescription"
                      rows={5} value={formData.themeDescription} onChange={handleChange}
                      placeholder="Jelaskan desain yang Anda inginkan. Contoh: 'Tema Barbie, warna dominan pink & putih, ada tulisan Happy Birthday, boneka Barbie bawa sendiri'"
                      required
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label htmlFor="cakeText" className="form-label fw-600">Tulisan di Kue (Opsional)</label>
                      <input
                        type="text" className="form-control" id="cakeText"
                        name="cakeText" value={formData.cakeText}
                        onChange={handleChange} placeholder="Contoh: Happy Birthday John!"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="age" className="form-label fw-600">Umur (Opsional)</label>
                      <input
                        type="text" className="form-control" id="age"
                        name="age" value={formData.age}
                        onChange={handleChange} placeholder="Contoh: 17"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="referenceImageUrl" className="form-label fw-600">Link Referensi Gambar (Opsional)</label>
                    <p className="form-text mt-0 mb-2" style={{ color: 'var(--color-text-muted)' }}>
                      Punya contoh gambar? Upload ke Imgur / Pinterest / Google Drive dan tempel link-nya di sini.
                    </p>
                    <input
                      type="url" className="form-control" id="referenceImageUrl"
                      name="referenceImageUrl" value={formData.referenceImageUrl}
                      onChange={handleChange} placeholder="https://pinterest.com/link-gambar-anda"
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
