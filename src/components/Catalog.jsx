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
        
        console.log('Attempting to load catalog items and sections...');
        const [items, sectionsData] = await Promise.all([
          catalogService.getAllItems(),
          catalogService.getAllSections()
        ]);
        setSections(sectionsData);
        
        // If no items in database, bulk add static files
        if (items.length === 0) {
          console.log('No items found, initializing with static files...');
          await catalogService.bulkAddItems(staticImageFiles);
          const newItems = await catalogService.getAllItems();
          setCatalogItems(newItems);
        } else {
          console.log(`Loaded ${items.length} items from database`);
          setCatalogItems(items);
        }
      } catch (error) {
        console.error('Error loading catalog:', error);
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
    // Check if image exists by trying to load it
    const img = new Image();
    img.onload = () => {
      const idx = catalogItems.findIndex(item => item.filename === filename);
      setModalIdx(idx);
      setModalOpen(true);
    };
    img.onerror = () => {
      alert(`A kép (${filename}) nem található a szerveren. Ellenőrizd, hogy a fájl létezik-e a /public/assets/ mappában.`);
    };
    img.src = `/assets/${filename}`;
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
        name: section.nameHu,
        items: []
      };
    });
    
    // Add "No Section" group
    grouped['no-section'] = {
      name: 'Egyéb termékek',
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
          <span className="visually-hidden">Betöltés...</span>
        </div>
        <p className="text-center">Katalógus betöltése...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center">
        <div className="alert alert-warning text-center mb-4">
          <h4>Figyelem</h4>
          <p>Adatbázis hiba: {error}</p>
          <p>Statikus katalógus használatban.</p>
        </div>
        {/* Continue with rendering catalogItems (fallback) */}
        <div className="container py-5">
          <h1 className="display-5 fw-bold mb-4 text-center">Katalógus</h1>
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
                    ELADVA
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
          Vissza
        </button>
      </main>
    );
  }

  return (
    <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center pt-5">
      <div className="container py-5">
        <h1 className="display-5 fw-bold mb-4 text-center">Katalógus</h1>
        
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
                        onError={(e) => {
                          e.currentTarget.style.backgroundColor = '#333';
                          e.currentTarget.style.border = '2px dashed #666';
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5LZXAgbmVtPC90ZXh0Pjx0ZXh0IHg9IjUwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj50YWzDoWxoYXTDszwvdGV4dD48L3N2Zz4=';
                          console.warn(`Image not found: /assets/${item.filename}`);
                        }}
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
                          ELADVA
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
                src={`/assets/${catalogItems[modalIdx].filename}`}
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
