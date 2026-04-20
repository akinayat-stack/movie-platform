import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { clearAuth } from './redux/authReducer'
import { NotificationProvider, useNotify } from './components/NotificationProvider'

const Layout = () => {
  const { token, user } = useSelector((state) => state.authReducer)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const notify = useNotify()

  const logout = () => {
    dispatch(clearAuth())
    notify('Logged out')
    navigate('/login')
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ flex: 1 }}>Simple Shop</Typography>
          {!token && <Button color="inherit" component={Link} to="/login">Login</Button>}
          {!token && <Button color="inherit" component={Link} to="/register">Register</Button>}
          {token && <Typography sx={{ mr: 2 }}>{user?.name} ({user?.role})</Typography>}
          {token && <Button color="inherit" onClick={logout}>Logout</Button>}
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/" replace />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? <Navigate to="/admin" replace /> : <UserDashboard />}
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </>
  )
}

const App = () => (
  <NotificationProvider>
    <Layout />
  </NotificationProvider>
)

export default App
