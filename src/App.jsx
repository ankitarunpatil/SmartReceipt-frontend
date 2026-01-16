import React, { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import Analytics from './components/Analytics';
import ReceiptsList from './components/ReceiptsList';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useToast } from './hooks/useToast';

function App() {
  const { toasts, removeToast, success, error } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = (result) => {
    setRefreshKey(prev => prev + 1);
    success('Receipt processed successfully!');
  };

  const handleDelete = () => {
    setRefreshKey(prev => prev + 1);
    success('Receipt deleted');
  };

  const handleUploadError = (errorMessage) => {
    error(errorMessage);
  };

  // Add keyboard shortcuts
  useKeyboardShortcuts({
    'u': () => {
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.click();
    },
    'ctrl+r': () => {
      setRefreshKey(prev => prev + 1);
      success('Data refreshed');
    },
    '?': () => {
      alert(
        '⌨️ Keyboard Shortcuts:\n\n' +
        'U - Upload receipt\n' +
        'Ctrl+R - Refresh data\n' +
        '? - Show this help'
      );
    }
  });

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh' }}>
        <Header />
        
        <div className="container">
          <div className="grid grid-2">
            {/* Left Column */}
            <div>
              <UploadSection 
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
              <div style={{ marginTop: '20px' }}>
                <Analytics refresh={refreshKey} />
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <ReceiptsList 
                refresh={refreshKey} 
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: 'white',
          marginTop: '40px'
        }}>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>
            Built with React + FastAPI + Gemini AI 🚀
          </p>
          <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '8px' }}>
            100% Free • No Credit Card Required
          </p>
        </footer>

        {/* Toast Notifications */}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ErrorBoundary>
  );
}

export default App;