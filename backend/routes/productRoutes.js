import express from 'express'
import Product from '../models/Product.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  const products = await Product.find().populate('category').sort({ createdAt: -1 })
  res.json(products)
})

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.create(req.body)
    const populated = await product.populate('category')
    res.status(201).json(populated)
  } catch {
    res.status(400).json({ message: 'Create product failed' })
  }
})

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('category')
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch {
    res.status(400).json({ message: 'Update product failed' })
  }
})

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  res.json({ message: 'Product deleted' })
})

export default router
