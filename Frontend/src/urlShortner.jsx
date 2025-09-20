import React, { useState } from 'react';
import { Link2, Copy, Check, Trash2, BarChart3 } from 'lucide-react';

const URLShortener = () => {
  const [currentPage, setCurrentPage] = useState('shortener');
  const [urls, setUrls] = useState([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }; 

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const handleSubmit = () => {
    if (!originalUrl) {
      alert('Please enter a URL');
      return;
    }
    
    if (!validateUrl(originalUrl)) {
      alert('Please enter a valid URL');
      return;
    }

    if (urls.length >= 5) {
      alert('Maximum 5 URLs allowed');
      return;
    }

    const newUrl = {
      id: Date.now(),
      originalUrl,
      shortcode: generateShortCode(),
      createdAt: new Date().toLocaleDateString(),
      clicks: 0
    };

    setUrls([...urls, newUrl]);
    setOriginalUrl('');
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  const deleteUrl = (id) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  const simulateClick = (id) => {
    setUrls(urls.map(url => 
      url.id === id ? { ...url, clicks: url.clicks + 1 } : url
    ));
  };

  return (
    <div className="app-container">
      {/* Simple Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="nav-title">
            <Link2 size={20} />
            URL Shortener
          </h1>
          <div className="nav-buttons">
            <button
              onClick={() => setCurrentPage('shortener')}
              className={`nav-button ${currentPage === 'shortener' ? 'active' : ''}`}
            >
              Shortener
            </button>
            <button
              onClick={() => setCurrentPage('statistics')}
              className={`nav-button ${currentPage === 'statistics' ? 'active' : ''}`}
            >
              <BarChart3 size={16} />
              Stats
            </button>
          </div>
        </div>
      </nav>

      <div className="main-container">
        {currentPage === 'shortener' ? (
          <div>
            {/* Simple Form */}
            <div className="card">
              <h2>Shorten Your URL</h2>
              
              <div className="form-group">
                <input
                  type="text"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="Enter your long URL here..."
                  className="url-input"
                />
                <button
                  onClick={handleSubmit}
                  disabled={urls.length >= 5}
                  className="submit-btn"
                >
                  Shorten URL
                </button>
              </div>
              
              <p className="url-counter">{urls.length}/5 URLs used</p>
            </div>

            {/* URL List */}
            {urls.length > 0 && (
              <div className="card">
                <h3>Your Shortened URLs</h3>
                
                {urls.map((url) => {
                  const shortUrl = `https://short.ly/${url.shortcode}`;
                  
                  return (
                    <div key={url.id} className="url-item">
                      <div className="url-info">
                        <p className="original-url">{url.originalUrl}</p>
                        <div className="short-url-row">
                          <code className="short-url">{shortUrl}</code>
                          <button
                            onClick={() => copyToClipboard(shortUrl, url.id)}
                            className={`copy-btn ${copiedId === url.id ? 'copied' : ''}`}
                          >
                            {copiedId === url.id ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                        <p className="url-meta">Created: {url.createdAt} • Clicks: {url.clicks}</p>
                      </div>
                      
                      <div className="url-actions">
                        <button
                          onClick={() => simulateClick(url.id)}
                          className="click-btn"
                        >
                          +1 Click
                        </button>
                        <button
                          onClick={() => deleteUrl(url.id)}
                          className="delete-btn"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          // Simple Statistics Page
          <div className="card">
            <h2>Statistics</h2>
            
            {urls.length === 0 ? (
              <div className="empty-state">
                <p>No URLs shortened yet.</p>
                <button
                  onClick={() => setCurrentPage('shortener')}
                  className="cta-btn"
                >
                  Create Your First URL
                </button>
              </div>
            ) : (
              <div>
                <div className="stats-grid">
                  <div className="stat-box">
                    <h3>Total URLs</h3>
                    <p className="stat-number">{urls.length}</p>
                  </div>
                  <div className="stat-box">
                    <h3>Total Clicks</h3>
                    <p className="stat-number">
                      {urls.reduce((sum, url) => sum + url.clicks, 0)}
                    </p>
                  </div>
                </div>
                
                <div className="stats-list">
                  {urls.map((url) => (
                    <div key={url.id} className="stats-item">
                      <div>
                        <code>{url.shortcode}</code>
                        <p className="stats-url">{url.originalUrl}</p>
                      </div>
                      <div className="stats-info">
                        <span className="click-count">{url.clicks} clicks</span>
                        <span className="date">{url.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default URLShortener;