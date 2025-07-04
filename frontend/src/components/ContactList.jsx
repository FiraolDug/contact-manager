import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function ContactList({ contacts, onEdit, onDelete }) {
  const contactsArray = Array.isArray(contacts) ? contacts : [];
  console.log('Contacts to display:', contactsArray);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contactsArray.length > 0 ? (
            contactsArray.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.contact_name}</TableCell>
                <TableCell>{contact.contact_email}</TableCell>
                <TableCell>{contact.contact_phone}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(contact.id)} aria-label="edit">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete(contact.id)} aria-label="delete">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No contacts available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
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
