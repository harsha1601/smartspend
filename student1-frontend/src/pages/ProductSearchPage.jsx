import React, { useState } from 'react';
import ProductSearch from '../../../student3-ecommerce/components/ProductSearch';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProductSearchPage() {
  const { formatCurrency } = useAuth();
  const [toast, setToast] = useState({ message: '', type: '' });

  const handleSuccess = (msg) => {
    setToast({ message: msg, type: 'success' });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const handleError = (msg) => {
    setToast({ message: msg, type: 'error' });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Toast Feedback */}
      {toast.message && (
        <div className={`p-3.5 rounded-xl text-sm font-medium transition-all ${
          toast.type === 'error'
            ? 'bg-rose-50 border border-rose-200 text-rose-800'
            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          {toast.type === 'error' ? '🚨 ' : '✅ '}{toast.message}
        </div>
      )}

      {/* Student 3 E-Commerce Product Search & Filter */}
      <ProductSearch
        api={api}
        formatCurrency={formatCurrency}
        onError={handleError}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
