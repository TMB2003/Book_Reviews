import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBook, createReview, updateReview, deleteReview } from '../services/api.js';
import RatingStars from '../components/RatingStars.jsx';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'];

export default function BookDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [myReview, setMyReview] = useState({ rating: 5, reviewText: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await getBook(id);
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const distribution = useMemo(() => {
    const counts = { 1:0,2:0,3:0,4:0,5:0 };
    (data?.reviews || []).forEach(r => { counts[r.rating] = (counts[r.rating]||0) + 1; });
    return Object.entries(counts).map(([k,v]) => ({ name: `${k}★`, value: v }));
  }, [data]);

  const submitReview = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await createReview({ bookId: id, ...myReview });
      setMyReview({ rating: 5, reviewText: '' });
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    } finally { setSubmitting(false); }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {data && (
        <div className="grid-2">
          <section className="card-panel">
            <h2>{data.book.title}</h2>
            <p className="muted">by {data.book.author}</p>
            <p>{data.book.genre} · {data.book.year}</p>
            <p style={{ marginTop: 8 }}>{data.book.description}</p>
            <div style={{ marginTop: 8 }}>
              <strong>Average:</strong> <RatingStars value={data.averageRating || 0} />
            </div>
            {data.book.owner && (
              <p className="muted" style={{ marginTop: 8 }}>Added by: {data.book.owner.name} ({data.book.owner.email})</p>
            )}
          </section>

          <section className="card-panel">
            <h3>Rating Distribution</h3>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                    {distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[5 - Number(entry.name[0])] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      )}

      <section className="card-panel">
        <h3>Add a Review</h3>
        <form onSubmit={submitReview} className="form">
          <label>Rating
            <select value={myReview.rating} onChange={(e)=>setMyReview(s=>({...s, rating:Number(e.target.value)}))}>
              {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label>Review
            <textarea value={myReview.reviewText} onChange={(e)=>setMyReview(s=>({...s, reviewText:e.target.value}))} placeholder="Write your thoughts..." />
          </label>
          <button className="btn" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
        </form>
      </section>

      <section className="card-panel">
        <h3>Reviews</h3>
        <ul className="list">
          {(data?.reviews || []).map(r => (
            <li key={r._id} className="list-item">
              <div>
                <RatingStars value={r.rating} />
                <p style={{ marginTop: 6 }}>{r.reviewText}</p>
                {r.user && <p className="muted">by {r.user.name} ({r.user.email})</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
