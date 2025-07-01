import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import  api  from '../api/api';
import ContactForm from '../components/ContactForm';

export default function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/contacts/${id}`)
      .then(res => setContact(res.data))
      .catch(() => {
        alert('Contact not found');
        navigate('/');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      await api.put(`/contacts/${id}`, data);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update contact');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!contact) return null;

  return (
    <>
      <h2>Edit Contact</h2>
      <ContactForm initialData={contact} onSubmit={handleSubmit} />
    </>
  );
}
