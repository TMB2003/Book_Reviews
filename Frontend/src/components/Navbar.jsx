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

  const active = ({ isActive }) => ({ textDecoration: isActive ? 'underline' : 'none' });

  return (
    <header className="nav">
      <Link to="/home" className="brand">Book Reviews</Link>
      <nav>
        <NavLink to="/home" style={active}>Home</NavLink>
        {isAuthed && <NavLink to="/books/new" style={active}>Add Book</NavLink>}
        {isAuthed && <NavLink to="/profile" style={active}>Profile</NavLink>}
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
