import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Smartphone, Car, Tv, Bike, ShoppingBag, Home, MapPin, Users, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../../hooks/useDispatch';
import { createGroup } from '../../../redux/asyncActions/groupActions';

const CATEGORIES = [
  { id: 'electronics', label: 'Electronics', icon: Smartphone, color: 'text-orange-500 bg-orange-50 border-orange-100' },
  { id: 'cars', label: 'Cars', icon: Car, color: 'text-blue-500 bg-blue-50 border-blue-100' },
  { id: 'appliances', label: 'Appliances', icon: Tv, color: 'text-purple-500 bg-purple-50 border-purple-100' },
  { id: 'bikes', label: 'Bikes', icon: Bike, color: 'text-green-500 bg-green-50 border-green-100' },
  { id: 'fashion', label: 'Fashion', icon: ShoppingBag, color: 'text-pink-500 bg-pink-50 border-pink-100' },
  { id: 'home', label: 'Home & Living', icon: Home, color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
];

const STEPS = ['Product', 'Category', 'Target', 'Review'];

const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {STEPS.map((step, i) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center gap-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
            i < current ? 'bg-green-500 text-white' :
            i === current ? 'bg-gray-900 text-white' :
            'bg-gray-100 text-gray-400'
          }`}>
            {i < current ? <CheckCircle2 size={14} /> : i + 1}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-wide ${i === current ? 'text-gray-900' : 'text-gray-400'}`}>
            {step}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`flex-1 h-0.5 mb-4 rounded-full transition-colors ${i < current ? 'bg-green-500' : 'bg-gray-100'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

const CreateGroup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    targetCount: '',
    location: '',
    priceRange: '',
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const handleLaunch = () => {
    dispatch(createGroup({ name: form.name, description: form.description, category: form.category }));
    navigate('/groups');
  };

  const selectedCat = CATEGORIES.find(c => c.id === form.category);

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-[#fafafa]">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 bg-white border-b border-gray-50 flex items-center gap-3 sticky top-0 z-20">
        {step > 0 ? (
          <button onClick={back} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
        ) : (
          <Link to="/groups" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} className="text-gray-600" />
          </Link>
        )}
        <div>
          <h1 className="font-black text-gray-900 text-base">Create Group</h1>
          <p className="text-[11px] text-gray-400 font-bold">Step {step + 1} of {STEPS.length}</p>
        </div>
      </div>

      <div className="px-5 pt-8 flex-1">
        <StepIndicator current={step} />

        <AnimatePresence mode="wait">
          {/* Step 0: Product Info */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">What are you buying?</h2>
                <p className="text-sm text-gray-400 font-medium">Tell us about the product you want to group buy.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 block">Group Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    className="w-full px-4 py-4 bg-white rounded-2xl border border-gray-200 text-gray-900 font-medium text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="e.g. iPhone 16 Pro Max Bulk Buy"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 block">Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={e => update('description', e.target.value)}
                    className="w-full px-4 py-4 bg-white rounded-2xl border border-gray-200 text-gray-900 font-medium text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                    placeholder="Describe what you're looking for and the deal you expect..."
                  />
                </div>

                {form.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 bg-secondary/5 border border-secondary/10 rounded-2xl px-4 py-3"
                  >
                    <Sparkles size={14} className="text-secondary shrink-0" />
                    <p className="text-[12px] font-bold text-secondary">
                      AI detected: <span className="font-black">Electronics</span> category
                    </p>
                  </motion.div>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={next}
                disabled={!form.name.trim()}
                className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                Continue →
              </motion.button>
            </motion.div>
          )}

          {/* Step 1: Category */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Pick a category</h2>
                <p className="text-sm text-gray-400 font-medium">This helps us connect you with the right buyers and vendors.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map(cat => {
                  const isSelected = form.category === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => update('category', cat.id)}
                      className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
                        isSelected
                          ? 'border-gray-900 bg-gray-900 shadow-xl shadow-black/10'
                          : `border-gray-100 bg-white ${cat.color.split(' ').slice(1).join(' ')}`
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isSelected ? 'bg-white/10' : cat.color.split(' ')[1]
                      }`}>
                        <cat.icon size={24} className={isSelected ? 'text-white' : cat.color.split(' ')[0]} />
                      </div>
                      <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                        {cat.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={next}
                disabled={!form.category}
                className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                Continue →
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Target */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Set your target</h2>
                <p className="text-sm text-gray-400 font-medium">How many buyers do you need to unlock the best deal?</p>
              </div>

              <div className="space-y-5">
                {/* Target Count */}
                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 block">
                    Number of Buyers Needed
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 20].map(n => (
                      <button
                        key={n}
                        onClick={() => update('targetCount', String(n))}
                        className={`py-3 rounded-2xl font-black text-sm border-2 transition-all ${
                          form.targetCount === String(n)
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-100 bg-white text-gray-700'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={form.targetCount}
                    onChange={e => update('targetCount', e.target.value)}
                    className="w-full mt-3 px-4 py-4 bg-white rounded-2xl border border-gray-200 text-gray-900 font-medium text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="Or enter custom number..."
                    min="2"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 block">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input
                      type="text"
                      value={form.location}
                      onChange={e => update('location', e.target.value)}
                      className="w-full pl-10 pr-4 py-4 bg-white rounded-2xl border border-gray-200 text-gray-900 font-medium text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="e.g. Delhi NCR, Mumbai..."
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 block">
                    Expected Price / Budget (optional)
                  </label>
                  <input
                    type="text"
                    value={form.priceRange}
                    onChange={e => update('priceRange', e.target.value)}
                    className="w-full px-4 py-4 bg-white rounded-2xl border border-gray-200 text-gray-900 font-medium text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="e.g. ₹90,000 – ₹1,10,000"
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={next}
                disabled={!form.targetCount || !form.location}
                className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                Review Group →
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Review & Launch</h2>
                <p className="text-sm text-gray-400 font-medium">Double-check your group details before going live.</p>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-black/4 overflow-hidden mb-6">
                {/* Preview Header */}
                <div className="bg-gray-900 px-6 py-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    {selectedCat && (
                      <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">
                        {selectedCat.label}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-white text-lg leading-tight">{form.name}</h3>
                  {form.description && (
                    <p className="text-sm text-white/50 font-medium mt-1 line-clamp-2">{form.description}</p>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  {[
                    { icon: Users, label: 'Target buyers', value: form.targetCount },
                    { icon: MapPin, label: 'Location', value: form.location },
                    ...(form.priceRange ? [{ icon: ChevronRight, label: 'Budget', value: form.priceRange }] : []),
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
                        <row.icon size={15} className="text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[11px] font-bold text-gray-400">{row.label}</div>
                        <div className="text-sm font-black text-gray-900">{row.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <Sparkles size={16} className="text-secondary shrink-0 mt-0.5" />
                <p className="text-[12px] font-bold text-secondary leading-relaxed">
                  Your group will be visible to buyers in <span className="font-black">{form.location}</span>.
                  Vendors matching your category will be notified automatically.
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleLaunch}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-orange-500/25 hover:bg-orange-600 transition-all"
              >
                🚀 Launch Group
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateGroup;
