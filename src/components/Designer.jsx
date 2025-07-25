import React from "react";
import { useNavigate } from "react-router-dom";

function Designer() {
  const navigate = useNavigate();
  return (
    <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center pt-5">
      <div className="container py-5">
        <div className="d-flex flex-column align-items-center mb-4">
          <img
            src="/assets/BinszkiMonika.jpg"
            alt="Binszki Mónika portré"
            className="rounded-circle shadow border border-warning mb-3"
            style={{ width: '160px', height: '160px', objectFit: 'cover', background: '#222' }}
          />
          <h2 className="text-center mb-2 text-light">A tervezőről</h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-light text-start small" style={{ whiteSpace: 'pre-line', fontSize: '1rem' }}>
              Üdvözöllek a Cabeceo világában!
              <br /><br />
              Engedd meg, hogy bemutatkozzam: <b>Binszki Mónika</b> vagyok – egy szenvedélyes divattervező, akit a nőiesség, az elegancia és az érzékiség inspirál. Több mint egy évtizedes tapasztalattal rendelkezem a pénzügyi és projektmenedzsment világában, ám az igazi szívügyem mindig is a divat és az alkotás volt.
              <br /><br />
              A „Cabeceo” márkát 2018-ban álmodtam meg, ahol a tangó érzékisége, a mozdulatok finomsága és az önkifejezés szabadsága ölt testet. Minden egyes ruhadarab egy történet, amely a női test mozgását követi, emeli ki, és ad hozzá magabiztosságot a viselőjének. 2020-ban saját kollekcióm divatbemutatóját is megszerveztem – ez volt az első nagy lépésem a kifutók világában.
              <br /><br />
              Kreatív gondolkodás, kifinomult szépérzék és a minőség iránti elkötelezettség vezet minden munkámban – legyen szó egy projektről, egy ruháról vagy egy új kollekció megálmodásáról. A változatosság, a harmónia és a mozgás szeretete átszövi az életem – akár a tangóban, akár a mindennapokban.
              <br /><br />
              Ha szeretnél egyedi, elegáns és érzéki ruhadarabot, ami Téged fejez ki, akkor jó helyen jársz.
              <br /><br />
              <b>Üdvözöl a Cabeceo – ahol a mozdulat ölt testet.</b>
            </div>
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


export default Designer;
