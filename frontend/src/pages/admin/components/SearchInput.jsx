import { Search } from 'lucide-react';
import { T, radius } from '../theme/adminTheme';

const SearchInput = ({ value, onChange, placeholder = 'Search…', width = 260 }) => (
  <div
    className="admin-focusable"
    style={{
      display: 'flex', alignItems: 'center', gap: 9,
      height: 38, padding: '0 13px', width, maxWidth: '100%',
      background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg,
    }}
  >
    <Search size={16} color={T.faint} strokeWidth={2.2} />
    <input
      className="admin-input"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: T.ink, fontWeight: 500 }}
    />
  </div>
);

export default SearchInput;
