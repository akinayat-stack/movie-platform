import express from 'express'
import mongoose from 'mongoose'
import Review from '../models/Review.js'
import Movie from '../models/Movie.js'
import User from '../models/User.js'

const router = express.Router()

const toResponse = review => ({ id: review._id.toString(), ...review.toObject(), _id: undefined })

router.get('/', async (req, res) => {
  const filter = {}
  if (req.query.movieId) {
    if (!mongoose.Types.ObjectId.isValid(req.query.movieId)) {
      return res.status(400).json({ message: 'Invalid movie id' })
    }
    filter.movieId = req.query.movieId
  }
  if (req.query.userId) {
    if (!mongoose.Types.ObjectId.isValid(req.query.userId)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }
    filter.userId = req.query.userId
  }

  const reviews = await Review.find(filter).sort({ createdAt: -1 })
  res.json(reviews.map(toResponse))
})

router.post('/', async (req, res) => {
  try {
    const { movieId, userId, text, rating, date } = req.body
    if (!movieId || !userId || !text || !rating || !date) {
      return res.status(400).json({ message: 'movieId, userId, text, rating and date are required' })
    }
    if (!mongoose.Types.ObjectId.isValid(movieId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid movieId or userId' })
    }
    const [movie, user] = await Promise.all([Movie.findById(movieId), User.findById(userId)])
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const review = await Review.create({ movieId, userId, text, rating, date })
    res.status(201).json(toResponse(review))
  } catch {
    res.status(400).json({ message: 'Create review failed' })
  }
})

router.delete('/:id', async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id)
  if (!review) {
    return res.status(404).json({ message: 'Review not found' })
  }
  res.json({ message: 'Review deleted' })
})

export default router
