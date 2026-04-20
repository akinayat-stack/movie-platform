import { createContext, useContext, useState } from 'react'
import { Snackbar, Alert } from '@mui/material'

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const [state, setState] = useState({ open: false, message: '', severity: 'success' })

  const notify = (message, severity = 'success') => {
    setState({ open: true, message, severity })
  }

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={2500}
        onClose={() => setState((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={state.severity} variant="filled" sx={{ width: '100%' }}>
          {state.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

export const useNotify = () => useContext(NotificationContext)
