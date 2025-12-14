function SweetCard({ sweet, onPurchase, isAdmin, onEdit, onDelete }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.name}>{sweet.name}</h3>
        <span style={styles.category}>{sweet.category}</span>
      </div>
      
      <div style={styles.body}>
        <div style={styles.priceRow}>
          <span style={styles.priceLabel}>Price:</span>
          <span style={styles.price}>${sweet.price}</span>
        </div>
        
        <div style={styles.stockRow}>
          <span style={styles.stockLabel}>Stock:</span>
          <span style={sweet.quantity > 0 ? styles.inStock : styles.outStock}>
            {sweet.quantity} available
          </span>
        </div>
      </div>
      
      <div style={styles.footer}>
        {!isAdmin && (
          <button
            onClick={() => onPurchase(sweet.id)}
            disabled={sweet.quantity === 0}
            style={sweet.quantity === 0 ? styles.buttonDisabled : styles.button}
          >
            {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
          </button>
        )}
        
        {isAdmin && (
          <>
            <button onClick={() => onEdit(sweet)} style={styles.editButton}>
              Edit
            </button>
            <button onClick={() => onDelete(sweet.id)} style={styles.deleteButton}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  header: {
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '10px',
    marginBottom: '15px',
  },
  name: {
    margin: '0 0 5px 0',
    color: '#333',
  },
  category: {
    background: '#667eea',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  body: {
    marginBottom: '15px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  priceLabel: {
    color: '#666',
  },
  price: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#667eea',
  },
  stockRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  stockLabel: {
    color: '#666',
  },
  inStock: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  outStock: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  footer: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    flex: 1,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    flex: 1,
    background: '#ccc',
    color: '#666',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'not-allowed',
    fontWeight: 'bold',
  },
  editButton: {
    flex: 1,
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default SweetCard;