export default function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star}
          onClick={() => !readOnly && onChange && onChange(star)}
          style={{
            fontSize: '24px', cursor: readOnly ? 'default' : 'pointer',
            color: star <= value ? '#f59e0b' : '#d1d5db'
          }}
        >★</span>
      ))}
    </div>
  )
} 
