export const exportToCSV = (receipts) => {
  if (!receipts || receipts.length === 0) {
    alert('No receipts to export');
    return;
  }

  // Create CSV header
  let csv = 'Date,Time,Merchant,Category,Subtotal,Tax,Total,Payment Method,Items,Item Count\n';

  // Add rows
  receipts.forEach(receipt => {
    const items = receipt.items.map(item => 
      `${item.quantity}x ${item.name} ($${item.price.toFixed(2)})`
    ).join('; ');

    const row = [
      receipt.date,
      receipt.time || '',
      `"${receipt.merchant_name}"`,
      receipt.category,
      receipt.subtotal.toFixed(2),
      receipt.tax.toFixed(2),
      receipt.total.toFixed(2),
      receipt.payment_method || '',
      `"${items}"`,
      receipt.items.length
    ];

    csv += row.join(',') + '\n';
  });

  // Create download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `smartreceipt_export_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);

  console.log(`✅ Exported ${receipts.length} receipts to CSV`);
};