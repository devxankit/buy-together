import React from 'react';

/**
 * Bottom sheet that lets the user pick an image source — Camera or Gallery.
 *
 * Used inside the Flutter wrapper, where the OS file-chooser's camera option
 * doesn't work, so we present our own choice and route Camera through the
 * native bridge. Callers decide when to show it (typically only when the
 * Flutter bridge is present).
 */
const ImageSourceSheet = ({ open, onClose, onCamera, onGallery, title = 'Add photo' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex flex-col justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 animate-fadeIn" />
      <div
        className="relative bg-surface rounded-t-2xl px-5 pt-4 pb-6 shadow-2xl animate-slideUp w-full max-w-[430px] mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-line mx-auto mb-4" />
        <p className="text-[11px] font-black text-ink uppercase tracking-wider text-center mb-3">{title}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCamera}
            className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-line bg-surface-alt active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="text-[12px] font-bold text-ink">Camera</span>
          </button>
          <button
            type="button"
            onClick={onGallery}
            className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-line bg-surface-alt active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-[12px] font-bold text-ink">Gallery</span>
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-3 py-2.5 text-[12px] font-bold text-muted"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ImageSourceSheet;
