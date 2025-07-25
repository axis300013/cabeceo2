



import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Admin from "./components/Admin";
import Home from "./components/Home";
import About from "./components/About";
import Catalog from "./components/Catalog";
import Contact from "./components/Contact";
import Designer from "./components/Designer";
import AboutEn from "./components/AboutEn";
import DesignerEn from "./components/DesignerEn";
import CatalogEn from "./components/CatalogEn";
import ContactEn from "./components/ContactEn";
import Gallery from "./components/Gallery";
import GalleryEn from "./components/GalleryEn";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/designer" element={<Designer />} />
        <Route path="/about" element={<About />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/contact" element={<Contact />} />
        {/* ...existing routes... */}
        <Route path="/admin-catalog" element={<Admin />} />
        {/* English routes */}
        <Route path="/en" element={<Home />} />
        <Route path="/en/about" element={<AboutEn />} />
        <Route path="/en/designer" element={<DesignerEn />} />
        <Route path="/en/catalog" element={<CatalogEn />} />
        <Route path="/en/contact" element={<ContactEn />} />
        <Route path="/en/gallery/:sessionDir" element={<GalleryEn />} />
        <Route path="/gallery/:sessionDir" element={<Gallery />} />
      </Routes>
      {/* Admin page link (not shown in nav, but here for reference): */}
      <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 9999 }}>
        <a href="/admin-catalog" style={{ color: '#ffc107', fontWeight: 'bold', opacity: 0.2, fontSize: '0.8rem', textDecoration: 'none' }}>Admin</a>
      </div>
    </Router>
  );
}

export default App;
