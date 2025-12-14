import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SweetCard from '../components/SweetCard';
import api from '../services/api';

function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    filterSweets();
  }, [searchName, searchCategory, minPrice, maxPrice, sweets]);

  const fetchSweets = async () => {
    try {
      const response = await api.get('/api/sweets/');
      setSweets(response.data);
      setFilteredSweets(response.data);
    } catch (error) {
      console.error('Error fetching sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSweets = () => {
    let filtered = [...sweets];

    if (searchName) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchCategory) {
      filtered = filtered.filter(sweet =>
        sweet.category.toLowerCase().includes(searchCategory.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter(sweet => sweet.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(sweet => sweet.price <= parseFloat(maxPrice));
    }

    setFilteredSweets(filtered);
  };

  const handlePurchase = async (sweetId) => {
    try {
      await api.post(`/api/sweets/${sweetId}/purchase`);
      setMessage(' Purchase successful!');
      fetchSweets();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(' ' + (error.response?.data?.detail || 'Purchase failed'));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.loading}>Loading sweets...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Available Sweets</h2>

        {message && <div style={styles.message}>{message}</div>}

        {/* Search & Filter */}
        <div style={styles.filterContainer}>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Search by category..."
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={styles.inputSmall}
          />
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={styles.inputSmall}
          />
          <button
            onClick={() => {
              setSearchName('');
              setSearchCategory('');
              setMinPrice('');
              setMaxPrice('');
            }}
            style={styles.clearButton}
          >
            Clear Filters
          </button>
        </div>

        {/* Sweet Cards */}
        {filteredSweets.length === 0 ? (
          <p style={styles.noResults}>No sweets found matching your criteria.</p>
        ) : (
          <div style={styles.grid}>
            {filteredSweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onPurchase={handlePurchase}
                isAdmin={false}
              />
            ))}
          </div>
        )}
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
  filterContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    minWidth: '200px',
    padding: '10px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
  },
  inputSmall: {
    width: '120px',
    padding: '10px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
  },
  clearButton: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666',
  },
  noResults: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666',
  },
};

export default Dashboard;