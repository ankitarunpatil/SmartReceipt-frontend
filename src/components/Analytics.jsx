import React, { useEffect, useState } from 'react';
import { TrendingUp, ShoppingCart, DollarSign, FileText } from 'lucide-react';
import { getAnalytics } from '../services/api';

const Analytics = ({ refresh }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [refresh]);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '16px' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Add this check after loading finishes
    if (!analytics || analytics.total_receipts === 0) {
    return (
        <div className="card fade-in" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>📊</p>
        <h3 style={{ marginBottom: '8px' }}>No analytics yet</h3>
        <p style={{ color: '#6c757d' }}>
            Upload receipts to see your spending analytics
        </p>
        </div>
    );
    }

//   if (!analytics) {
//     return null;
//   }

  const stats = [
    {
      icon: <FileText size={32} color="#667eea" />,
      label: 'Total Receipts',
      value: analytics.total_receipts,
      color: '#667eea'
    },
    {
      icon: <DollarSign size={32} color="#28a745" />,
      label: 'Total Spent',
      value: `$${analytics.total_spent.toFixed(2)}`,
      color: '#28a745'
    },
    {
      icon: <ShoppingCart size={32} color="#ffc107" />,
      label: 'Categories',
      value: Object.keys(analytics.by_category).length,
      color: '#ffc107'
    },
    {
      icon: <TrendingUp size={32} color="#17a2b8" />,
      label: 'Avg per Receipt',
      value: analytics.total_receipts > 0 
        ? `$${(analytics.total_spent / analytics.total_receipts).toFixed(2)}`
        : '$0.00',
      color: '#17a2b8'
    }
  ];

  return (
    <div className="fade-in">
      <h2 style={{ marginBottom: '20px', fontSize: '24px', color: 'white' }}>
        📊 Analytics Dashboard
      </h2>
      
      {/* Stats Grid */}
      <div className="grid grid-2" style={{ marginBottom: '20px' }}>
        {stats.map((stat, index) => (
          <div key={index} className="card" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '12px' }}>
              {stat.icon}
            </div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: 'bold',
              color: stat.color,
              marginBottom: '8px'
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      {Object.keys(analytics.by_category).length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>
            Spending by Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(analytics.by_category).map(([category, amount]) => {
              const percentage = (amount / analytics.total_spent) * 100;
              return (
                <div key={category}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <span style={{ 
                      textTransform: 'capitalize',
                      fontWeight: '600'
                    }}>
                      {category}
                    </span>
                    <span style={{ fontWeight: 'bold' }}>
                      ${amount.toFixed(2)}
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6c757d',
                    marginTop: '4px'
                  }}>
                    {percentage.toFixed(1)}% of total
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monthly Breakdown */}
      {Object.keys(analytics.by_month).length > 0 && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>
            Spending by Month
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(analytics.by_month).map(([month, amount]) => (
              <div key={month} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <span style={{ fontWeight: '600' }}>
                  {new Date(month + '-01').toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </span>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>
                  ${amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;