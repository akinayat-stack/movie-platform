 import { Link } from 'react-router-dom'

export default function MovieCard({ movie, reviewCount = 0 }) {
  return (
    <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden',
        transition: 'transform 0.2s', cursor: 'pointer', background: '#fff'
      }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {movie.poster && (
          <img src={movie.poster} alt={movie.title}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        )}
        <div style={{ padding: '12px' }}>
          <h3 style={{ margin: '0 0 4px' }}>{movie.title}</h3>
          <p style={{ margin: '0 0 4px', color: '#666', fontSize: '14px' }}>{movie.genre} · {movie.year}</p>
          <p style={{ margin: '0 0 4px', color: '#444', fontSize: '13px' }}>
            Reviews {reviewCount}
          </p>
          {movie.rating && <p style={{ margin: 0, color: '#f59e0b' }}>⭐ {movie.rating}</p>}
        </div>
      </div>
    </Link>
  )
}
