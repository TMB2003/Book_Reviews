import { useEffect, useMemo, useState } from 'react';
import { listBooks, getBook } from '../services/api.js';
import SearchBar from '../components/SearchBar.jsx';
import Pagination from '../components/Pagination.jsx';
import RatingStars from '../components/RatingStars.jsx';
import { Link } from 'react-router-dom';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [avgMap, setAvgMap] = useState({});
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

  // Fetch average rating for visible books on this page
  useEffect(() => {
    const loadAverages = async () => {
      if (!books?.length) { setAvgMap({}); return; }
      try {
        const resps = await Promise.all(books.map(b => getBook(b._id).catch(() => null)));
        const m = {};
        resps.forEach(r => { if (r?.data) m[r.data.book._id] = r.data.averageRating || 0; });
        setAvgMap(m);
      } catch {
        // ignore
      }
    };
    loadAverages();
  }, [books]);

  const allGenres = useMemo(() => {
    const s = new Set();
    for (const b of books) {
      const g = Array.isArray(b.genre)
        ? b.genre
        : String(b.genre || '').split(',').map((x) => x.trim()).filter(Boolean);
      g.forEach((x) => s.add(x));
    }
    return Array.from(s).sort((a,b)=>a.localeCompare(b));
  }, [books]);

  const filtered = useMemo(() => {
    let out = [...books];
    if (query) {
      const q = query.toLowerCase();
      out = out.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    if (genre) {
      out = out.filter((b) => {
        const g = Array.isArray(b.genre)
          ? b.genre
          : String(b.genre || '').split(',').map((s) => s.trim()).filter(Boolean);
        const lc = g.map((s) => s.toLowerCase());
        return lc.includes(genre.toLowerCase());
      });
    }
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
        <SearchBar
          query={query}
          setQuery={setQuery}
          genre={genre}
          setGenre={setGenre}
          sort={sort}
          setSort={setSort}
          genres={allGenres}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {filtered.map(b => (
          <Link className="card" key={b._id} to={`/books/${b._id}`}>
            <h3 style={{ marginBottom: 6 }}>{b.title}</h3>
            <p className="muted meta">{b.author} <span className="dot">•</span> {b.year}</p>
            <div className="badges">
              {(Array.isArray(b.genre) ? b.genre : String(b.genre || '').split(',').map(s=>s.trim()).filter(Boolean)).map((g, idx) => (
                <span key={idx} className="badge">{g}</span>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <RatingStars value={avgMap[b._id] ?? 0} />
            </div>
          </Link>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
