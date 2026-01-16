import React, { useEffect, useState } from 'react';
import { Trash2, Calendar, DollarSign, Tag, Download, Search } from 'lucide-react';
import { getReceipts, deleteReceipt } from '../services/api';
import { exportToCSV } from '../utils/exportCSV';

const CATEGORIES = [
  { name: 'All', value: null, icon: '🏷️' },
  { name: 'Groceries', value: 'groceries', icon: '🛒' },
  { name: 'Restaurant', value: 'restaurant', icon: '🍽️' },
  { name: 'Gas', value: 'gas', icon: '⛽' },
  { name: 'Shopping', value: 'shopping', icon: '🛍️' },
  { name: 'Entertainment', value: 'entertainment', icon: '🎬' },
  { name: 'Health', value: 'health', icon: '💊' },
  { name: 'Transport', value: 'transport', icon: '🚗' },
  { name: 'Other', value: 'other', icon: '📦' }
];

const ReceiptsList = ({ refresh, onDelete }) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadReceipts();
  }, [refresh, selectedCategory]);

  const loadReceipts = async () => {
    setLoading(true);
    try {
      const data = await getReceipts(selectedCategory);
      setReceipts(data);
    } catch (err) {
      console.error('Failed to load receipts:', err);
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, merchantName) => {
    if (!window.confirm(`Are you sure you want to delete receipt from ${merchantName}?`)) {
      return;
    }

    try {
      await deleteReceipt(id);
      setReceipts(receipts.filter(r => r.id !== id));
      if (onDelete) onDelete();
    } catch (err) {
      console.error('Failed to delete receipt:', err);
      alert('❌ Failed to delete receipt. Please try again.');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      groceries: '#28a745',
      restaurant: '#fd7e14',
      gas: '#6f42c1',
      shopping: '#e83e8c',
      entertainment: '#20c997',
      health: '#17a2b8',
      transport: '#ffc107',
      other: '#6c757d'
    };
    return colors[category] || colors.other;
  };

  // Filter receipts by search query
  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = 
      receipt.merchant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.items.some(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', color: '#6c757d' }}>Loading receipts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h2 style={{ fontSize: '24px', color: 'white', margin: 0 }}>
          📝 Your Receipts ({filteredReceipts.length})
        </h2>
        
        <button
          className="btn btn-primary"
          onClick={() => exportToCSV(receipts)}
          disabled={receipts.length === 0}
          style={{ 
            opacity: receipts.length === 0 ? 0.5 : 1,
            cursor: receipts.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '16px', position: 'relative' }}>
        <Search 
          size={20} 
          style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#6c757d',
            pointerEvents: 'none'
          }} 
        />
        <input
          type="text"
          className="input"
          placeholder="🔍 Search receipts or items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            background: 'white',
            paddingLeft: '44px'
          }}
        />
      </div>

      {/* Category Filters */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '20px'
      }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value || 'all'}
            onClick={() => setSelectedCategory(cat.value)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '20px',
              background: selectedCategory === cat.value 
                ? 'white' 
                : 'rgba(255,255,255,0.3)',
              color: selectedCategory === cat.value ? '#667eea' : 'white',
              fontWeight: selectedCategory === cat.value ? '600' : '400',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
              boxShadow: selectedCategory === cat.value 
                ? '0 2px 8px rgba(0,0,0,0.15)' 
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== cat.value) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== cat.value) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              }
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredReceipts.length === 0 ? (
        <div className="card text-center" style={{ padding: '60px 20px' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>
            {searchQuery ? '🔍' : '📭'}
          </p>
          <h3 style={{ marginBottom: '8px', fontSize: '20px' }}>
            {searchQuery 
              ? 'No receipts found' 
              : selectedCategory 
                ? `No ${selectedCategory} receipts yet`
                : 'No receipts yet'}
          </h3>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            {searchQuery 
              ? `Try a different search term` 
              : 'Upload your first receipt to get started!'}
          </p>
          {(searchQuery || selectedCategory) && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              style={{ marginTop: '16px' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        /* Receipts List */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredReceipts.map((receipt) => (
            <div 
              key={receipt.id} 
              className="card" 
              style={{ 
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              {/* Receipt Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    {receipt.merchant_name}
                  </h3>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '16px',
                    fontSize: '14px',
                    color: '#6c757d',
                    marginBottom: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={16} />
                      {new Date(receipt.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      {receipt.time && ` at ${receipt.time}`}
                    </span>
                    
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Tag size={16} />
                      <span style={{
                        background: getCategoryColor(receipt.category) + '20',
                        color: getCategoryColor(receipt.category),
                        padding: '2px 8px',
                        borderRadius: '4px',
                        textTransform: 'capitalize',
                        fontWeight: '600'
                      }}>
                        {receipt.category}
                      </span>
                    </span>
                  </div>
                </div>
                
                {/* Total & Actions */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold',
                    color: '#667eea',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    justifyContent: 'flex-end'
                  }}>
                    <DollarSign size={24} />
                    {receipt.total.toFixed(2)}
                  </div>
                  
                  <button
                    className="btn btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(receipt.id, receipt.merchant_name);
                    }}
                    style={{ 
                      padding: '6px 12px', 
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Items Expandable Section */}
              {receipt.items && receipt.items.length > 0 && (
                <details style={{ marginTop: '12px' }}>
                  <summary style={{ 
                    cursor: 'pointer', 
                    fontWeight: '600',
                    color: '#667eea',
                    userSelect: 'none',
                    padding: '8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>📦</span>
                    View {receipt.items.length} item(s)
                  </summary>
                  
                  <div style={{ 
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '2px solid #e0e0e0'
                  }}>
                    {/* Items List */}
                    <div style={{ marginBottom: '12px' }}>
                      {receipt.items.map((item, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            fontSize: '14px',
                            background: idx % 2 === 0 ? '#f8f9fa' : 'transparent',
                            borderRadius: '4px'
                          }}
                        >
                          <span style={{ flex: 1 }}>
                            {item.quantity > 1 && (
                              <span style={{ 
                                fontWeight: '600', 
                                color: '#667eea',
                                marginRight: '6px'
                              }}>
                                {item.quantity}×
                              </span>
                            )}
                            {item.name}
                          </span>
                          <span style={{ fontWeight: '600', color: '#333' }}>
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Receipt Totals */}
                    <div style={{ 
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '2px solid #dee2e6',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontSize: '14px',
                      background: '#f8f9fa',
                      padding: '12px',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6c757d' }}>Subtotal:</span>
                        <span style={{ fontWeight: '500' }}>
                          ${receipt.subtotal.toFixed(2)}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6c757d' }}>Tax:</span>
                        <span style={{ fontWeight: '500' }}>
                          ${receipt.tax.toFixed(2)}
                        </span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        marginTop: '6px',
                        paddingTop: '8px',
                        borderTop: '1px solid #dee2e6',
                        color: '#667eea'
                      }}>
                        <span>Total:</span>
                        <span>${receipt.total.toFixed(2)}</span>
                      </div>
                      
                      {receipt.payment_method && (
                        <div style={{ 
                          marginTop: '8px',
                          paddingTop: '8px',
                          borderTop: '1px dashed #dee2e6',
                          fontSize: '12px',
                          color: '#6c757d',
                          textAlign: 'center'
                        }}>
                          💳 Paid with {receipt.payment_method}
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              )}

              {/* Footer Info */}
              <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #e0e0e0',
                fontSize: '12px',
                color: '#6c757d',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>
                  📄 {receipt.filename}
                </span>
                {receipt.ai_model && (
                  <span style={{ 
                    background: '#e8f5e9',
                    color: '#2e7d32',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    🤖 {receipt.ai_model}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceiptsList;