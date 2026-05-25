import { T } from '../theme/adminTheme';

// Maps a status/severity keyword → pill colours. Falls back to neutral.
const MAP = {
  active:       { fg: T.success, bg: T.successSoft, label: 'Active' },
  verified:     { fg: T.success, bg: T.successSoft, label: 'Verified' },
  completed:    { fg: T.success, bg: T.successSoft, label: 'Completed' },
  locked:       { fg: T.violet,  bg: T.violetSoft,  label: 'Locked' },
  closing:      { fg: T.info,    bg: T.infoSoft,    label: 'Closing soon' },
  pending:      { fg: T.warning, bg: T.warningSoft, label: 'Pending' },
  submitted:    { fg: T.warning, bg: T.warningSoft, label: 'Submitted' },
  negotiation:  { fg: T.info,    bg: T.infoSoft,    label: 'Negotiation' },
  confirmation: { fg: T.violet,  bg: T.violetSoft,  label: 'Confirmation' },
  flagged:      { fg: T.danger,  bg: T.dangerSoft,  label: 'Flagged' },
  suspended:    { fg: T.danger,  bg: T.dangerSoft,  label: 'Suspended' },
  rejected:     { fg: T.danger,  bg: T.dangerSoft,  label: 'Rejected' },
  disputed:     { fg: T.danger,  bg: T.dangerSoft,  label: 'Disputed' },
  failed:       { fg: T.danger,  bg: T.dangerSoft,  label: 'Failed' },
  high:         { fg: T.danger,  bg: T.dangerSoft,  label: 'High' },
  medium:       { fg: T.warning, bg: T.warningSoft, label: 'Medium' },
  low:          { fg: T.muted,   bg: T.lineSoft,    label: 'Low' },
  vendor:       { fg: T.violet,  bg: T.violetSoft,  label: 'Vendor' },
  buyer:        { fg: T.info,    bg: T.infoSoft,    label: 'Buyer' },
  user:         { fg: T.info,    bg: T.infoSoft,    label: 'User' },
};

const StatusBadge = ({ status, label, dot = true, size = 'md' }) => {
  const cfg = MAP[status] || { fg: T.muted, bg: T.lineSoft, label: status };
  const pad = size === 'sm' ? '2px 8px' : '4px 10px';
  const fs = size === 'sm' ? 11 : 11.5;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: pad, borderRadius: 999, background: cfg.bg, color: cfg.fg,
      fontSize: fs, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3,
      whiteSpace: 'nowrap', textTransform: 'capitalize',
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 99, background: cfg.fg }} />}
      {label || cfg.label}
    </span>
  );
};

export default StatusBadge;
