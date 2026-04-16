import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bcrypt from 'bcryptjs'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (!form.username || !form.email || !form.password) {
      return setError('All fields are required.')
    }
    if (form.password !== form.confirm) {
      return setError('Passwords do not match.')
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }

    setLoading(true)
    try {
      const existing = await api.get(`/users?email=${form.email}`)
      if (existing.length > 0) {
        return setError('Email already registered.')
      }

      const hashed = await bcrypt.hash(form.password, 10)
      const newUser = await api.post('/users', {
        username: form.username,
        email: form.email,
        password: hashed,
        role: 'user',
      })

      const { password: _, ...safeUser } = newUser
      login(safeUser)
      navigate('/movies')
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Join and start reviewing films</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              className="form-control"
              name="username"
              placeholder="e.g. cinephile42"
              value={form.username}
              onChange={handleChange}
            />
          </div>

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
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              className="form-control"
              type="password"
              name="confirm"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
