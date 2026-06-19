/**
 * Dynamic premium toast success/info notification.
 * Appends a minimal, modern card to the top-center of the viewport.
 * Automatically handles fade-in/slide-down and slide-up/fade-out transitions.
 * Persists across page transitions because it is appended directly to document.body.
 */
export const showToast = (message) => {
  if (typeof document === 'undefined') return;

  // Strip emojis from message
  let cleanMessage = message || '';
  try {
    cleanMessage = cleanMessage.replace(/\p{Extended_Pictographic}/gu, '').replace(/\s+/g, ' ').trim();
  } catch (e) {
    cleanMessage = cleanMessage.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').replace(/\s+/g, ' ').trim();
  }

  const toast = document.createElement('div');
  
  // High-fidelity inline styling for maximum reliability across components
  toast.style.position = 'fixed';
  toast.style.top = '24px';
  toast.style.left = '50%';
  toast.style.transform = 'translate(-50%, -20px)';
  toast.style.backgroundColor = 'rgba(15, 23, 42, 0.95)'; // Deep Slate
  toast.style.color = '#ffffff';
  toast.style.fontSize = '12.5px';
  toast.style.fontWeight = '800';
  toast.style.padding = '10px 16px';
  toast.style.borderRadius = '12px';
  toast.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.15)';
  toast.style.zIndex = '99999';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '8px';
  toast.style.transition = 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'; // Springy effect
  toast.style.opacity = '0';
  toast.style.backdropFilter = 'blur(6px)';
  toast.style.webkitBackdropFilter = 'blur(6px)';
  toast.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  toast.style.whiteSpace = 'normal';
  toast.style.wordBreak = 'break-word';
  toast.style.maxWidth = 'calc(100vw - 32px)';
  toast.style.textAlign = 'center';
  toast.style.lineHeight = '1.4';
  toast.style.pointerEvents = 'none';

  toast.innerHTML = `<span>${cleanMessage}</span>`;
  document.body.appendChild(toast);

  // Trigger layout to enable transition
  toast.offsetHeight;

  // Animate in
  toast.style.opacity = '1';
  toast.style.transform = 'translate(-50%, 0)';

  // Remove toast after delay
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -25px)';
    setTimeout(() => {
      toast.remove();
    }, 350);
  }, 2500);
};
