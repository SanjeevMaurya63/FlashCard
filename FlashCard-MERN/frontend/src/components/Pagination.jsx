export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, total, limit } = pagination;
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  const btnStyle = (active) => ({
    width: '36px', height: '36px',
    borderRadius: '8px',
    border: active ? 'none' : '1px solid var(--border)',
    background: active ? 'var(--accent)' : 'var(--card-bg)',
    color: active ? '#fff' : 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.15s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total} students
      </p>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button style={btnStyle(false)} disabled={page === 1} onClick={() => onPageChange(page - 1)}>←</button>
        {pages.map(p => (
          <button key={p} style={btnStyle(p === page)} onClick={() => onPageChange(p)}>{p}</button>
        ))}
        <button style={btnStyle(false)} disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>→</button>
      </div>
    </div>
  );
}
