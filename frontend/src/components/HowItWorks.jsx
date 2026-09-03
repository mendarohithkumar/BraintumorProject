import React from 'react';
import { UploadCloud, Send, Cpu, CheckSquare } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Upload MRI Image',
      desc: 'Select or drag & drop a cranial MRI image in PNG or JPG format (up to 10 MB).',
      icon: <UploadCloud size={24} />,
    },
    {
      number: '02',
      title: 'Sent to AI Model',
      desc: 'The frontend preprocesses the scan and securely dispatches it to the model API.',
      icon: <Send size={24} />,
    },
    {
      number: '03',
      title: 'CNN Model Analyzes',
      desc: 'Deep convolutional layers extract neural spatial features and pathological patterns.',
      icon: <Cpu size={24} />,
    },
    {
      number: '04',
      title: 'Result & Confidence',
      desc: 'Instant diagnostic prediction is rendered alongside calibrated confidence metrics.',
      icon: <CheckSquare size={24} />,
    },
  ];

  return (
    <section className="section how-it-works-section" id="how-it-works">
      <div className="content-wrapper">
        <div className="section-header">
          <span className="section-tag">Workflow Pipeline</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            An automated computer-vision workflow designed for high-accuracy brain MRI evaluation.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <div className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <div className="step-icon-wrap">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
