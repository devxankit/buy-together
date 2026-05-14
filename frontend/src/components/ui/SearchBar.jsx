import { c } from '../../design/tokens';
import Icon from './Icon';

const SearchBar = ({ placeholder = 'Search groups, products, vendors…', value, onChange, compact }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    background: '#fff', borderRadius: 14,
    padding: compact ? '11px 14px' : '14px 16px',
    border: `1px solid ${c.line}`,
    boxShadow: '0 1px 2px rgba(15,15,18,0.04)',
  }}>
    <Icon name="search" size={17} color={c.muted} stroke={1.8} />
    {onChange ? (
      <input
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          flex: 1, fontSize: 13, fontWeight: 400, color: c.ink,
          background: 'none', border: 'none', outline: 'none',
          fontFamily: 'inherit',
        }}
      />
    ) : (
      <span style={{ flex: 1, fontSize: 13, fontWeight: 400, color: value ? c.ink : c.muted }}>
        {value || placeholder}
      </span>
    )}
    <div style={{ width: 1, height: 18, background: c.line }} />
    <Icon name="filter" size={15} color={c.muted} stroke={1.8} />
  </div>
);

export default SearchBar;
