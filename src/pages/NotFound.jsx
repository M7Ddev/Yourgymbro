import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-number">404</div>
      <h1 className="notfound-title">Missed That Set</h1>
      <p className="notfound-sub">
        This page doesn&rsquo;t exist. Either you skipped too many leg days to find it,
        or it was never here to begin with.
      </p>
      <Link to="/" className="btn btn--primary">Back to the Gym</Link>
    </div>
  )
}
