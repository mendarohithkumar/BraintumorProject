import React from 'react';
import { ArrowRight, Sparkles, Brain, Cpu, ShieldCheck } from 'lucide-react';

export default function Hero({ onStartClick }) {
  const scrollToDetection = () => {
    if (onStartClick) {
      onStartClick();
    } else {
      const el = document.getElementById('detection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section" id="hero">
      <div className="content-wrapper">
        {/* Research status pill */}
        <div className="hero-badge-container">
          <div className="hero-badge">
            <span className="dot-live"></span>
            <Sparkles size={14} color="#0284c7" />
            <span>Deep Learning MRI Analysis Engine</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="hero-title">
          Brain Tumor Detection <span className="hero-title-gradient">Using AI</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Upload a brain MRI image and let the AI model analyze the image.
        </p>

        {/* Action Buttons */}
        <div className="hero-actions">
          <button
            id="start-detection-btn"
            className="btn-primary-hero"
            onClick={scrollToDetection}
          >
            <span>Start Detection</span>
            <ArrowRight size={18} />
          </button>

          <button
            className="btn-secondary-hero"
            onClick={scrollToHowItWorks}
          >
            <span>View Architecture</span>
          </button>
        </div>

        {/* Highlight Feature Cards */}
        <div className="hero-highlights">
          <div className="highlight-card">
            <div className="highlight-icon">
              <Brain size={22} />
            </div>
            <div>
              <div className="highlight-title">CNN Neural Architecture</div>
              <div className="highlight-desc">Trained on multi-class brain MRI scan datasets</div>
            </div>
          </div>

          <div className="highlight-card">
            <div className="highlight-icon">
              <Cpu size={22} />
            </div>
            <div>
              <div className="highlight-title">Instant Inference</div>
              <div className="highlight-desc">Sub-second prediction with calibrated confidence</div>
            </div>
          </div>

          <div className="highlight-card">
            <div className="highlight-icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="highlight-title">Educational Prototype</div>
              <div className="highlight-desc">Built for medical imaging research & benchmarking</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
