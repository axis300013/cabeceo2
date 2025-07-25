import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();
  return (
    <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center pt-5">
      <div className="container py-5">
        <h2 className="text-center mb-4 text-light">A márkáról</h2>
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-5 d-flex justify-content-center mb-4 mb-lg-0">
            <img
              src="/assets/cabeceo_05.jpg"
              alt="Cabeceo márka"
              className="img-fluid rounded shadow border border-warning"
              style={{ maxHeight: '820px', width: '100%', objectFit: 'contain', background: '#222' }}
            />
          </div>
          <div className="col-lg-7 d-flex align-items-center">
            <p className="text-light text-start small ms-lg-4" style={{ maxWidth: '600px', fontSize: '1rem' }}>
              Egy kedves tekintetet követő fejbólintás, melyet a táncok ajánlatának és elfogadásának jelzésére használnak a tangóban. Eredete a 1940-es évekre vezethető vissza, amikor is a túlzsúfolt milongákon a tánctermek hölgytagjainak táncra való felkérését könnyítette meg a fiatalemberek számára.<br/>
              A hölgyek feladata, hogy feltűnőek, csinosak, kacérak legyenek megjelenésükben, azzal a céllal, hogy a férfiak tekintetét megragadják, amint belépnek a táncterembe.<br/>
              A Cabeceo kizárólag a tangóra jellemző, egyedi kulturális szokás. Ez az egyediség jellemzi ruháim stílusát, melyek szabása, vonalvezetése kiemeli a nőiességet, megjelenésükben szexisek, figyelem felkeltőek, olyan kisugárzást, magabiztosságot nyújtanak viselői számára, mellyel a milongák koronázatlan királynőiként érezhetik magukat.<br/>
              Szem előtt tartva, hogy a tangó mozdulataiban nagyon összetett, mozgásigényes formátumú tánc, ruháim tervezésekor különös gondot fordítottam a praktikum, kényelem szempontjaira is, amely - az egyediség, nőiesség, érzéki megjelenés mellett - elengedhetetlen feltétele, hogy viselője élvezze a tánc minden apró rezdülését, hozzájárulva a tökéletes tanda megéléséhez.<br/>
              Cabeceo: egyedi, utánozhatatlan, tükrözi a tánc iránti szenvedélyt, segítve a hölgyeket a megfelelő férfipartner kiválasztásában, a ruha „pillog" helyettük.<br/>
              Célom, hogy minden nőnek legyen egy személyiségében hozzá illő Cabeceo ruha a toalettjében, hozzájárulva a táncparketten való sikeréhez.
            </p>
          </div>
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

export default About;
