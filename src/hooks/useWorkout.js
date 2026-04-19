import { useContext } from 'react'
import { WorkoutContext } from '../context/WorkoutContext'

export function useWorkout() {
  return useContext(WorkoutContext)
}
