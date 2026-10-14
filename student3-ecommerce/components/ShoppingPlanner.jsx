import React, { useState, useEffect } from 'react';
import BudgetImpactWarning from './BudgetImpactWarning';

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Books & Media',
  'Health & Beauty',
  'Fitness & Sports',
  'Other'
];

export default function ShoppingPlanner({ api, formatCurrency, onError, onSuccess }) {
  const [items, setItems] = useState([]);
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    quantity: 1,
    priority: 'Medium',
    expectedDate: '',
    productUrl: '',
    notes: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, impactRes] = await Promise.all([
        api.get('/shopping'),
        api.get('/shopping/budget-impact')
      ]);

      if (itemsRes.data && itemsRes.data.success) {
        setItems(itemsRes.data.data);
      }
      if (impactRes.data && impactRes.data.success) {
        setImpact(impactRes.data);
      }
    } catch (err) {
      if (onError) onError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Electronics',
      price: '',
      quantity: 1,
      priority: 'Medium',
      expectedDate: '',
      productUrl: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity || 1,
      priority: item.priority,
      expectedDate: item.expectedDate || '',
      productUrl: item.productUrl || '',
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return onError && onError('Please enter a product name.');
    if (!formData.price || Number(formData.price) <= 0) return onError && onError('Please enter a valid price.');

    try {
      if (editingItem) {
        await api.put(`/shopping/${editingItem._id}`, formData);
        if (onSuccess) onSuccess('Product updated successfully!');
      } else {
        await api.post('/shopping', formData);
        if (onSuccess) onSuccess('Product added to shopping planner!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      if (onError) onError(err.response?.data?.message || err.message);
    }
  };

  const handleTogglePurchased = async (id) => {
    try {
      const res = await api.patch(`/shopping/${id}/toggle-purchased`);
      if (onSuccess) onSuccess(res.data?.message || 'Status updated!');
      fetchData();
    } catch (err) {
      if (onError) onError(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product from your planner?')) return;
    try {
      await api.delete(`/shopping/${id}`);
      if (onSuccess) onSuccess('Product removed from planner.');
      fetchData();
    } catch (err) {
      if (onError) onError(err.response?.data?.message || err.message);
    }
  };

  const fmt = (v) => formatCurrency ? formatCurrency(v) : `$${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const totalPlanned = items
    .filter(i => !i.isPurchased)
    .reduce((sum, i) => sum + (Number(i.price) * (Number(i.quantity) || 1)), 0);

  const totalPurchased = items
    .filter(i => i.isPurchased)
    .reduce((sum, i) => sum + (Number(i.price) * (Number(i.quantity) || 1)), 0);

  const unpurchasedCount = items.filter(i => !i.isPurchased).length;
  const highPriorityCount = items.filter(i => !i.isPurchased && i.priority === 'High').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">E-Commerce Shopping Planner</h2>
          <p className="text-sm text-slate-500">Plan upcoming purchases, evaluate budget feasibility, and prevent impulse spending.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition-all shadow-indigo-100"
        >
          <span>＋</span> Add Planned Product
        </button>
      </div>

      {/* Budget Impact Warning Alert */}
      <BudgetImpactWarning impact={impact} formatCurrency={formatCurrency} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Planned Spending</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">{fmt(totalPlanned)}</div>
          <span className="text-xs text-indigo-600 font-medium mt-1 inline-block">{unpurchasedCount} items queued</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Purchased</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{fmt(totalPurchased)}</div>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">{items.length - unpurchasedCount} items bought</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">High Priority Outlay</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {fmt(items.filter(i => !i.isPurchased && i.priority === 'High').reduce((s, i) => s + (Number(i.price) * (Number(i.quantity) || 1)), 0))}
          </div>
          <span className="text-xs text-rose-500 font-medium mt-1 inline-block">{highPriorityCount} urgent items</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Month Budget Left</span>
          <div className="text-2xl font-bold text-slate-700 mt-1">{fmt(impact?.remainingBudget || 0)}</div>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Discretionary limit</span>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Wishlist & Planned Purchases</h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
            {items.length} Products Total
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading shopping items...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-2">🛍️</div>
            <h4 className="font-semibold text-slate-700">No planned purchases yet</h4>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              Add products you want to buy to calculate total planned cost and assess budget impact.
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg text-sm hover:bg-indigo-100 transition-colors"
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Done</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-center">Qty</th>
                  <th className="py-3.5 px-4 text-right">Total</th>
                  <th className="py-3.5 px-4 text-center">Priority</th>
                  <th className="py-3.5 px-4">Target Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const lineTotal = Number(item.price) * (Number(item.quantity) || 1);
                  return (
                    <tr
                      key={item._id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        item.isPurchased ? 'bg-slate-50/40 text-slate-400' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={Boolean(item.isPurchased)}
                          onChange={() => handleTogglePurchased(item._id)}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        <div className={`${item.isPurchased ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {item.name}
                        </div>
                        {item.notes && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{item.notes}</p>}
                        {item.productUrl && (
                          <a
                            href={item.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-500 hover:underline inline-block mt-0.5"
                          >
                            🔗 View Store Page
                          </a>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-700">
                        {fmt(item.price)}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-600">
                        {item.quantity || 1}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                        {fmt(lineTotal)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          item.priority === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : item.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {item.expectedDate || 'Flexible'}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-slate-400 hover:text-indigo-600 p-1.5 transition-colors mr-1"
                          title="Edit Product"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                          title="Remove Product"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">
                {editingItem ? 'Edit Planned Product' : 'Add Product to Shopping Planner'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Price per Unit ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Target Purchase Date
                  </label>
                  <input
                    type="date"
                    value={formData.expectedDate}
                    onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Product URL / Store Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.productUrl}
                    onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Notes / Research Details
                </label>
                <textarea
                  rows="2"
                  placeholder="Notes on discounts, model specs, alternative stores..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
                >
                  {editingItem ? 'Save Changes' : 'Add to Wishlist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
