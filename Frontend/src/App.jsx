import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import BookDetails from './pages/BookDetails.jsx';
import BookForm from './pages/BookForm.jsx';
import Profile from './pages/Profile.jsx';
import { useAuth } from './context/AuthContext.jsx';
import './App.css';

function Protected({ children }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}

function GuestOnly({ children }) {
  const { isAuthed } = useAuth();
  if (isAuthed) return <Navigate to="/home" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const hideNav = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';
  return (
    <div className="app-shell">
      {!hideNav && <Navbar />}
      <main className={hideNav ? 'auth-main' : 'container'}>
        <Routes>
          <Route path="/" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />

          <Route path="/home" element={<Protected><Home /></Protected>} />
          <Route path="/books/:id" element={<Protected><BookDetails /></Protected>} />
          <Route path="/books/new" element={<Protected><BookForm mode="create" /></Protected>} />
          <Route path="/books/:id/edit" element={<Protected><BookForm mode="edit" /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideNav && <Footer />}
    </div>
  );
}
