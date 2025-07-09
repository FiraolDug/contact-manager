import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { contactAPI } from '../api/api';
import ContactList from '../components/ContactList';
import { Paper, Typography, Button, Alert, CircularProgress, Box } from '@mui/material';

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await contactAPI.getAll();
      setContacts(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // This effect refetches contacts when the location changes to '/'
  useEffect(() => {
    if (location.pathname === '/') {
      fetchContacts();
    }
  }, [location.pathname]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactAPI.delete(id);
        setContacts((prev) => prev.filter(contact => contact.id !== id));
      } catch (err) {
        alert(err.response?.data?.error || 'Delete failed');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} style={{ padding: '32px', maxWidth: '900px', margin: '40px auto' }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} style={{ padding: '32px', maxWidth: '900px', margin: '40px auto', borderRadius: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Typography variant="h4" component="h1">My Contacts</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/add')}>
          Add Contact
        </Button>
      </div>
      <ContactList 
        contacts={contacts} 
        onEdit={(id) => navigate(`/edit/${id}`)} 
        onDelete={handleDelete} 
      />
    </Paper>
  );
}
