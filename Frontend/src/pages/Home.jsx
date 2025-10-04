import { useEffect, useMemo, useState } from 'react';
import { listBooks } from '../services/api.js';
import SearchBar from '../components/SearchBar.jsx';
import Pagination from '../components/Pagination.jsx';
import RatingStars from '../components/RatingStars.jsx';
import { Link } from 'react-router-dom';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const run = async () => {
      setLoading(true); setError('');
      try {
        const { data } = await listBooks({ page });
        setBooks(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [page]);

  const filtered = useMemo(() => {
    let out = [...books];
    if (query) {
      const q = query.toLowerCase();
      out = out.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    if (genre) out = out.filter(b => b.genre === genre);
    if (sort === 'newest') out.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
    if (sort === 'oldest') out.sort((a,b)=> new Date(a.createdAt)-new Date(b.createdAt));
    if (sort === 'year-desc') out.sort((a,b)=> (b.year||0)-(a.year||0));
    if (sort === 'year-asc') out.sort((a,b)=> (a.year||0)-(b.year||0));
    // No average rating in list endpoint; keep by created time or year
    return out;
  }, [books, query, genre, sort]);

  return (
    <div>
      <div className="card-panel">
        <SearchBar query={query} setQuery={setQuery} genre={genre} setGenre={setGenre} sort={sort} setSort={setSort} />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {filtered.map(b => (
          <Link className="card" key={b._id} to={`/books/${b._id}`}>
            <h3>{b.title}</h3>
            <p className="muted">by {b.author}</p>
            <p>{b.genre} · {b.year}</p>
            <div style={{ marginTop: 8 }}>
              <RatingStars value={b.averageRating || 0} />
            </div>
          </Link>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
