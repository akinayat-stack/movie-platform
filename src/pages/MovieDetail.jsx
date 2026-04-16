import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/StarRating'
import './MovieDetail.css'

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [users, setUsers] = useState({})
  const [loading, setLoading] = useState(true)
  const [reviewForm, setReviewForm] = useState({ text: '', rating: 0 })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [movieData, reviewData, userData] = await Promise.all([
          api.get(`/movies/${id}`),
          api.getMovieReviews(id),
          api.get('/users'),
        ])
        setMovie(movieData)
        setReviews(reviewData.sort((a, b) => (b.date || '').localeCompare(a.date || '')))
        const userMap = {}
        userData.forEach(u => { userMap[u.id] = u.username })
        setUsers(userMap)
      } catch {
        navigate('/movies')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate, user?.id])

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const hasReviewed = user && reviews.some(r => r.userId === user.id)

  const handleSubmitReview = async e => {
    e.preventDefault()
    setFormError('')
    if (!reviewForm.text.trim()) return setFormError('Please write your review.')
    if (!reviewForm.rating) return setFormError('Please select a rating.')

    setSubmitting(true)
    try {
      const newReview = await api.createReview({
        movieId: id,
        userId: user.id,
        text: reviewForm.text.trim(),
        rating: reviewForm.rating,
        date: new Date().toISOString().split('T')[0],
      })
      setReviews(prev => [newReview, ...prev])
      setReviewForm({ text: '', rating: 0 })
    } catch {
      setFormError('Failed to submit review.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return
    await api.delete(`/reviews/${reviewId}`)
    setReviews(prev => prev.filter(r => r.id !== reviewId))
  }

  if (loading) return <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
  if (!movie) return null

  return (
    <div className="movie-detail fade-in">
      <div className="detail-hero">
        <div className="detail-backdrop" style={{ backgroundImage: `url(${movie.poster})` }} />
        <div className="detail-hero-inner container">
          <img
            className="detail-poster"
            src={movie.poster}
            alt={movie.title}
            onError={e => { e.target.src = 'https://via.placeholder.com/300x450/12121a/555568?text=No+Poster' }}
          />
          <div className="detail-meta">
            <span className="badge badge-genre">{movie.genre}</span>
            <h1 className="detail-title">{movie.title}</h1>
            <div className="detail-stats">
              <span className="detail-year">{movie.year}</span>
              {avgRating && (
                <span className="detail-rating">
                  <span className="star filled">★</span> {avgRating} <span className="rating-count">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </span>
              )}
            </div>
            <p className="detail-desc">{movie.description}</p>
          </div>
        </div>
      </div>

      <div className="container detail-body">
        <div className="reviews-section">
          <h2 className="section-title">Reviews <span className="review-count">{reviews.length}</span></h2>

          {user && !hasReviewed && (
            <form className="review-form card" onSubmit={handleSubmitReview}>
              <h3 className="review-form-title">Write a Review</h3>
              {formError && <div className="error-msg">{formError}</div>}
              <div className="form-group">
                <label>Your Rating</label>
                <StarRating value={reviewForm.rating} onChange={v => setReviewForm(f => ({ ...f, rating: v }))} />
              </div>
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  className="form-control review-textarea"
                  placeholder="What did you think of this film?"
                  value={reviewForm.text}
                  onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
                  rows={4}
                />
              </div>
              <button className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          )}

          {!user && (
            <div className="login-prompt card">
              <p>Sign in to write a review.</p>
            </div>
          )}

          {hasReviewed && (
            <div className="already-reviewed">You've already reviewed this film.</div>
          )}

          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          ) : (
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review.id} className="review-card card">
                  <div className="review-header">
                    <div className="review-author-info">
                      <span className="review-author">{users[review.userId] || 'Unknown'}</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-right">
                      <StarRating value={review.rating} readonly />
                      {(user?.id === review.userId || user?.role === 'admin') && (
                        <button className="btn btn-danger btn-xs" onClick={() => handleDeleteReview(review.id)}>Delete</button>
                      )}
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
