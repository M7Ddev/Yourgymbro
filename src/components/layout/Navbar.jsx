import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLang } from '../../context/LanguageContext'

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
  </svg>
)

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function Navbar({ darkMode, onToggleDark }) {
  const { isLoggedIn, displayName, logout } = useAuth()
  const { lang, toggleLang, t } = useLang()
  const [drawerOpen, setDrawerOpen] = useState(false)

  function closeDrawer() { setDrawerOpen(false) }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar__logo" onClick={closeDrawer}>
          YourGym<span>Bro</span>
        </Link>

        {/* Desktop actions */}
        <div className="navbar__actions">
          <button className="theme-toggle" onClick={onToggleDark} title="Toggle theme">
            {darkMode ? <SunIcon /> : <MoonIcon />}
            {darkMode ? t('light') : t('dark')}
          </button>

          <button className="lang-toggle" onClick={toggleLang} title="Switch language">
            {lang === 'en' ? 'ع' : 'EN'}
          </button>

          {isLoggedIn ? (
            <>
              <span className="navbar__welcome">{t('navWelcome')} {displayName}</span>
              <button className="btn btn--ghost btn--sm" onClick={logout}>{t('logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm">{t('login')}</Link>
              <Link to="/signup" className="btn btn--outline btn--sm">{t('signup')}</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="nav-hamburger" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
          <HamburgerIcon />
        </button>
      </nav>

      {/* Overlay */}
      {drawerOpen && <div className="nav-overlay" onClick={closeDrawer} />}

      {/* Drawer */}
      <div className={`nav-drawer${drawerOpen ? ' nav-drawer--open' : ''}`}>
        <div className="nav-drawer__header">
          <Link to="/" className="navbar__logo" onClick={closeDrawer}>
            YourGym<span>Bro</span>
          </Link>
          <button className="nav-drawer__close" onClick={closeDrawer} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        <div className="nav-drawer__divider" />

        {isLoggedIn && (
          <div className="nav-drawer__welcome">
            {t('navWelcome')} <strong>{displayName}</strong>
          </div>
        )}

        <div className="nav-drawer__actions">
          <button className="theme-toggle nav-drawer__btn" onClick={() => { onToggleDark(); closeDrawer() }}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
            {darkMode ? t('light') : t('dark')}
          </button>

          <button className="lang-toggle nav-drawer__btn" onClick={() => { toggleLang(); closeDrawer() }}>
            {lang === 'en' ? 'ع — العربية' : 'EN — English'}
          </button>
        </div>

        <div className="nav-drawer__divider" />

        <div className="nav-drawer__links">
          {isLoggedIn ? (
            <button
              className="nav-drawer__link nav-drawer__link--danger"
              onClick={() => { logout(); closeDrawer() }}
            >
              {t('logout')}
            </button>
          ) : (
            <>
              <Link to="/login" className="nav-drawer__link" onClick={closeDrawer}>
                {t('login')}
              </Link>
              <Link to="/signup" className="nav-drawer__link nav-drawer__link--accent" onClick={closeDrawer}>
                {t('signup')}
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
