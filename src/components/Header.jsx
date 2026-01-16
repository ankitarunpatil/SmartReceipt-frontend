import React from 'react';
import { Receipt } from 'lucide-react';

const Header = () => {
  return (
    <header style={{
      background: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '30px'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Receipt size={32} color="#667eea" />
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              SmartReceipt
            </h1>
            <p style={{ fontSize: '14px', color: '#6c757d' }}>
              AI-Powered Receipt Manager (100% Free)
            </p>
          </div>
        </div>
        
        <div style={{ 
          background: '#e8f5e9', 
          padding: '8px 16px', 
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#2e7d32'
        }}>
          💰 $0.00 Cost
        </div>
      </div>
    </header>
  );
};

export default Header;