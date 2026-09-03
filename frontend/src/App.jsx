import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ImageUploader from './components/ImageUploader';
import DetectionButton from './components/DetectionButton';
import ResultCard from './components/ResultCard';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import Footer from './components/Footer';
import { Activity, ShieldCheck, Info } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  
  // Prediction states: 'initial' | 'loading' | 'success' | 'error'
  const [predictionState, setPredictionState] = useState('initial');
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Optional Demo Mode for testing when Python backend is not yet started
  const [demoMode, setDemoMode] = useState(false);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // Handle image selection
  const handleImageSelect = useCallback((file) => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreviewUrl(previewUrl);
    setPredictionState('initial');
    setResultData(null);
    setErrorMessage('');
  }, [imagePreviewUrl]);

  // Handle image removal
  const handleImageRemove = useCallback(() => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setPredictionState('initial');
    setResultData(null);
    setErrorMessage('');
  }, [imagePreviewUrl]);

  // Reset entire detection session
  const handleReset = useCallback(() => {
    handleImageRemove();
  }, [handleImageRemove]);

  // Run tumor detection inference
  const handleDetectTumor = async () => {
    if (!selectedImage) return;

    setPredictionState('loading');
    setErrorMessage('');

    // If Demo Mode is enabled, simulate network latency and return realistic prediction
    if (demoMode) {
      setTimeout(() => {
        const isTumorSample = selectedImage.name.toLowerCase().includes('tumor') ||
                              selectedImage.name.toLowerCase().includes('gl') ||
                              Math.random() > 0.4;
        
        const mockConfidence = isTumorSample ? 0.96 : 0.94;
        const mockPrediction = isTumorSample ? 'Tumor' : 'No Tumor';

        setResultData({
          prediction: mockPrediction,
          confidence: mockConfidence,
        });
        setPredictionState('success');
      }, 1500);
      return;
    }

    // Real Backend API call using FormData with field name "image"
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const endpoint = `${API_BASE_URL}/predict`;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.prediction === undefined) {
        throw new Error('Invalid response structure from backend API');
      }

      setResultData({
        prediction: data.prediction,
        confidence: typeof data.confidence === 'number' ? data.confidence : 0.95,
        subtype: data.subtype || null,
      });
      setPredictionState('success');
    } catch (err) {
      console.error('Detection API Error:', err);
      setErrorMessage(
        'Unable to analyze the image. Please check the backend connection and try again.'
      );
      setPredictionState('error');
    }
  };

  // Smooth scroll helper
  const scrollToDetection = () => {
    const el = document.getElementById('detection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* 1. Navigation Bar */}
      <Navbar />

      <main className="main-content">
        {/* 2. Hero Section */}
        <Hero onStartClick={scrollToDetection} />

        {/* 3 & 4 & 5 & 6 & 7. Detection Workspace */}
        <section className="section detection-section" id="detection">
          <div className="content-wrapper">
            <div className="section-header">
              <span className="section-tag">Deep Learning Analysis</span>
              <h2 className="section-title">Brain MRI Diagnostic Workspace</h2>
              <p className="section-subtitle">
                Upload a cranial MRI image to run the convolutional neural network detector.
              </p>
            </div>

            <div className="detection-workspace">
              {/* Workspace Toolbar */}
              <div className="workspace-toolbar">
                <div className="toolbar-status">
                  <span
                    className={`status-indicator ${
                      predictionState === 'loading'
                        ? 'running'
                        : predictionState === 'success'
                        ? 'success'
                        : selectedImage
                        ? 'ready'
                        : ''
                    }`}
                  ></span>
                  <span>
                    {predictionState === 'loading'
                      ? 'Inference in progress...'
                      : predictionState === 'success'
                      ? 'Analysis completed'
                      : predictionState === 'error'
                      ? 'Connection Error'
                      : selectedImage
                      ? 'MRI Image Ready'
                      : 'Awaiting MRI Image'}
                  </span>
                </div>

                {/* Demo Mode Toggle Switch */}
                <div className="demo-toggle-group">
                  <label htmlFor="demo-toggle" style={{ cursor: 'pointer' }}>
                    Demo Mode {demoMode ? '(Active)' : '(Off)'}
                  </label>
                  <label className="toggle-switch">
                    <input
                      id="demo-toggle"
                      type="checkbox"
                      checked={demoMode}
                      onChange={(e) => setDemoMode(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              {/* Two Column Layout: Left = Upload/Action, Right = Result */}
              <div className="workspace-grid">
                {/* Left Column: Image Uploader & Action Button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <ImageUploader
                    selectedImage={selectedImage}
                    imagePreviewUrl={imagePreviewUrl}
                    onImageSelect={handleImageSelect}
                    onImageRemove={handleImageRemove}
                    isLoading={predictionState === 'loading'}
                  />

                  {/* 4. Detection Action Button */}
                  <DetectionButton
                    onClick={handleDetectTumor}
                    isLoading={predictionState === 'loading'}
                    disabled={!selectedImage || predictionState === 'loading'}
                  />
                </div>

                {/* Right Column: 5. Result Card & Confidence Bar */}
                <div>
                  <ResultCard
                    predictionState={predictionState}
                    resultData={resultData}
                    imagePreviewUrl={imagePreviewUrl}
                    selectedImage={selectedImage}
                    errorMessage={errorMessage}
                    onReset={handleReset}
                    onRetry={handleDetectTumor}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. How It Works Section */}
        <HowItWorks />

        {/* Technical Overview / About Section */}
        <About />
      </main>

      {/* 9 & 10. Footer with Disclaimer */}
      <Footer />
    </div>
  );
}
