import { supabase } from './supabaseClient'

// Workouts
export async function fetchWorkouts(userId) {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function addWorkout(workout) {
  const { data, error } = await supabase
    .from('workouts')
    .insert(workout)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteWorkout(id) {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Exercises
export async function fetchExercisesByWorkout(workoutId) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('workout_id', workoutId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function addExercise(exercise) {
  const { data, error } = await supabase
    .from('exercises')
    .insert(exercise)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateExercise(id, updates) {
  const { data, error } = await supabase
    .from('exercises')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteExercise(id) {
  const { error } = await supabase
    .from('exercises')
    .delete()
    .eq('id', id)
  if (error) throw error
}
