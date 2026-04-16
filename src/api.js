const BASE = 'http://localhost:3001'

const asString = (value) => String(value ?? '')

const normalizeReview = (review) => {
  const movieId = review.movieId ?? review.movie_id
  const userId = review.userId ?? review.user_id
  return {
    ...review,
    movieId: asString(movieId),
    movie_id: asString(movieId),
    userId: asString(userId),
    user_id: asString(userId),
    rating: Number(review.rating) || 0,
    text: review.text || '',
  }
}

const dedupeById = (items) => {
  const map = new Map()
  items.forEach(item => map.set(item.id, item))
  return [...map.values()]
}

const parseResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  if (response.status === 204) return null
  return response.json()
}

export const api = {
  get: (path) => fetch(`${BASE}${path}`).then(parseResponse),
  post: (path, body) => fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(parseResponse),
  put: (path, body) => fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(parseResponse),
  patch: (path, body) => fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(parseResponse),
  delete: (path) => fetch(`${BASE}${path}`, { method: 'DELETE' }).then(parseResponse),

  getAllReviews: async () => {
    const reviews = await api.get('/reviews')
    return reviews.map(normalizeReview)
  },

  getMovieReviews: async (movieId) => {
    const key = asString(movieId)
    const [byMovieId, byMovieIdSnake] = await Promise.all([
      api.get(`/reviews?movieId=${encodeURIComponent(key)}`).catch(() => []),
      api.get(`/reviews?movie_id=${encodeURIComponent(key)}`).catch(() => []),
    ])
    return dedupeById([...byMovieId, ...byMovieIdSnake])
      .map(normalizeReview)
      .filter(review => review.movieId === key)
  },

  getUserReviews: async (userId) => {
    const key = asString(userId)
    const [byUserId, byUserIdSnake] = await Promise.all([
      api.get(`/reviews?userId=${encodeURIComponent(key)}`).catch(() => []),
      api.get(`/reviews?user_id=${encodeURIComponent(key)}`).catch(() => []),
    ])
    return dedupeById([...byUserId, ...byUserIdSnake])
      .map(normalizeReview)
      .filter(review => review.userId === key)
  },

  createReview: async ({ movieId, userId, text, rating, date }) => {
    const payload = {
      movieId: asString(movieId),
      movie_id: asString(movieId),
      userId: asString(userId),
      user_id: asString(userId),
      text,
      rating: Number(rating),
      date,
    }
    const created = await api.post('/reviews', payload)
    return normalizeReview(created)
  },
}
