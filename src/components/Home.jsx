import React, { useRef, useLayoutEffect, useState } from "react";



// Timeline data: session name, subdir, first image
const timelineSessions = [
  { name: 'András Dóri', dir: '1. Andras Dori', img: 'IMG_0005.JPG' },
  { name: 'Antonella Csongor', dir: '2. Antonella Csongor', img: 'm (103) - Copy.jpg' },
  { name: 'Bocsi Barbi', dir: '3. Bocsi Barbi', img: '01.jpg' },
  { name: 'Divatbemutató', dir: '4. Divatbemutato', img: 'DSC09154 (2).jpg' },
  { name: 'Kálmán 2023', dir: '5. Kalman 2023', img: 'K   (102).jpg' },
  { name: 'Moni 1', dir: '7. Moni 1', img: '2 (1).jpg' },
  { name: 'Moni 2', dir: '8. Moni 2', img: 'centiméteres.jpg' },
  { name: 'Tangóbal 2018', dir: '9. Tangobal 2018', img: 'DSC_0001.jpg' },
  { name: 'Tangóbal 2019', dir: '10. Tangobal 2019', img: '_DSC4693.jpg' },
];


const Home = () => (
  <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center">
    {/* Logo removed as requested */}
    <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow border border-warning bg-dark mb-5" style={{ maxWidth: '700px', width: '100%' }}>
      <iframe
        src="https://www.youtube.com/embed/zJ4sGHtmUv8?rel=0&autoplay=1&mute=1&loop=1&playlist=zJ4sGHtmUv8"
        title="Cabeceo bemutatkozó videó"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        style={{ transition: 'opacity 1s', opacity: 1 }}
      ></iframe>
    </div>

    {/* Timeline with straight SVG line */}
    <TimelineBar sessions={timelineSessions} />

    {/* Facebook link at bottom center */}
    <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3" style={{zIndex: 20}}>
      <a href="https://www.facebook.com/cabeceotangoclothes" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center gap-2 text-decoration-none text-light">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#1877f3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M15.117 8.667h-1.35V7.667c0-.327.217-.404.37-.404h.96V5.25l-1.32-.005c-1.47 0-1.81 1.1-1.81 1.805v1.617H10v2.083h1.967V18h1.8v-7.25h1.217l.133-2.083z" fill="#1877f3"/></svg>
        <span className="d-none d-sm-inline text-light">Facebook</span>
      </a>
    </div>


  </main>
);

// Responsive timeline bar with straight line and non-overlapping thumbnails
function TimelineBar({ sessions }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.scrollWidth);
    }
    const handleResize = () => {
      if (containerRef.current) setWidth(containerRef.current.scrollWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Thumbnail size and vertical offset
  const thumbSize = 80;
  const vOffset = 50;
  const lineY = 110;
  const minHeight = 2 * vOffset + thumbSize + 40;

  const fallbackWidth = width > 0 ? width : 600;
  return (
    <div
      ref={containerRef}
      className="position-relative w-100 d-flex flex-row justify-content-center align-items-center mb-5"
      style={{ overflowX: 'auto', minHeight }}
    >
      {/* SVG straight line, responsive to thumbnails */}
      <svg
        className="position-absolute top-0 start-0"
        style={{ left: 0, top: 0, width: fallbackWidth, height: minHeight, pointerEvents: 'none', zIndex: 0 }}
        width={fallbackWidth}
        height={minHeight}
        viewBox={`0 0 ${fallbackWidth} ${minHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1={60} y1={lineY} x2={Math.max(fallbackWidth - 60, 120)} y2={lineY} stroke="#ffc107" strokeWidth="4" />
      </svg>
      {/* Thumbnails */}
      {sessions.map((session, idx) => (
        <div
          key={session.dir}
          className="d-flex flex-column align-items-center mx-3"
          style={{
            zIndex: 1,
            minWidth: 120,
            position: 'relative',
            top: idx % 2 === 0 ? -vOffset : vOffset,
            background: 'none',
          }}
        >
          {idx % 2 === 0 ? (
            // Up row: text above, then thumbnail
            <>
              <span className="small text-center mb-2">{session.name}</span>
              <a href={`/gallery/${encodeURIComponent(session.dir)}`} className="timeline-thumb-link">
                <img src={`/assets/Fotozasok/${session.dir}/${session.img}`} alt={session.name} className="rounded shadow border border-warning" style={{ width: thumbSize, height: thumbSize, objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.2s', background: 'black' }} />
              </a>
            </>
          ) : (
            // Down row: thumbnail first, then name below
            <>
              <a href={`/gallery/${encodeURIComponent(session.dir)}`} className="timeline-thumb-link mb-2">
                <img src={`/assets/Fotozasok/${session.dir}/${session.img}`} alt={session.name} className="rounded shadow border border-warning" style={{ width: thumbSize, height: thumbSize, objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.2s', background: 'black' }} />
              </a>
              <span className="small text-center mt-1">{session.name}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Home;
