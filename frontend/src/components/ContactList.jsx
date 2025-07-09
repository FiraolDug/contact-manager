import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  Typography,
  Chip
} from '@mui/material';
import { Edit, Delete, Search, Sort } from '@mui/icons-material';

export default function ContactList({ contacts, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const contactsArray = Array.isArray(contacts) ? contacts : [];

  // Filter and sort contacts
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contactsArray.filter(contact => {
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.contact_name?.toLowerCase().includes(searchLower) ||
        contact.contact_email?.toLowerCase().includes(searchLower) ||
        contact.contact_phone?.toLowerCase().includes(searchLower)
      );
    });

    // Sort contacts
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [contactsArray, searchTerm, sortBy, sortOrder]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  return (
    <Box>
      {/* Search and Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Search contacts"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <MenuItem value="contact_name">Name</MenuItem>
            <MenuItem value="contact_email">Email</MenuItem>
            <MenuItem value="contact_phone">Phone</MenuItem>
          </Select>
        </FormControl>

        <Chip
          label={`${sortOrder === 'asc' ? '↑' : '↓'} ${sortBy.replace('contact_', '')}`}
          color="primary"
          variant="outlined"
          icon={<Sort />}
        />
      </Box>

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredAndSortedContacts.length} of {contactsArray.length} contacts
      </Typography>

      {/* Contacts Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedContacts.length > 0 ? (
              filteredAndSortedContacts.map((contact) => (
                <TableRow key={contact.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{contact.contact_name}</TableCell>
                  <TableCell>{contact.contact_email}</TableCell>
                  <TableCell>{contact.contact_phone || '-'}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => onEdit(contact.id)} 
                      aria-label="edit"
                      color="primary"
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={() => onDelete(contact.id)} 
                      aria-label="delete"
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {searchTerm ? 'No contacts found matching your search.' : 'No contacts available.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

ContactList.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      contact_name: PropTypes.string,
      contact_email: PropTypes.string,
      contact_phone: PropTypes.string,
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

ContactList.defaultProps = {
  contacts: [],
};
