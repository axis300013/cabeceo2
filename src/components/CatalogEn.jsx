import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { catalogService } from "../services/catalogService";

// Static list for fallback or initial setup
const staticImageFiles = [
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
  "DSC_0680.jpg", // Newly added image
];

function Lightbox({ image, onClose }) {
  const handleModalClick = (e) => e.stopPropagation();
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={handleModalClick}>
        <div className="modal-content bg-dark text-light position-relative">
          <button type="button" className="btn-close btn-close-white position-absolute end-0 m-2" aria-label="Close" onClick={e => { e.stopPropagation(); onClose(); }}></button>
          <div className="modal-body text-center">
            <img src={image} alt="Product large" className="img-fluid rounded shadow" style={{ maxHeight: '80vh' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

const CatalogEn = () => {
  const [catalogItems, setCatalogItems] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState(null);
  const navigate = useNavigate();

  // Load catalog items from Firestore
  useEffect(() => {
    const loadCatalogItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Attempting to load catalog items and sections (EN)...');
        const [items, sectionsData] = await Promise.all([
          catalogService.getAllItems(),
          catalogService.getAllSections()
        ]);
        setSections(sectionsData);
        
        // Set catalog items from database
        console.log(`Loaded ${items.length} items from database (EN)`);
        setCatalogItems(items);
      } catch (error) {
        console.error('Error loading catalog (EN):', error);
        setError(error.message);
        
        // Fallback to static files
        const fallbackItems = staticImageFiles.map((filename, index) => ({
          id: `fallback-${index}`,
          filename,
          sold: false,
          cikkszam: '',
          description: '',
          sectionId: ''
        }));
        setCatalogItems(fallbackItems);
      } finally {
        setLoading(false);
      }
    };

    loadCatalogItems();
  }, []);

  const openModal = (filename) => {
    const idx = catalogItems.findIndex(item => item.filename === filename);
    setModalIdx(idx);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalIdx(null);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setModalIdx(idx => (idx === 0 ? catalogItems.length - 1 : idx - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setModalIdx(idx => (idx === catalogItems.length - 1 ? 0 : idx + 1));
  };

  // Group items by section
  const groupItemsBySection = () => {
    const grouped = {};
    
    // Add sections
    sections.forEach(section => {
      grouped[section.id] = {
        name: section.nameEn || section.nameHu, // Use English name or fallback to Hungarian
        items: []
      };
    });
    
    // Add "No Section" group
    grouped['no-section'] = {
      name: 'Other Products',
      items: []
    };
    
    // Group items
    catalogItems.forEach(item => {
      if (item.sectionId && grouped[item.sectionId]) {
        grouped[item.sectionId].items.push(item);
      } else {
        grouped['no-section'].items.push(item);
      }
    });
    
    // Filter out empty sections
    return Object.keys(grouped)
      .filter(key => grouped[key].items.length > 0)
      .map(key => ({
        id: key,
        ...grouped[key]
      }));
  };

  const groupedItems = groupItemsBySection();

  if (loading) {
    return (
      <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center">
        <div className="spinner-border text-warning mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-center">Loading catalog...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center">
        <div className="alert alert-warning text-center mb-4">
          <h4>Warning</h4>
          <p>Database error: {error}</p>
          <p>Static catalog in use.</p>
        </div>
        {/* Continue with rendering catalogItems (fallback) */}
        <div className="container py-5">
          <h1 className="display-5 fw-bold mb-4 text-center">Catalog</h1>
          <div className="row g-0">
            {catalogItems.slice(0, 100).map((item, idx) => (
              <div className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-2 d-flex justify-content-center align-items-center p-1 position-relative" key={item.id}>
                <img
                  src={`/assets/${item.filename}`}
                  alt={item.filename}
                  className="border border-dark bg-dark"
                  style={{ 
                    aspectRatio: '1/1', 
                    objectFit: 'cover', 
                    cursor: 'pointer', 
                    transition: 'transform 0.2s', 
                    width: '75%', 
                    height: '75%',
                    opacity: item.sold ? 0.6 : 1
                  }}
                  onClick={() => openModal(item.filename)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                {item.sold && (
                  <div
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0,0,0,0.45)',
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
                    SOLD
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <button
          className="btn btn-outline-warning position-fixed bottom-0 start-0 m-4 px-4 py-2 fw-semibold text-uppercase"
          onClick={() => navigate(-1)}
          style={{ zIndex: 10 }}
        >
          Back
        </button>
      </main>
    );
  }

  return (
    <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center pt-5">
      <div className="container py-5">
        <h1 className="display-5 fw-bold mb-4 text-center">Catalog</h1>
        
        {/* Render items by sections */}
        {groupedItems.map(group => (
          <div key={group.id} className="mb-5">
            <h2 className="h4 mb-3 text-warning">{group.name}</h2>
            <div className="row g-0">
              {group.items.slice(0, 100).map((item, idx) => {
                const globalIdx = catalogItems.findIndex(catalogItem => catalogItem.id === item.id);
                return (
                  <div className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-2 d-flex justify-content-center align-items-center p-1 position-relative" key={item.id}>
                    <div className="position-relative w-100 h-100">
                      <img
                        src={`/assets/${item.filename}`}
                        alt={item.filename}
                        className="border border-dark bg-dark"
                        style={{ 
                          aspectRatio: '1/1', 
                          objectFit: 'cover', 
                          cursor: 'pointer', 
                          transition: 'transform 0.2s', 
                          width: '75%', 
                          height: '75%',
                          opacity: item.sold ? 0.6 : 1
                        }}
                        onClick={() => openModal(item.filename)}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      
                      {/* Info overlay */}
                      {(item.cikkszam || item.description) && (
                        <div 
                          className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-75 text-white px-2 py-1"
                          style={{ fontSize: '0.7rem' }}
                        >
                          {item.cikkszam && <div className="fw-bold">#{item.cikkszam}</div>}
                          {item.description && (
                            <div className="text-truncate">
                              {item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {item.sold && (
                        <div
                          className="position-absolute d-flex align-items-center justify-content-center"
                          style={{
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0,0,0,0.45)',
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
                          SOLD
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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
                aria-label="Close"
                style={{ fontSize: '2rem', lineHeight: 1, zIndex: 2 }}
              >
                &times;
              </button>
              <button
                type="button"
                className="btn btn-secondary position-absolute top-50 start-0 translate-middle-y ms-2"
                onClick={showPrev}
                aria-label="Previous"
                style={{ fontSize: '2rem', zIndex: 2 }}
              >
                &#8592;
              </button>
              <img
                src={`/assets/${catalogItems[modalIdx].filename}`}
                alt="Product large"
                className="img-fluid rounded shadow mx-4"
                style={{ maxHeight: '80vh', maxWidth: '90vw' }}
              />
              <button
                type="button"
                className="btn btn-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                onClick={showNext}
                aria-label="Next"
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
        Back
      </button>
    </main>
  );
};

export default CatalogEn;
