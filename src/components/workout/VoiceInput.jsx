import { useState, useRef, useEffect } from 'react'
import { EXERCISES } from '../../data/exercises'

const WORD_NUMS = {
  zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8,
  nine:9, ten:10, eleven:11, twelve:12, thirteen:13, fourteen:14, fifteen:15,
  sixteen:16, seventeen:17, eighteen:18, nineteen:19, twenty:20, thirty:30,
  forty:40, fifty:50, sixty:60, seventy:70, eighty:80, ninety:90, hundred:100,
}

function normalizeNumbers(text) {
  return text.replace(
    /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)\b/gi,
    m => WORD_NUMS[m.toLowerCase()]
  )
}

function parseTranscript(raw) {
  const text = normalizeNumbers(raw.toLowerCase())
  const result = { name: '', sets: '', reps: '', weight: '' }

  // sets
  let m = text.match(/(\d+)\s*sets?\b/) || text.match(/\bsets?\s+(?:was|were|is|of)?\s*(\d+)/)
  if (m) result.sets = String(parseInt(m[1] ?? m[2]))

  // reps
  m = text.match(/(\d+)\s*reps?\b/) || text.match(/\breps?\s+(?:was|were|is|of)?\s*(\d+)/)
  if (m) result.reps = String(parseInt(m[1] ?? m[2]))

  // weight
  m = text.match(/(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilos?|pounds?|lbs?)/)
    || text.match(/\bweight\s+(?:was|is|of)?\s*(\d+(?:\.\d+)?)/)
    || text.match(/\bweighed?\s+(\d+(?:\.\d+)?)/)
  if (m) result.weight = String(parseFloat(m[1] ?? m[2]))

  // exercise name
  const lower = EXERCISES.map(e => e.toLowerCase())
  const found = lower.findIndex(e => text.includes(e))
  if (found !== -1) {
    result.name = EXERCISES[found]
  } else {
    const cleaned = text
      .replace(/(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilos?|pounds?|lbs?)/g, '')
      .replace(/\b(sets?|reps?|weight|the|i|did|and|was|were|with|a|my|played|it|had|weighed?|of|is)\b/g, '')
      .replace(/\d+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    result.name = cleaned.replace(/\b\w/g, c => c.toUpperCase())
  }

  return result
}

function MicIcon({ active }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0014 0" />
      <line x1="12" y1="21" x2="12" y2="17" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </svg>
  )
}

export default function VoiceInput({ onResult }) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const recRef = useRef(null)
  const onResultRef = useRef(onResult)

  // Always keep ref in sync with latest prop to avoid stale closure
  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  const supported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  if (!supported) return null

  function start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 1

    rec.onresult = e => {
      const text = e.results[0][0].transcript
      setTranscript(text)
      onResultRef.current(parseTranscript(text))
    }
    rec.onerror = e => {
      setError(e.error === 'not-allowed' ? 'Microphone access denied.' : 'Could not capture audio.')
      setListening(false)
    }
    rec.onend = () => setListening(false)

    recRef.current = rec
    rec.start()
    setListening(true)
    setTranscript('')
    setError(null)
  }

  function stop() {
    recRef.current?.stop()
    setListening(false)
  }

  return (
    <div className="voice-input">
      <button
        type="button"
        className={`voice-btn${listening ? ' voice-btn--active' : ''}`}
        onClick={listening ? stop : start}
        title={listening ? 'Stop recording' : 'Fill form by voice'}
      >
        <MicIcon active={listening} />
        {listening ? 'Listening…' : 'Voice'}
      </button>
      {transcript && !listening && (
        <span className="voice-transcript">"{transcript}"</span>
      )}
      {error && <span className="voice-error">{error}</span>}
    </div>
  )
}
