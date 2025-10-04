import { useEffect, useMemo, useState } from 'react';
import { getMe, listBooks, getBook } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const [me, setMe] = useState(user);
  const [myBooks, setMyBooks] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
              <h4>{b.title}</h4>
              <p className="muted">{b.author}</p>
              <p>{b.genre} · {b.year}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="card-panel">
        <h3>My Reviews</h3>
        <ul className="list">
          {myReviews.map(r => (
            <li key={r._id} className="list-item">
              <p><strong>{r.bookTitle}</strong></p>
              <p>{r.reviewText}</p>
            </li>
          ))}
        </ul>
      </section>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
