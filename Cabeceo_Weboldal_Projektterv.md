
# Cabeceo Weboldal – Projektterv

## 1. 🎯 Célkitűzés
- Modern, reszponzív weboldal létrehozása a “Cabeceo” márkának.
- HTML/CSS/JavaScript (vagy React) használata.
- Firebase Hosting-re telepítve, a jelenlegi rackforest tárhely kiváltása.
- A domain: `www.cabeceo.hu`, ami nálad van.

## 2. 🏗️ Technológiai stack
- Frontend: HTML5 + CSS3 (vagy Tailwind/Bootstrap) + JavaScript vagy React
- Optional: React Router, CSS-modulok
- Backend/hosting: Firebase Hosting (+ később Firestore, Functions a kapcsolati űrlaphoz)
- Verziókezelés: Git + GitHub

## 3. ✅ Oldalak és funkciók

### 3.1 Navigációs struktúra
- **Home** – kezdőlap
- **A márkáról** – bemutatkozás
- **Katalógus** – termékgaléria
- **Kapcsolat** – űrlap és elérhetőség

### 3.2 Kezdőlap (Home)
- **Cabeceo logó**: középre, a csatolt kép használatával
- **Beágyazott YouTube videó**: `https://www.youtube.com/watch?v=zJ4sGHtmUv8`
  - Responsive design, lazy-load attribútum
- Letisztult, modern layout

### 3.3 A márkáról (About)
- Bemutatkozó szöveg:
  - Márka neve: Cabeceo
  - Divattervező: Binszki Mónika
- Strukturált, olvasható felépítés, reszponzív elrendezés

### 3.4 Katalógus (Catalog)
- Grid galéria:
  - Desktop: 3–4 oszlop
  - Mobil: 2 oszlop
- Thumbnail-ek forrása: például `https://cabeceo.hu/termekek/tango-tanc-ruha/`
- Modal vagy lightbox:
  - 2–3 nagy kép
  - Next/Prev navigáció
  - “Vissza a katalógushoz” link
- Könnyen bővíthető struktúra (JSON vagy Firestore alapú)

### 3.5 Kapcsolat (Contact)
- Űrlap mezők:
  - Név (input)
  - Email (input)
  - Üzenet (textarea)
  - Küldés gomb
- Opcionális backend: Firebase Functions
- Statisztikus elérhetőségek (email, social linkek)

## 4. 📁 Projektstruktúra (példa)

```
my-cabeceo-site/
├── public/                 
│   ├── index.html
│   ├── favicon.ico
│   └── assets/            
├── src/
│   ├── App.js / App.jsx
│   ├── index.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Catalog.jsx
│   │   ├── Contact.jsx
│   │   └── Lightbox.jsx
│   └── styles/
│       ├── global.css
│       └── components.css
├── firebase.json
├── .firebaserc
├── package.json
└── README.md
```

## 5. 🔧 Fejlesztési lépések
1. Repo inicializálása, könyvtárstruktúra elkészítése  
2. Firebase projekt létrehozása + CLI beállítás (`firebase init hosting`)  
3. Alap komponensek fejlesztése: Navbar, Home (logo + videó), About oldal  
4. Katalógus oldal – grid és lightbox funkció  
5. Kapcsolati oldal – űrlap és validáció  
6. Reszponzív CSS hozzáadása  
7. Firebase deploy tesztelése  
8. Domain beállítása a Firebase-ben, DNS módosítása  
9. Élesítés / utolsó tesztek  

## 6. 🧪 Kiterjesztési lehetőségek
- **Firestore** a katalógus dinamikus kezeléséhez  
- **Authentication** (pl. védett galéria hozzáférés)  
- **Performance-optimalizáció** (képek lazy-load, videó)  
- **Form handling**: Firebase Functions + email értesítések

---

### 🛠 Copilot prompt példa

```
You are a skilled full‑stack web developer. Create a responsive React single‑page app with Firebase Hosting. Feature:
- Home with centered Cabeceo logo and responsive YouTube video
- About page introducing Cabeceo and Binszki Mónika
- Catalog displaying thumbnail grid of fashion items with clickable lightbox modal (2‑3 large images and navigation)
- Contact page with form (name, email, message)
Include Firebase configuration, routing, components, and responsive CSS for mobile/desktop. Provide directory structure and key file contents. Deployable via `firebase deploy`.
```

---

**Megjegyzés:** Mentsd el ezt `.md` kiterjesztéssel, és megnyithatod VS Code-ban vagy bármely Markdown-szerkesztőben. Ha PDF vagy DOCX formátumot szeretnél, szólj bátran! 😊
