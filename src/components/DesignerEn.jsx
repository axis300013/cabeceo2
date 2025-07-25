import React from "react";
import { useNavigate } from "react-router-dom";

function DesignerEn() {
  const navigate = useNavigate();
  return (
    <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center pt-5">
      <div className="container py-5">
        <div className="d-flex flex-column align-items-center mb-4">
          <img
            src="/assets/BinszkiMonika.jpg"
            alt="Binszki Monika portrait"
            className="rounded-circle shadow border border-warning mb-3"
            style={{ width: '160px', height: '160px', objectFit: 'cover', background: '#222' }}
          />
          <h2 className="text-center mb-2 text-light">About the Designer</h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-light text-start small" style={{ whiteSpace: 'pre-line', fontSize: '1rem' }}>
              Welcome to the world of Cabeceo!
              <br /><br />
              Let me introduce myself: <b>Monika Binszki</b> – a passionate fashion designer inspired by femininity, elegance, and sensuality. I have over a decade of experience in finance and project management, but my true passion has always been fashion and creation.
              <br /><br />
              I dreamed up the "Cabeceo" brand in 2018, where the sensuality of tango, the subtlety of movement, and the freedom of self-expression come to life. Each garment tells a story, following and highlighting the movement of the female body, giving confidence to its wearer. In 2020, I organized my own collection's fashion show – my first big step into the world of runways.
              <br /><br />
              Creative thinking, refined aesthetics, and a commitment to quality guide all my work – whether it's a project, a dress, or envisioning a new collection. Variety, harmony, and a love of movement weave through my life – both in tango and in everyday moments.
              <br /><br />
              If you want a unique, elegant, and sensual garment that expresses you, you're in the right place.
              <br /><br />
              <b>Welcome to Cabeceo – where movement comes to life.</b>
            </div>
          </div>
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

export default DesignerEn;
