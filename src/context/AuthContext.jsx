import { createContext, useContext, useReducer, useEffect } from 'react'

const AuthContext = createContext(null)

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, loading: false }
    case 'LOGOUT':
      return { ...state, user: null, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
  })

  useEffect(() => {
    const stored = localStorage.getItem('cinereview_user')
    if (stored) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(stored) })
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const login = (user) => {
    localStorage.setItem('cinereview_user', JSON.stringify(user))
    dispatch({ type: 'LOGIN', payload: user })
  }

  const logout = () => {
    localStorage.removeItem('cinereview_user')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ user: state.user, loading: state.loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
