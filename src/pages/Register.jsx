import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material'
import api from '../api'
import { useNotify } from '../components/NotificationProvider'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const navigate = useNavigate()
  const notify = useNotify()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', form)
      notify('Register successful')
      navigate('/login')
    } catch (error) {
      notify(error.response?.data?.message || 'Register failed', 'error')
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 420, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Register</Typography>
      <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <TextField select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        <Button type="submit" variant="contained">Register</Button>
      </Box>
      <Typography sx={{ mt: 2 }}>Have an account? <Link to="/login">Login</Link></Typography>
    </Paper>
  )
}

export default Register
