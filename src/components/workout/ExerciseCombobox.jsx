import { useState, useRef, useEffect, useMemo } from 'react'
import { EXERCISES } from '../../data/exercises'

export default function ExerciseCombobox({ value, onChange, hasError }) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const filtered = useMemo(() =>
    value.trim()
      ? EXERCISES.filter(ex => ex.toLowerCase().includes(value.toLowerCase()))
      : EXERCISES,
    [value]
  )

  useEffect(() => {
    setHighlighted(-1)
  }, [value])

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleKeyDown(e) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      select(filtered[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function select(name) {
    onChange(name)
    setOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className="combobox" ref={containerRef}>
      <input
        ref={inputRef}
        id="ex-name"
        className={`input${hasError ? ' input--error' : ''}`}
        name="name"
        placeholder="e.g. Bench Press"
        value={value}
        autoComplete="off"
        onChange={e => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {open && filtered.length > 0 && (
        <ul className="combobox__list" role="listbox">
          {filtered.map((ex, i) => (
            <li
              key={ex}
              className={`combobox__item${i === highlighted ? ' combobox__item--active' : ''}`}
              role="option"
              onMouseDown={() => select(ex)}
              onMouseEnter={() => setHighlighted(i)}
            >
              {ex}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
