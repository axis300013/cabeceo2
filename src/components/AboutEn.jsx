import React from "react";
import { useNavigate } from "react-router-dom";

function AboutEn() {
  const navigate = useNavigate();
  return (
    <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center pt-5">
      <div className="container py-5">
        <h2 className="text-center mb-4 text-light">About the Brand</h2>
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-5 d-flex justify-content-center mb-4 mb-lg-0">
            <img
              src="/assets/cabeceo_05.jpg"
              alt="Cabeceo brand"
              className="img-fluid rounded shadow border border-warning"
              style={{ maxHeight: '820px', width: '100%', objectFit: 'contain', background: '#222' }}
            />
          </div>
          <div className="col-lg-7 d-flex align-items-center">
            <p className="text-light text-start small ms-lg-4" style={{ maxWidth: '600px', fontSize: '1rem' }}>
              A gentle nod following a kind glance, used in tango to signal the offer and acceptance of a dance. Its origins date back to the 1940s, when crowded milongas made it easier for young men to invite ladies to dance in the ballroom.<br/>
              The ladies' task is to be eye-catching, pretty, and flirtatious in their appearance, with the aim of capturing the men's attention as they enter the dance hall.<br/>
              Cabeceo is a unique cultural custom exclusive to tango. This uniqueness characterizes the style of my dresses, whose cuts and lines highlight femininity, making them sexy and attention-grabbing, giving their wearers a radiance and confidence that makes them feel like the uncrowned queens of the milongas.<br/>
              Keeping in mind that tango is a very complex, movement-intensive dance, I paid special attention to practicality and comfort when designing my dresses, which - in addition to uniqueness, femininity, and sensual appearance - are essential for the wearer to enjoy every subtle movement of the dance, contributing to the perfect tanda experience.<br/>
              Cabeceo: unique, inimitable, reflects a passion for dance, helping ladies choose the right male partner, with the dress "winking" for them.<br/>
              My goal is for every woman to have a Cabeceo dress in her wardrobe that matches her personality, contributing to her success on the dance floor.
            </p>
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

export default AboutEn;
