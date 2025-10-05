import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import './navbar.css';

export default function Navbar() {
  const { isAuthed, setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    setToken('');
    setUser(null);
    navigate('/login');
  };

  const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <header className="nav">
      <Link to="/home" className="brand">Book Reviews</Link>
      <nav>
        <NavLink to="/home" className={linkClass}>Home</NavLink>
        {isAuthed && <NavLink to="/books/new" className={linkClass}>Add Book</NavLink>}
        {isAuthed && <NavLink to="/profile" className={linkClass}>Profile</NavLink>}
      </nav>
      <div className="right">
        <ThemeToggle />
        {isAuthed ? (
          <button className="btn" onClick={logout}>Logout</button>
        ) : (
          <>
            <Link className="btn" to="/login">Login</Link>
            <Link className="btn" to="/signup">Signup</Link>
          </>
        )}
      </div>
    </header>
  );
}
