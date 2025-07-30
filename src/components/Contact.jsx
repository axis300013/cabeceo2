import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialState = { name: "", email: "", message: "" };

function Contact() {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);
    setIsLoading(true);
    
    try {
      // Firebase Function URL - will be updated after deployment
      const FUNCTION_URL = process.env.NODE_ENV === 'production' 
        ? 'https://sendcontactemail-yrmh5nz2aq-ew.a.run.app' // Production Firebase Function URL
        : 'http://localhost:3001/api/contact'; // Local development fallback
      
      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Hiba az üzenet küldésekor');
      }
      
      console.log('Email sent successfully via Firebase Function:', data);
      setSubmitted(true);
      setForm(initialState); // Reset form after successful submission
      
    } catch (err) {
      console.error('Contact form error:', err);
      setError(err.message || 'Hiba az üzenet küldésekor. Próbáld újra később.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center pt-5">
      <div className="container py-5">
        <h1 className="display-5 fw-bold mb-4 text-center">Kapcsolat</h1>
        <div className="row justify-content-center">
          <div className="col-lg-7">
            {submitted ? (
              <div className="alert alert-success text-center">
                <h5 className="mb-2">
                  <i className="fas fa-check-circle me-2"></i>
                  Üzenet sikeresen elküldve!
                </h5>
                <p className="mb-1">Köszönjük a megkeresést!</p>
                <small className="text-muted">
                  Hamarosan válaszolunk az <strong>info@cabeceo.hu</strong> címről.
                </small>
              </div>
            ) : (
              <>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">Név</label>
                    <input id="name" name="name" type="text" required className="form-control" value={form.name} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">Email</label>
                    <input id="email" name="email" type="email" required className="form-control" value={form.email} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label fw-semibold">Üzenet</label>
                    <textarea id="message" name="message" required className="form-control" rows={5} value={form.message} onChange={handleChange}></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary px-5 py-2" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Küldés...
                      </>
                    ) : (
                      'Küldés'
                    )}
                  </button>
                </form>
              </>
            )}
            <div className="mt-5 text-center text-secondary">
              <div>Email: <a href="mailto:info@cabeceo.hu" className="text-primary text-decoration-underline">info@cabeceo.hu</a></div>
              <div className="mt-2">Instagram: <a href="https://instagram.com/cabeceo.hu" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-underline">@cabeceo.hu</a></div>
              <div className="mt-2">
                <a href="https://www.facebook.com/cabeceotangoclothes" target="_blank" rel="noopener noreferrer" className="d-inline-flex align-items-center gap-2 text-decoration-none text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#1877f3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M15.117 8.667h-1.35V7.667c0-.327.217-.404.37-.404h.96V5.25l-1.32-.005c-1.47 0-1.81 1.1-1.81 1.805v1.617H10v2.083h1.967V18h1.8v-7.25h1.217l.133-2.083z" fill="#1877f3"/></svg>
                  <span className="align-middle">Facebook</span>
                </a>
              </div>
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

export default Contact;
