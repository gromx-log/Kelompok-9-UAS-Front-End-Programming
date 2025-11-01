'use client';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function FaqPage() {
  return (
    <>
      <Head>
        <title>FAQ - Pertanyaan Umum - KartiniAle</title>
      </Head>

      {/* Style kustom untuk Bootstrap Accordion 
        agar warnanya sesuai dengan tema Anda (pink/cokelat)
      */}
      <style jsx>{`
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
        }
        .accordion-item {
          background-color: var(--color-bg-light);
          border-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>

      <div className="container my-5 pt-5">
        <h1 className="text-center mb-5">Pertanyaan Umum (FAQ)</h1>

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
                    Bagaimana cara mengetahui harga kue? Apakah ada pricelist?
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    Harga kue kami bervariasi tergantung pada <strong>desain, ukuran, dan tingkat kerumitan</strong>. Karena setiap kue kustom itu unik, kami tidak memiliki pricelist tetap.
                    <br />
                    <br />
                    Cara terbaik untuk mendapatkan harga adalah dengan mengunjungi halaman <Link href="/products">Produk</Link> kami untuk referensi atau <Link href="/contact">menghubungi kami</Link> langsung dengan konsep desain, jumlah porsi, dan tanggal acara Anda. Kami akan dengan senang hati memberikan penawaran harga.
                  </div>
                </div>
              </div>

              {/* === Pertanyaan 2: Model Kue === */}
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
                    Di mana saya bisa melihat contoh atau model kue?
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    Anda dapat melihat portofolio lengkap kami di beberapa platform:
                    <ul>
                      <li>
                        <strong>Website:</strong> Katalog utama kami tersedia di halaman <Link href="/products">Produk</Link>.
                      </li>
                      <li>
                        <strong>Instagram:</strong> Untuk portofolio terbaru dan *behind-the-scenes*, ikuti kami di <a href="https://instagram.com/kartiniale" target="_blank" rel="noopener noreferrer">@KartiniAle</a>.
                      </li>
                      <li>
                        <strong>TikTok:</strong> Lihat proses pembuatan kue kami di <a href="https://tiktok.com/@kartiniale" target="_blank" rel="noopener noreferrer">@KartiniAle</a>.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* === Pertanyaan 3: Pengiriman === */}
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
                    Dari mana lokasi pengiriman kuenya?
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingThree"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    Semua pesanan kami dibuat dan dikirimkan dari <em>home kitchen</em> kami yang berlokasi di <strong>Jelambar, Jakarta Barat</strong>.
                    <br />
                    <br />
                    Kami juga menyediakan opsi <em>self-pickup</em> (ambil sendiri) di lokasi ini. Harap konfirmasi jam pengambilan Anda setidaknya H-1.
                  </div>
                </div>
              </div>

              {/* === Pertanyaan 4: Potongan Kue === */}
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
                    Apa saja pilihan rasa dan isian kuenya? (Bisa lihat foto potongan kue?)
                  </button>
                </h2>
                <div
                  id="collapseFour"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingFour"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    Kami menawarkan berbagai pilihan rasa dasar (base cake) dan <em>filling</em> premium. Pilihan populer kami meliputi:
                    <ul>
                      <li>Red Velvet dengan Cream Cheese</li>
                      <li>Double Chocolate Fudge</li>
                      <li>Vanilla Bean dengan Swiss Meringue</li>
                      <li>(Tambahkan rasa andalan Anda di sini)</li>
                    </ul>
                    <br />
                    Berikut adalah contoh potongan kue kami untuk menunjukkan tekstur dan lapisan di dalamnya:
                    
                    [Image of a cake slice with multiple layers]
                    <Image
                      src="/images/cake-slice-example.jpg" // GANTI DENGAN PATH GAMBAR ANDA
                      alt="Potongan kue KartiniAle"
                      width={400}
                      height={300}
                      className="img-fluid rounded mt-3"
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        maxHeight: '300px',
                      }}
                    />
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