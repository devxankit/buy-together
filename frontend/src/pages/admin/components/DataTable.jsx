import { MoreHorizontal } from 'lucide-react';
import { T } from '../theme/adminTheme';

/**
 * Reusable table.
 * columns: [{ key, label, render?(row), align?, width?, mono? }]
 * rows: array of objects (must have stable `id`)
 * onRowAction: optional (row) => void  → renders a trailing ··· button
 */
const DataTable = ({ columns = [], rows = [], onRowAction, emptyText = 'No records found.' }) => (
  <div className="admin-scroll" style={{ overflowX: 'auto', margin: -20 }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={{
              textAlign: col.align || 'left', padding: '12px 16px',
              fontSize: 11, fontWeight: 700, color: T.faint, textTransform: 'uppercase',
              letterSpacing: '0.05em', borderBottom: `1px solid ${T.line}`,
              background: T.surfaceAlt, whiteSpace: 'nowrap', width: col.width,
              position: 'sticky', top: 0,
            }}>{col.label}</th>
          ))}
          {onRowAction && <th style={{ width: 44, background: T.surfaceAlt, borderBottom: `1px solid ${T.line}` }} />}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length + (onRowAction ? 1 : 0)} style={{ padding: '40px 16px', textAlign: 'center', color: T.muted, fontSize: 13.5 }}>
              {emptyText}
            </td>
          </tr>
        )}
        {rows.map((row, ri) => (
          <tr key={row.id || ri} className="admin-row">
            {columns.map((col) => (
              <td key={col.key} className={col.mono ? 'font-mono-num' : ''} style={{
                textAlign: col.align || 'left', padding: '13px 16px',
                fontSize: 13.5, color: T.inkSoft, fontWeight: col.strong ? 600 : 500,
                borderBottom: ri === rows.length - 1 ? 'none' : `1px solid ${T.lineSoft}`,
                whiteSpace: col.wrap ? 'normal' : 'nowrap', verticalAlign: 'middle',
              }}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
            {onRowAction && (
              <td style={{ textAlign: 'center', borderBottom: ri === rows.length - 1 ? 'none' : `1px solid ${T.lineSoft}` }}>
                <button
                  className="admin-icon-btn"
                  onClick={() => onRowAction(row)}
                  style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'transparent', color: T.muted, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <MoreHorizontal size={17} />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
