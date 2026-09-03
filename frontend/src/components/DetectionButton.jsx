import React from 'react';
import { Cpu, Loader2 } from 'lucide-react';

export default function DetectionButton({
  onClick,
  isLoading,
  disabled,
}) {
  return (
    <button
      id="detect-tumor-btn"
      type="button"
      className="btn-detect"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <div className="spinner"></div>
          <span>Analyzing MRI image...</span>
        </>
      ) : (
        <>
          <Cpu size={20} />
          <span>Detect Tumor</span>
        </>
      )}
    </button>
  );
}
