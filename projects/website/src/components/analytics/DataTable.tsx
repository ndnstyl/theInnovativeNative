import React, { useState, useMemo } from 'react';

type FormatType = 'number' | 'currency' | 'percent' | 'text';

interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  format?: FormatType;
}

interface DataTableProps {
  columns: ColumnDef[];
  data: Record<string, unknown>[];
  searchable?: boolean;
  pageSize?: number;
  rowClassName?: (row: Record<string, unknown>) => string;
}

function formatCell(value: unknown, format?: FormatType): string {
  if (value === null || value === undefined) return '-';
  if (format === 'currency') return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (format === 'percent') return `${Number(value).toFixed(1)}%`;
  if (format === 'number') return Number(value).toLocaleString();
  return String(value);
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  searchable = false,
  pageSize = 10,
  rowClassName,
}) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(q))
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  function handleSort(key: string, sortable?: boolean) {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(0);
  }

  return (
    <div className="analytics__table-wrapper">
      {searchable && (
        <div className="analytics__table-search">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="analytics__table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key, col.sortable)}
                  className={
                    sortKey === col.key
                      ? sortDir === 'asc'
                        ? 'sorted-asc'
                        : 'sorted-desc'
                      : ''
                  }
                  style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '24px' }}>
                  No data
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr key={i} className={rowClassName ? rowClassName(row) : ''}>
                  {columns.map((col) => (
                    <td key={col.key}>{formatCell(row[col.key], col.format)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="analytics__table-pagination">
          <span>
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
              Prev
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages - 1}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
