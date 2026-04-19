import { useAuth } from '../hooks/useAuth'
import { useWorkout } from '../hooks/useWorkout'
import { useLang } from '../context/LanguageContext'

export default function Profile() {
  const { user, displayName } = useAuth()
  const { workouts, exercises } = useWorkout()
  const { t } = useLang()

  if (!user) return null

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0)
  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{t('profileTitle')}</h1>
        <p className="page-subtitle">{t('profileSub')}</p>
      </div>

      <div className="profile-hero">
        <div className="profile-avatar">{displayName?.[0]?.toUpperCase() ?? '?'}</div>
        <div className="profile-info">
          <div className="profile-info__name">{displayName}</div>
          <div className="profile-info__handle">{user.email}</div>
          <div className="profile-info__since">{t('memberSince')} {memberSince}</div>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-card__label">{t('sessionsLogged')}</span>
          <div><span className="stat-card__value">{workouts.length}</span></div>
          <span className="stat-card__sub">{t('allTime')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">{t('exercisesLogged')}</span>
          <div><span className="stat-card__value">{exercises.length}</span></div>
          <span className="stat-card__sub">{t('currentSession')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">{t('setsLogged')}</span>
          <div><span className="stat-card__value">{totalSets}</span></div>
          <span className="stat-card__sub">{t('currentSession')}</span>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">{t('recentSessions')}</h2>
      </div>

      {workouts.length === 0 ? (
        <p style={{ color: 'var(--c-text-2)', fontSize: '0.9rem' }}>{t('noSessionsYet')}</p>
      ) : (
        <table className="pr-table">
          <thead>
            <tr>
              <th>{t('sessionCol')}</th>
              <th>{t('dateCol')}</th>
            </tr>
          </thead>
          <tbody>
            {workouts.slice(0, 10).map(w => (
              <tr key={w.id}>
                <td className="pr-table__exercise">{w.name}</td>
                <td className="pr-table__date">
                  {new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
