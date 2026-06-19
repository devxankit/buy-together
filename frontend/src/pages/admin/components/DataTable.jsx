import { useState, Fragment } from 'react';
import { MoreHorizontal, ChevronRight } from 'lucide-react';
import { T } from '../theme/adminTheme';

/**
 * Reusable table.
 * columns: [{ key, label, render?(row), align?, width?, mono? }]
 * rows: array of objects (must have stable `id` or `_id`)
 * onRowAction: optional (row) => void  → renders a trailing ··· button
 * renderExpanded: optional (row) => node  → makes rows expandable; clicking the
 *   leading chevron reveals the returned node in a full-width panel below the row.
 * getRowId: optional (row) => string  → overrides the default id resolution.
 */
const DataTable = ({
  columns = [],
  rows = [],
  onRowAction,
  renderExpanded,
  getRowId,
  emptyText = 'No records found.',
}) => {
  const [expanded, setExpanded] = useState({});
  const expandable = typeof renderExpanded === 'function';
  const resolveId = (row, ri) => (getRowId ? getRowId(row) : row.id ?? row._id ?? ri);
  const toggle = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const leadCols = expandable ? 1 : 0;
  const trailCols = onRowAction ? 1 : 0;
  const totalCols = columns.length + leadCols + trailCols;

  return (
    <div className="admin-scroll" style={{ overflowX: 'auto', margin: -20 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
        <thead>
          <tr>
            {expandable && <th style={{ width: 40, background: T.surfaceAlt, borderBottom: `1px solid ${T.line}` }} />}
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
              <td colSpan={totalCols} style={{ padding: '40px 16px', textAlign: 'center', color: T.muted, fontSize: 13.5 }}>
                {emptyText}
              </td>
            </tr>
          )}
          {rows.map((row, ri) => {
            const id = resolveId(row, ri);
            const isOpen = !!expanded[id];
            const isLast = ri === rows.length - 1;
            const cellBorder = isLast && !isOpen ? 'none' : `1px solid ${T.lineSoft}`;
            return (
              <Fragment key={id}>
                <tr className="admin-row">
                  {expandable && (
                    <td style={{ textAlign: 'center', borderBottom: cellBorder, verticalAlign: 'middle' }}>
                      <button
                        className="admin-icon-btn"
                        onClick={() => toggle(id)}
                        title={isOpen ? 'Collapse' : 'Expand'}
                        aria-label={isOpen ? 'Collapse row' : 'Expand row'}
                        style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: 'transparent', color: T.muted, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <ChevronRight size={16} style={{ transition: 'transform 0.15s', transform: isOpen ? 'rotate(90deg)' : 'none' }} />
                      </button>
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={col.mono ? 'font-mono-num' : ''} style={{
                      textAlign: col.align || 'left', padding: '13px 16px',
                      fontSize: 13.5, color: T.inkSoft, fontWeight: col.strong ? 600 : 500,
                      borderBottom: cellBorder,
                      whiteSpace: col.wrap ? 'normal' : 'nowrap', verticalAlign: 'middle',
                    }}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {onRowAction && (
                    <td style={{ textAlign: 'center', borderBottom: cellBorder }}>
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
                {expandable && isOpen && (
                  <tr>
                    <td colSpan={totalCols} style={{ padding: 0, borderBottom: isLast ? 'none' : `1px solid ${T.lineSoft}`, background: T.surfaceAlt }}>
                      {renderExpanded(row)}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
