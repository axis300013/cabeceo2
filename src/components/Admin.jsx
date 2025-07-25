import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  writeBatch
} from "firebase/firestore";

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
];

const catalogCol = collection(db, "catalog");
const initialImages = imageFiles.map((filename, idx) => ({ filename, sold: idx === 1 }));
const Admin = () => {
  const [images, setImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [batchSold, setBatchSold] = useState([]);
  const navigate = useNavigate();

  // Fetch all catalog images and their sold status from Firestore
  useEffect(() => {
    const fetchImages = async () => {
      const snapshot = await getDocs(catalogCol);
      // Map Firestore docs to array, fallback to not sold if missing
      const firestoreMap = {};
      snapshot.forEach(docSnap => {
        firestoreMap[docSnap.id] = docSnap.data();
      });
      setImages(
        imageFiles.map(filename =>
          firestoreMap[filename]
            ? { filename, sold: !!firestoreMap[filename].sold }
            : { filename, sold: false }
        )
      );
    };
    fetchImages();
  }, []);

  // Handle file input change (for future batch upload)
  const handleFileChange = (e) => {
    setNewFiles([...e.target.files]);
  };

  // Add new images (future: upload to storage and add to Firestore)
  const handleAddImages = async () => {
    const batch = writeBatch(db);
    Array.from(newFiles).forEach(f => {
      const docRef = doc(db, "catalog", f.name);
      batch.set(docRef, { filename: f.name, sold: false });
    });
    await batch.commit();
    setNewFiles([]);
    // Refresh
    const snapshot = await getDocs(catalogCol);
    const firestoreMap = {};
    snapshot.forEach(docSnap => {
      firestoreMap[docSnap.id] = docSnap.data();
    });
    setImages(
      imageFiles.map(filename =>
        firestoreMap[filename]
          ? { filename, sold: !!firestoreMap[filename].sold }
          : { filename, sold: false }
      )
    );
  };

  // Toggle sold status for a single image in Firestore
  const toggleSold = async idx => {
    const img = images[idx];
    const docRef = doc(db, "catalog", img.filename);
    await setDoc(docRef, { filename: img.filename, sold: !img.sold }, { merge: true });
    setImages(imgs => imgs.map((im, i) => i === idx ? { ...im, sold: !im.sold } : im));
  };

  // Batch mark selected as sold in Firestore
  const handleBatchSold = async () => {
    const batch = writeBatch(db);
    batchSold.forEach(idx => {
      const img = images[idx];
      const docRef = doc(db, "catalog", img.filename);
      batch.set(docRef, { filename: img.filename, sold: true }, { merge: true });
    });
    await batch.commit();
    setImages(imgs => imgs.map((im, i) => batchSold.includes(i) ? { ...im, sold: true } : im));
    setBatchSold([]);
  };

  // Batch unmark in Firestore
  const handleBatchUnsold = async () => {
    const batch = writeBatch(db);
    batchSold.forEach(idx => {
      const img = images[idx];
      const docRef = doc(db, "catalog", img.filename);
      batch.set(docRef, { filename: img.filename, sold: false }, { merge: true });
    });
    await batch.commit();
    setImages(imgs => imgs.map((im, i) => batchSold.includes(i) ? { ...im, sold: false } : im));
    setBatchSold([]);
  };

  // Select for batch
  const handleBatchSelect = idx => {
    setBatchSold(sel => sel.includes(idx) ? sel.filter(i => i !== idx) : [...sel, idx]);
  };

  return (
    <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center pt-5">
      <div className="container py-5">
        <h1 className="display-5 fw-bold mb-4 text-center">Katalógus Adminisztráció</h1>
        <div className="mb-4">
          <label className="form-label">Képek hozzáadása (több is):</label>
          <input type="file" multiple className="form-control" onChange={handleFileChange} />
          <button className="btn btn-warning mt-2" onClick={handleAddImages} disabled={!newFiles.length}>Feltöltés</button>
        </div>
        <div className="mb-4">
          <button className="btn btn-success me-2" onClick={handleBatchSold} disabled={!batchSold.length}>Kijelöltek eladottként</button>
          <button className="btn btn-secondary" onClick={handleBatchUnsold} disabled={!batchSold.length}>Kijelöltek visszavonása</button>
        </div>
        <div className="row g-0">
          {images.map((img, idx) => (
            <div className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-2 d-flex justify-content-center align-items-center p-1 position-relative" key={img.filename}>
              <img
                src={img.filename.startsWith("IMG") ? "/assets/" + img.filename : URL.createObjectURL(newFiles.find(f => f.name === img.filename) || new Blob())}
                alt={img.filename}
                className={`border border-dark bg-dark ${batchSold.includes(idx) ? 'border-3 border-warning' : ''}`}
                style={{ aspectRatio: '1/1', objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.2s', width: '75%', height: '75%' }}
                onClick={() => handleBatchSelect(idx)}
              />
              {img.sold && (
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
              <button className="btn btn-sm btn-outline-warning position-absolute top-0 end-0 m-1" style={{zIndex:3}} onClick={e => { e.stopPropagation(); toggleSold(idx); }}>{img.sold ? 'Vissza' : 'Eladva'}</button>
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
};

export default Admin;
