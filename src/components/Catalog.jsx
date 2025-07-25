

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


// List all .jpg files in public/assets statically (Vite import.meta.glob does not work for public/)
const imageFiles = [
  "IMG_20250722_191115~3.jpg",
  "IMG_20250722_191130~2.jpg",
  "IMG_20250722_191142~2.jpg",
  "IMG_20250722_191155~2.jpg",
  "IMG_20250722_191247~2.jpg",
  "IMG_20250722_191307~2.jpg",
  "IMG_20250722_191343~2.jpg",
  "IMG_20250722_191401~2.jpg",
  "IMG_20250722_191416~2.jpg",
  "IMG_20250722_191431~2.jpg",
  "IMG_20250722_191443~2.jpg",
  "IMG_20250722_191455~2.jpg",
  "IMG_20250722_191529~2.jpg",
  "IMG_20250722_191549~2.jpg",
  "IMG_20250722_191605~2.jpg",
  "IMG_20250722_191648~2.jpg",
  "IMG_20250722_191700~2.jpg",
  "IMG_20250722_191713~2.jpg",
  "IMG_20250722_191727~2.jpg",
  "IMG_20250722_191834~2.jpg",
  // ...add more filenames as needed, up to 100
];


function Lightbox({ image, onClose }) {
  // Prevent modal click from closing when clicking inside content
  const handleModalClick = (e) => e.stopPropagation();
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={handleModalClick}>
        <div className="modal-content bg-dark text-light position-relative">
          <button type="button" className="btn-close btn-close-white position-absolute end-0 m-2" aria-label="Bezárás" onClick={e => { e.stopPropagation(); onClose(); }}></button>
          <div className="modal-body text-center">
            <img src={image} alt="Termék nagy képe" className="img-fluid rounded shadow" style={{ maxHeight: '80vh' }} />
          </div>
        </div>
      </div>
    </div>
  );
}


const Catalog = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState(null);
  const navigate = useNavigate();

  const openModal = (img) => {
    const idx = imageFiles.findIndex(f => '/assets/' + f === img);
    setModalIdx(idx);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalIdx(null);
  };
  const showPrev = (e) => {
    e.stopPropagation();
    setModalIdx(idx => (idx === 0 ? imageFiles.length - 1 : idx - 1));
  };
  const showNext = (e) => {
    e.stopPropagation();
    setModalIdx(idx => (idx === imageFiles.length - 1 ? 0 : idx + 1));
  };

  return (
    <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center pt-5">
      <div className="container py-5">
        <h1 className="display-5 fw-bold mb-4 text-center">Katalógus</h1>
        <div className="row g-0">
        {imageFiles.slice(0, 100).map((filename, idx) => (
          <div className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-2 d-flex justify-content-center align-items-center p-1 position-relative" key={filename}>
            <img
              src={'/assets/' + filename}
              alt={filename}
              className="border border-dark bg-dark"
              style={{ aspectRatio: '1/1', objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.2s', width: '75%', height: '75%' }}
              onClick={() => openModal('/assets/' + filename)}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
            {idx === 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(0,0,0,0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: '1.5rem',
                  letterSpacing: '0.1em',
                  textShadow: '0 2px 8px #000',
                  zIndex: 2,
                  borderRadius: '0.375rem',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                ELADVA
              </div>
            )}
          </div>
        ))}
        </div>
        {modalOpen && modalIdx !== null && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.85)", zIndex: 1050 }}
            onClick={closeModal}
          >
            <div className="position-relative d-flex align-items-center" onClick={e => e.stopPropagation()} style={{ minWidth: '320px' }}>
              <button
                type="button"
                className="btn btn-light position-absolute top-0 end-0 m-2"
                onClick={closeModal}
                aria-label="Bezárás"
                style={{ fontSize: '2rem', lineHeight: 1, zIndex: 2 }}
              >
                &times;
              </button>
              <button
                type="button"
                className="btn btn-secondary position-absolute top-50 start-0 translate-middle-y ms-2"
                onClick={showPrev}
                aria-label="Előző"
                style={{ fontSize: '2rem', zIndex: 2 }}
              >
                &#8592;
              </button>
              <img
                src={'/assets/' + imageFiles[modalIdx]}
                alt="Termék nagy képe"
                className="img-fluid rounded shadow mx-4"
                style={{ maxHeight: '80vh', maxWidth: '90vw' }}
              />
              <button
                type="button"
                className="btn btn-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                onClick={showNext}
                aria-label="Következő"
                style={{ fontSize: '2rem', zIndex: 2 }}
              >
                &#8594;
              </button>
            </div>
          </div>
        )}
      </div>
      <button
        className="btn btn-outline-warning position-fixed bottom-0 start-0 m-4 px-4 py-2 fw-semibold text-uppercase"
        onClick={() => navigate(-1)}
        style={{ zIndex: 10 }}
      >
        Vissza
      </button>
    </main>
  );
};

export default Catalog;
