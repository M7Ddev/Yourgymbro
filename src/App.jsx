import { useEffect, useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { WorkoutProvider } from './context/WorkoutContext'
import { LanguageProvider } from './context/LanguageContext'
import AppRouter from './routes/AppRouter'

export default function App() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('light', !darkMode)
  }, [darkMode])

  return (
    <LanguageProvider>
      <AuthProvider>
        <WorkoutProvider>
          <AppRouter darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />
        </WorkoutProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
