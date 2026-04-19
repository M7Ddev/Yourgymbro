import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import ProtectedRoute from './ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Profile from '../pages/Profile'
import Schedule from '../pages/Schedule'
import NotFound from '../pages/NotFound'

export default function AppRouter({ darkMode, onToggleDark }) {
  return (
    <BrowserRouter>
      <Navbar darkMode={darkMode} onToggleDark={onToggleDark} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        <span>Built by </span>
        <a href="https://github.com/M7Ddev" target="_blank" rel="noopener noreferrer" className="footer__link">M7dev</a>
      </footer>
    </BrowserRouter>
  )
}
