import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TOTAL_STEPS = 5;

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
  { id: 'Smartphones', name: 'Smartphones', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
      <rect x="5" y="2" width="14" height="20" rx="3" /><line x1="12" y1="18" x2="12" y2="18" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  )},
  { id: 'Laptops', name: 'Laptops', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
      <rect x="2" y="4" width="20" height="14" rx="2" /><path d="M0 20h24" strokeLinecap="round" />
    </svg>
  )},
  { id: 'Appliances', name: 'Appliances', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )},
  { id: 'Electronics', name: 'Electronics', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
      <path d="M3 18v-6a9 9 0 0118 0v6" /><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
    </svg>
  )},
  { id: 'Fashion', name: 'Fashion', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
    </svg>
  )},
  { id: 'Groceries', name: 'Groceries', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )},
  { id: 'Furniture', name: 'Furniture', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
      <path d="M20 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v3" /><path d="M2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5a2 2 0 00-4 0v2H6v-2a2 2 0 00-4 0z" /><line x1="6" y1="18" x2="6" y2="22" /><line x1="18" y1="18" x2="18" y2="22" />
    </svg>
  )},
];

const CreateGroup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Step 1 - Group Name
  const [groupName, setGroupName] = useState('');

  // Step 2 - Group Goal
  const [goal, setGoal] = useState(10);
  const [deadline, setDeadline] = useState('7');

  // Step 3 - Category
  const [selectedMainCat, setSelectedMainCat] = useState('');

  // Step 4 - Sub Category
  const [selectedSubCat, setSelectedSubCat] = useState('');

  // Step 5 - Product Details
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');

  const canProceed = () => {
    if (step === 1) return groupName.trim().length >= 3;
    if (step === 2) return goal >= 2;
    if (step === 3) return selectedMainCat !== '';
    if (step === 4) return selectedSubCat !== '';
    if (step === 5) return productName.trim().length >= 2;
    return false;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1);
    else navigate('/groups');
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    else navigate(-1);
  };

  const steps = [
    { num: 1, label: 'Name' },
    { num: 2, label: 'Goal' },
    { num: 3, label: 'Category' },
    { num: 4, label: 'Sub-cat' },
    { num: 5, label: 'Product' },
  ];

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-[430px] mx-auto bg-white font-sans overflow-hidden">

      {/* ── HEADER ── */}
      <div className="flex-shrink-0 bg-white border-b border-slate-100 px-4 pt-4 pb-3 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center active:scale-90 transition-all flex-shrink-0"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[14px] font-black text-slate-800">Create Group</h1>
            <p className="text-[10px] text-slate-400 font-medium">Step {step} of {TOTAL_STEPS}</p>
          </div>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-1.5">
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                  step > s.num ? 'bg-[#0D9488] text-white' :
                  step === s.num ? 'bg-[#0D9488] text-white ring-2 ring-[#0D9488]/20' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {step > s.num ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s.num}
                </div>
                <span className={`text-[8px] font-bold whitespace-nowrap ${step === s.num ? 'text-[#0D9488]' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-[2px] rounded-full mb-3 transition-all ${step > s.num ? 'bg-[#0D9488]' : 'bg-slate-100'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div className="flex-1 overflow-y-auto px-5 py-6">

        {/* ── STEP 1: GROUP NAME ── */}
        {step === 1 && (
          <div className="flex flex-col gap-5 animate-[fadeIn_0.2s_ease]">
            <div>
              <h2 className="text-[20px] font-black text-slate-800 leading-tight">What's your group called?</h2>
              <p className="text-[12px] text-slate-400 font-medium mt-1">Give your buying group a clear, memorable name.</p>
            </div>

            <div className={`border-2 rounded-2xl px-4 py-3.5 bg-white transition-all ${groupName.length > 0 ? 'border-[#0D9488] shadow-[0_0_0_4px_rgba(13,148,136,0.08)]' : 'border-slate-200'}`}>
              <p className="text-[10px] font-bold text-slate-400 mb-1.5">Group Name</p>
              <input
                type="text"
                autoFocus
                value={groupName}
                onChange={e => setGroupName(e.target.value.slice(0, 60))}
                placeholder="e.g. iPhone 15 Pro Buyers"
                className="w-full text-[16px] font-black text-slate-800 placeholder:text-slate-300 placeholder:font-semibold bg-transparent outline-none"
              />
              <p className="text-[10px] text-slate-400 font-medium mt-1.5 text-right">{groupName.length}/60</p>
            </div>

            {/* Tips */}
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 flex gap-3">
              <span className="text-lg">💡</span>
              <div>
                <p className="text-[12px] font-bold text-teal-700 mb-1">Tips for a great name</p>
                <ul className="text-[11px] text-teal-600 flex flex-col gap-0.5">
                  <li>• Include the product name</li>
                  <li>• Keep it short and clear</li>
                  <li>• e.g. "Samsung TV Group Indore"</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: GROUP GOAL ── */}
        {step === 2 && (
          <div className="flex flex-col gap-5 animate-[fadeIn_0.2s_ease]">
            <div>
              <h2 className="text-[20px] font-black text-slate-800 leading-tight">Set your group goal</h2>
              <p className="text-[12px] text-slate-400 font-medium mt-1">How many buyers do you need to unlock the deal?</p>
            </div>

            {/* Min Buyers Counter */}
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 flex flex-col items-center gap-4">
              <p className="text-[12px] font-bold text-slate-500">Minimum Buyers Required</p>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setGoal(Math.max(2, goal - 1))}
                  className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center active:scale-90 transition-all text-slate-600 hover:bg-slate-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                </button>
                <div className="text-center">
                  <span className="text-[44px] font-black text-[#0D9488] leading-none">{goal}</span>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">buyers</p>
                </div>
                <button
                  onClick={() => setGoal(Math.min(500, goal + 1))}
                  className="w-11 h-11 rounded-xl bg-[#0D9488] flex items-center justify-center active:scale-90 transition-all text-white shadow-md shadow-teal-500/30 hover:bg-teal-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
              {/* Quick select */}
              <div className="flex gap-2 flex-wrap justify-center">
                {[5, 10, 25, 50, 100].map(n => (
                  <button
                    key={n}
                    onClick={() => setGoal(n)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95 ${goal === n ? 'bg-[#0D9488] text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Deadline */}
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-4">
              <p className="text-[12px] font-bold text-slate-600 mb-3">Group Deadline</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: '3 Days', val: '3' },
                  { label: '7 Days', val: '7' },
                  { label: '14 Days', val: '14' },
                  { label: '30 Days', val: '30' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setDeadline(opt.val)}
                    className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all active:scale-95 ${deadline === opt.val ? 'bg-[#0D9488] text-white shadow-sm shadow-teal-500/20' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: MAIN CATEGORY ── */}
        {step === 3 && (
          <div className="flex flex-col gap-5 animate-[fadeIn_0.2s_ease]">
            <div>
              <h2 className="text-[20px] font-black text-slate-800 leading-tight">Select a category</h2>
              <p className="text-[12px] text-slate-400 font-medium mt-1">What type of product are you buying together?</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {mainCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedMainCat(cat.id); setSelectedSubCat(''); }}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                    selectedMainCat === cat.id
                      ? 'border-[#0D9488] bg-[#F0FDF9] shadow-md shadow-teal-500/10'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <span className={selectedMainCat === cat.id ? 'text-[#0D9488]' : 'text-slate-400'}>
                    {cat.icon}
                  </span>
                  <span className={`text-[12px] font-bold text-center leading-tight ${ selectedMainCat === cat.id ? 'text-[#0D9488]' : 'text-slate-700'}`}>
                    {cat.name}
                  </span>
                  {selectedMainCat === cat.id && (
                    <div className="w-4 h-4 bg-[#0D9488] rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 4: SUB CATEGORY ── */}
        {step === 4 && (
          <div className="flex flex-col gap-5 animate-[fadeIn_0.2s_ease]">
            <div>
              <h2 className="text-[20px] font-black text-slate-800 leading-tight">Select sub-category</h2>
              <p className="text-[12px] text-slate-400 font-medium mt-1">
                Under <span className="font-bold text-[#0D9488]">{selectedMainCat}</span> — pick a specific type
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {(subCategoryMap[selectedMainCat] || []).map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCat(sub)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                    selectedSubCat === sub
                      ? 'border-[#0D9488] bg-[#F0FDF9]'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <span className={`text-[13px] font-bold ${selectedSubCat === sub ? 'text-[#0D9488]' : 'text-slate-700'}`}>
                    {sub}
                  </span>
                  {selectedSubCat === sub && (
                    <svg className="w-4 h-4 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 5: PRODUCT DETAILS ── */}
        {step === 5 && (
          <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease]">
            <div>
              <h2 className="text-[20px] font-black text-slate-800 leading-tight">Product details</h2>
              <p className="text-[12px] text-slate-400 font-medium mt-1">Tell buyers what product you're targeting.</p>
            </div>

            {/* Product Name */}
            <div className={`border-2 rounded-2xl px-4 py-3.5 bg-white transition-all ${productName.length > 0 ? 'border-[#0D9488] shadow-[0_0_0_4px_rgba(13,148,136,0.08)]' : 'border-slate-200'}`}>
              <p className="text-[10px] font-bold text-slate-400 mb-1.5">Product Name <span className="text-red-400">*</span></p>
              <input
                type="text"
                autoFocus
                value={productName}
                onChange={e => setProductName(e.target.value.slice(0, 80))}
                placeholder="e.g. iPhone 15 Pro 256GB Black"
                className="w-full text-[15px] font-black text-slate-800 placeholder:text-slate-300 placeholder:font-semibold bg-transparent outline-none"
              />
              <p className="text-[10px] text-slate-400 font-medium mt-1.5 text-right">{productName.length}/80</p>
            </div>

            {/* Product Description */}
            <div className="border-2 border-slate-200 rounded-2xl px-4 py-3.5 bg-white focus-within:border-[#0D9488] focus-within:shadow-[0_0_0_4px_rgba(13,148,136,0.08)] transition-all">
              <p className="text-[10px] font-bold text-slate-400 mb-1.5">Description <span className="text-slate-400 font-normal">(optional)</span></p>
              <textarea
                value={productDesc}
                onChange={e => setProductDesc(e.target.value.slice(0, 300))}
                placeholder="Describe the product, variant, or any specific requirements..."
                className="w-full text-[13px] font-semibold text-slate-700 placeholder:text-slate-300 bg-transparent outline-none resize-none"
                rows={3}
              />
              <p className="text-[10px] text-slate-400 font-medium mt-1 text-right">{productDesc.length}/300</p>
            </div>

            {/* Summary card */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-wide">Group Summary</p>
              {[
                { label: 'Group Name', val: groupName },
                { label: 'Min Buyers', val: `${goal} people · ${deadline} days` },
                { label: 'Category', val: `${selectedMainCat} › ${selectedSubCat}` },
              ].map(item => (
                <div key={item.label} className="flex items-start justify-between gap-3">
                  <span className="text-[11px] text-slate-400 font-medium">{item.label}</span>
                  <span className="text-[11px] font-bold text-slate-700 text-right max-w-[180px]">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── FIXED BOTTOM ACTION ── */}
      <div className="flex-shrink-0 bg-white border-t border-slate-100 px-5 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] z-30">
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full h-[52px] bg-[#0D9488] rounded-2xl text-white text-[15px] font-black flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
        >
          {step === TOTAL_STEPS ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Create Group
            </>
          ) : (
            <>
              Continue
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default CreateGroup;
