import React from 'react';
import { Percent, TrendingUp } from 'lucide-react';

export default function ConfidenceBar({
  confidence = 0,
  isTumor = false,
}) {
  // Normalize confidence (handles 0.96 or 96)
  const normalizedValue = confidence > 1 ? confidence : confidence * 100;
  const percentage = Math.min(100, Math.max(0, Math.round(normalizedValue)));

  const stateClass = isTumor ? 'tumor' : 'no-tumor';

  return (
    <div className="confidence-widget">
      <div className="confidence-header">
        <div className="confidence-label">
          <TrendingUp size={16} />
          <span>Prediction Confidence</span>
        </div>
        <div className="confidence-percentage">
          {percentage}%
        </div>
      </div>

      <div className="confidence-bar-track" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
        <div
          className={`confidence-bar-fill ${stateClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
