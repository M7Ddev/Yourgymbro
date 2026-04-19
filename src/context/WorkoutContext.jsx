import { createContext, useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  fetchWorkouts,
  addWorkout as dbAddWorkout,
  deleteWorkout as dbDeleteWorkout,
  fetchExercisesByWorkout,
  addExercise as dbAddExercise,
  updateExercise as dbUpdateExercise,
  deleteExercise as dbDeleteExercise,
} from '../services/workoutService'

export const WorkoutContext = createContext(null)

export function WorkoutProvider({ children }) {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [exercises, setExercises] = useState([])
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setWorkouts([])
      setExercises([])
      setSelectedWorkout(null)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    fetchWorkouts(user.id)
      .then(setWorkouts)
      .catch(() => setError('Failed to load workouts. Please refresh.'))
      .finally(() => setLoading(false))
  }, [user])

  useEffect(() => {
    if (!selectedWorkout) {
      setExercises([])
      return
    }
    fetchExercisesByWorkout(selectedWorkout.id)
      .then(setExercises)
      .catch(() => setError('Failed to load exercises. Please try again.'))
  }, [selectedWorkout])

  async function addWorkout(workout) {
    const saved = await dbAddWorkout({ ...workout, user_id: user.id })
    setWorkouts(prev => [saved, ...prev])
    return saved
  }

  async function deleteWorkout(id) {
    await dbDeleteWorkout(id)
    setWorkouts(prev => prev.filter(w => w.id !== id))
    if (selectedWorkout?.id === id) setSelectedWorkout(null)
  }

  async function addExercise(exercise) {
    const saved = await dbAddExercise({ ...exercise, user_id: user.id, workout_id: selectedWorkout.id })
    setExercises(prev => [...prev, saved])
  }

  async function updateExercise(id, updates) {
    const saved = await dbUpdateExercise(id, updates)
    setExercises(prev => prev.map(ex => ex.id === id ? saved : ex))
  }

  async function deleteExercise(id) {
    await dbDeleteExercise(id)
    setExercises(prev => prev.filter(ex => ex.id !== id))
  }

  return (
    <WorkoutContext.Provider value={{
      workouts,
      exercises,
      selectedWorkout,
      setSelectedWorkout,
      addWorkout,
      deleteWorkout,
      addExercise,
      updateExercise,
      deleteExercise,
      loading,
      error,
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}
