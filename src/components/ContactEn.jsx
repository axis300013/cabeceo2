import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialState = { name: "", email: "", message: "" };

function ContactEn() {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Integrate with backend/Firebase Functions
    setSubmitted(true);
  };

  return (
    <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center pt-5">
      <div className="container py-5">
        <h1 className="display-5 fw-bold mb-4 text-center">Contact</h1>
        <div className="row justify-content-center">
          <div className="col-lg-7">
            {submitted ? (
              <div className="alert alert-success text-center">Thank you for your message!</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">Name</label>
                  <input id="name" name="name" type="text" required className="form-control" value={form.name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">Email</label>
                  <input id="email" name="email" type="email" required className="form-control" value={form.email} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label fw-semibold">Message</label>
                  <textarea id="message" name="message" required className="form-control" rows={5} value={form.message} onChange={handleChange}></textarea>
                </div>
                <button type="submit" className="btn btn-primary px-5 py-2">Send</button>
              </form>
            )}
            <div className="mt-5 text-center text-secondary">
              <div>Email: <a href="mailto:cabeceo.monika@gmail.com" className="text-primary text-decoration-underline">cabeceo.monika@gmail.com</a></div>
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
        Back
      </button>
    </main>
  );
}

export default ContactEn;
