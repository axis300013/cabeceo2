import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { catalogService } from "../services/catalogService";
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
  "DSC_0680.jpg", // Newly added image
];

const catalogCol = collection(db, "catalog");
const initialImages = imageFiles.map((filename, idx) => ({ filename, sold: idx === 1 }));
const Admin = () => {
  const [images, setImages] = useState([]);
  const [sections, setSections] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [batchSold, setBatchSold] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [newSection, setNewSection] = useState({ nameHu: '', nameEn: '' });
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [newItem, setNewItem] = useState({
    filename: '',
    cikkszam: '',
    description: '',
    sectionId: ''
  });
  const navigate = useNavigate();

  // Fetch all catalog images and sections
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sections
        const sectionsData = await catalogService.getAllSections();
        setSections(sectionsData);

        // Fetch images
        const snapshot = await getDocs(catalogCol);
        const firestoreMap = {};
        snapshot.forEach(docSnap => {
          firestoreMap[docSnap.id] = docSnap.data();
        });
        
        // Create combined images array with fallback for static files
        const allImages = [];
        
        // Add items from database
        Object.keys(firestoreMap).forEach(id => {
          const data = firestoreMap[id];
          allImages.push({
            id,
            filename: data.filename,
            sold: !!data.sold,
            cikkszam: data.cikkszam || '',
            description: data.description || '',
            sectionId: data.sectionId || ''
          });
        });
        
        // Add static files that aren't in database yet
        imageFiles.forEach(filename => {
          const existsInDb = Object.values(firestoreMap).some(item => item.filename === filename);
          if (!existsInDb) {
            allImages.push({
              id: `temp-${filename}`,
              filename,
              sold: false,
              cikkszam: '',
              description: '',
              sectionId: ''
            });
          }
        });
        
        setImages(allImages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Add new section
  const handleAddSection = async () => {
    if (!newSection.nameHu.trim()) return;
    try {
      await catalogService.addSection(newSection.nameHu, newSection.nameEn, sections.length);
      const updatedSections = await catalogService.getAllSections();
      setSections(updatedSections);
      setNewSection({ nameHu: '', nameEn: '' });
      alert('Szekció sikeresen hozzáadva!');
    } catch (error) {
      console.error('Error adding section:', error);
      alert('Hiba a szekció hozzáadásakor: ' + error.message);
    }
  };

  // Add new item with details
  const handleAddNewItem = async () => {
    if (!newItem.filename.trim()) return;
    
    // Check if it's an existing image file in assets or a new upload
    const isExistingFile = imageFiles.includes(newItem.filename);
    
    if (!isExistingFile) {
      alert('Figyelem: A megadott fájl (' + newItem.filename + ') nem található az assets mappában. Győződj meg róla, hogy a fájl fizikailag létezik a /public/assets/ mappában, mielőtt hozzáadod az adatbázishoz.');
      return;
    }
    
    try {
      await catalogService.addItem(
        newItem.filename,
        false,
        newItem.cikkszam,
        newItem.description,
        newItem.sectionId
      );
      
      // Refresh images
      const snapshot = await getDocs(catalogCol);
      const firestoreMap = {};
      snapshot.forEach(docSnap => {
        firestoreMap[docSnap.id] = docSnap.data();
      });
      
      const allImages = [];
      Object.keys(firestoreMap).forEach(id => {
        const data = firestoreMap[id];
        allImages.push({
          id,
          filename: data.filename,
          sold: !!data.sold,
          cikkszam: data.cikkszam || '',
          description: data.description || '',
          sectionId: data.sectionId || ''
        });
      });
      
      imageFiles.forEach(filename => {
        const existsInDb = Object.values(firestoreMap).some(item => item.filename === filename);
        if (!existsInDb) {
          allImages.push({
            id: `temp-${filename}`,
            filename,
            sold: false,
            cikkszam: '',
            description: '',
            sectionId: ''
          });
        }
      });
      
      setImages(allImages);
      setNewItem({ filename: '', cikkszam: '', description: '', sectionId: '' });
      setShowNewItemForm(false);
      alert('Termék sikeresen hozzáadva!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Hiba a termék hozzáadásakor: ' + error.message);
    }
  };

  // Update item details
  const handleUpdateItem = async () => {
    if (!editingItem) return;
    try {
      if (editingItem.id.startsWith('temp-')) {
        // Convert temp item to real database item
        await catalogService.addItem(
          editingItem.filename,
          editingItem.sold,
          editingItem.cikkszam,
          editingItem.description,
          editingItem.sectionId
        );
      } else {
        // Update existing item
        await catalogService.updateItem(editingItem.id, {
          cikkszam: editingItem.cikkszam,
          description: editingItem.description,
          sectionId: editingItem.sectionId,
          sold: editingItem.sold
        });
      }
      
      // Refresh images
      const snapshot = await getDocs(catalogCol);
      const firestoreMap = {};
      snapshot.forEach(docSnap => {
        firestoreMap[docSnap.id] = docSnap.data();
      });
      
      const allImages = [];
      Object.keys(firestoreMap).forEach(id => {
        const data = firestoreMap[id];
        allImages.push({
          id,
          filename: data.filename,
          sold: !!data.sold,
          cikkszam: data.cikkszam || '',
          description: data.description || '',
          sectionId: data.sectionId || ''
        });
      });
      
      imageFiles.forEach(filename => {
        const existsInDb = Object.values(firestoreMap).some(item => item.filename === filename);
        if (!existsInDb) {
          allImages.push({
            id: `temp-${filename}`,
            filename,
            sold: false,
            cikkszam: '',
            description: '',
            sectionId: ''
          });
        }
      });
      
      setImages(allImages);
      setEditingItem(null);
      alert('Termék sikeresen frissítve!');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Hiba a termék frissítésekor: ' + error.message);
    }
  };

  // Delete item from catalog
  const handleDeleteItem = async (itemId, filename) => {
    if (!window.confirm(`Biztosan törölni szeretnéd ezt a terméket: ${filename}?\n\nEz csak az adatbázisból távolítja el, a kép fájl a szerveren marad.`)) {
      return;
    }
    
    try {
      if (!itemId.startsWith('temp-')) {
        // Delete from database if it's a real item
        await catalogService.deleteItem(itemId);
      }
      
      // Remove from local state
      setImages(imgs => imgs.filter(img => img.id !== itemId));
      alert('Termék sikeresen törölve az adatbázisból!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Hiba a termék törlésekor: ' + error.message);
    }
  };

  // Batch delete selected items
  const handleBatchDelete = async () => {
    if (batchSold.length === 0) return;
    
    const itemsToDelete = batchSold.map(idx => images[idx]);
    const filenames = itemsToDelete.map(item => item.filename).join(', ');
    
    if (!window.confirm(`Biztosan törölni szeretnéd ezeket a termékeket?\n\n${filenames}\n\nEz csak az adatbázisból távolítja el őket, a kép fájlok a szerveren maradnak.`)) {
      return;
    }
    
    try {
      // Delete items from database (skip temp items)
      const realItems = itemsToDelete.filter(item => !item.id.startsWith('temp-'));
      for (const item of realItems) {
        await catalogService.deleteItem(item.id);
      }
      
      // Remove from local state
      const idsToDelete = itemsToDelete.map(item => item.id);
      setImages(imgs => imgs.filter(img => !idsToDelete.includes(img.id)));
      setBatchSold([]);
      
      alert(`${itemsToDelete.length} termék sikeresen törölve az adatbázisból!`);
    } catch (error) {
      console.error('Error batch deleting items:', error);
      alert('Hiba a termékek törlésekor: ' + error.message);
    }
  };

  // Handle file input change (for future batch upload)
  const handleFileChange = (e) => {
    setNewFiles([...e.target.files]);
  };

  // Add new images (handles file upload and database entry)
  const handleAddImages = async () => {
    if (newFiles.length === 0) return;
    
    try {
      // First, add files to database
      const batch = writeBatch(db);
      const uploadedFiles = [];
      
      Array.from(newFiles).forEach(file => {
        const docRef = doc(db, "catalog", file.name);
        batch.set(docRef, { 
          filename: file.name, 
          sold: false,
          cikkszam: '',
          description: '',
          sectionId: '',
          createdAt: new Date().toISOString()
        });
        uploadedFiles.push(file.name);
      });
      
      await batch.commit();
      
      // Show instructions for manual file placement
      const fileList = uploadedFiles.join(', ');
      alert(`Fájlok hozzáadva az adatbázishoz: ${fileList}\n\nFontos: Kézzel másold át a következő fájlokat a projekt /public/assets/ mappájába:\n${fileList}\n\nEzután frissítsd az oldalt, hogy a képek megjelenjenek.`);
      
      setNewFiles([]);
      
      // Refresh the images list
      const snapshot = await getDocs(catalogCol);
      const firestoreMap = {};
      snapshot.forEach(docSnap => {
        firestoreMap[docSnap.id] = docSnap.data();
      });
      
      const allImages = [];
      Object.keys(firestoreMap).forEach(id => {
        const data = firestoreMap[id];
        allImages.push({
          id,
          filename: data.filename,
          sold: !!data.sold,
          cikkszam: data.cikkszam || '',
          description: data.description || '',
          sectionId: data.sectionId || ''
        });
      });
      
      // Add static files that aren't in database yet
      imageFiles.forEach(filename => {
        const existsInDb = Object.values(firestoreMap).some(item => item.filename === filename);
        if (!existsInDb) {
          allImages.push({
            id: `temp-${filename}`,
            filename,
            sold: false,
            cikkszam: '',
            description: '',
            sectionId: ''
          });
        }
      });
      
      setImages(allImages);
      
    } catch (error) {
      console.error('Error adding images:', error);
      alert('Hiba a képek hozzáadásakor: ' + error.message);
    }
  };

  // Toggle sold status for a single image in Firestore
  const toggleSold = async idx => {
    const img = images[idx];
    try {
      if (img.id.startsWith('temp-')) {
        // Convert temp item to real database item with sold status
        await catalogService.addItem(
          img.filename,
          !img.sold,
          img.cikkszam,
          img.description,
          img.sectionId
        );
      } else {
        // Update existing item
        await catalogService.updateSoldStatus(img.id, !img.sold);
      }
      
      setImages(imgs => imgs.map((im, i) => i === idx ? { ...im, sold: !im.sold } : im));
    } catch (error) {
      console.error('Error toggling sold status:', error);
      alert('Hiba az eladási státusz módosításakor: ' + error.message);
    }
  };

  // Batch mark selected as sold in Firestore
  const handleBatchSold = async () => {
    try {
      const updates = [];
      const newItems = [];
      
      batchSold.forEach(idx => {
        const img = images[idx];
        if (img.id.startsWith('temp-')) {
          newItems.push(img);
        } else {
          updates.push({ id: img.id, data: { sold: true } });
        }
      });
      
      // Handle new items
      for (const item of newItems) {
        await catalogService.addItem(
          item.filename,
          true,
          item.cikkszam,
          item.description,
          item.sectionId
        );
      }
      
      // Handle existing items
      if (updates.length > 0) {
        await catalogService.bulkUpdateItems(updates);
      }
      
      setImages(imgs => imgs.map((im, i) => batchSold.includes(i) ? { ...im, sold: true } : im));
      setBatchSold([]);
    } catch (error) {
      console.error('Error batch updating sold status:', error);
      alert('Hiba a tömeges státusz módosításkor: ' + error.message);
    }
  };

  // Batch unmark in Firestore
  const handleBatchUnsold = async () => {
    try {
      const updates = [];
      const newItems = [];
      
      batchSold.forEach(idx => {
        const img = images[idx];
        if (img.id.startsWith('temp-')) {
          newItems.push(img);
        } else {
          updates.push({ id: img.id, data: { sold: false } });
        }
      });
      
      // Handle new items
      for (const item of newItems) {
        await catalogService.addItem(
          item.filename,
          false,
          item.cikkszam,
          item.description,
          item.sectionId
        );
      }
      
      // Handle existing items
      if (updates.length > 0) {
        await catalogService.bulkUpdateItems(updates);
      }
      
      setImages(imgs => imgs.map((im, i) => batchSold.includes(i) ? { ...im, sold: false } : im));
      setBatchSold([]);
    } catch (error) {
      console.error('Error batch updating sold status:', error);
      alert('Hiba a tömeges státusz módosításkor: ' + error.message);
    }
  };

  // Select for batch
  const handleBatchSelect = idx => {
    setBatchSold(sel => sel.includes(idx) ? sel.filter(i => i !== idx) : [...sel, idx]);
  };

  // Bulk insert all static images to Firestore
  const handleBulkInsertAll = async () => {
    try {
      const batch = writeBatch(db);
      imageFiles.forEach(filename => {
        const docRef = doc(db, "catalog", filename);
        batch.set(docRef, { 
          filename, 
          sold: false,
          cikkszam: '',
          description: '',
          sectionId: '',
          createdAt: new Date().toISOString() 
        });
      });
      await batch.commit();
      
      // Refresh the images list
      const snapshot = await getDocs(catalogCol);
      const firestoreMap = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        firestoreMap[docSnap.id] = data;
      });
      
      const allImages = [];
      Object.keys(firestoreMap).forEach(id => {
        const data = firestoreMap[id];
        allImages.push({
          id,
          filename: data.filename,
          sold: !!data.sold,
          cikkszam: data.cikkszam || '',
          description: data.description || '',
          sectionId: data.sectionId || ''
        });
      });
      
      setImages(allImages);
      alert(`Successfully added ${imageFiles.length} images to the database!`);
    } catch (error) {
      console.error('Error bulk inserting images:', error);
      alert('Error adding images to database: ' + error.message);
    }
  };

  return (
    <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center pt-5">
      <div className="container py-5">
        <h1 className="display-5 fw-bold mb-4 text-center">Katalógus Adminisztráció</h1>
        
        {/* Section Management */}
        <div className="card bg-dark text-light mb-4">
          <div className="card-header">
            <h5>Szekciók kezelése</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Magyar név:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newSection.nameHu}
                  onChange={(e) => setNewSection({...newSection, nameHu: e.target.value})}
                  placeholder="pl. Nyári ruhák"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Angol név:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newSection.nameEn}
                  onChange={(e) => setNewSection({...newSection, nameEn: e.target.value})}
                  placeholder="pl. Summer Dresses"
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button 
                  className="btn btn-success" 
                  onClick={handleAddSection}
                  disabled={!newSection.nameHu.trim()}
                >
                  Szekció hozzáadása
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <h6>Meglévő szekciók:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {sections.map(section => (
                    <span key={section.id} className="badge bg-secondary fs-6">
                      {section.nameHu} {section.nameEn && `(${section.nameEn})`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Item Form */}
        {showNewItemForm && (
          <div className="card bg-dark text-light mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Új termék hozzáadása</h5>
              <button 
                className="btn btn-outline-light btn-sm"
                onClick={() => setShowNewItemForm(false)}
              >
                ×
              </button>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Fájlnév:</label>
                  <div className="d-flex gap-2">
                    <select 
                      className="form-control"
                      value={newItem.filename}
                      onChange={(e) => setNewItem({...newItem, filename: e.target.value})}
                    >
                      <option value="">Válassz meglévő fájlt...</option>
                      {imageFiles.map(filename => (
                        <option key={filename} value={filename}>
                          {filename}
                        </option>
                      ))}
                    </select>
                    <span className="text-muted align-self-center">vagy</span>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={newItem.filename}
                      onChange={(e) => setNewItem({...newItem, filename: e.target.value})}
                      placeholder="kep.jpg"
                    />
                  </div>
                  <small className="text-muted">
                    Válassz a meglévő fájlok közül vagy írj be új fájlnevet
                  </small>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Cikkszám:</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newItem.cikkszam}
                    onChange={(e) => setNewItem({...newItem, cikkszam: e.target.value})}
                    placeholder="ABC123"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Leírás:</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Termék leírása..."
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Szekció:</label>
                  <select 
                    className="form-control"
                    value={newItem.sectionId}
                    onChange={(e) => setNewItem({...newItem, sectionId: e.target.value})}
                  >
                    <option value="">Nincs szekció</option>
                    {sections.map(section => (
                      <option key={section.id} value={section.id}>
                        {section.nameHu}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleAddNewItem}
                disabled={!newItem.filename.trim()}
              >
                Termék hozzáadása
              </button>
            </div>
          </div>
        )}

        {/* Item Edit Modal */}
        {editingItem && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.85)' }}>
            <div className="modal-dialog">
              <div className="modal-content bg-dark text-light">
                <div className="modal-header">
                  <h5 className="modal-title">Termék szerkesztése: {editingItem.filename}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setEditingItem(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Cikkszám:</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={editingItem.cikkszam}
                      onChange={(e) => setEditingItem({...editingItem, cikkszam: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Leírás:</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Szekció:</label>
                    <select 
                      className="form-control"
                      value={editingItem.sectionId}
                      onChange={(e) => setEditingItem({...editingItem, sectionId: e.target.value})}
                    >
                      <option value="">Nincs szekció</option>
                      {sections.map(section => (
                        <option key={section.id} value={section.id}>
                          {section.nameHu}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      checked={editingItem.sold}
                      onChange={(e) => setEditingItem({...editingItem, sold: e.target.checked})}
                    />
                    <label className="form-check-label">Eladva</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingItem(null)}>Mégse</button>
                  <button type="button" className="btn btn-primary" onClick={handleUpdateItem}>Mentés</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* File Upload Instructions */}
        <div className="alert alert-info mb-4">
          <h6 className="alert-heading">📁 Képfeltöltési és törlési útmutató</h6>
          <p className="mb-2">
            <strong>Módszer 1 - Meglévő képek használata:</strong><br/>
            Az "Új termék" gombbal hozzáadhatsz új termékeket a már feltöltött képekhez.
          </p>
          <p className="mb-2">
            <strong>Módszer 2 - Új képek feltöltése:</strong><br/>
            1. Válaszd ki a képfájlokat az alábbi "Képek hozzáadása" részben<br/>
            2. Kattints a "Feltöltés" gombra<br/>
            3. <strong>Fontos:</strong> Kézzel másold át a fájlokat a <code>/public/assets/</code> mappába<br/>
            4. Frissítsd az oldalt (F5) a változások megtekintéséhez
          </p>
          <p className="mb-2">
            <strong>Termékek törlése:</strong><br/>
            A "Törlés" gomb csak az adatbázisból távolítja el a terméket - a kép fájl a szerveren marad.
            Ha a fájlt is el szeretnéd távolítani, kézzel töröld a <code>/public/assets/</code> mappából.
          </p>
          <small className="text-muted">
            A böngésző biztonsági okokból nem tudja automatikusan másolni vagy törölni a fájlokat a szerver mappájában.
          </small>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="form-label">Képek hozzáadása (több is):</label>
          <input type="file" multiple className="form-control" onChange={handleFileChange} />
          <button className="btn btn-warning mt-2" onClick={handleAddImages} disabled={!newFiles.length}>Feltöltés</button>
        </div>

        {/* Batch Operations */}
        <div className="mb-4">
          <button className="btn btn-success me-2" onClick={handleBatchSold} disabled={!batchSold.length}>Kijelöltek eladottként</button>
          <button className="btn btn-secondary me-2" onClick={handleBatchUnsold} disabled={!batchSold.length}>Kijelöltek visszavonása</button>
          <button className="btn btn-danger me-2" onClick={handleBatchDelete} disabled={!batchSold.length}>Kijelöltek törlése</button>
          <button className="btn btn-info me-2" onClick={() => setShowNewItemForm(true)}>Új termék</button>
        </div>

        {/* Bulk Insert */}
        <div className="mb-4">
          <button className="btn btn-primary" onClick={handleBulkInsertAll}>
            Összes statikus kép hozzáadása az adatbázishoz ({imageFiles.length} kép)
          </button>
          <small className="d-block text-muted mt-1">
            Ez hozzáadja az összes előre definiált képet az adatbázishoz, ha még nincsenek ott.
          </small>
        </div>

        {/* Section Filter */}
        <div className="mb-4">
          <label className="form-label">Szekció szerinti szűrés:</label>
          <select 
            className="form-control"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="">Összes szekció</option>
            <option value="no-section">Nincs szekció</option>
            {sections.map(section => (
              <option key={section.id} value={section.id}>
                {section.nameHu}
              </option>
            ))}
          </select>
        </div>
        {/* Images Grid */}
        <div className="row g-0">
          {images
            .filter(img => {
              if (!selectedSection) return true;
              if (selectedSection === 'no-section') return !img.sectionId;
              return img.sectionId === selectedSection;
            })
            .map((img, idx) => {
              const originalIdx = images.findIndex(item => item.id === img.id);
              const sectionName = img.sectionId ? sections.find(s => s.id === img.sectionId)?.nameHu : '';
              
              return (
                <div className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-2 d-flex justify-content-center align-items-center p-1 position-relative" key={img.id}>
                  <div className="position-relative w-100 h-100">
                    <img
                      src={`/assets/${img.filename}`}
                      alt={img.filename}
                      className={`border border-dark bg-dark ${batchSold.includes(originalIdx) ? 'border-3 border-warning' : ''}`}
                      style={{ aspectRatio: '1/1', objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.2s', width: '75%', height: '75%' }}
                      onClick={() => handleBatchSelect(originalIdx)}
                      onError={(e) => {
                        e.currentTarget.style.backgroundColor = '#333';
                        e.currentTarget.style.border = '2px dashed #666';
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5LZXAgbmVtPC90ZXh0Pjx0ZXh0IHg9IjUwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj50YWzDoWxoYXTDszwvdGV4dD48L3N2Zz4=';
                        console.warn(`Image not found: /assets/${img.filename}`);
                      }}
                    />
                    
                    {/* Info overlay */}
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-1"
                      style={{ fontSize: '0.7rem', pointerEvents: 'none' }}
                    >
                      {/* Top info */}
                      <div className="bg-dark bg-opacity-75 text-white px-1 rounded" style={{ fontSize: '0.6rem' }}>
                        {img.cikkszam && <div>#{img.cikkszam}</div>}
                        {sectionName && <div className="text-info">{sectionName}</div>}
                      </div>
                      
                      {/* Bottom info */}
                      {img.description && (
                        <div className="bg-dark bg-opacity-75 text-white px-1 rounded" style={{ fontSize: '0.6rem' }}>
                          {img.description.length > 20 ? img.description.substring(0, 20) + '...' : img.description}
                        </div>
                      )}
                    </div>

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
                    
                    {/* Action buttons */}
                    <div className="position-absolute top-0 end-0 d-flex flex-column gap-1 m-1" style={{zIndex:3}}>
                      <button 
                        className="btn btn-sm btn-outline-warning" 
                        onClick={e => { e.stopPropagation(); toggleSold(originalIdx); }}
                      >
                        {img.sold ? 'Vissza' : 'Eladva'}
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-info" 
                        onClick={e => { e.stopPropagation(); setEditingItem({...img}); }}
                      >
                        Szerk
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={e => { e.stopPropagation(); handleDeleteItem(img.id, img.filename); }}
                        title="Termék törlése az adatbázisból"
                      >
                        Törlés
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
