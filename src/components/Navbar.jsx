import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav style={{ padding: '1rem', background: '#222', color: '#fff', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Link to="/movies" style={{ color: '#fff' }}>Movies</Link>
      {user ? (
        <>
          <Link to="/profile" style={{ color: '#fff' }}>Profile</Link>
          {user.role === 'admin' && <Link to="/admin" style={{ color: '#fff' }}>Admin</Link>}
          <button onClick={() => { logout(); navigate('/movies') }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: '#fff' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff' }}>Register</Link>
        </>
      )}
    </nav>
  )
}