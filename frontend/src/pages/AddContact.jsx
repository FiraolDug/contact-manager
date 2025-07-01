import { useNavigate } from 'react-router-dom';
import api  from '../api/api';
import ContactForm from '../components/ContactForm';

export default function AddContact() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await api.post('/contacts', data);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create contact');
    }
  };

  return (
    <>
      <h2>Add Contact</h2>
      <ContactForm onSubmit={handleSubmit} />
    </>
  );
}
