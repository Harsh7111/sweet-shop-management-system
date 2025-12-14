import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SweetCard from '../components/SweetCard';
import api from '../services/api';

function AdminPanel() {
  const [sweets, setSweets] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [message, setMessage] = useState('');
  const [restockId, setRestockId] = useState('');
  const [restockQty, setRestockQty] = useState('');

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const response = await api.get('/api/sweets/');
      setSweets(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSweet) {
        await api.put(`/api/sweets/${editingSweet.id}`, formData);
        setMessage(' Sweet updated successfully!');
      } else {
        await api.post('/api/sweets/', formData);
        setMessage(' Sweet added successfully!');
      }
      
      resetForm();
      fetchSweets();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(' ' + (error.response?.data?.detail || 'Operation failed'));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;
    
    try {
      await api.delete(`/api/sweets/${id}`);
      setMessage(' Sweet deleted successfully!');
      fetchSweets();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(' ' + (error.response?.data?.detail || 'Delete failed'));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
    });
    setShowAddForm(true);
  };

  const handleRestock = async () => {
    if (!restockId || !restockQty) {
      setMessage(' Please select a sweet and enter quantity');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      await api.post(`/api/sweets/${restockId}/restock?quantity=${restockQty}`);
      setMessage('Restocked successfully!');
      setRestockId('');
      setRestockQty('');
      fetchSweets();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(' ' + (error.response?.data?.detail || 'Restock failed'));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: '', price: '', quantity: '' });
    setEditingSweet(null);
    setShowAddForm(false);
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}> Admin Panel</h2>

        {message && <div style={styles.message}>{message}</div>}

        {/* Add/Edit Sweet Form */}
        <div style={styles.section}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={styles.toggleButton}
          >
            {showAddForm ? ' Cancel' : 'Add New Sweet'}
          </button>

          {showAddForm && (
            <form onSubmit={handleSubmit} style={styles.form}>
              <h3>{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</h3>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                style={styles.input}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                style={styles.input}
              />
              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                style={styles.input}
              />
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.submitButton}>
                  {editingSweet ? 'Update' : '➕ Add'}
                </button>
                <button type="button" onClick={resetForm} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Restock Section */}
        <div style={styles.section}>
          <h3>Restock Sweet</h3>
          <div style={styles.restockForm}>
            <select
              value={restockId}
              onChange={(e) => setRestockId(e.target.value)}
              style={styles.select}
            >
              <option value="">Select a sweet</option>
              {sweets.map(sweet => (
                <option key={sweet.id} value={sweet.id}>
                  {sweet.name} (Current: {sweet.quantity})
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity to add"
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
              style={styles.inputSmall}
            />
            <button onClick={handleRestock} style={styles.restockButton}>
              Restock
            </button>
          </div>
        </div>

        {/* Sweets List */}
        <div style={styles.section}>
          <h3>All Sweets</h3>
          {sweets.length === 0 ? (
            <p style={styles.noSweets}>No sweets available. Add one above!</p>
          ) : (
            <div style={styles.grid}>
              {sweets.map((sweet) => (
                <SweetCard
                  key={sweet.id}
                  sweet={sweet}
                  isAdmin={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  title: {
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center',
  },
  message: {
    background: '#e8f5e9',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  toggleButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  form: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
  },
  inputSmall: {
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    width: '150px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  submitButton: {
    flex: 1,
    background: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    background: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  restockForm: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginTop: '15px',
    flexWrap: 'wrap',
  },
  select: {
    flex: 1,
    minWidth: '250px',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
  },
  restockButton: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  noSweets: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '16px',
  },
};

export default AdminPanel;