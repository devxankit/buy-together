import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SavedAddresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'Rohan Verma',
      phone: '+91 98765 43210',
      address: '101, A-Wing, Crystal Towers',
      area: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      name: 'Rohan Verma',
      phone: '+91 98765 43210',
      address: 'WeWork BKC, C-20, G Block',
      area: 'Bandra Kurla Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
      isDefault: false
    }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = {
    type: 'Home',
    name: '',
    phone: '',
    address: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  };
  
  const [formData, setFormData] = useState(initialForm);

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(addresses.map(addr => addr.id === editingId ? { ...formData, id: editingId } : addr));
    } else {
      setAddresses([...addresses, { ...formData, id: Date.now() }]);
    }
    setIsAdding(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({ ...addr, isDefault: addr.id === id })));
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans pb-20 relative">
      <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-white sticky top-0 z-30 shadow-sm shadow-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 bg-slate-50 rounded-full active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-extrabold text-[#1E293B]">Saved Addresses</h1>
        </div>
      </div>

      {!isAdding ? (
        <div className="px-5 py-4 flex flex-col gap-4">
          <button 
            onClick={() => { setFormData(initialForm); setIsAdding(true); }}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-teal-200 bg-teal-50 text-teal-700 rounded-2xl py-4 font-bold active:scale-95 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Address
          </button>

          {addresses.map((addr) => (
            <div key={addr.id} className={`bg-white rounded-2xl border ${addr.isDefault ? 'border-teal-500' : 'border-slate-200'} p-4 shadow-sm relative`}>
              {addr.isDefault && (
                <div className="absolute top-0 right-0 bg-teal-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-2xl">
                  DEFAULT
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  {addr.type === 'Home' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  )}
                </div>
                <h3 className="font-bold text-slate-800">{addr.type}</h3>
              </div>
              
              <div className="text-sm text-slate-600 mb-3 space-y-1">
                <p className="font-semibold text-slate-800">{addr.name}</p>
                <p>{addr.address}</p>
                <p>{addr.area}, {addr.city}</p>
                <p>{addr.state} - {addr.pincode}</p>
                <p className="pt-1 font-medium">{addr.phone}</p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button 
                  onClick={() => handleEdit(addr)}
                  className="flex-1 text-center text-sm font-semibold text-slate-600 py-1"
                >
                  Edit
                </button>
                <div className="w-[1px] h-4 bg-slate-200"></div>
                <button 
                  onClick={() => handleDelete(addr.id)}
                  className="flex-1 text-center text-sm font-semibold text-red-500 py-1"
                >
                  Remove
                </button>
                {!addr.isDefault && (
                  <>
                    <div className="w-[1px] h-4 bg-slate-200"></div>
                    <button 
                      onClick={() => handleSetDefault(addr.id)}
                      className="flex-1 text-center text-sm font-semibold text-teal-600 py-1"
                    >
                      Set Default
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5 py-4 h-full flex flex-col absolute inset-0 bg-white z-40">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-1.5 bg-slate-50 rounded-full active:scale-95 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-extrabold text-[#1E293B]">{editingId ? 'Edit Address' : 'Add New Address'}</h1>
            </div>
          </div>

          <form onSubmit={handleSave} className="flex-1 overflow-y-auto pb-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Save Address As</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setFormData({...formData, type: 'Home'})} className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all ${formData.type === 'Home' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 bg-white'}`}>Home</button>
                <button type="button" onClick={() => setFormData({...formData, type: 'Office'})} className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all ${formData.type === 'Office' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 bg-white'}`}>Office</button>
                <button type="button" onClick={() => setFormData({...formData, type: 'Other'})} className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all ${formData.type === 'Other' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 bg-white'}`}>Other</button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <input required type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-teal-500" />
              </div>
              <div>
                <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-teal-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input required type="text" placeholder="Pincode" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-teal-500" />
                <input required type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-teal-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input required type="text" placeholder="State" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-teal-500" />
                <input required type="text" placeholder="Area / Locality" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-teal-500" />
              </div>
              <div>
                <textarea required placeholder="Flat, House no., Building, Company, Apartment" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-teal-500 h-24 resize-none"></textarea>
              </div>
              
              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${formData.isDefault ? 'bg-teal-500 border-teal-500' : 'border-slate-300'}`}>
                  {formData.isDefault && <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
                <input type="checkbox" className="hidden" checked={formData.isDefault} onChange={(e) => setFormData({...formData, isDefault: e.target.checked})} />
                <span className="text-sm font-bold text-slate-700">Make this my default address</span>
              </label>
            </div>
            
            <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-all mt-4">
              Save Address
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SavedAddresses;
