import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, getBook, updateBook } from '../services/api.js';

export default function BookForm({ mode = 'create' }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === 'edit';
  const [form, setForm] = useState({ title: '', author: '', description: '', genre: [], year: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const GENRE_OPTIONS = [
    'Fiction','Non-Fiction','Fantasy','Romance','Thriller','Biography','Science','Self-Help','History','Mystery'
  ];

  useEffect(() => {
    const load = async () => {
      if (!isEdit || !id) return;
      setLoading(true); setError('');
      try {
        const { data } = await getBook(id);
        const b = data.book;
        setForm({
          title: b.title || '',
          author: b.author || '',
          description: b.description || '',
          genre: Array.isArray(b.genre) ? b.genre : (b.genre ? String(b.genre).split(',').map(s=>s.trim()).filter(Boolean) : []),
          year: b.year || ''
        });
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally { setLoading(false); }
    };
    load();
  }, [isEdit, id]);

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  const addGenre = (value) => {
    if (!value) return;
    setForm((s) => ({ ...s, genre: s.genre.includes(value) ? s.genre : [...s.genre, value] }));
  };
  const removeGenre = (value) => setForm((s) => ({ ...s, genre: s.genre.filter(g => g !== value) }));

  const onSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const payload = { ...form, year: Number(form.year), genre: form.genre };
      if (isEdit) await updateBook(id, payload); else await createBook(payload);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="card-panel">
      <h2>{isEdit ? 'Edit Book' : 'Add Book'}</h2>
      <form className="form" onSubmit={onSubmit}>
        <label>Title<input name="title" value={form.title} onChange={onChange} required /></label>
        <label>Author<input name="author" value={form.author} onChange={onChange} required /></label>
        <label>Genres
          <div className="chips-wrap">
            <div className="chips">
              {form.genre.map(g => (
                <span key={g} className="chip">
                  {g}
                  <button type="button" aria-label={`remove ${g}`} onClick={() => removeGenre(g)}>×</button>
                </span>
              ))}
            </div>
            <select
              onChange={(e)=>{ addGenre(e.target.value); e.target.value=''; }}
              defaultValue=""
            >
              <option value="" disabled>Add genre…</option>
              {GENRE_OPTIONS.filter(o => !form.genre.includes(o)).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </label>
        <label>Published Year<input type="number" name="year" value={form.year} onChange={onChange} required /></label>
        <label>Description<textarea name="description" value={form.description} onChange={onChange} /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Book')}</button>
      </form>
    </div>
  );
}
