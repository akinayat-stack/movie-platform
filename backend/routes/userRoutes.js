import express from 'express'
import User from '../models/User.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const users = await User.find().select('_id name email role').sort({ createdAt: -1 })
  const response = users.map(user => ({
    id: user._id.toString(),
    username: user.name,
    name: user.name,
    email: user.email,
    role: user.role
  }))
  res.json(response)
})

router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json({ message: 'User deleted' })
})

export default router
