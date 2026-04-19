import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLang } from '../context/LanguageContext'

export default function Login() {
  const { isLoggedIn, login } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (isLoggedIn) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">{t('welcomeBack')}</h1>
        <p className="auth-card__sub">{t('signInSub')}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? t('signingIn') : t('signIn')}
          </button>
        </form>

        <p className="auth-card__footer">
          {t('noAccount')} <Link to="/signup">{t('signUpFree')}</Link>
        </p>
      </div>
    </div>
  )
}
