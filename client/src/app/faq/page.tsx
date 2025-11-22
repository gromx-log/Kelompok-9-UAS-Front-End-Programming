import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image'; 
import styles from './faq.module.css';
import Navbar from '../../components/navbar';
import CTA from '../../components/callToAction';
import Footer from '../../components/footer';
import CustomHeader from '../../components/customHeader';

export const metadata = {
  title: 'FAQ - Pertanyaan Umum - KartiniAle',
};

export default function FaqPage() {
  const whatsappNumber = "6281211365855";
  const whatsappMessage = encodeURIComponent("Halo Kartini Ale, saya ingin konsultasi tentang pemesanan kue custom.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      <Navbar/>
      {/* === Banner Halaman Baru === */}
      <section className={styles.pageHeader}>
        <CustomHeader title='Pertanyaan Umum (FAQ)'/>
      </section>

      {/* === Konten Accordion === */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div
              className="accordion shadow-sm"
              id="faqAccordion"
              style={{ borderRadius: '0.5rem', overflow: 'hidden' }}
            >
              {/* === Pertanyaan 1: Pricelist === */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Boleh minta pricelist?
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    Semua kue kami dibuat <strong>custom</strong>, dirancang sepenuhnya sesuai dengan permintaan dan preferensi setiap pelanggan. 
                    Karena setiap kue memiliki detail dan karakter unik, kami <strong>tidak memiliki daftar harga tetap</strong>.  
                    <br /><br />
                    Harga dapat berbeda tergantung pada <strong>ukuran, base cake, serta tingkat kerumitan desain</strong> yang diinginkan. 
                    Kami selalu berupaya memberikan hasil terbaik, baik dari segi tampilan, maupun rasa dengan menyesuaikan pada kebutuhan.
                    <br /><br />
                    Untuk mendapatkan gambaran harga dan inspirasi desain, silakan kunjungi halaman 
                    <Link href="/products"> Galeri</Link> untuk melihat berbagai contoh karya kami.  
                    <br /><br />
                    Jika Anda sudah memiliki konsep atau ide tertentu, Anda bisa melakukan 
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer"> konsultasi dengan kami</a> terlebih dahulu. 
                    Setelah detail pesanan sudah fix dan jelas, Anda dapat mengisi <Link href="/order">Form Pemesanan</Link> kami 
                    agar kami dapat memproses pesanan Anda dengan lebih cepat dan akurat.
                  </div>
                </div>
              </div>

              {/* === Pertanyaan 2: Pengiriman === */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    Pengiriman dari mana?
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    Pengiriman dilakukan dari <strong>Jelambar, Jakarta Barat</strong>. 
                    Karena setiap kue kami dibuat dengan detail dan dekorasi yang lembut, kami sangat menyarankan untuk menggunakan 
                    <strong> jasa pengiriman khusus kue menggunakan mobil</strong> agar kue tiba di lokasi dengan aman dan tetap dalam kondisi sempurna.  
                    <br /><br />
                    Anda dapat mengatur pengiriman sendiri melalui layanan seperti <strong>GoCar, GrabCar, atau Lalamove</strong>, 
                    namun kami juga dengan senang hati akan <strong>membantu memesankan layanan pengiriman</strong> untuk Anda 
                    melalui mitra yang sudah berpengalaman menangani produk kue dan dessert.  
                    <br /><br />
                    Biaya pengiriman akan menyesuaikan dengan jarak dan jenis layanan yang digunakan. 
                    Kami akan membantu memberikan estimasi dan memastikan kue Anda dikirim pada waktu yang tepat agar tetap segar saat diterima.
                  </div>
                </div>
              </div>

              {/* === Pertanyaan 3: Pilihan Kue === */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    Pilihan bagian dalam kue ada apa saja?
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingThree"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    Kami menyediakan dua pilihan base cake premium: 
                    <strong> Ogura Cake</strong> dan <strong> Lapis Surabaya Premium</strong>.  
                    <br /><br />
                    <strong>Ogura Cake</strong> memiliki tekstur yang sangat lembut, ringan, dan moist. Sangat cocok untuk Anda yang menyukai rasa manis yang halus dan tidak berlebihan.  
                    Sementara itu, <strong>Lapis Surabaya Premium</strong> menawarkan sensasi padat, kaya rasa, dan lebih "buttery", sempurna untuk desain kue yang ingin tampil elegan dan klasik.  
                    <br /><br />
                    Anda dapat melihat penjelasan lebih detail beserta foto potongan kue di halaman 
                    <Link href="/our-cakes"> Tentang Kue Kami</Link> untuk membantu memilih base cake yang paling sesuai dengan selera dan konsep acara Anda.
                  </div>
                </div>
              </div>

              {/* === Pertanyaan 4: Cara Pesan === */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingFour">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFour"
                    aria-expanded="false"
                    aria-controls="collapseFour"
                  >
                    Bagaimana cara pesannya?
                  </button>
                </h2>
                <div
                  id="collapseFour"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingFour"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    Untuk melakukan pemesanan, silakan isi form di halaman <Link href="/order">Pesan Sekarang</Link>. 
                    Lengkapi semua detail yang dibutuhkan, seperti ukuran, jenis kue, tema desain, dan tanggal acara, 
                    agar kami dapat memahami kebutuhan Anda dengan lebih baik.  
                    <br /><br />
                    Namun, jika Anda masih belum yakin dengan detail pesanan atau ingin mendiskusikan konsep terlebih dahulu, 
                    silakan <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><strong>Konsultasi Sekarang</strong></a> dengan kami. 
                    Tim kami akan dengan senang hati membantu memberikan rekomendasi terkait ukuran, desain, base cake yang sesuai, 
                    serta memberikan <strong>estimasi harga dan jadwal produksi</strong> sesuai dengan kebutuhan acara Anda.  
                    <br /><br />
                    Setelah semua detail sudah jelas dan Anda merasa yakin, barulah Anda dapat mengisi form pemesanan 
                    agar kami dapat segera memproses pesanan dengan lebih cepat dan akurat. 
                    Jangan ragu untuk bertanya—Kartini Ale siap membantu mewujudkan kue impian Anda!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CTA/>
      <Footer/>
    </>
  );
}