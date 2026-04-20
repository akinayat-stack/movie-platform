import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material'
import api from '../api'
import { setCategories, setProducts } from '../redux/dataReducer'
import { useNotify } from '../components/NotificationProvider'
import ConfirmDialog from '../components/ConfirmDialog'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const notify = useNotify()
  const { categories, products } = useSelector((state) => state.dataReducer)
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', id: null })
  const [productForm, setProductForm] = useState({ name: '', price: '', category: '', id: null })
  const [deleteState, setDeleteState] = useState({ open: false, type: '', id: '' })

  const loadData = async () => {
    try {
      const [c, p] = await Promise.all([api.get('/categories'), api.get('/products')])
      dispatch(setCategories(c.data))
      dispatch(setProducts(p.data))
    } catch {
      notify('Load failed', 'error')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const saveCategory = async (e) => {
    e.preventDefault()
    try {
      if (categoryForm.id) {
        await api.put(`/categories/${categoryForm.id}`, { name: categoryForm.name, description: categoryForm.description })
        notify('Category updated')
      } else {
        await api.post('/categories', { name: categoryForm.name, description: categoryForm.description })
        notify('Category created')
      }
      setCategoryForm({ name: '', description: '', id: null })
      loadData()
    } catch (error) {
      notify(error.response?.data?.message || 'Save category failed', 'error')
    }
  }

  const saveProduct = async (e) => {
    e.preventDefault()
    try {
      const payload = { name: productForm.name, price: Number(productForm.price), category: productForm.category }
      if (productForm.id) {
        await api.put(`/products/${productForm.id}`, payload)
        notify('Product updated')
      } else {
        await api.post('/products', payload)
        notify('Product created')
      }
      setProductForm({ name: '', price: '', category: '', id: null })
      loadData()
    } catch (error) {
      notify(error.response?.data?.message || 'Save product failed', 'error')
    }
  }

  const confirmDelete = async () => {
    try {
      if (deleteState.type === 'category') {
        await api.delete(`/categories/${deleteState.id}`)
        notify('Category deleted')
      }
      if (deleteState.type === 'product') {
        await api.delete(`/products/${deleteState.id}`)
        notify('Product deleted')
      }
      setDeleteState({ open: false, type: '', id: '' })
      loadData()
    } catch (error) {
      notify(error.response?.data?.message || 'Delete failed', 'error')
    }
  }

  return (
    <Box sx={{ display: 'grid', gap: 3, mt: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Manage Categories</Typography>
        <Box component="form" onSubmit={saveCategory} sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          <TextField label="Name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
          <TextField label="Description" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
          <Button type="submit" variant="contained">{categoryForm.id ? 'Update' : 'Create'}</Button>
        </Box>
        {categories.map((c) => (
          <Box key={c._id} sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
            <Typography sx={{ flex: 1 }}>{c.name} - {c.description}</Typography>
            <Button size="small" onClick={() => setCategoryForm({ id: c._id, name: c.name, description: c.description })}>Edit</Button>
            <Button size="small" color="error" onClick={() => setDeleteState({ open: true, type: 'category', id: c._id })}>Delete</Button>
          </Box>
        ))}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Manage Products</Typography>
        <Box component="form" onSubmit={saveProduct} sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          <TextField label="Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
          <TextField label="Price" type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
          <TextField select label="Category" sx={{ minWidth: 160 }} value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
            {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
          </TextField>
          <Button type="submit" variant="contained">{productForm.id ? 'Update' : 'Create'}</Button>
        </Box>
        {products.map((p) => (
          <Box key={p._id} sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
            <Typography sx={{ flex: 1 }}>{p.name} - ${p.price} - {p.category?.name}</Typography>
            <Button size="small" onClick={() => setProductForm({ id: p._id, name: p.name, price: p.price, category: p.category?._id || '' })}>Edit</Button>
            <Button size="small" color="error" onClick={() => setDeleteState({ open: true, type: 'product', id: p._id })}>Delete</Button>
          </Box>
        ))}
      </Paper>

      <ConfirmDialog
        open={deleteState.open}
        title={`Delete ${deleteState.type}`}
        onClose={() => setDeleteState({ open: false, type: '', id: '' })}
        onConfirm={confirmDelete}
      />
    </Box>
  )
}

export default AdminDashboard
