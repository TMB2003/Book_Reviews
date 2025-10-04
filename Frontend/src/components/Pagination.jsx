export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(totalPages, page + 1));
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
      <button className="btn" onClick={prev} disabled={page <= 1}>Prev</button>
      <span>Page {page} / {totalPages}</span>
      <button className="btn" onClick={next} disabled={page >= totalPages}>Next</button>
    </div>
  );
}
