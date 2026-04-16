import { useState, useEffect } from 'react'
import { api } from '../api'
import './Admin.css'

const EMPTY_MOVIE = { title: '', genre: '', description: '', year: '', poster: '' }

export default function Admin() {
  const [tab, setTab] = useState('movies')
  const [movies, setMovies] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [showMovieForm, setShowMovieForm] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [movieForm, setMovieForm] = useState(EMPTY_MOVIE)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [m, u] = await Promise.all([api.get('/movies'), api.get('/users')])
      setMovies(m)
      setUsers(u)
      setLoading(false)
    }
    load()
  }, [])

  const openCreate = () => {
    setEditingMovie(null)
    setMovieForm(EMPTY_MOVIE)
    setFormError('')
    setShowMovieForm(true)
  }

  const openEdit = (movie) => {
    setEditingMovie(movie)
    setMovieForm({ title: movie.title, genre: movie.genre, description: movie.description, year: movie.year, poster: movie.poster })
    setFormError('')
    setShowMovieForm(true)
  }

  const handleMovieFormChange = e => setMovieForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleMovieSave = async e => {
    e.preventDefault()
    setFormError('')
    if (!movieForm.title || !movieForm.genre || !movieForm.year) {
      return setFormError('Title, genre and year are required.')
    }
    setSaving(true)
    try {
      const payload = { ...movieForm, year: Number(movieForm.year) }
      if (editingMovie) {
        const updated = await api.put(`/movies/${editingMovie.id}`, { ...editingMovie, ...payload })
        setMovies(prev => prev.map(m => m.id === editingMovie.id ? updated : m))
      } else {
        const created = await api.post('/movies', payload)
        setMovies(prev => [...prev, created])
      }
      setShowMovieForm(false)
    } catch {
      setFormError('Failed to save movie.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie and all its reviews?')) return
    await api.delete(`/movies/${id}`)
    const reviewsToDelete = await api.get(`/reviews?movieId=${id}`)
    await Promise.all(reviewsToDelete.map(r => api.delete(`/reviews/${r.id}`)))
    setMovies(prev => prev.filter(m => m.id !== id))
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    await api.delete(`/users/${id}`)
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  if (loading) return <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>

  return (
    <div className="container fade-in">
      <div className="page-header">
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-subtitle">Manage movies and users</p>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'movies' ? 'active' : ''}`} onClick={() => setTab('movies')}>
          Movies <span className="tab-count">{movies.length}</span>
        </button>
        <button className={`admin-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
          Users <span className="tab-count">{users.length}</span>
        </button>
      </div>

      {tab === 'movies' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Movies</h2>
            <button className="btn btn-primary" onClick={openCreate}>+ Add Movie</button>
          </div>

          {showMovieForm && (
            <div className="movie-form-overlay">
              <div className="movie-form-modal card">
                <div className="modal-header">
                  <h3>{editingMovie ? 'Edit Movie' : 'Add Movie'}</h3>
                  <button className="close-btn" onClick={() => setShowMovieForm(false)}>✕</button>
                </div>
                <form onSubmit={handleMovieSave} className="movie-form">
                  {formError && <div className="error-msg">{formError}</div>}
                  <div className="form-row">
                    <div className="form-group">
                      <label>Title *</label>
                      <input className="form-control" name="title" value={movieForm.title} onChange={handleMovieFormChange} placeholder="Movie title" />
                    </div>
                    <div className="form-group">
                      <label>Genre *</label>
                      <input className="form-control" name="genre" value={movieForm.genre} onChange={handleMovieFormChange} placeholder="e.g. Sci-Fi" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Year *</label>
                      <input className="form-control" name="year" type="number" value={movieForm.year} onChange={handleMovieFormChange} placeholder="2024" />
                    </div>
                    <div className="form-group">
                      <label>Poster URL</label>
                      <input className="form-control" name="poster" value={movieForm.poster} onChange={handleMovieFormChange} placeholder="https://…" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control" name="description" value={movieForm.description} onChange={handleMovieFormChange} rows={3} placeholder="Short description…" />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => setShowMovieForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Saving…' : editingMovie ? 'Save Changes' : 'Add Movie'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie.id}>
                    <td>
                      <div className="movie-row">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="table-poster"
                          onError={e => { e.target.src = 'https://via.placeholder.com/32x48/12121a/555568?text=?' }}
                        />
                        <span>{movie.title}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-genre">{movie.genre}</span></td>
                    <td className="muted">{movie.year}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-ghost btn-xs" onClick={() => openEdit(movie)}>Edit</button>
                        <button className="btn btn-danger btn-xs" onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Users</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="bold">{u.username}</td>
                    <td className="muted">{u.email}</td>
                    <td>
                      <span className={u.role === 'admin' ? 'badge badge-admin' : 'badge badge-genre'}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {u.role !== 'admin' && (
                        <button className="btn btn-danger btn-xs" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
