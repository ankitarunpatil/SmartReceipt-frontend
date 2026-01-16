import React, { useState } from 'react';
import { Upload, Loader, CheckCircle, XCircle } from 'lucide-react';
import { uploadReceipt } from '../services/api';

const UploadSection = ({ onUploadSuccess, onUploadError }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    // Validate file size
    if (selectedFile.size > 10 * 1024 * 1024) {
      const errorMsg = 'File too large. Max size is 10MB';
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      return;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      const errorMsg = 'Invalid file type. Please upload JPG or PNG';
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setSuccess(false);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const result = await uploadReceipt(file);
      console.log('Upload success:', result);
      
      clearInterval(progressInterval);
      setProgress(100);
      setSuccess(true);
      
      // Show success message
      setTimeout(() => {
        // Reset form
        setFile(null);
        setPreview(null);
        setSuccess(false);
        setProgress(0);
        
        // Notify parent
        if (onUploadSuccess) {
          onUploadSuccess(result);
        }
      }, 2000);
      
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      console.error('Upload error:', err);
      
      let errorMessage = 'Failed to upload receipt';
      
      if (err.response) {
        errorMessage = err.response.data?.detail || errorMessage;
      } else if (err.request) {
        errorMessage = 'Cannot connect to server. Is the backend running?';
      }
      
      setError(errorMessage);
      if (onUploadError) onUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = { target: { files: [droppedFile] } };
      handleFileSelect(event);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="card fade-in">
      <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>
        📸 Upload Receipt
      </h2>
      
      <div 
        style={{ 
          border: '2px dashed #667eea', 
          borderRadius: '12px', 
          padding: '40px',
          textAlign: 'center',
          background: '#f8f9ff',
          cursor: 'pointer',
          transition: 'all 0.2s',
          position: 'relative'
        }}
        onClick={() => !uploading && document.getElementById('file-input').click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseEnter={(e) => !uploading && (e.currentTarget.style.background = '#f0f2ff')}
        onMouseLeave={(e) => e.currentTarget.style.background = '#f8f9ff'}
      >
        {uploading ? (
          <div>
            <Loader 
              size={48} 
              color="#667eea" 
              style={{ 
                margin: '0 auto 16px',
                animation: 'spin 1s linear infinite'
              }} 
            />
            <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              Processing with AI...
            </p>
            <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '16px' }}>
              Extracting receipt data
            </p>
            
            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '8px',
              background: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{ fontSize: '12px', color: '#6c757d' }}>
              {progress}% complete
            </p>
          </div>
        ) : success ? (
          <div>
            <CheckCircle 
              size={48} 
              color="#28a745" 
              style={{ margin: '0 auto 16px' }} 
            />
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#28a745' }}>
              ✅ Receipt processed successfully!
            </p>
            <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '8px' }}>
              Refreshing data...
            </p>
          </div>
        ) : preview ? (
          <div>
            <img 
              src={preview} 
              alt="Receipt preview" 
              style={{ 
                maxWidth: '300px', 
                maxHeight: '400px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }} 
            />
            <p style={{ color: '#667eea', fontWeight: '600' }}>
              📄 {file.name}
            </p>
            <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        ) : (
          <div>
            <Upload size={48} color="#667eea" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              Click or drag to upload receipt
            </p>
            <p style={{ fontSize: '14px', color: '#6c757d' }}>
              JPG, PNG or JPEG • Max 10MB
            </p>
            <p style={{ fontSize: '12px', color: '#667eea', marginTop: '8px', fontWeight: '600' }}>
              Press 'U' to upload
            </p>
          </div>
        )}
        
        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </div>

      {error && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: '#fff3f3',
          border: '1px solid #ffcccc',
          borderRadius: '8px',
          color: '#d32f2f',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <XCircle size={20} />
          <div style={{ flex: 1 }}>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {file && !uploading && !success && (
        <>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            style={{ marginTop: '20px', width: '100%' }}
          >
            <Upload size={20} style={{ 
              display: 'inline-block',
              marginRight: '8px',
              verticalAlign: 'middle'
            }} />
            Upload & Process with AI
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={() => {
              setFile(null);
              setPreview(null);
              setError(null);
            }}
            style={{ marginTop: '12px', width: '100%' }}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default UploadSection;