import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'

const ConfirmDialog = ({ open, title, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>Are you sure?</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
