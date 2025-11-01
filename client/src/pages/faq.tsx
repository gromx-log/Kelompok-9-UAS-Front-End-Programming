import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image'; // Tetap di-import, meskipun tidak dipakai di Q&A baru

export default function FaqPage() {
  return (
    <>
      <Head>
        <title>FAQ - Pertanyaan Umum - KartiniAle</title>
      </Head>

      {/* Style kustom untuk Bootstrap Accordion & Banner Halaman Baru
      */}
      <style jsx>{`
        /* == Gaya Accordion == */
        .accordion-button {
          font-weight: 600;
          color: var(--color-text);
          background-color: var(--color-bg-light);
        }
        .accordion-button:not(.collapsed) {
          color: var(--color-text);
          background-color: #fffbf8; /* Sedikit lebih gelap dari putih */
          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.05);
        }
        .accordion-button:focus {
          box-shadow: 0 0 0 0.25rem rgba(249, 175, 175, 0.5); /* Warna --color-accent-light */
          border-color: var(--color-accent);
        }
        .accordion-body {
          color: var(--color-text-muted);
          line-height: 1.7; /* Membuat teks jawaban lebih mudah dibaca */
        }
        .accordion-item {
          background-color: var(--color-bg-light);
          border-color: rgba(0, 0, 0, 0.05);
        }

        /* == Gaya Banner Halaman Baru == */
        .page-header {
          background-color: var(--color-primary);
          color: #fff;
          padding-top: 9rem;
          padding-bottom: 3rem;
        }

        /* Style untuk Breadcrumbs di atas banner */
        .breadcrumb {
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        :global(.breadcrumb-item a) {
          color: #fff;
          text-decoration: none;
        }
        :global(.breadcrumb-item a:hover) {
          text-decoration: underline;
        }
        :global(.breadcrumb-item.active) {
          color: rgba(255, 255, 255, 0.8);
        }
        :global(.breadcrumb-item + .breadcrumb-item::before) {
          color: rgba(255, 255, 255, 0.8);
        }
        
        /* == Mobile Friendly untuk Banner == */
        @media (max-width: 768px) {
          .page-header {
            padding-top: 7rem;
            padding-bottom: 2.5rem;
          }
        }
      `}</style>

      {/* === Banner Halaman Baru === */}
      <section className="page-header">
        <div className="container text-center">
          <h1 className="display-5 display-lg-4 fade-in-up fw-bold" style={{ color: 'var(--color-text)' }}>
            Pertanyaan Umum (FAQ)
          </h1>
        </div>
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
              {/* === Pertanyaan 1: Pricelist === (KONTEN BARU) */}
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
                    <Link href="/gallery"> Galeri</Link> untuk melihat berbagai contoh karya kami.  
                    Jika Anda sudah memiliki konsep atau ide tertentu, anda dapat mengisi <Link href="/order"> Form Pemesanan </Link> 
                  </div>
                </div>
              </div>

              {/* === Pertanyaan 2: Pengiriman === (KONTEN BARU) */}
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
                    Pengiriman dilakukan dari <strong>  Jelambar, Jakarta Barat</strong>. 
                    Karena setiap kue kami dibuat dengan detail dan dekorasi yang lembut, kami sangat menyarankan untuk menggunakan 
                    <strong> jasa pengiriman khusus kue (mobil) </strong>agar kue tiba di lokasi dengan aman dan tetap dalam kondisi sempurna.  
                    <br /><br />
                    Anda dapat mengatur pengiriman sendiri, namun kami juga dengan senang hati akan <strong> membantu memesankan layanan pengiriman </strong>
                    melalui mitra logistik yang sudah berpengalaman menangani produk kue dan dessert.  
                    <br /><br />
                    Biaya pengiriman akan menyesuaikan dengan jarak dan jenis kendaraan yang digunakan. 
                    Kami akan membantu memberikan estimasi dan memastikan kue Anda dikirim pada waktu yang tepat agar tetap segar saat diterima.
                  </div>
                </div>
              </div>

              {/* === Pertanyaan 3: Pilihan Kue === (KONTEN BARU) */}
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
                    Sementara itu, <strong>Lapis Surabaya Premium</strong> menawarkan sensasi padat, kaya rasa, dan lebih “buttery”, sempurna untuk desain kue yang ingin tampil elegan dan klasik.  
                    <br /><br />
                    Anda dapat melihat penjelasan lebih detail beserta foto potongan kue di halaman 
                    <Link href="/our-cakes"> Tentang Kue Kami</Link> untuk membantu memilih base cake yang paling sesuai dengan selera dan konsep acara Anda.
                  </div>
                </div>
              </div>

              {/* === Pertanyaan 4: Cara Pesan === (KONTEN BARU) */}
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
                    Setelah form dikirim, Anda akan langsung terhubung ke <strong> WhatsApp kami </strong> untuk proses konsultasi. 
                    Di sana, tim kami akan membantu memberikan rekomendasi, menyesuaikan desain jika diperlukan, 
                    serta memberikan <strong> estimasi harga dan jadwal produksi </strong> sesuai dengan permintaan Anda.  
                    <br /><br />
                    Jangan ragu untuk bertanya atau berdiskusi. Kartini Ale dengan senang hati akan membantu Anda untuk membuat kue sesuai dengan keinginan Anda.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}