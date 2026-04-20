import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material'
import api from '../api'
import { setAuth } from '../redux/authReducer'
import { useNotify } from '../components/NotificationProvider'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const notify = useNotify()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', form)
      dispatch(setAuth(data))
      notify('Login successful')
      navigate('/')
    } catch (error) {
      notify(error.response?.data?.message || 'Login failed', 'error')
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 420, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>
      <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" variant="contained">Login</Button>
      </Box>
      <Typography sx={{ mt: 2 }}>No account? <Link to="/register">Register</Link></Typography>
    </Paper>
  )
}

export default Login
