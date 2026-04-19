import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useWorkout } from '../hooks/useWorkout'
import { useLang } from '../context/LanguageContext'
import { getMonday, toDateKey } from '../utils/formatDate'

const DAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

function getWeekDays(monday) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return d
  })
}

export default function Schedule() {
  const { isLoggedIn } = useAuth()
  const { workouts } = useWorkout()
  const { t } = useLang()
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))
  const todayStr = new Date().toDateString()
  const days = getWeekDays(weekStart)

  function prevWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d)
  }

  function nextWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d)
  }

  const workoutsByDate = workouts.reduce((acc, w) => {
    if (!acc[w.date]) acc[w.date] = []
    acc[w.date].push(w)
    return acc
  }, {})

  const weekLabel = `${days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${days[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{t('scheduleTitle')}</h1>
        <p className="page-subtitle">{t('scheduleSub')}</p>
      </div>

      <div className="week-nav">
        <button className="btn btn--outline btn--sm" onClick={prevWeek}>{t('prevWeek')}</button>
        <span className="week-nav__label">{weekLabel}</span>
        <button className="btn btn--outline btn--sm" onClick={nextWeek}>{t('nextWeek')}</button>
      </div>

      <div className="week-grid">
        {days.map((day, i) => {
          const key = toDateKey(day)
          const dayWorkouts = workoutsByDate[key] ?? []
          const isToday = day.toDateString() === todayStr

          return (
            <div key={key} className={`day-col${isToday ? ' day-col--today' : ''}`}>
              <div className="day-col__header">
                <span className="day-col__day">{DAY_NAMES[i]}</span>
                <span className="day-col__date">{day.getDate()}</span>
              </div>
              <div className="day-col__body">
                {!isLoggedIn ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--c-text-2)', fontFamily: 'var(--f-condensed)', letterSpacing: '0.1em' }}>
                    {t('loginRequired')}
                  </span>
                ) : dayWorkouts.length > 0 ? (
                  dayWorkouts.map(w => (
                    <div key={w.id} className="schedule-block schedule-block--push">
                      <span className="schedule-block__name">{w.name}</span>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--c-text-2)', fontFamily: 'var(--f-condensed)', letterSpacing: '0.1em' }}>
                    {t('rest')}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
