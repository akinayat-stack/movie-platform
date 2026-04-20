import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:5000/api'
})

client.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const request = async config => {
  const { data } = await client.request(config)
  return data
}

export const api = {
  get: (url, config) => request({ method: 'get', url, ...config }),
  post: (url, data, config) => request({ method: 'post', url, data, ...config }),
  put: (url, data, config) => request({ method: 'put', url, data, ...config }),
  delete: (url, config) => request({ method: 'delete', url, ...config }),
  getAllReviews: () => request({ method: 'get', url: '/reviews' }),
  getMovieReviews: movieId => request({ method: 'get', url: '/reviews', params: { movieId } }),
  getUserReviews: userId => request({ method: 'get', url: '/reviews', params: { userId } }),
  createReview: payload => request({ method: 'post', url: '/reviews', data: payload })
}

export default client
