import { useState } from 'react';
import { TextField, Button, Paper, Typography, Alert } from '@mui/material';

export default function ContactForm({ initialData = {}, onSubmit, loading }) {
  const [name, setName] = useState(initialData.contact_name || '');
  const [email, setEmail] = useState(initialData.contact_email || '');
  const [phone, setPhone] = useState(initialData.contact_phone || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    setError('');
    onSubmit({
      contact_name: name,
      contact_email: email,
      contact_phone: phone,
    });
  };

  return (
    <Paper elevation={3} style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom>
        {initialData.contact_name ? 'Edit Contact' : 'Add Contact'}
      </Typography>
      {error && <Alert severity="error" style={{ marginBottom: 16 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          style={{ marginTop: 20 }}
        >
          {loading ? 'Saving...' : 'Save Contact'}
        </Button>
      </form>
    </Paper>
  );
}
