import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLang } from '../context/LanguageContext'
import { signUp } from '../services/authService'

export default function Signup() {
  const { isLoggedIn } = useAuth()
  const { t } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  if (isLoggedIn) return <Navigate to="/" replace />

  if (confirmed) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-card__title">{t('checkEmail')}</h1>
          <p className="auth-card__sub">
            {t('confirmationSentPrefix')} <strong>{email}</strong>.<br />
            {t('confirmationSentSuffix')}
          </p>
          <Link to="/login" className="btn btn--primary btn--block" style={{ marginTop: '1.5rem', display: 'block', textAlign: 'center' }}>
            {t('goToSignIn')}
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signUp(email, password, name)
      setConfirmed(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">{t('createAccountTitle')}</h1>
        <p className="auth-card__sub">{t('createAccountSub')}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="name">{t('fullName')}</label>
            <input
              id="name" type="text" className="input"
              placeholder="John Smith"
              value={name} onChange={(e) => setName(e.target.value)} required
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="email">{t('email')}</label>
            <input
              id="email" type="email" className="input"
              placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">{t('password')}</label>
            <input
              id="password" type="password" className="input"
              placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              minLength={6} required
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? t('creatingAccount') : t('signUpBtn')}
          </button>
        </form>

        <p className="auth-card__footer">
          {t('alreadyHaveAccount')} <Link to="/login">{t('signInLink')}</Link>
        </p>
      </div>
    </div>
  )
}
