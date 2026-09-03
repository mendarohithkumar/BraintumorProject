import React, { useRef, useState } from 'react';
import { UploadCloud, FileImage, Trash2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export default function ImageUploader({
  selectedImage,
  imagePreviewUrl,
  onImageSelect,
  onImageRemove,
  isLoading,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Validate and handle file
  const handleFile = (file) => {
    setUploadError(null);

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setUploadError('Invalid format. Please upload a PNG, JPG, or JPEG MRI image.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError('File is too large. Maximum allowable image size is 10 MB.');
      return;
    }

    onImageSelect(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  // File input change
  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    // reset input value so re-selecting the same file works
    e.target.value = '';
  };

  // Load sample test image
  const loadSampleImage = async (path, sampleName) => {
    try {
      setUploadError(null);
      const response = await fetch(path);
      const blob = await response.blob();
      const file = new File([blob], sampleName, { type: 'image/jpeg' });
      onImageSelect(file);
    } catch (err) {
      console.error('Failed to load sample image:', err);
      setUploadError('Unable to load sample MRI image.');
    }
  };

  // Helper for human-readable file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="uploader-panel">
      {/* If an image is selected, show Preview Card */}
      {selectedImage && imagePreviewUrl ? (
        <div className="preview-card">
          <div className="preview-media-container">
            <img
              src={imagePreviewUrl}
              alt="Brain MRI Preview"
              className="preview-image"
            />

            {/* Radar Scanning Line Animation while prediction is running */}
            {isLoading && (
              <>
                <div className="scanner-line"></div>
                <div className="scanner-overlay"></div>
              </>
            )}
          </div>

          <div className="preview-details">
            <div className="file-info">
              <div className="file-icon">
                <FileImage size={20} />
              </div>
              <div>
                <div className="file-name" title={selectedImage.name}>
                  {selectedImage.name}
                </div>
                <div className="file-size">
                  {formatFileSize(selectedImage.size)} &bull; {selectedImage.type || 'image/jpeg'}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-remove-image"
              onClick={onImageRemove}
              disabled={isLoading}
              title="Remove image"
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Large Drag & Drop Upload Zone */
        <div
          id="dropzone-area"
          className={`dropzone-container ${isDragOver ? 'is-dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current && fileInputRef.current.click();
            }
          }}
        >
          <div className="dropzone-icon-wrap">
            <UploadCloud size={32} />
          </div>

          <h3 className="dropzone-title">Upload Brain MRI Image</h3>
          <p className="dropzone-text">
            Drag and drop your scan here, or click to browse files
          </p>

          <div className="dropzone-limits">
            <span>PNG, JPG, JPEG</span>
            <span>&bull;</span>
            <span>Up to 10 MB</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            className="hidden-file-input"
            onChange={handleInputChange}
          />
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="inline-disclaimer" style={{ background: '#fff1f2', borderColor: '#fecdd3', color: '#be123c' }}>
          <AlertCircle size={18} color="#e11d48" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Preset MRI Samples for Quick Evaluation */}
      <div className="sample-images-bar">
        <span className="sample-title">Try Sample Scans:</span>
        <div className="sample-buttons">
          <button
            type="button"
            className="btn-sample"
            onClick={() => loadSampleImage('/samples/tumor-sample.jpg', 'tumor_glioma_sample.jpg')}
            disabled={isLoading}
          >
            <Sparkles size={14} color="#e11d48" />
            <span>Sample (Tumor)</span>
          </button>
          <button
            type="button"
            className="btn-sample"
            onClick={() => loadSampleImage('/samples/healthy-sample.jpg', 'healthy_scan_sample.jpg')}
            disabled={isLoading}
          >
            <Sparkles size={14} color="#059669" />
            <span>Sample (No Tumor)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
