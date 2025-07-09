import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contactAPI } from '../api/api';
import ContactForm from '../components/ContactForm';
import { Paper, Typography, Alert, CircularProgress, Box } from '@mui/material';

export default function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await contactAPI.getById(id);
        setContact(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Contact not found');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      await contactAPI.update(id, data);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update contact');
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
      <Paper elevation={3} style={{ padding: '24px', maxWidth: '500px', margin: '40px auto' }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  if (!contact) return null;

  return (
    <Paper elevation={3} style={{ padding: '24px', maxWidth: '500px', margin: '40px auto' }}>
      <Typography variant="h5" gutterBottom>
        Edit Contact
      </Typography>
      <ContactForm initialData={contact} onSubmit={handleSubmit} />
    </Paper>
  );
}
