import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/StarRating'
import './Profile.css'

export default function Profile() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [movies, setMovies] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [reviewData, movieData] = await Promise.all([
        api.getUserReviews(user.id),
        api.get('/movies'),
      ])
      const movieMap = {}
      movieData.forEach(m => { movieMap[m.id] = m })
      setReviews(reviewData.sort((a, b) => (b.date || '').localeCompare(a.date || '')))
      setMovies(movieMap)
      setLoading(false)
    }
    load()
  }, [user.id])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return
    await api.delete(`/reviews/${id}`)
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  return (
    <div className="container fade-in">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">@{user.username} · {user.email}</p>
      </div>

      <div className="profile-stats">
        <div className="stat-card card">
          <span className="stat-num">{reviews.length}</span>
          <span className="stat-label">Reviews</span>
        </div>
        <div className="stat-card card">
          <span className="stat-num">{avgRating}</span>
          <span className="stat-label">Avg Rating</span>
        </div>
        <div className="stat-card card">
          <span className="stat-num">{user.role}</span>
          <span className="stat-label">Role</span>
        </div>
      </div>

      <h2 className="section-heading">My Reviews</h2>

      {loading ? (
        <p className="muted-text">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <div className="empty-state card">
          <p>No reviews yet.</p>
          <Link to="/movies" className="btn btn-primary" style={{ marginTop: 12 }}>Browse Movies</Link>
        </div>
      ) : (
        <div className="profile-reviews">
          {reviews.map(review => {
            const movie = movies[review.movieId]
            return (
              <div key={review.id} className="profile-review card">
                {movie && (
                  <Link to={`/movies/${movie.id}`} className="review-movie-link">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="review-movie-poster"
                      onError={e => { e.target.src = 'https://via.placeholder.com/60x90/12121a/555568?text=?' }}
                    />
                    <div className="review-movie-info">
                      <span className="review-movie-title">{movie.title}</span>
                      <span className="review-movie-year">{movie.year}</span>
                    </div>
                  </Link>
                )}
                <div className="review-content">
                  <div className="review-top">
                    <StarRating value={review.rating} readonly />
                    <span className="review-date">{review.date}</span>
                  </div>
                  <p className="review-text">{review.text}</p>
                  {review.userId === user.id && (
                    <button className="btn btn-danger btn-xs" onClick={() => handleDelete(review.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
