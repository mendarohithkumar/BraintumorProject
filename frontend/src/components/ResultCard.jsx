import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
  Brain,
  Layers,
  FileSearch,
} from 'lucide-react';
import ConfidenceBar from './ConfidenceBar';

export default function ResultCard({
  predictionState, // 'initial' | 'loading' | 'success' | 'error'
  resultData,      // { prediction: string, confidence: number, subtype?: string }
  imagePreviewUrl,
  selectedImage,
  errorMessage,
  onReset,
  onRetry,
}) {
  // 1. Initial State: No image selected or ready to scan
  if (predictionState === 'initial') {
    return (
      <div className="result-card-container state-initial">
        <div className="initial-illustration">
          <Brain size={44} strokeWidth={1.5} />
        </div>
        <h3 className="initial-heading">
          {selectedImage ? 'Ready for Analysis' : 'No Image Selected'}
        </h3>
        <p className="initial-desc">
          {selectedImage
            ? 'Click "Detect Tumor" to run the deep learning inference pipeline.'
            : 'Select or drag & drop a brain MRI scan on the left to begin AI analysis.'}
        </p>
      </div>
    );
  }

  // 2. Loading State: Analyzing MRI image...
  if (predictionState === 'loading') {
    return (
      <div className="result-card-container state-loading">
        <div className="loading-radar">
          <div className="loading-radar-inner"></div>
        </div>
        <h3 className="loading-heading">Analyzing MRI image...</h3>
        <p className="loading-subtext">
          Running convolutional layers, feature extraction, and classification.
        </p>
      </div>
    );
  }

  // 3. Error State: API Connection error or server issue
  if (predictionState === 'error') {
    return (
      <div className="result-card-container state-error">
        <div className="error-icon-wrap">
          <AlertCircle size={36} />
        </div>
        <h3 className="error-title">Analysis Failed</h3>
        <p className="error-desc">
          {errorMessage ||
            'Unable to analyze the image. Please check the backend connection and try again.'}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {onRetry && (
            <button type="button" className="btn-retry" onClick={onRetry}>
              <RotateCcw size={16} />
              <span>Retry Analysis</span>
            </button>
          )}
          <button type="button" className="btn-reset" onClick={onReset}>
            <span>Reset</span>
          </button>
        </div>

        <div className="inline-disclaimer">
          <AlertTriangle size={18} />
          <span>
            Ensure your backend server is running (e.g. at <code>{import.meta.env.VITE_API_URL || 'http://localhost:5000'}</code>) with CORS enabled.
          </span>
        </div>
      </div>
    );
  }

  // 4. Success State: Result received
  // Evaluate if tumor or not
  const rawPred = (resultData?.prediction || '').toString().trim().toLowerCase();
  const isNoTumor =
    rawPred === 'no tumor' ||
    rawPred === 'notumor' ||
    rawPred === 'no_tumor' ||
    rawPred === 'negative' ||
    rawPred === 'normal';

  const isTumor = !isNoTumor;

  // Format title as required:
  // "Tumor Detected" or "No Tumor Detected"
  const formattedTitle = isTumor ? 'Tumor Detected' : 'No Tumor Detected';

  // Subtype detail if provided by 4-class model (e.g., glioma, meningioma, pituitary)
  let subtypeDisplay = null;
  if (isTumor && rawPred !== 'tumor') {
    subtypeDisplay = rawPred.charAt(0).toUpperCase() + rawPred.slice(1);
  }

  const confidence = resultData?.confidence ?? 0;

  return (
    <div className="result-panel">
      <div className="result-card-container state-result">
        {/* Outcome Alert Banner */}
        <div className={`outcome-banner ${isTumor ? 'tumor' : 'no-tumor'}`}>
          <div className="outcome-icon-wrap">
            {isTumor ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />}
          </div>

          <div>
            <div className="outcome-tag">AI Classification Result</div>
            <div className="outcome-title">{formattedTitle}</div>
          </div>
        </div>

        {/* Paired MRI Image Thumbnail */}
        {imagePreviewUrl && (
          <div className="result-paired-view">
            <img
              src={imagePreviewUrl}
              alt="Analyzed Brain MRI"
              className="result-thumb"
            />
            <div className="result-thumb-info">
              <div className="result-thumb-title">Analyzed MRI Scan</div>
              <div className="result-thumb-desc">
                {selectedImage?.name || 'mri_scan.jpg'} &bull; Deep CNN Input
              </div>
            </div>
          </div>
        )}

        {/* Meta Info Grid */}
        <div className="result-meta-grid">
          <div className="meta-box">
            <div className="meta-box-label">Diagnosis State</div>
            <div className="meta-box-value" style={{ color: isTumor ? '#e11d48' : '#059669' }}>
              {isTumor ? 'Tumor Positive' : 'Tumor Negative'}
            </div>
          </div>

          <div className="meta-box">
            <div className="meta-box-label">Classification Type</div>
            <div className="meta-box-value">
              {subtypeDisplay ? `${subtypeDisplay}` : (isTumor ? 'Abnormal Mass' : 'Normal Scan')}
            </div>
          </div>
        </div>

        {/* Visual Confidence Bar */}
        <ConfidenceBar confidence={confidence} isTumor={isTumor} />

        {/* Reset / Analyze Another Button */}
        <button
          type="button"
          className="btn-reset"
          onClick={onReset}
          id="reset-detection-btn"
        >
          <RotateCcw size={16} />
          <span>Analyze Another Image</span>
        </button>

        {/* Required Prominent Disclaimer Near Result */}
        <div className="inline-disclaimer">
          <ShieldAlert size={18} />
          <span>
            <strong>Disclaimer:</strong> This application is intended for educational and research purposes only. It is not a medical diagnostic tool. Always consult a qualified healthcare professional for medical advice.
          </span>
        </div>
      </div>
    </div>
  );
}
