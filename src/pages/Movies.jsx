import { useState, useEffect, useMemo } from 'react'
import { api } from '../api'
import MovieCard from '../components/MovieCard'
import './Movies.css'

export default function Movies() {
  const [movies, setMovies] = useState([])
  const [reviewCounts, setReviewCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('All')

  useEffect(() => {
    const load = async () => {
      const [movieData, reviewData] = await Promise.all([
        api.get('/movies'),
        api.getAllReviews(),
      ])
      const countMap = {}
      reviewData.forEach(review => {
        countMap[review.movieId] = (countMap[review.movieId] || 0) + 1
      })
      setMovies(movieData)
      setReviewCounts(countMap)
      setLoading(false)
    }
    load()
  }, [])

  const genres = useMemo(() => {
    const all = movies.map(m => m.genre)
    return ['All', ...new Set(all)]
  }, [movies])

  const filtered = useMemo(() => {
    return movies.filter(m => {
      const matchSearch = m.title.toLowerCase().includes(search.toLowerCase())
      const matchGenre = genre === 'All' || m.genre === genre
      return matchSearch && matchGenre
    })
  }, [movies, search, genre])

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Movie Catalog</h1>
        <p className="page-subtitle">{movies.length} films — rate and review</p>
      </div>

      <div className="movies-filters">
        <input
          className="form-control search-input"
          placeholder="Search movies…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="genre-pills">
          {genres.map(g => (
            <button
              key={g}
              className={`genre-pill ${genre === g ? 'active' : ''}`}
              onClick={() => setGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="movies-loading">Loading movies…</div>
      ) : filtered.length === 0 ? (
        <div className="movies-empty">No movies found.</div>
      ) : (
        <div className="movies-grid fade-in">
          {filtered.map(movie => (
            <MovieCard key={movie.id} movie={movie} reviewCount={reviewCounts[String(movie.id)] || 0} />
          ))}
        </div>
      )}
    </div>
  )
}
