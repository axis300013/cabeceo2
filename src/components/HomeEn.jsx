import React from "react";


// Timeline data: session name, subdir, first image
const timelineSessions = [
  { name: 'Andras Dori', dir: '1. Andras Dori', img: 'IMG_0005.JPG' },
  { name: 'Antonella Csongor', dir: '2. Antonella Csongor', img: 'm (103) - Copy.jpg' },
  { name: 'Bocsi Barbi', dir: '3. Bocsi Barbi', img: '01.jpg' },
  { name: 'Fashion Show', dir: '4. Divatbemutato', img: 'DSC09154 (2).jpg' },
  { name: 'Kalman 2023', dir: '5. Kalman 2023', img: 'K   (102).jpg' },
  { name: 'Moni 1', dir: '7. Moni 1', img: '2 (1).jpg' },
  { name: 'Moni 2', dir: '8. Moni 2', img: 'centiméteres.jpg' },
  { name: 'Tango Ball 2018', dir: '9. Tangobal 2018', img: 'DSC_0001.jpg' },
  { name: 'Tango Ball 2019', dir: '10. Tangobal 2019', img: '_DSC4693.jpg' },
];

const HomeEn = () => (
  <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center">
    {/* Logo removed as requested */}
    <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow border border-warning bg-dark mb-5" style={{ maxWidth: '700px', width: '100%' }}>
      <iframe
        src="https://www.youtube.com/embed/zJ4sGHtmUv8?rel=0&autoplay=1&mute=1&loop=1&playlist=zJ4sGHtmUv8"
        title="Cabeceo introduction video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        style={{ transition: 'opacity 1s', opacity: 1 }}
      ></iframe>
    </div>

    {/* Timeline with straight SVG line */}
    <div className="position-relative w-100 d-flex flex-row justify-content-center align-items-center mb-5" style={{overflowX: 'auto', minHeight: 220}}>
      {/* SVG straight line */}
      <svg
        className="position-absolute top-0 start-0"
        style={{ left: 0, top: 0, width: '100%', height: 220, pointerEvents: 'none', zIndex: 0 }}
        width="100%"
        height="220"
        viewBox={`0 0 ${timelineSessions.length * 120} 220`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="60" y1="110" x2={60 + (timelineSessions.length - 1) * 120} y2="110" stroke="#ffc107" strokeWidth="4" />
      </svg>
      {/* Thumbnails */}
      {timelineSessions.map((session, idx) => (
        <div key={session.dir} className="d-flex flex-column align-items-center mx-3" style={{zIndex: 1, minWidth: 120}}>
          {idx % 2 === 0 ? (
            <>
              <a href={`/gallery/${encodeURIComponent(session.dir)}`} className="timeline-thumb-link mb-2" style={{ marginBottom: 30 }}>
                <img src={`/assets/Fotozasok/${session.dir}/${session.img}`} alt={session.name} className="rounded shadow border border-warning" style={{ width: 80, height: 80, objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.2s' }} />
              </a>
              <span className="small text-center mt-1">{session.name}</span>
            </>
          ) : (
            <>
              <span className="small text-center mb-1">{session.name}</span>
              <a href={`/gallery/${encodeURIComponent(session.dir)}`} className="timeline-thumb-link mt-2" style={{ marginTop: 30 }}>
                <img src={`/assets/Fotozasok/${session.dir}/${session.img}`} alt={session.name} className="rounded shadow border border-warning" style={{ width: 80, height: 80, objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.2s' }} />
              </a>
            </>
          )}
        </div>
      ))}
    </div>

    {/* Facebook link at bottom center */}
    <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3" style={{zIndex: 20}}>
      <a href="https://www.facebook.com/cabeceotangoclothes" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center gap-2 text-decoration-none text-light">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#1877f3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M15.117 8.667h-1.35V7.667c0-.327.217-.404.37-.404h.96V5.25l-1.32-.005c-1.47 0-1.81 1.1-1.81 1.805v1.617H10v2.083h1.967V18h1.8v-7.25h1.217l.133-2.083z" fill="#1877f3"/></svg>
        <span className="d-none d-sm-inline text-light">Facebook</span>
      </a>
    </div>
  </main>
);

export default HomeEn;
