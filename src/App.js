import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import './styles/global.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Wrapper that hides Navbar/Footer on admin pages
const PublicLayout = ({ children }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return isAdmin ? children : (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <ScrollToTop />
      <PublicLayout>
        <Routes>
          {/* ── Public ── */}
          <Route path="/"         element={<Home />} />
          <Route path="/about"    element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact"  element={<Contact />} />

          {/* ── Admin ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* ── 404 ── */}
          <Route path="*" element={
            <main style={{
              display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', minHeight:'80vh', gap:'16px',
              paddingTop:'var(--nav-height)'
            }}>
              <h1 style={{ fontSize:'80px', fontFamily:'var(--font-display)', color:'var(--gray-200)' }}>404</h1>
              <p style={{ color:'var(--gray-500)', fontSize:'18px' }}>Page not found</p>
              <a href="/" className="btn btn-primary">Go Home</a>
            </main>
          } />
        </Routes>
      </PublicLayout>
    </Router>
  </AuthProvider>
);

export default App;
