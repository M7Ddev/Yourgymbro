import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useWorkout } from '../hooks/useWorkout'
import { useLang } from '../context/LanguageContext'
import ExerciseCombobox from '../components/workout/ExerciseCombobox'
import VoiceInput from '../components/workout/VoiceInput'

const EMPTY = { name: '', sets: '', reps: '', weight: '' }

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

export default function Home() {
  const { isLoggedIn, displayName } = useAuth()
  const { workouts, exercises, selectedWorkout, setSelectedWorkout, addWorkout, deleteWorkout, addExercise, updateExercise, deleteExercise, loading, error } = useWorkout()
  const { t } = useLang()
  const [form, setForm] = useState(EMPTY)
  const [editingExercise, setEditingExercise] = useState(null)
  const [flash, setFlash] = useState(false)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [newWorkoutName, setNewWorkoutName] = useState('')
  const [newWorkoutDate, setNewWorkoutDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [showNewWorkout, setShowNewWorkout] = useState(false)
  const [creatingWorkout, setCreatingWorkout] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = true
    if (!form.sets || form.sets < 1) e.sets = true
    if (!form.reps || form.reps < 1) e.reps = true
    return e
  }

  async function handleCreateWorkout(e) {
    e.preventDefault()
    if (!newWorkoutName.trim()) return
    setCreatingWorkout(true)
    try {
      const saved = await addWorkout({ name: newWorkoutName.trim(), date: newWorkoutDate })
      setSelectedWorkout(saved)
      setNewWorkoutName('')
      setShowNewWorkout(false)
    } catch (err) {
      console.error(err)
    } finally {
      setCreatingWorkout(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    setSaving(true)
    try {
      if (editingExercise) {
        await updateExercise(editingExercise.id, {
          name: form.name.trim(),
          sets: Number(form.sets),
          reps: Number(form.reps),
          weight: form.weight ? Number(form.weight) : 0,
        })
        setEditingExercise(null)
      } else {
        await addExercise({
          name: form.name.trim(),
          sets: Number(form.sets),
          reps: Number(form.reps),
          weight: form.weight ? Number(form.weight) : 0,
        })
      }
      setForm(EMPTY)
      setFlash(true)
      setTimeout(() => setFlash(false), 1800)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(ex) {
    setEditingExercise(ex)
    setForm({ name: ex.name, sets: String(ex.sets), reps: String(ex.reps), weight: ex.weight > 0 ? String(ex.weight) : '' })
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingExercise(null)
    setForm(EMPTY)
    setErrors({})
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this exercise?')) return
    try { await deleteExercise(id) } catch (err) { console.error(err) }
  }

  async function handleDeleteWorkout(id) {
    if (!window.confirm('Delete this session and all its exercises? This cannot be undone.')) return
    try { await deleteWorkout(id) } catch (err) { console.error(err) }
  }

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0)

  return (
    <>
      {/* ── HERO ── */}
      <div className="hero">
        <h1 className="hero__title">
          {isLoggedIn ? t('heroTitle_user', { name: displayName }) : t('heroTitle_guest')}
        </h1>
        <p className="hero__sub">
          {isLoggedIn ? t('heroSub_user') : t('heroSub_guest')}
        </p>
      </div>

      {/* ── PLANNER CARD ── */}
      <div className="planner-card">
        <div className="planner-card__head">
          <h2 className="planner-card__title">{t('yourWorkouts')}</h2>
          {error && <span style={{ fontSize: '0.8rem', color: 'var(--c-danger, #e53e3e)' }}>{error}</span>}
          {selectedWorkout && exercises.length > 0 && (
            <span className="planner-card__meta">
              {exercises.length} &middot; {totalSets} {t('setsTotal')}
            </span>
          )}
        </div>

        {/* ── GATE: not logged in ── */}
        {!isLoggedIn ? (
          <div className="plan-empty">
            <p>
              <Link to="/signup">{t('loginPromptLink')}</Link> {t('loginPromptOr')} <Link to="/login">{t('loginPromptSignIn')}</Link> {t('loginPromptSuffix')}
            </p>
          </div>
        ) : (
          <>
            {/* ── WORKOUT SELECTOR ── */}
            <div style={{ marginBottom: '1.75rem', padding: '0 2.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <select
                  className="input input--select"
                  style={{ flex: 1, minWidth: '200px' }}
                  value={selectedWorkout?.id ?? ''}
                  onChange={e => {
                    const w = workouts.find(w => w.id === e.target.value) ?? null
                    setSelectedWorkout(w)
                  }}
                >
                  <option value="">{t('selectSession')}</option>
                  {workouts.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} — {new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </option>
                  ))}
                </select>
                <button className="btn btn--outline btn--sm" type="button" onClick={() => setShowNewWorkout(v => !v)}>
                  {showNewWorkout ? t('cancel') : t('newSession')}
                </button>
                {selectedWorkout && (
                  <button
                    className="btn btn--sm"
                    style={{ background: 'var(--c-danger, #e53e3e)', color: '#fff', border: 'none' }}
                    type="button"
                    onClick={() => handleDeleteWorkout(selectedWorkout.id)}
                  >
                    {t('deleteSession')}
                  </button>
                )}
              </div>

              {showNewWorkout && (
                <form onSubmit={handleCreateWorkout} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div className="input-group" style={{ flex: 1, minWidth: '160px' }}>
                    <label className="input-label">{t('sessionName')}</label>
                    <input
                      className="input"
                      placeholder={t('sessionNamePlaceholder')}
                      value={newWorkoutName}
                      onChange={e => setNewWorkoutName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">{t('date')}</label>
                    <input
                      className="input"
                      type="date"
                      value={newWorkoutDate}
                      onChange={e => setNewWorkoutDate(e.target.value)}
                    />
                  </div>
                  <button className="btn btn--primary" type="submit" disabled={creatingWorkout}>
                    {creatingWorkout ? t('creating') : t('create')}
                  </button>
                </form>
              )}
            </div>

            {/* ── EXERCISE FORM ── */}
            {selectedWorkout && (
              <form className="exercise-form" onSubmit={handleSubmit} noValidate>
                <VoiceInput onResult={parsed => setForm(prev => ({
                  ...prev,
                  ...(parsed.name   && { name:   parsed.name }),
                  ...(parsed.sets   && { sets:   parsed.sets }),
                  ...(parsed.reps   && { reps:   parsed.reps }),
                  ...(parsed.weight && { weight: parsed.weight }),
                }))} />
                <div className="exercise-form__row1">
                  <div className="input-group">
                    <label className="input-label" htmlFor="ex-name">{t('exercise')}</label>
                    <ExerciseCombobox
                      value={form.name}
                      onChange={val => {
                        setForm(prev => ({ ...prev, name: val }))
                        if (errors.name) setErrors(prev => ({ ...prev, name: false }))
                      }}
                      hasError={!!errors.name}
                    />
                    {errors.name && <span className="field-error">{t('required')}</span>}
                  </div>
                </div>

                <div className="exercise-form__row2">
                  <div className="input-group">
                    <label className="input-label" htmlFor="ex-sets">{t('sets')}</label>
                    <input
                      id="ex-sets"
                      className={`input${errors.sets ? ' input--error' : ''}`}
                      name="sets" type="number" min="1" max="20" placeholder="3"
                      value={form.sets} onChange={handleChange}
                    />
                    {errors.sets && <span className="field-error">{t('required')}</span>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="ex-reps">{t('reps')}</label>
                    <input
                      id="ex-reps"
                      className={`input${errors.reps ? ' input--error' : ''}`}
                      name="reps" type="number" min="1" max="100" placeholder="8"
                      value={form.reps} onChange={handleChange}
                    />
                    {errors.reps && <span className="field-error">{t('required')}</span>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="ex-weight">
                      {t('weight')} <span className="input-label__opt">({t('optional')})</span>
                    </label>
                    <input
                      id="ex-weight"
                      className="input"
                      name="weight" type="number" min="0" max="1000" step="0.5" placeholder="80 kg"
                      value={form.weight} onChange={handleChange}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ visibility: 'hidden' }}>Submit</label>
                    <button type="submit" className={`btn btn--block${flash ? ' btn--success' : ' btn--primary'}`} disabled={saving}>
                      {flash ? (editingExercise ? '✓ Saved' : t('added')) : saving ? t('saving') : editingExercise ? 'Save Changes' : t('addExercise')}
                    </button>
                    {editingExercise && (
                      <button type="button" className="btn btn--outline btn--sm" style={{ marginTop: '0.5rem', width: '100%' }} onClick={handleCancelEdit}>
                        {t('cancel')}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}

            {/* ── EXERCISE LIST ── */}
            {loading ? (
              <div className="plan-empty"><p>{t('loading')}</p></div>
            ) : !selectedWorkout ? (
              <div className="plan-empty">
                <div className="plan-empty__dots"><span /><span /><span /></div>
                <p>{t('selectSessionPrompt')}</p>
              </div>
            ) : exercises.length === 0 ? (
              <div className="plan-empty">
                <div className="plan-empty__dots"><span /><span /><span /></div>
                <p>{t('noExercisesYet')}</p>
              </div>
            ) : (
              <div className="plan-view">
                <div className="day-section">
                  <div className="day-section__header">
                    <span className="day-section__name">{selectedWorkout.name}</span>
                    <span className="day-section__count">
                      {new Date(selectedWorkout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="day-section__exercises">
                    {exercises.map((ex) => (
                      <div key={ex.id} className={`ex-row${editingExercise?.id === ex.id ? ' ex-row--editing' : ''}`}>
                        <span className="ex-row__name">{ex.name}</span>
                        <span className="ex-row__sets">{ex.sets} × {ex.reps}</span>
                        <span className="ex-row__weight">
                          {ex.weight > 0 ? `${ex.weight} kg` : 'Bodyweight'}
                        </span>
                        <button className="ex-row__edit" onClick={() => handleEdit(ex)} title="Edit" aria-label="Edit exercise">
                          <PencilIcon />
                        </button>
                        <button className="ex-row__delete" onClick={() => handleDelete(ex.id)} title="Remove" aria-label="Remove exercise">
                          <TrashIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
