import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Books & Media',
  'Health & Beauty',
  'Fitness & Sports',
  'Other'
];

export default function ProductSearch({ api, formatCurrency, onError, onSuccess }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchFilteredProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedPriority !== 'All') params.append('priority', selectedPriority);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await api.get(`/shopping?${params.toString()}`);
      if (res.data && res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      if (onError) onError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      fetchFilteredProducts();
    }, 250);
    return () => clearTimeout(delayTimer);
  }, [search, selectedCategory, selectedPriority, minPrice, maxPrice, sortBy, sortOrder]);

  const handleTogglePurchased = async (id) => {
    try {
      const res = await api.patch(`/shopping/${id}/toggle-purchased`);
      if (onSuccess) onSuccess(res.data?.message || 'Status updated!');
      fetchFilteredProducts();
    } catch (err) {
      if (onError) onError(err.response?.data?.message || err.message);
    }
  };

  const fmt = (v) => formatCurrency ? formatCurrency(v) : `$${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedPriority('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('date');
    setSortOrder('desc');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">E-Commerce Product Search & Filter</h2>
        <p className="text-sm text-slate-500">Discover and organize planned items with multi-attribute filtering, price boundaries, and priority sorting.</p>
      </div>

      {/* Search & Filter Controls Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        {/* Top Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-base">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search products by keyword or notes (e.g. Headphones, Monitor)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="date-desc">Newest Added</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="priority-desc">Priority: High to Low</option>
              <option value="expectedDate-asc">Target Date: Soonest</option>
            </select>

            <button
              onClick={resetFilters}
              className="px-3.5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors"
              title="Reset All Filters"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-semibold uppercase mr-2 tracking-wider">Category:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Priority & Price Range */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority Only</option>
              <option value="Medium">Medium Priority Only</option>
              <option value="Low">Low Priority Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Min Price ($)</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Max Price ($)</label>
            <input
              type="number"
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Results Count & Badges */}
      <div className="flex justify-between items-center px-1">
        <span className="text-sm font-semibold text-slate-600">
          Showing {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Product Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">Searching products...</div>
      ) : items.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-4xl mb-2">🔎</div>
          <h4 className="font-semibold text-slate-700 text-lg">No products match your criteria</h4>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting search terms, price boundaries, or clearing category filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg text-sm hover:bg-indigo-100 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => {
            const lineTotal = Number(item.price) * (Number(item.quantity) || 1);
            return (
              <div
                key={item._id}
                className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  item.isPurchased ? 'opacity-70 bg-slate-50/50' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      item.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : item.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.priority} Priority
                    </span>
                  </div>

                  <h4 className={`text-base font-bold text-slate-800 mt-3 ${
                    item.isPurchased ? 'line-through text-slate-400' : ''
                  }`}>
                    {item.name}
                  </h4>

                  {item.notes && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.notes}</p>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Unit Price</span>
                      <span className="text-lg font-bold text-slate-800">{fmt(item.price)}</span>
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Qty: {item.quantity}</span>
                        <span className="text-xs font-semibold text-slate-600">Total: {fmt(lineTotal)}</span>
                      </div>
                    )}
                  </div>

                  {item.expectedDate && (
                    <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <span>📅 Target:</span>
                      <span className="font-medium text-slate-600">{item.expectedDate}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTogglePurchased(item._id)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      item.isPurchased
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {item.isPurchased ? '✓ Purchased (Click to Undo)' : 'Mark as Purchased'}
                  </button>

                  {item.productUrl && (
                    <a
                      href={item.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                      title="Open Store Link"
                    >
                      🔗
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
