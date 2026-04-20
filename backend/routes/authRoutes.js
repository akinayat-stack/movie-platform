import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' })
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed, role: role || 'user' })
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role })
  } catch {
    res.status(500).json({ message: 'Register failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch {
    res.status(500).json({ message: 'Login failed' })
  }
})

router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json(user)
})

export default router
