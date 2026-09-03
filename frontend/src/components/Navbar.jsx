import React, { useState } from 'react';
import { Activity, ShieldCheck, Cpu, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar" id="navbar">
      <div className="content-wrapper navbar-inner">
        <div className="nav-brand" onClick={() => scrollToSection('hero')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon-wrapper">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <span>Brain Tumor Detection</span>
          <span className="brand-badge">AI Research</span>
        </div>

        <ul className="nav-links">
          <li>
            <a href="#hero" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
              Home
            </a>
          </li>
          <li>
            <a href="#detection" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('detection'); }}>
              Detection
            </a>
          </li>
          <li>
            <a href="#how-it-works" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>
              How It Works
            </a>
          </li>
          <li>
            <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
              About
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          <button
            className="nav-cta-btn"
            onClick={() => scrollToSection('detection')}
          >
            <Cpu size={16} />
            <span>Start Detection</span>
          </button>

          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          style={{
            background: 'white',
            borderBottom: '1px solid var(--border-color)',
            padding: '1.25rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <a href="#hero" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
            Home
          </a>
          <a href="#detection" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('detection'); }}>
            Detection
          </a>
          <a href="#how-it-works" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>
            How It Works
          </a>
          <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
            About
          </a>
        </div>
      )}
    </nav>
  );
}
