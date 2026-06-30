import { useState, useEffect, useRef } from 'react';
import { UploadCloud, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { uploadImage } from '../../../services/upload.api';

const MAX_UPLOAD_MB = 5;

const inputStyle = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  fontSize: 13.5,
  color: T.ink,
  fontWeight: 500,
  background: T.surfaceAlt,
  border: `1px solid ${T.line}`,
  borderRadius: radius.lg,
  fontFamily: 'inherit',
  outline: 'none',
};

const ImageUploader = ({ value, onChange, folder = 'categories', maxSizeMb = MAX_UPLOAD_MB }) => {
  const fileRef = useRef(null);
  const previewRef = useRef(null);
  const [localPreview, setLocalPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [pct, setPct] = useState(0);
  const [err, setErr] = useState('');

  const previewSrc = localPreview || value;

  const clearLocal = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = '';
    }
    setLocalPreview('');
  };

  useEffect(() => () => clearLocal(), []); // revoke object URL on unmount

  // When the parent clears `value` (e.g. the form is reset after submitting),
  // drop any lingering local blob preview so the uploader returns to empty.
  useEffect(() => {
    if (!value && !uploading) clearLocal();
  }, [value, uploading]);

  const handleFile = async (file) => {
    if (!file) return;
    setErr('');
    if (!file.type.startsWith('image/')) return setErr('Please choose an image file.');
    if (file.size > maxSizeMb * 1024 * 1024) return setErr(`Image must be ${maxSizeMb}MB or smaller.`);

    clearLocal();
    const obj = URL.createObjectURL(file);
    previewRef.current = obj;
    setLocalPreview(obj);
    setUploading(true);
    setPct(0);
    try {
      const { data } = await uploadImage(file, { folder, onProgress: setPct });
      onChange(data.url);
    } catch (e) {
      setErr(e.response?.data?.message || 'Upload failed. Check Cloudinary setup and try again.');
      clearLocal();
    } finally {
      setUploading(false);
    }
  };

  const onInput = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = ''; // allow re-selecting the same file
  };

  const remove = () => {
    clearLocal();
    onChange('');
    setErr('');
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" onChange={onInput} style={{ display: 'none' }} />

      {previewSrc ? (
        <div style={{ position: 'relative', width: '100%', height: 168, borderRadius: radius.xl, overflow: 'hidden', border: `1px solid ${T.line}`, background: T.surfaceAlt }}>
          <img src={previewSrc} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {uploading && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(16,16,20,0.55)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Loader2 size={22} className="admin-spin" />
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Uploading… {pct}%</span>
              <div style={{ width: '60%', height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#fff', transition: 'width 0.2s ease' }} />
              </div>
            </div>
          )}
          {!uploading && (
            <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
              <button type="button" onClick={() => fileRef.current?.click()} title="Replace" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(16,16,20,0.6)', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={15} />
              </button>
              <button type="button" onClick={remove} title="Remove" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(209,67,67,0.92)', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          style={{ width: '100%', height: 168, borderRadius: radius.xl, border: `1.5px dashed ${T.line}`, background: T.surfaceAlt, color: T.muted, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}
        >
          <UploadCloud size={26} color={T.primary} />
          <span style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>Click to upload a cover image</span>
          <span style={{ fontSize: 11.5, color: T.faint }}>PNG, JPG, WebP — up to {maxSizeMb}MB</span>
        </button>
      )}

      {err && <div style={{ fontSize: 11.5, color: T.danger, fontWeight: 600, marginTop: 6 }}>{err}</div>}

      <input
        style={{ ...inputStyle, marginTop: 8, height: 36, fontSize: 12.5 }}
        value={value || ''}
        onChange={(e) => { clearLocal(); onChange(e.target.value); }}
        placeholder="…or paste an image URL"
      />
    </div>
  );
};

export default ImageUploader;
