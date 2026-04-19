export function calculateVolume(exercises) {
  return exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
  }, 0)
}

export function formatVolume(volume) {
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}k`
  return String(volume)
}
