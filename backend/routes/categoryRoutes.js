import express from 'express'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 })
  res.json(categories)
})

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json(category)
  } catch {
    res.status(400).json({ message: 'Create category failed' })
  }
})

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.json(category)
  } catch {
    res.status(400).json({ message: 'Update category failed' })
  }
})

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id)
  if (!category) {
    return res.status(404).json({ message: 'Category not found' })
  }
  await Product.deleteMany({ category: req.params.id })
  res.json({ message: 'Category deleted' })
})

export default router
