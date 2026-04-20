import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Paper, Typography } from '@mui/material'
import api from '../api'
import { setCategories, setProducts } from '../redux/dataReducer'
import { useNotify } from '../components/NotificationProvider'

const UserDashboard = () => {
  const dispatch = useDispatch()
  const notify = useNotify()
  const { categories, products } = useSelector((state) => state.dataReducer)

  useEffect(() => {
    const load = async () => {
      try {
        const [c, p] = await Promise.all([api.get('/categories'), api.get('/products')])
        dispatch(setCategories(c.data))
        dispatch(setProducts(p.data))
        notify('Data loaded')
      } catch {
        notify('Load failed', 'error')
      }
    }
    load()
  }, [])

  return (
    <Box sx={{ mt: 3, display: 'grid', gap: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Categories</Typography>
        {categories.map((c) => <Typography key={c._id}>{c.name}</Typography>)}
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Products</Typography>
        {products.map((p) => <Typography key={p._id}>{p.name} - ${p.price} - {p.category?.name}</Typography>)}
      </Paper>
    </Box>
  )
}

export default UserDashboard
