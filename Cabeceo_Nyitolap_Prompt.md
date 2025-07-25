
# 🧠 Copilot Prompt – Cabeceo Landing Page

## 🎯 Cél
Készíts egy ütős, modern kezdőlapot a „Cabeceo” márka ruha katalógusához. A dizájn legyen sötét alapon (fekete vagy sötétkék), elegáns, és harmonizáljon a logó színeivel. A stílus legyen modern, minimalista, divatbemutató hangulatú.

## ✨ Inspiráció
- https://www.rentadressandtux.com/formal-evening-wear/long-formal-dress-catalogue/
- https://www.easy-clothes.com/en/collections/dresses-suits

## 🖼️ Elrendezés
### Hero szekció (nyitó):
- Teljes képernyős sötét háttér
- Középen a **Cabeceo logó** (csatolt kép)
- Alatta beágyazott YouTube videó (responsive, sötét stílusban):
  - https://www.youtube.com/watch?v=zJ4sGHtmUv8
- Stílus: videó árnyékos háttérrel, letisztult keretben

### 🌐 Navigációs sáv (top):
- Fix pozícióban a képernyő tetején
- Menüpontok: 
  - A márkáról
  - Katalógus
  - Kapcsolat
- Világos szöveg (pl. fehér, arany, bézs), jól olvasható betűtípus

### 🎨 Design
- Fekete alapszín (#000000 vagy nagyon sötét szürke)
- Betűtípus: modern, divatos (pl. Playfair Display, Montserrat, Inter)
- Színek a logóval összhangban: törtfehér, arany, bordó, szürke
- Button hover effektek: finom animációk

## 🔧 Technikai részletek
- HTML5, CSS3 (vagy Tailwind CSS)
- JavaScript ha szükséges a videó/lapozáshoz
- Reszponzív kialakítás mobil/tablet/desktopra
- Video lazy-load
- Komponensekre bontható, ha React-ben dolgozunk

## 🛠 Prompt
```
You are a professional web developer. Create a modern, stylish, responsive black-themed fashion brand landing page for "Cabeceo".

The landing page should include:
- Fullscreen dark background
- Centered logo image (use cabeceo brand logo)
- Embedded responsive YouTube video: https://www.youtube.com/watch?v=zJ4sGHtmUv8
- Fixed top navigation with links: "A márkáról", "Katalógus", "Kapcsolat"
- Elegant, fashion-style layout, inspired by:
  - https://www.rentadressandtux.com/formal-evening-wear/long-formal-dress-catalogue/
  - https://www.easy-clothes.com/en/collections/dresses-suits
- Colors: black background, white/gold/burgundy text matching logo
- Font: use stylish fonts (e.g., Playfair Display, Montserrat)
- Responsive layout for mobile/tablet/desktop
- Smooth transitions and hover animations
- Prepare for Firebase hosting

Output full HTML and CSS (or React components if using React).
```

---

Ezt a promptot használd GitHub Copilot Agent-hez Visual Studio Code-ban a kezdőlap generálásához.
