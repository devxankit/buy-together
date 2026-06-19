import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../../../redux/slices/authSlice';
import { updateUserProfile } from '../../../../services/user.api';
import { uploadImage } from '../../../../services/upload.api';
import { showToast } from '../../../../utils/toast';

const getPlaceholderAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;

const PersonalInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user) || {};

  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [gender, setGender] = useState(currentUser.gender || 'Male');
  
  // Format DOB (Date) to YYYY-MM-DD string for HTML5 input field
  const [dob, setDob] = useState(() => {
    if (!currentUser.dob) return '';
    const d = new Date(currentUser.dob);
    return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
  });
  
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data } = await uploadImage(file, { folder: 'misc' });
      setAvatar(data.url);
      showToast('Photo uploaded successfully!', '📸');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload photo.', '❌');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showToast('Full name is required.', '⚠️');
      return;
    }
    if (saving) return;

    setSaving(true);
    const payload = {
      name: name.trim(),
      email: email.trim(),
      dob: dob || null,
      gender,
      location: location.trim(),
      avatar,
    };

    try {
      await updateUserProfile(payload);
      dispatch(updateUser(payload));
      showToast('Profile updated successfully! ✅');
      navigate(-1);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save profile details.', '❌');
    } finally {
      setSaving(false);
    }
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
          <div className="relative cursor-pointer" onClick={() => !uploading && fileInputRef.current?.click()}>
            <img src={avatar || getPlaceholderAvatar(name)} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-surface shadow-md" style={uploading ? { opacity: 0.6 } : undefined} />
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-surface">
              {uploading ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </button>
          </div>
          <p className="text-[11px] text-muted font-medium mt-2">{uploading ? 'Uploading...' : 'Tap to change photo'}</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarChange} 
            className="hidden" 
            accept="image/*" 
            disabled={uploading}
          />
        </div>

        {[
          { label: 'Full Name', val: name, set: setName, type: 'text' },
          { label: 'Email Address', val: email, set: setEmail, type: 'email' },
          { label: 'Phone Number (Read-only)', val: phone, set: () => {}, type: 'tel', disabled: true },
          { label: 'Location (City, State)', val: location, set: setLocation, type: 'text' },
          { label: 'Date of Birth', val: dob, set: setDob, type: 'date' },
        ].map(f => (
          <div key={f.label} className={`border-2 border-line rounded-2xl px-4 py-3 bg-surface transition-all ${f.disabled ? 'opacity-60' : 'focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(13,148,136,0.08)]'}`}>
            <p className="text-[10px] font-bold text-muted mb-1">{f.label}</p>
            <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} disabled={f.disabled} className="w-full text-[14px] font-bold text-ink bg-transparent outline-none" />
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
          disabled={saving || uploading}
          className="w-full h-[50px] bg-primary rounded-2xl text-white text-[14px] font-black flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 active:scale-95 transition-all mt-2 disabled:opacity-50 disabled:scale-100"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
