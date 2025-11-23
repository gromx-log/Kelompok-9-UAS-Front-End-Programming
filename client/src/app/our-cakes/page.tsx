import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import Navbar from '../../components/navbar';
import CTA from '../../components/callToAction';
import Footer from '../../components/footer';
import CustomHeader from '../../components/customHeader';

const oguraImage = "https://res.cloudinary.com/drb9yajiy/image/upload/v1763866544/IMG_6125_s5syns.jpg";
const lapisImage = "https://res.cloudinary.com/drb9yajiy/image/upload/v1763866544/PhotoRoom_20231114_215014_yrkqni.jpg";
const damiImage = "/images/placeholder-dami.jpg";

export const metadata = {
  title: 'Tentang Kue Kami - KartiniAle',
  description: 'Pelajari tentang base cake premium kami: Ogura Cake yang lembut dan Lapis Surabaya Premium yang kaya rasa.',
};

export default function OurCakesPage() {
  return (
    <>

      <Navbar/>
      
      {/* Header */}
      <CustomHeader 
        title='Kualitas di Balik Keindahan'
        subtitle='Pelajari mengapa kue kami tidak hanya cantik, tapi juga lezat tak terlupakan.'
      />

      {/* Main Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          
          {/* Tabs Navigation */}
          <ul 
            className="nav nav-pills mb-4 justify-content-center fade-in-up our-cakes-tabs" 
            id="cakeTabs" 
            role="tablist"
            style={{ fontSize: '1.1rem' }}
          >
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link active" 
                id="ogura-tab-btn" 
                data-bs-toggle="pill" 
                data-bs-target="#ogura-tab-pane" 
                type="button" 
                role="tab" 
                aria-controls="ogura-tab-pane" 
                aria-selected="true"
              >
                <i className="bi bi-cloud-sun-fill"></i>
                <span className="tab-text"> Ogura Cake (Standar)</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link" 
                id="lapis-tab-btn" 
                data-bs-toggle="pill" 
                data-bs-target="#lapis-tab-pane" 
                type="button" 
                role="tab" 
                aria-controls="lapis-tab-pane" 
                aria-selected="false"
              >
                <i className="bi bi-gem"></i>
                <span className="tab-text"> Lapis Surabaya (Premium)</span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link" 
                id="dami-tab-btn" 
                data-bs-toggle="pill" 
                data-bs-target="#dami-tab-pane" 
                type="button" 
                role="tab" 
                aria-controls="dami-tab-pane" 
                aria-selected="false"
              >
                <i className="bi bi-image-fill"></i>
                <span className="tab-text"> Dummy Cake</span>
              </button>
            </li>
          </ul>

          {/* Tabs Content */}
          <div className="tab-content pt-4" id="cakeTabsContent">
            
            {/* Ogura Cake */}
            <div 
              className="tab-pane fade show active" 
              id="ogura-tab-pane" 
              role="tabpanel" 
              aria-labelledby="ogura-tab-btn"
            >
              <div className="row g-5 align-items-center">
                <div className="col-lg-6">
                  <Image
                    src={oguraImage}
                    alt="Potongan Kue Ogura"
                    width={800} height={600}
                    className="img-fluid rounded shadow-sm"
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  />
                </div>
                <div className="col-lg-6">
                  <h2 className="display-5 fw-bold mb-3">Lembutnya Ogura Cake</h2>
                  <p className="lead fs-5 mb-4" style={{ color: 'var(--color-text-muted)' }}>
                    Pilihan standar kami bukanlah bolu biasa. Ogura Cake memiliki
                    tekstur selembut kapas, mirip Japanese Cheesecake, yang
                    tidak seret di tenggorokan dan tetap empuk bahkan setelah
                    disimpan di kulkas.
                  </p>
                  <h5 className="fw-bold">Pilihan Rasa Tersedia:</h5>
                  <ul className="list-unstyled fs-5" style={{ color: 'var(--color-text)' }}>
                    <li><i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--color-accent)' }}></i> Coklat</li>
                    <li><i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--color-accent)' }}></i> Mocca</li>
                    <li><i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--color-accent)' }}></i> Keju</li>
                    <li><i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--color-accent)' }}></i> Vanilla</li>
                    <li><i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--color-accent)' }}></i> Pandan</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Lapis Surabaya */}
            <div 
              className="tab-pane fade" 
              id="lapis-tab-pane" 
              role="tabpanel" 
              aria-labelledby="lapis-tab-btn"
            >
              <div className="row g-5 align-items-center">
                <div className="col-lg-6">
                  <Image
                    src={lapisImage}
                    alt="Potongan Kue Lapis Surabaya"
                    width={800} height={600}
                    className="img-fluid rounded shadow-sm"
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  />
                </div>
                <div className="col-lg-6">
                  <h2 className="display-5 fw-bold mb-3">Mewahnya Lapis Surabaya Premium</h2>
                  <p className="lead fs-5 mb-4" style={{ color: 'var(--color-text-muted)' }}>
                    Untuk Anda yang mencari kemewahan. Kami hanya menggunakan resep premium
                    (bukan ekonomis) yang memakai 40 kuning telur per loyang 20cm
                    dan 100% butter Wijsman.
                  </p>
                  <p className="fs-5" style={{ color: 'var(--color-text)' }}>
                    Hasilnya adalah kue yang padat, kaya rasa, dan lumer di mulut
                    tanpa bahan pengembang buatan.
                  </p>
                </div>
              </div>
            </div>

            {/* Dami Cake */}
            <div 
              className="tab-pane fade" 
              id="dami-tab-pane" 
              role="tabpanel" 
              aria-labelledby="dami-tab-btn"
            >
              <div className="row g-5 align-items-center">
                <div className="col-lg-6">
                  <Image
                    src={damiImage}
                    alt="Kue Dami Styrofoam"
                    width={800} height={600}
                    className="img-fluid rounded shadow-sm"
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  />
                </div>
                <div className="col-lg-6">
                  <h2 className="display-5 fw-bold mb-3"> Dummy Cake</h2>
                  <p className="lead fs-5 mb-4" style={{ color: 'var(--color-text-muted)' }}>
                    Butuh kue yang cantik hanya untuk keperluan foto? Kami punya solusi hemat.
                  </p>
                  <p className="fs-5" style={{ color: 'var(--color-text)' }}>
                    Kami menyediakan opsi Dummy Cake, yaitu kue palsu dari styrofoam
                    yang kami hias secantik mungkin, disajikan dengan kue potong asli
                    secara terpisah. Lebih hemat dan bisa Anda simpan sebagai kenang-kenangan.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <CTA/>
      <Footer/>
    </>
  );
}
