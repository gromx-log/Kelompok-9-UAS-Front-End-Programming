"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductImages({ images }: { images: string[] }) {
  const [modalSrc, setModalSrc] = useState<string | null>(null);

  return (
    <>
      {/* Carousel */}
      <div
        id="productCarousel"
        className="carousel slide carousel-dark"
        data-bs-ride="carousel"
        data-bs-interval="3500"
      >
        <div className="carousel-inner">
          {images.map((img, i) => (
            <div
              key={i}
              className={`carousel-item ${i === 0 ? "active" : ""}`}
            >
              <div
                data-bs-toggle="modal"
                data-bs-target="#imageModal"
                onClick={() => setModalSrc(img)}
                style={{
                  position: "relative",
                  height: "500px",
                  width: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "zoom-in",
                }}
              >
                <Image
                  src={img}
                  alt="product image"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#productCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" />
            </button>

            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#productCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" />
            </button>
          </>
        )}
      </div>

      {/* Modal (Bootstrap-controlled) */}
      <div
        className="modal fade"
        id="imageModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-dark p-2">
            {modalSrc && (
              <img
                src={modalSrc}
                alt="Full"
                className="img-fluid rounded"
                style={{
                  maxHeight: "90vh",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
