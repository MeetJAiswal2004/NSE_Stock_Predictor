// frontend/src/App.jsx (Final version with Mobile Toggle Logic)

import React, { useState, useEffect } from 'react';
import './style1.css';
import './style2.css';
import SearchBar from './components/SearchBar.jsx';
import About from './components/About.jsx';
import LoginPage from './components/LoginPage.jsx';
import SignupPage from './components/SignupPage.jsx';
import StockInfo from './components/StockInfo.jsx';
import StockChart from './components/StockChart.jsx';
import TermsPage from './components/TermsPage.jsx';
import LoginPopup from './components/LoginPopup.jsx';
import PanelToggle from './components/PanelToggle.jsx';
import { AUTH_API_URL, PREDICT_API_URL } from './config.js';

function App() {
  const [stockData, setStockData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [activeMobilePanel, setActiveMobilePanel] = useState('details');
  const [termsAccepted, setTermsAccepted] = useState(
    localStorage.getItem('termsAccepted') === 'true'
  );
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (!termsAccepted) {
      const timer = setTimeout(() => {
        setShowTerms(true);
      }, 1000); // 1 second
      return () => clearTimeout(timer);
    }
  }, [termsAccepted]);

  const handleAcceptTerms = () => {
    localStorage.setItem('termsAccepted', 'true');
    setTermsAccepted(true);
    setShowTerms(false);
  };
  
  const handleSearch = (companyName) => {
    setActiveMobilePanel('details');
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    setIsLoading(true);
    setError('');
    setStockData(null);
    const fetchPrediction = async () => {
        try {
          const apiUrl = `${PREDICT_API_URL}/api/predict`;
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify({ company: companyName }),
          });
          const data = await response.json();
          if (!response.ok) { throw new Error(data.error || 'Prediction failed.'); }
          setStockData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
    };
    fetchPrediction();
  };
  
  const handleLoginSuccess = (username, termsAccepted) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
    if (!termsAccepted) {
      setCurrentPage('terms');
    } else {
      setCurrentPage('main');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setStockData(null);
  };
  
  const handleSignupSuccess = () => {
    setCurrentPage('login');
  };

  const handleAcceptTermsBackend = async () => {
      try {
          await fetch(`${AUTH_API_URL}/auth/accept_terms`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
              body: JSON.stringify({ username: currentUser })
          });
          setCurrentPage('main');
      } catch (err) {
          alert("Could not update terms. Please try again.");
      }
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'about':
        return <About onBackClick={() => setCurrentPage('main')} />;
      case 'login':
        return <LoginPage onBackClick={() => setCurrentPage('main')} onLoginSuccess={handleLoginSuccess} />;
      case 'signup':
        return <SignupPage onBackClick={() => setCurrentPage('main')} onSignupSuccess={handleSignupSuccess} />;
      case 'terms':
        return <TermsPage onAccept={handleAcceptTermsBackend} />; // Is function ko call karein
      default:
        return (
          <>
            <SearchBar onSearch={handleSearch} isResponseVisible={!!stockData} />
            {isLoading && <p style={{ color: 'white', marginTop:'-20px', marginLeft: '-25px', textAlign: 'center', fontSize: '20px' }}>Fetching Prediction...</p>}
            {error && <p style={{ color: 'red', marginTop: '-20px', marginLeft: '-25px', textAlign: 'center', fontSize: '20px' }}>Error: {error}</p>}
            
            {stockData && (
              <>
                <PanelToggle 
                  activePanel={activeMobilePanel} 
                  onToggle={setActiveMobilePanel} 
                />
                <div className={`container mobile-view-${activeMobilePanel}`}>
                  <StockInfo data={stockData} />
                  <StockChart plots={stockData.plots} />
                </div>
              </>
            )}
          </>
        );
    }
  };

  if (showTerms) {
    return (
      <>
        <video autoPlay muted loop id="bg-video">
            <source src="https://res.cloudinary.com/dcwrpmp5k/video/upload/v1759073498/bgvideo_g9jrbh.mp4" type="video/mp4" />
        </video>
        <div className="overlay">
          <div className="content-animated">
             <TermsPage onAccept={handleAcceptTerms} />
          </div>
        </div>
      </>
    );
  }

  if (termsAccepted) {
    return (
      <>
        {showLoginPopup && 
          <LoginPopup 
            onClose={() => setShowLoginPopup(false)} 
            onLoginClick={() => { setShowLoginPopup(false); setCurrentPage('login'); }}
            onSignupClick={() => { setShowLoginPopup(false); setCurrentPage('signup'); }}
          />
        }
        <video autoPlay muted loop id="bg-video">
         <source src="https://res.cloudinary.com/dcwrpmp5k/video/upload/v1759073498/bgvideo_g9jrbh.mp4" type="video/mp4" />
        </video>
        <div className="top-right header-nav">
          <button onClick={() => setCurrentPage('about')}>About Us</button>
          {isLoggedIn ? ( <button onClick={handleLogout}>Logout</button> ) : (
            <>
              <button onClick={() => setCurrentPage('login')}>Login</button>
              <button onClick={() => setCurrentPage('signup')}>Signup</button>
            </>
          )}
        </div>
        <div id="dynamic-content">
          <div className="overlay">
            <div className="content-animated">
              {renderPageContent()}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
      <video autoPlay muted loop id="bg-video">
        <source src="https://res.cloudinary.com/dcwrpmp5k/video/upload/v1759073498/bgvideo_g9jrbh.mp4" type="video/mp4" />
      </video>
  );
}

export default App;


