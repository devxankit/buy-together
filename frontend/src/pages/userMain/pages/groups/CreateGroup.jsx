import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const subCategoryMap = {
  'Smartphones': ['All Smartphones', 'iPhone', 'Samsung', 'OnePlus', 'Xiaomi', 'Google Pixel', 'Motorola', 'Realme'],
  'Laptops': ['All Laptops', 'MacBook', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI'],
  'Appliances': ['All Appliances', 'Refrigerator', 'Washing Machine', 'AC', 'Microwave', 'Dishwasher'],
  'Electronics': ['All Electronics', 'Headphones', 'Speakers', 'Cameras', 'Smart Watch', 'Tablet', 'Gaming'],
  'Fashion': ['All Fashion', 'Men', 'Women', 'Kids', 'Footwear', 'Accessories', 'Sports'],
  'Groceries': ['All Groceries', 'Fruits & Veggies', 'Dairy', 'Snacks', 'Beverages', 'Staples'],
  'Furniture': ['All Furniture', 'Sofa', 'Bed', 'Table', 'Chair', 'Storage', 'Décor'],
};

const mainCategories = [
  { id: 'Smartphones', name: 'Smartphones' },
  { id: 'Laptops', name: 'Laptops' },
  { id: 'Appliances', name: 'Appliances' },
  { id: 'Electronics', name: 'Electronics' },
  { id: 'Fashion', name: 'Fashion' },
  { id: 'Groceries', name: 'Groceries' },
  { id: 'Furniture', name: 'Furniture' },
];

const CreateGroup = () => {
  const navigate = useNavigate();

  // Form Fields
  const [groupName, setGroupName] = useState('');
  const [goal, setGoal] = useState(10);
  const [deadline, setDeadline] = useState('7');
  const [selectedMainCat, setSelectedMainCat] = useState('');
  const [selectedSubCat, setSelectedSubCat] = useState('');
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');

  // Dropdown States
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [isDeadlineOpen, setIsDeadlineOpen] = useState(false);

  // Dynamic Case-Insensitive Sub-Category Resolver
  const getSubCategories = (mainCat) => {
    if (!mainCat) return [];
    const key = Object.keys(subCategoryMap).find(
      k => k.toLowerCase() === mainCat.toLowerCase()
    );
    return key ? subCategoryMap[key] : [];
  };

  const canSubmit = () => {
    return (
      groupName.trim().length >= 3 &&
      selectedMainCat !== '' &&
      selectedSubCat !== '' &&
      goal >= 2 &&
      productName.trim().length >= 2
    );
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (canSubmit()) {
      // Navigate to /groups after creating
      navigate('/groups');
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-[430px] mx-auto bg-surface font-sans overflow-hidden">

      {/* ── SCROLLABLE FORM ── */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-6 pb-28">

        {/* ── TYPOGRAPHIC HERO TITLE ── */}
        <div className="pb-2 border-b border-line">
          <h1 className="text-[20px] font-black text-ink tracking-tight">Create Co-Buying Group</h1>
          <p className="text-[11px] text-muted font-semibold mt-0.5">Fill in the fields below to launch a new buying pool</p>
        </div>

        {/* ── SECTION 1: BASIC INFORMATION ── */}
        <div className="flex flex-col gap-3 pb-5 border-b border-line">
          <h3 className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Group Profile
          </h3>

          <div>
            <label className="text-[10px] font-bold text-muted block mb-1">Group Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value.slice(0, 60))}
              placeholder="e.g. Indore MacBook Buyers, Pune EV Group"
              className="w-full text-xs font-bold text-ink placeholder:text-muted bg-surface-alt border border-line rounded-xl px-3 py-2.5 outline-none focus:border-primary focus:bg-surface transition-all"
              required
            />
            <p className="text-[9px] text-muted font-medium mt-1 text-right">{groupName.length}/60</p>
          </div>
        </div>

        {/* ── SECTION 2: DYNAMIC CATEGORY & SUB-CATEGORY ── */}
        <div className="flex flex-col gap-3.5 pb-5 border-b border-line">
          <h3 className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Category Classification
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="text-[10px] font-bold text-muted block mb-1">Category <span className="text-red-400">*</span></label>
              <button
                type="button"
                onClick={() => {
                  setIsMainOpen(!isMainOpen);
                  setIsSubOpen(false);
                  setIsDeadlineOpen(false);
                }}
                className={`w-full flex items-center justify-between text-xs font-bold text-ink bg-surface-alt/50 border rounded-xl px-3 py-2.5 outline-none transition-all cursor-pointer ${
                  isMainOpen ? 'border-primary bg-surface ring-2 ring-[#0D9488]/10' : 'border-slate-200/80'
                }`}
              >
                <span className="truncate">{selectedMainCat ? mainCategories.find(c => c.id.toLowerCase() === selectedMainCat.toLowerCase())?.name || selectedMainCat : 'Select Category'}</span>
                <svg className={`w-3.5 h-3.5 text-muted transition-transform duration-200 flex-shrink-0 ml-1 ${isMainOpen ? 'rotate-180 text-primary' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isMainOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsMainOpen(false)}></div>
                  <div className="absolute left-0 right-0 mt-1.5 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 max-h-[220px] overflow-y-auto animate-slideDown">
                    {mainCategories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedMainCat(cat.id);
                          setSelectedSubCat('');
                          setIsMainOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 text-left text-xs font-bold transition-all hover:bg-surface-alt ${
                          selectedMainCat?.toLowerCase() === cat.id.toLowerCase() ? 'text-primary bg-primary-soft' : 'text-faint'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold text-muted block mb-1">Sub-Category <span className="text-red-400">*</span></label>
              <button
                type="button"
                disabled={!selectedMainCat}
                onClick={() => {
                  setIsSubOpen(!isSubOpen);
                  setIsMainOpen(false);
                  setIsDeadlineOpen(false);
                }}
                className={`w-full flex items-center justify-between text-xs font-bold transition-all cursor-pointer rounded-xl px-3 py-2.5 outline-none ${
                  !selectedMainCat 
                    ? 'bg-surface-alt border border-slate-200/50 text-slate-300 cursor-not-allowed opacity-60' 
                    : isSubOpen 
                      ? 'border-primary bg-surface ring-2 ring-[#0D9488]/10 text-ink' 
                      : 'bg-surface-alt/50 border border-slate-200/80 text-ink'
                }`}
              >
                <span className="truncate">{selectedSubCat || 'Select Sub'}</span>
                <svg className={`w-3.5 h-3.5 text-muted transition-transform duration-200 flex-shrink-0 ml-1 ${isSubOpen ? 'rotate-180 text-primary' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isSubOpen && selectedMainCat && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSubOpen(false)}></div>
                  <div className="absolute left-0 right-0 mt-1.5 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 max-h-[220px] overflow-y-auto animate-slideDown">
                    {getSubCategories(selectedMainCat).map(sub => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => {
                          setSelectedSubCat(sub);
                          setIsSubOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 text-left text-xs font-bold transition-all hover:bg-surface-alt ${
                          selectedSubCat === sub ? 'text-primary bg-primary-soft' : 'text-faint'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── SECTION 3: GROUP GOAL & TIMELINE ── */}
        <div className="flex flex-col gap-4 pb-5 border-b border-line">
          <h3 className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            Deal Target & Duration
          </h3>

          {/* Counters */}
          <div>
            <label className="text-[10px] font-bold text-muted block mb-1.5">Minimum Buyers Required <span className="text-red-400">*</span></label>
            <div className="flex items-center justify-between bg-surface-alt/50 border border-slate-200/60 rounded-xl px-4 py-2">
              <button
                type="button"
                onClick={() => setGoal(Math.max(2, goal - 1))}
                className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center active:scale-90 transition-all text-faint hover:bg-slate-200"
              >
                <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
              </button>
              <div className="text-center flex items-baseline gap-1">
                <span className="text-[20px] font-black text-primary">{goal}</span>
                <span className="text-[9px] font-bold text-muted">buyers</span>
              </div>
              <button
                type="button"
                onClick={() => setGoal(Math.min(500, goal + 1))}
                className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center active:scale-90 transition-all text-white hover:bg-teal-600 shadow-sm"
              >
                <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            {/* Quick selectors */}
            <div className="flex gap-1.5 mt-2 justify-between">
              {[5, 10, 25, 50, 100].map(n => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setGoal(n)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all active:scale-95 border ${goal === n ? 'bg-primary text-white border-transparent shadow-sm' : 'bg-surface border-slate-200/60 text-faint hover:bg-surface-alt'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Duration selection dropdown */}
          <div className="relative">
            <label className="text-[10px] font-bold text-muted block mb-1">Group Timeline Deadline <span className="text-red-400">*</span></label>
            <button
              type="button"
              onClick={() => {
                setIsDeadlineOpen(!isDeadlineOpen);
                setIsMainOpen(false);
                setIsSubOpen(false);
              }}
              className={`w-full flex items-center justify-between text-xs font-bold text-ink bg-surface-alt/50 border rounded-xl px-3 py-2.5 outline-none transition-all cursor-pointer ${
                isDeadlineOpen ? 'border-primary bg-surface ring-2 ring-[#0D9488]/10' : 'border-slate-200/80'
              }`}
            >
              <span>
                {deadline === '3' && '3 Days (Fast track)'}
                {deadline === '7' && '7 Days (Standard)'}
                {deadline === '14' && '14 Days (Extended)'}
                {deadline === '30' && '30 Days (Maximum window)'}
              </span>
              <svg className={`w-3.5 h-3.5 text-muted transition-transform duration-200 flex-shrink-0 ${isDeadlineOpen ? 'rotate-180 text-primary' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDeadlineOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDeadlineOpen(false)}></div>
                <div className="absolute left-0 right-0 mt-1.5 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-slideDown">
                  {[
                    { val: '3', label: '3 Days (Fast track)' },
                    { val: '7', label: '7 Days (Standard)' },
                    { val: '14', label: '14 Days (Extended)' },
                    { val: '30', label: '30 Days (Maximum window)' }
                  ].map(item => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => {
                        setDeadline(item.val);
                        setIsDeadlineOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left text-xs font-bold transition-all hover:bg-surface-alt ${
                        deadline === item.val ? 'text-primary bg-primary-soft' : 'text-faint'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── SECTION 4: PRODUCT SPECIFICS ── */}
        <div className="flex flex-col gap-3 pb-5 border-b border-line">
          <h3 className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Target Product Specs
          </h3>

          <div>
            <label className="text-[10px] font-bold text-muted block mb-1">Product Model / Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value.slice(0, 80))}
              placeholder="e.g. Apple iPad Air M2 128GB Space Gray"
              className="w-full text-xs font-bold text-ink placeholder:text-muted bg-surface-alt border border-line rounded-xl px-3 py-2.5 outline-none focus:border-primary focus:bg-surface transition-all"
              required
            />
            <p className="text-[9px] text-muted font-medium mt-1 text-right">{productName.length}/80</p>
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted block mb-1">Requirements Description <span className="text-muted font-normal">(optional)</span></label>
            <textarea
              value={productDesc}
              onChange={e => setProductDesc(e.target.value.slice(0, 300))}
              placeholder="Describe color variants, storage configurations, or details about the supplier quote..."
              className="w-full text-xs font-semibold text-ink placeholder:text-muted bg-surface-alt border border-line rounded-xl px-3 py-2 outline-none focus:border-primary focus:bg-surface transition-all resize-none"
              rows={2}
            />
            <p className="text-[9px] text-muted font-medium mt-0.5 text-right">{productDesc.length}/300</p>
          </div>
        </div>

        {/* ── SECTION 5: LIVE SUMMARY BOX ── */}
        <div className="bg-gradient-to-r from-teal-50/80 to-[#F0FDF9]/80 border border-teal-100/50 rounded-2xl p-4 flex flex-col gap-2.5">
          <p className="text-[10.5px] font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            LIVE PREVIEW SUMMARY
          </p>
          <div className="flex flex-col gap-1.5 text-[11px] font-semibold text-faint">
            <div className="flex justify-between items-center border-b border-teal-100/50 pb-1">
              <span className="opacity-75">Pool Name:</span>
              <span className="text-ink font-extrabold truncate max-w-[200px]">{groupName || 'Unspecified Name'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-teal-100/50 pb-1">
              <span className="opacity-75">Target Product:</span>
              <span className="text-ink font-extrabold truncate max-w-[200px]">{productName || 'Unspecified Product'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-teal-100/50 pb-1">
              <span className="opacity-75">Category Range:</span>
              <span className="text-ink font-extrabold">{selectedMainCat ? `${selectedMainCat} › ${selectedSubCat || 'Sub-cat'}` : 'Not Categorized'}</span>
            </div>
            <div className="flex justify-between items-center pt-0.5">
              <span className="opacity-75">Deal Target:</span>
              <span className="text-ink font-extrabold">{goal} Buyers • {deadline} Days Limit</span>
            </div>
          </div>
        </div>

      </form>

      {/* ── FIXED BOTTOM ACTION BUTTON ── */}
      <div className="flex-shrink-0 bg-surface border-t border-line px-4 py-3 shadow-[0_-8px_35px_rgba(0,0,0,0.04)] z-30">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className="w-full h-[48px] bg-primary hover:bg-[#0B7A70] rounded-xl text-white text-[13.5px] font-black flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
        >
          <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Group & Launch
        </button>
      </div>

    </div>
  );
};

export default CreateGroup;
