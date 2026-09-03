import React from 'react';
import { Database, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function About() {
  return (
    <section className="section about-section" id="about">
      <div className="content-wrapper">
        <div className="about-grid">
          <div className="about-content">
            <span className="section-tag">About Project</span>
            <h2 className="section-title">
              Deep Learning in Neurological Diagnostics
            </h2>
            <p className="about-text">
              Brain tumors represent abnormal growths of tissue within the skull. Early identification using Magnetic Resonance Imaging (MRI) is essential for effective treatment planning. This research project demonstrates the power of Convolutional Neural Networks (CNNs) in assisting the automated screening of cranial MRI scans.
            </p>

            <ul className="about-features-list">
              <li className="about-feature-item">
                <CheckCircle2 size={18} />
                <span>Convolutional feature extraction tuned for cranial bone, tissue, and fluid contrast.</span>
              </li>
              <li className="about-feature-item">
                <CheckCircle2 size={18} />
                <span>Supports classification across common glioma, meningioma, pituitary, and healthy scans.</span>
              </li>
              <li className="about-feature-item">
                <CheckCircle2 size={18} />
                <span>Configurable RESTful API integration for Python Flask, FastAPI, or Node microservices.</span>
              </li>
              <li className="about-feature-item">
                <CheckCircle2 size={18} />
                <span>Designed with privacy: images are evaluated in-memory and never cached permanently.</span>
              </li>
            </ul>
          </div>

          <div className="about-stats-card">
            <div className="stats-card-header">
              <div className="stats-icon-wrap">
                <Cpu size={20} />
              </div>
              <h3 className="stats-title">Technical Specifications</h3>
            </div>

            <div className="tech-spec-row">
              <span className="tech-spec-label">Framework</span>
              <span className="tech-spec-val">TensorFlow / Keras</span>
            </div>
            <div className="tech-spec-row">
              <span className="tech-spec-label">Model Format</span>
              <span className="tech-spec-val">.keras Deep CNN</span>
            </div>
            <div className="tech-spec-row">
              <span className="tech-spec-label">Input Resolution</span>
              <span className="tech-spec-val">160 &times; 160 &times; 3</span>
            </div>
            <div className="tech-spec-row">
              <span className="tech-spec-label">Dataset Split</span>
              <span className="tech-spec-val">Training &amp; Independent Testing</span>
            </div>
            <div className="tech-spec-row">
              <span className="tech-spec-label">Interface Protocol</span>
              <span className="tech-spec-val">POST /predict (multipart/form-data)</span>
            </div>
            <div className="tech-spec-row">
              <span className="tech-spec-label">Client Stack</span>
              <span className="tech-spec-val">React 18 + Vite</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
