import express from 'express'
import mongoose from 'mongoose'
import Movie from '../models/Movie.js'
import Review from '../models/Review.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort({ createdAt: -1 })
  const response = movies.map(movie => ({ id: movie._id.toString(), ...movie.toObject(), _id: undefined }))
  res.json(response)
})

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid movie id' })
  }

  const movie = await Movie.findById(req.params.id)
  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const reviews = await Review.find({ movieId: movie._id }).sort({ createdAt: -1 })
  const mappedReviews = reviews.map(review => ({ id: review._id.toString(), ...review.toObject(), _id: undefined }))

  res.json({ id: movie._id.toString(), ...movie.toObject(), _id: undefined, reviews: mappedReviews })
})

router.post('/', async (req, res) => {
  try {
    const movie = await Movie.create(req.body)
    res.status(201).json({ id: movie._id.toString(), ...movie.toObject(), _id: undefined })
  } catch {
    res.status(400).json({ message: 'Create movie failed' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    res.json({ id: movie._id.toString(), ...movie.toObject(), _id: undefined })
  } catch {
    res.status(400).json({ message: 'Update movie failed' })
  }
})

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id)
  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' })
  }
  await Review.deleteMany({ movieId: movie._id })
  res.json({ message: 'Movie deleted' })
})

export default router
