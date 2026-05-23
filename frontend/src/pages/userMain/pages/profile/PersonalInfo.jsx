import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PersonalInfo = () => {
  const navigate = useNavigate();

  const [name, setName] = useState(() => localStorage.getItem('buytogether_profile_name') || 'Rohan Verma');
  const [email, setEmail] = useState(() => localStorage.getItem('buytogether_profile_email') || 'rohan.verma@gmail.com');
  const [phone, setPhone] = useState(() => localStorage.getItem('buytogether_profile_phone') || '9876543210');
  const [gender, setGender] = useState(() => localStorage.getItem('buytogether_profile_gender') || 'Male');
  const [dob, setDob] = useState(() => localStorage.getItem('buytogether_profile_dob') || '1998-05-15');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('buytogether_profile_image') || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80');

  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem('buytogether_profile_name', name);
    localStorage.setItem('buytogether_profile_email', email);
    localStorage.setItem('buytogether_profile_phone', phone);
    localStorage.setItem('buytogether_profile_gender', gender);
    localStorage.setItem('buytogether_profile_dob', dob);
    localStorage.setItem('buytogether_profile_image', avatar);

    // Premium feedback toast
    const toast = document.createElement('div');
    toast.className = "fixed bottom-24 left-1/2 -translate-x-1/2 bg-ink text-surface text-xs font-black px-4 py-2.5 rounded-xl shadow-2xl z-[100] flex items-center gap-2 animate-fadeIn";
    toast.innerHTML = "<span>✅</span> Profile updated successfully!";
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-fadeOut');
      setTimeout(() => {
        toast.remove();
        navigate(-1);
      }, 400);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[var(--surface-deep)] font-sans pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-surface border-b border-line sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-ink">Personal Information</h1>
      </div>

      <div className="flex-1 px-5 py-6 flex flex-col gap-4">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-2">
          <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img src={avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-surface shadow-md" />
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-surface">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
          <p className="text-[11px] text-muted font-medium mt-2">Tap to change photo</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {[
          { label: 'Full Name', val: name, set: setName, type: 'text' },
          { label: 'Email Address', val: email, set: setEmail, type: 'email' },
          { label: 'Phone Number', val: phone, set: (v) => setPhone(v.replace(/\D/g, '').slice(0, 10)), type: 'tel' },
          { label: 'Date of Birth', val: dob, set: setDob, type: 'date' },
        ].map(f => (
          <div key={f.label} className="border-2 border-line rounded-2xl px-4 py-3 bg-surface focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(13,148,136,0.08)] transition-all">
            <p className="text-[10px] font-bold text-muted mb-1">{f.label}</p>
            <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} className="w-full text-[14px] font-bold text-ink bg-transparent outline-none" />
          </div>
        ))}

        {/* Gender */}
        <div className="border-2 border-line rounded-2xl px-4 py-3 bg-surface">
          <p className="text-[10px] font-bold text-muted mb-2">Gender</p>
          <div className="flex gap-2">
            {['Male', 'Female', 'Other'].map(g => (
              <button key={g} type="button" onClick={() => setGender(g)} className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all active:scale-95 ${gender === g ? 'bg-primary text-white shadow-sm' : 'bg-surface-alt text-faint'}`}>{g}</button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full h-[50px] bg-primary rounded-2xl text-white text-[14px] font-black flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 active:scale-95 transition-all mt-2"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
