import React, { useState } from 'react';
import authService from '../services/authService';

const AdminLogin = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const user = await authService.signInWithGoogle();
      
      if (authService.isAuthorized(user)) {
        onLoginSuccess(user);
      } else {
        setError('Nincs jogosultságod az admin felülethez. Lépj kapcsolatba az adminisztrátorral.');
        await authService.signOut();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Hiba a bejelentkezés során: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="d-flex flex-column min-vh-100 bg-black text-light justify-content-center align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card bg-dark text-light shadow-lg">
              <div className="card-body p-5 text-center">
                <h2 className="card-title mb-4">
                  <i className="fas fa-shield-alt me-2"></i>
                  Admin Bejelentkezés
                </h2>
                
                <p className="text-muted mb-4">
                  A katalógus adminisztrációjához bejelentkezés szükséges.
                </p>

                {error && (
                  <div className="alert alert-danger mb-4" role="alert">
                    <small>{error}</small>
                  </div>
                )}

                <button
                  className="btn btn-primary btn-lg w-100 mb-3 d-flex align-items-center justify-content-center"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Bejelentkezés...
                    </>
                  ) : (
                    <>
                      <i className="fab fa-google me-2"></i>
                      Bejelentkezés Google-lel
                    </>
                  )}
                </button>

                <small className="text-muted">
                  Biztonságos bejelentkezés Google fiókkal
                </small>
              </div>
            </div>

            <div className="text-center mt-4">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Csak jogosult felhasználók férhetnek hozzá az admin felülethez
              </small>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminLogin;
