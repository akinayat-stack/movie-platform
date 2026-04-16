import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import bcrypt from 'bcryptjs'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/movies'

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Both fields are required.')

    setLoading(true)
    try {
      const users = await api.get(`/users?email=${form.email}`)
      if (users.length === 0) return setError('Invalid email or password.')

      const user = users[0]
      const match = await bcrypt.compare(form.password, user.password)
      if (!match) return setError('Invalid email or password.')

      const { password: _, ...safeUser } = user
      login(safeUser)
      navigate(from, { replace: true })
    } catch {
      setError('Something went wrong. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card fade-in">
        <div className="auth-header">
          <div className="auth-logo">▶ CINEREVIEW</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-sub">Sign in to your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="demo-creds">
          <p className="demo-label">Demo credentials</p>
          <p><strong>Admin:</strong> admin@cinema.com / password</p>
          <p><strong>User:</strong> john@example.com / password</p>
        </div>

        <p className="auth-footer">
          No account? <Link to="/register" className="auth-link">Register</Link>
        </p>
      </div>
    </div>
  )
}
