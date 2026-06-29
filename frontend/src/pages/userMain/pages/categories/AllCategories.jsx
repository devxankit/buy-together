import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../../../services/category.api';
import { swr, swrPeek } from '../../../../services/swr';

/**
2. * Premium, gorgeous All Categories list page.
3. * Displays all available categories in a clean grid with filter search capability.
4. */
const AllCategories = () => {
  const navigate = useNavigate();
  // Cached paint on revisit, then silent background revalidation.
  const cached = swrPeek('categories:all');
  const [categories, setCategories] = useState(cached || []);
  const [loading, setLoading] = useState(cached === undefined);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let active = true;
    swr(
      'categories:all',
      async () => {
        const { data } = await getCategories();
        return data || [];
      },
      { ttl: 0, onData: (d) => { if (active) { setCategories(d); setLoading(false); } } }
    ).catch((err) => {
      console.warn('Failed to load categories:', err);
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-surface-alt font-sans pb-24 select-none">
      {/* Header Container */}
      <div className="flex flex-col gap-3 px-5 pt-6 pb-4 bg-surface sticky top-0 z-30 shadow-sm shadow-slate-100/70">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-1.5 bg-surface-alt rounded-full active:scale-95 transition-all text-ink"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-black text-ink tracking-tight">All Categories</h1>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center bg-surface-alt border border-line rounded-xl overflow-hidden h-9 shadow-inner px-3">
          <svg className="w-4 h-4 text-faint flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full text-xs font-semibold text-ink pl-2.5 focus:outline-none bg-transparent"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-faint hover:text-ink active:scale-90 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="px-5 py-5 flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-muted">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs font-bold">No categories found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-x-4 gap-y-5">
            {filteredCategories.map((cat) => (
              <div
                key={cat._id || cat.slug}
                onClick={() => navigate('/categories', { state: { categoryId: cat.slug } })}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* Image Box */}
                <div className="w-full aspect-square rounded-[22px] overflow-hidden flex items-center justify-center bg-white border border-line/60 shadow-sm group-active:scale-95 transition-all duration-300">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-primary text-xl font-bold">
                      {cat.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Name Label */}
                <span className="text-[11px] font-extrabold text-ink mt-2 text-center tracking-tight leading-snug max-w-full truncate px-0.5 group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCategories;
