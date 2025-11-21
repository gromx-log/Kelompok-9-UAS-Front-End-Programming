"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import CustomHeader from "../../components/customHeader";
import styles from "./order.module.css";
import { label } from "framer-motion/client";

interface IFormData {
  customerName: string;
  customerPhone: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryAddress: string;
  cakeBase: "Ogura Cake" | "Lapis Surabaya" | "Dummy Cake" | "Dummy + Mix";
  mixBase: "Ogura Cake" | "Lapis Surabaya" | "";
  cakeFlavor: string;
  cakeFilling: string;
  cakeDiameter: string;
  cakeTiers: number | "";
  cakeText: string;
  age: number | "";
  cakeModel: string;
  referenceImageUrl: string;
}

export default function OrderPage() {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<IFormData>({
    customerName: "",
    customerPhone: "",
    deliveryDate: "",
    deliveryTime: "",
    deliveryAddress: "",
    cakeBase: "Ogura Cake",
    mixBase: "",
    cakeFlavor: "",
    cakeFilling: "",
    cakeDiameter: "",
    cakeTiers: 1,
    cakeText: "",
    age: "",
    cakeModel: "",
    referenceImageUrl: "",
  });

  const [isMixBaseVisible, setIsMixBaseVisible] = useState(false);
  const [isFlavorDisabled, setIsFlavorDisabled] = useState(false);
  const [isFillingDisabled, setIsFillingDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const { cakeBase, mixBase } = formData;

    const showMixBase = cakeBase === "Dummy + Mix";
    setIsMixBaseVisible(showMixBase);
    if (!showMixBase) setFormData((prev) => ({ ...prev, mixBase: "" }));

    const disableFlavor =
      cakeBase === "Lapis Surabaya" ||
      cakeBase === "Dummy Cake" ||
      (cakeBase === "Dummy + Mix" &&
        (mixBase === "Lapis Surabaya" || mixBase === ""));
    setIsFlavorDisabled(disableFlavor);
    if (disableFlavor) setFormData((prev) => ({ ...prev, cakeFlavor: "" }));

    const disableFilling = cakeBase === "Dummy Cake";
    setIsFillingDisabled(disableFilling);
    if (disableFilling) setFormData((prev) => ({ ...prev, cakeFilling: "" }));
  }, [formData.cakeBase, formData.mixBase]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: any = {
        ...formData,
        cakeFlavor: isFlavorDisabled ? "" : formData.cakeFlavor,
        cakeFilling: isFillingDisabled ? "" : formData.cakeFilling,
        mixBase: isMixBaseVisible ? formData.mixBase : "",
        cakeTiers: Number(formData.cakeTiers),
      };

      console.log("Payload:", payload);

      const response = await fetch(
        "https://kelompok-9-uas-front-end-programming-production.up.railway.app/api/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal menyimpan pesanan");

      console.log("Sukses:", data);

      const adminPhoneNumber = "6281211365855";
      let message = `Hai Kartini Ale, saya mau pesan kue custom:\n\n`;
      message += `*1. DATA PEMESAN*\nNama: ${formData.customerName}\nNo. HP/WA: ${formData.customerPhone}\nAlamat Pengiriman:\n${formData.deliveryAddress}\n\n`;
      message += `*2. JADWAL PENGIRIMAN*\nTanggal: ${formData.deliveryDate}\nWaktu: ${formData.deliveryTime}\n\n`;
      message += `*3. DETAIL KUE*\nModel/Tema: ${formData.cakeModel}\nBase Cake: ${formData.cakeBase}\n`;
      if (isMixBaseVisible && formData.mixBase) message += `Mix dengan: ${formData.mixBase}\n`;
      if (!isFlavorDisabled && formData.cakeFlavor) message += `Rasa Kue: ${formData.cakeFlavor}\n`;
      if (!isFillingDisabled && formData.cakeFilling) message += `Filling/Selai: ${formData.cakeFilling}\n`;
      message += `Tingkat Kue: ${formData.cakeTiers}\nDiameter: ${formData.cakeDiameter}\n\n`;
      message += `*4. TULISAN*\nTulisan di Kue: ${formData.cakeText}\n`;
      if (formData.age) message += `Umur: ${formData.age}\n`;
      message += `\n---\nMohon info selanjutnya untuk harga dan konfirmasi. Terima kasih!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");

      setFormData({
        customerName: "",
        customerPhone: "",
        deliveryDate: "",
        deliveryTime: "",
        deliveryAddress: "",
        cakeBase: "Ogura Cake",
        mixBase: "",
        cakeFlavor: "",
        cakeFilling: "",
        cakeDiameter: "",
        cakeTiers: 1,
        cakeText: "",
        age: "",
        cakeModel: "",
        referenceImageUrl: "",
      });
    } catch (error) {
      console.error(error);
      setSubmitError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <CustomHeader title="Pesan Kue Custom" subtitle='Wujudkan kue impian anda bersama Kartini Ale'/>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className={styles.orderContainer}>
              <form onSubmit={handleSubmit}>

                {/* 1. Data Diri */}
                <div className={`mb-5 sectionFadeIn`}>
                  <h3 className={styles.sectionHeader}>1. Data Diri Anda</h3>
                  <div className="form-floating mb-3">
                    <input type="text" className="form-control" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Nama Lengkap" required />
                    <label>Nama Lengkap</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="tel" className="form-control" name="customerPhone" value={formData.customerPhone} onChange={handleChange} placeholder="08123456789" required />
                    <label>No. WhatsApp (Aktif)</label>
                  </div>
                  <div className="form-floating mb-3">
                    <textarea className="form-control" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} placeholder="Alamat lengkap" style={{ height: 80 }} required></textarea>
                    <label>Alamat Pengiriman</label>
                  </div>
                </div>

                {/* 2. Detail Pesanan */}
                <div className={`mb-5 sectionFadeIn`}>
                  <h3 className={styles.sectionHeader}>2. Detail Pesanan</h3>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-600">Tanggal Pengiriman</label>
                      <input type="date" className="form-control" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} min={today} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-600">Waktu Pengiriman</label>
                      <input type="time" className="form-control" name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-600">Base Cake</label>
                      <select className="form-select" name="cakeBase" value={formData.cakeBase} onChange={handleChange}>
                        <option value="Ogura Cake">Ogura</option>
                        <option value="Lapis Surabaya">Lapis Surabaya</option>
                        <option value="Dummy Cake">Dummy Cake</option>
                        <option value="Dummy + Mix">Dummy + Mix</option>
                      </select>
                    </div>

                    {isMixBaseVisible && (
                      <div className="col-md-6 mixBaseContainer">
                        <label className="form-label fw-600">Mix dengan Base</label>
                        <select className="form-select" name="mixBase" value={formData.mixBase} onChange={handleChange}>
                          <option value="">Pilih Mix Base</option>
                          <option value="Ogura Cake">Ogura</option>
                          <option value="Lapis Surabaya">Lapis Surabaya</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-600">Rasa Kue</label>
                      <select className="form-select" name="cakeFlavor" value={formData.cakeFlavor} onChange={handleChange} disabled={isFlavorDisabled}>
                        <option value="">Pilih Rasa</option>
                        <option value="Vanilla">Vanilla</option>
                        <option value="Moka">Moka</option>
                        <option value="Keju">Keju</option>
                        <option value="Coklat">Coklat</option>
                        <option value="Pandan">Pandan</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-600">Filling / Selai</label>
                      <select className="form-select" name="cakeFilling" value={formData.cakeFilling} onChange={handleChange} disabled={isFillingDisabled}>
                        <option value="">Pilih Filling</option>
                        <option value="Blueberry">Blueberry</option>
                        <option value="Strawberry">Strawberry</option>
                        <option value="Mocca">Mocca</option>
                        <option value="Coklat">Coklat</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-8">
                      <div className="form-floating">
                        <input type="number" 
                        className="form-control" 
                        name="cakeDiameter" 
                        value={formData.cakeDiameter} 
                        onChange={handleChange} 
                        placeholder="Contoh: 20cm" 
                        required 
                        min={1}
                        max={30}
                        />
                        <label>Diameter Kue</label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input type="number" 
                        className="form-control" 
                        name="cakeTiers" 
                        value={formData.cakeTiers} 
                        onChange={handleChange} 
                        min={1} max={10} 
                        placeholder="Tingkat" 
                        required />
                        <label>Jumlah Tingkat</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Desain & Tulisan */}
                <div className={`mb-5 sectionFadeIn`}>
                  <h3 className={styles.sectionHeader}>3. Desain & Tulisan</h3>
                  <div className="form-floating mb-3">
                    <textarea className="form-control" name="cakeModel" value={formData.cakeModel} onChange={handleChange} rows={5} placeholder="Deskripsi desain kue" required></textarea>
                    <label>Model Kue / Tema</label>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-8">
                      <div className="form-floating">
                        <input type="text" className="form-control" name="cakeText" value={formData.cakeText} onChange={handleChange} placeholder="Tulisan di kue" required />
                        <label>Tulisan di Kue</label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input type="number" className="form-control" name="age" value={formData.age} onChange={handleChange} placeholder="Umur (Opsional)" min={0} />
                        <label>Umur (Opsional)</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="d-grid mt-4">
                  <button type="submit" className={`btn btn-lg py-3 ${styles.submitButton}`} disabled={isSubmitting}>
                    {isSubmitting ? "Menyimpan..." : "Pesan Sekarang"}
                  </button>
                  {submitError && <div className={`alert alert-danger mt-3 ${styles.errorAlert}`}>{submitError}</div>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
