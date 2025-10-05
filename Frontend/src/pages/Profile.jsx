import { useEffect, useMemo, useState } from 'react';
import { getMe, listBooks, getBook } from '../services/api.js';
import RatingStars from '../components/RatingStars.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const [me, setMe] = useState(user);
  const [myBooks, setMyBooks] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avgMap, setAvgMap] = useState({});

  useEffect(() => {
    const run = async () => {
      setLoading(true); setError('');
      try {
        // Refresh me
        const u = await getMe().then(r => r.data);
        setMe(u);

        // Load a few pages of books and filter by owner
        let page = 1; const collected = []; let totalPages = 1;
        do {
          const { data } = await listBooks({ page });
          totalPages = data.totalPages || 1;
          collected.push(...(data.items || []));
          page += 1;
        } while (page <= Math.min(totalPages, 5)); // cap to 5 pages for demo
        setMyBooks(collected.filter(b => String(b.addedBy) === String(u.id)));

        // For reviews, naive approach: check details for user's reviews from owned books only (demo)
        const myRevs = [];
        for (const b of collected.slice(0, 10)) { // cap to 10 for demo
          try {
            const { data: bd } = await getBook(b._id);
            (bd.reviews || []).forEach(r => {
              if (String(r.user?.id || r.userId) === String(u.id)) {
                myRevs.push({ ...r, bookTitle: bd.book.title, bookId: bd.book._id });
              }
            });
          } catch {}
        }
        setMyReviews(myRevs);
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally { setLoading(false); }
    };
    run();
  }, []);

  // Load average rating for books shown in My Books
  useEffect(() => {
    const loadAverages = async () => {
      if (!myBooks?.length) { setAvgMap({}); return; }
      try {
        const resps = await Promise.all(myBooks.map(b => getBook(b._id).catch(() => null)));
        const m = {};
        resps.forEach(r => { if (r?.data) m[r.data.book._id] = r.data.averageRating || 0; });
        setAvgMap(m);
      } catch {
        // ignore
      }
    };
    loadAverages();
  }, [myBooks]);

  return (
    <div>
      <section className="card-panel">
        <h2>Profile</h2>
        {me ? (
          <>
            <p><strong>Name:</strong> {me.name}</p>
            <p><strong>Email:</strong> {me.email}</p>
          </>
        ) : <p>Loading user...</p>}
      </section>

      <section className="card-panel">
        <h3>My Books</h3>
        {myBooks.length === 0 && <p className="muted">No books yet.</p>}
        <div className="grid">
          {myBooks.map(b => (
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
      </section>

      <section className="card-panel">
        <h3>My Reviews</h3>
        <ul className="list comments-list">
          {myReviews.map(r => (
            <li key={r._id} className="list-item comment-item">
              <p className="muted" style={{ marginBottom: 6 }}><strong>{r.bookTitle}</strong></p>
              <p className="comment-text">{r.reviewText}</p>
            </li>
          ))}
        </ul>
      </section>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
