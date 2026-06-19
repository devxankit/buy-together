import { AlertTriangle } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import Button from './Button';

/**
 * ConfirmDialog
 * -------------
 * A styled confirmation popup to replace the browser's window.confirm.
 *
 * props:
 *   open        — whether the dialog is visible
 *   title       — heading text
 *   message     — body text / node
 *   confirmLabel, cancelLabel
 *   variant     — 'danger' (default) | 'primary'
 *   loading     — disables buttons + shows a busy confirm label
 *   onConfirm, onClose
 */
const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onClose,
}) => {
  if (!open) return null;

  const isDanger = variant === 'danger';
  const accent = isDanger ? T.danger : T.primary;
  const accentSoft = isDanger ? T.dangerSoft : T.primarySoft;

  return (
    <div
      onMouseDown={loading ? undefined : onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(16,16,20,0.45)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          width: '100%', maxWidth: 400, background: T.surface,
          borderRadius: radius['2xl'], boxShadow: T.shadowLg || T.shadowSm,
          border: `1px solid ${T.line}`, overflow: 'hidden',
          animation: 'admin-fade-up 0.2s cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        <div style={{ padding: 22, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: accentSoft, color: accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>{title}</div>
            {message && (
              <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 6, lineHeight: 1.5 }}>{message}</div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 22px', borderTop: `1px solid ${T.lineSoft}`, background: T.surfaceAlt }}>
          <Button variant="soft" size="sm" onClick={onClose} style={loading ? { opacity: 0.6, pointerEvents: 'none' } : undefined}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            size="sm"
            onClick={onConfirm}
            style={loading ? { opacity: 0.7, pointerEvents: 'none' } : undefined}
          >
            {loading ? 'Working…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
