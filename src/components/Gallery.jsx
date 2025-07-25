import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Timeline session data (should match Home.jsx)
const timelineSessions = [
  { name: 'András Dóri', dir: '1. Andras Dori' },
  { name: 'Antonella Csongor', dir: '2. Antonella Csongor' },
  { name: 'Bocsi Barbi', dir: '3. Bocsi Barbi' },
  { name: 'Divatbemutató', dir: '4. Divatbemutato' },
  { name: 'Kálmán 2023', dir: '5. Kalman 2023' },
  { name: 'Karácsonyi tangóbal', dir: '6. Karacsonyi tangobal' },
  { name: 'Moni 1', dir: '7. Moni 1' },
  { name: 'Moni 2', dir: '8. Moni 2' },
  { name: 'Tangóbal 2018', dir: '9. Tangobal 2018' },
  { name: 'Tangóbal 2019', dir: '10. Tangobal 2019' },
];

// Map of session dir to sorted image filenames (first 100)
const sessionImages = {
  '1. Andras Dori': [
    "IMG_0005.JPG","IMG_0012.JPG","IMG_0021.JPG","IMG_0030.JPG","IMG_0034.JPG","IMG_0039.JPG","IMG_0049.JPG","IMG_0096.JPG","IMG_0098.JPG","IMG_0101.JPG","IMG_9920.JPG","IMG_9924.JPG","IMG_9928.JPG","IMG_9940.JPG","IMG_9948.JPG","IMG_9958.JPG","IMG_9964.JPG","IMG_9970.JPG","IMG_9980.JPG","IMG_9989.JPG","IMG_9994.JPG"
  ],
  '2. Antonella Csongor': [
    "m (103) - Copy.jpg","m (165) - Copy.jpg","m (168) - Copy.jpg","m (191) - Copy.jpg","m (197) - Copy.jpg","m (226) - Copy.jpg","m (238) - Copy.jpg","m (244) - Copy.jpg","m (245) - Copy.jpg","m (255) - Copy.jpg","m (263) - Copy.jpg","m (268) - Copy.jpg","m (281) - Copy.jpg","m (320) - Copy.jpg","m (325) - Copy.jpg","m (362) - Copy.jpg","m (365) - Copy.jpg","m (369) - Copy.jpg","m (372) - Copy.jpg","m (373) - Copy.jpg","m (388) - Copy.jpg","m (390) - Copy.jpg","m (413) - Copy.jpg","m (427) - Copy.jpg","m (439) - Copy.jpg","m (460) - Copy.jpg","m (466) - Copy.jpg","m (472) - Copy.jpg"
  ],
  '3. Bocsi Barbi': ["01.jpg","02.jpg","03.jpg","04.jpg","05.jpg","c1.jpg"],
  '4. Divatbemutato': ["DSC09154 (2).jpg","DSC09155 (2).jpg","DSC09157 (2).jpg","DSC09160 (2).jpg","DSC09167 (2).jpg","DSC09196 (2).jpg","DSC09197 (2).jpg","DSC09203 (2).jpg","DSC09204 (2).jpg","DSC09208 (2).jpg","DSC09209 (2).jpg","DSC09210 (2).jpg","DSC09212 (2).jpg","DSC09219 (2).jpg","DSC09220 (2).jpg","DSC09221 (2).jpg","DSC09222 (2).jpg","DSC09223 (2).jpg","DSC09224 (2).jpg","DSC09234 (2).jpg","DSC09235 (2).jpg"],
  '5. Kalman 2023': ["K   (102).jpg","K   (113).jpg","K   (122).jpg","K   (123).jpg","K   (16).jpg","K   (274).jpg","K   (343).jpg","K   (362).jpg","K   (40).jpg","K   (43).jpg","K   (55).jpg","K   (57).jpg","K   (73).jpg","K   (82).jpg","K   (89).jpg","K   (99).jpg"],
  '6. Karacsonyi tangobal': ["_DSC4693.jpg","_DSC4695.jpg","_DSC4696.jpg","_DSC4703.jpg","_DSC4706.jpg","_DSC4708.jpg","_DSC4711.jpg","_DSC4712.jpg","_DSC4713.jpg","_DSC4714.jpg","_DSC4715.jpg","_DSC4717.jpg","_DSC4718.jpg","_DSC4719.jpg","_DSC4721.jpg","_DSC4722.jpg","_DSC4724.jpg","_DSC4726.jpg","_DSC4732.jpg","_DSC4733.jpg","_DSC4737.jpg","_DSC4740.jpg","_DSC4745.jpg","_DSC4747.jpg","_DSC4751.jpg","_DSC4754.jpg","_DSC4758.jpg","_DSC4761.jpg","_DSC4766.jpg","_DSC4778.jpg","_DSC4780.jpg","_DSC4785.jpg"],
  '7. Moni 1': ["2 (1).jpg","2 (112).jpg","2 (133).jpg","2 (140).jpg","2 (15).jpg","2 (30).jpg","2 (70).jpg","2 (8).jpg","2 (80).jpg","2 (87).jpg","2 (93).jpg","BMT  (150).jpg","BMT  (192).jpg","BMT  (210).jpg","BMT  (241).jpg","BMT  (25).jpg","BMT  (290).jpg","BMT  (337).jpg","BMT  (342).jpg","BMT  (37).jpg","BMT  (377).jpg","BMT  (413).jpg","BMT  (423).jpg","BMT  (48).jpg","BMT  (480).jpg","BMT  (495).jpg","BMT  (502).jpg","BMT  (513).jpg","BMT  (518).jpg","BMT  (522).jpg","BMT  (527).jpg","BMT  (537).jpg","BMT  (541).jpg","BMT  (63).jpg","BMT  (68).jpg"],
  '8. Moni 2': ["centiméteres.jpg","centiméteres_kicsi.jpg","DSC_0038 + .jpg","DSC_0038.jpg","DSC_0085.jpg","DSC_0110.jpg","DSC_0118.jpg","DSC_0155.jpg","DSC_0176 + +  .jpg","DSC_0176 + + +  .jpg","DSC_0176 + + + .jpg","DSC_0176 + .jpg","DSC_0193.jpg","DSC_0251.jpg","DSC_0268.jpg","DSC_0297.jpg","DSC_0299.jpg","DSC_0300.jpg","DSC_0303.jpg","DSC_0334.jpg","DSC_0363.jpg","DSC_0372.jpg","DSC_0403.jpg","DSC_0418 + .jpg","DSC_0418.jpg","DSC_0435 + .jpg","DSC_0447 + .jpg","DSC_0447.jpg","DSC_0522.jpg","DSC_0524.jpg","DSC_0527.jpg","DSC_0543.jpg","DSC_0555.jpg","DSC_0571.jpg","DSC_0577.jpg","DSC_0577_1.jpg","DSC_0586.jpg","DSC_0599.jpg","DSC_0617.jpg","DSC_0636.jpg","DSC_0645 + .jpg","DSC_0645.jpg","DSC_0651.jpg","DSC_0663.jpg","DSC_0664.jpg","Muhari_cabeceo.jpg","PinUp.jpg"],
  '9. Tangobal 2018': ["DSC_0001.jpg","DSC_0003.jpg","DSC_0004.jpg","DSC_0005.jpg","DSC_0006.jpg","DSC_0007.jpg","DSC_0008.jpg","DSC_0009.jpg","DSC_0010.jpg","DSC_0011.jpg","DSC_0012.jpg","DSC_0013.jpg","DSC_0015.jpg","DSC_0016.jpg","DSC_0021.jpg","DSC_0022.jpg","DSC_0024.jpg","DSC_0025.jpg","DSC_0026.jpg","DSC_0027.jpg","DSC_0028.jpg","DSC_0029.jpg","DSC_0030.jpg","DSC_0031.jpg","DSC_0032.jpg","DSC_0033.jpg","DSC_0034.jpg","DSC_0036.jpg","DSC_0037.jpg","DSC_0038.jpg","DSC_0042.jpg","DSC_0043.jpg","DSC_0044.jpg","DSC_0045.jpg","DSC_0046.jpg","DSC_0048.jpg","DSC_0049.jpg","DSC_0050.jpg","DSC_0051.jpg","DSC_0052.jpg","DSC_0053.jpg","DSC_0054.jpg","DSC_0055.jpg","DSC_0056.jpg","DSC_0057.jpg","DSC_0058.jpg","DSC_0059.jpg","DSC_0060.jpg","DSC_0064.jpg","DSC_0065.jpg","DSC_0066.jpg","DSC_0067.jpg","DSC_0068.jpg","DSC_0069.jpg","DSC_0070.jpg","DSC_0071.jpg","DSC_0073.jpg","DSC_0074.jpg","DSC_0075.jpg","DSC_0078.jpg","DSC_0079.jpg","DSC_0080.jpg","DSC_0081.jpg","DSC_0082.jpg","DSC_0083.jpg","DSC_0084.jpg","DSC_0085.jpg","DSC_0087.jpg","DSC_0088.jpg","DSC_0089.jpg","DSC_0090.jpg","DSC_0091.jpg","DSC_0092.jpg","DSC_0093.jpg","DSC_0094.jpg","DSC_0095.jpg","DSC_0096.jpg","DSC_0097.jpg","DSC_0098.jpg","DSC_0099.jpg","DSC_0100.jpg","DSC_0101.jpg","DSC_0102.jpg","DSC_0103.jpg"],
  '10. Tangobal 2019': ["_DSC4693.jpg","_DSC4695.jpg","_DSC4696.jpg","_DSC4703.jpg","_DSC4706.jpg","_DSC4708.jpg","_DSC4711.jpg","_DSC4712.jpg","_DSC4713.jpg","_DSC4714.jpg","_DSC4715.jpg","_DSC4717.jpg","_DSC4718.jpg","_DSC4719.jpg","_DSC4721.jpg","_DSC4722.jpg","_DSC4724.jpg","_DSC4726.jpg","_DSC4732.jpg","_DSC4733.jpg","_DSC4737.jpg","_DSC4740.jpg","_DSC4745.jpg","_DSC4747.jpg","_DSC4751.jpg","_DSC4754.jpg","_DSC4758.jpg","_DSC4761.jpg","_DSC4766.jpg","_DSC4778.jpg","_DSC4780.jpg","_DSC4785.jpg"]
};

function Lightbox({ image, onClose }) {
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

const Gallery = () => {
  const { sessionDir } = useParams();
  const navigate = useNavigate();
  const images = sessionImages[sessionDir] || [];
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState(null);

  const openModal = (img) => {
    const idx = images.findIndex(f => `/assets/Fotozasok/${sessionDir}/${f}` === img);
    setModalIdx(idx);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalIdx(null);
  };
  const showPrev = (e) => {
    e.stopPropagation();
    setModalIdx(idx => (idx === 0 ? images.length - 1 : idx - 1));
  };
  const showNext = (e) => {
    e.stopPropagation();
    setModalIdx(idx => (idx === images.length - 1 ? 0 : idx + 1));
  };

  return (
    <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center pt-5">
      <div className="container py-5">
        <h1 className="display-5 fw-bold mb-4 text-center">Galéria</h1>
        <div className="row g-0">
        {images.slice(0, 100).map((filename, idx) => (
            <div className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-2 d-flex justify-content-center align-items-center p-1" key={filename}>
              <img
                src={`/assets/Fotozasok/${sessionDir}/${filename}`}
                alt={filename}
                className="border border-dark bg-dark"
                style={{ aspectRatio: '1/1', objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.2s', width: '75%', height: '75%' }}
                onClick={() => openModal(`/assets/Fotozasok/${sessionDir}/${filename}`)}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
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
                src={`/assets/Fotozasok/${sessionDir}/${images[modalIdx]}`}
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

export default Gallery;
