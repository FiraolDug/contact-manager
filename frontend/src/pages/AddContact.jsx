import React from 'react';
import { useNavigate } from 'react-router-dom';
import { contactAPI } from '../api/api';
import ContactForm from '../components/ContactForm';
import { Paper, Typography } from '@mui/material';

export default function AddContact() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await contactAPI.create(data);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create contact');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '24px', maxWidth: '500px', margin: '40px auto' }}>
      <Typography variant="h5" gutterBottom>
        Add Contact
      </Typography>
      <ContactForm onSubmit={handleSubmit} />
    </Paper>
  );
}
