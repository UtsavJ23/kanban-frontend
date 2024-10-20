import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5225/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`
});

export const fetchTickets = async () => {
  try {
    const response = await api.get('/tickets');
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error.response?.data || error.message);
    throw new Error('Failed to fetch tickets');
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message);
    throw new Error('Failed to fetch users');
  }
};

export const createTicket = async (ticketData) => {
  try {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error.response?.data || error.message);
    throw new Error('Failed to create ticket');
  }
};

export const updateTicket = async (ticketId, ticketData) => {
  try {
    const response = await api.patch(`/tickets/${ticketId}`, ticketData);
    return response.data;
  } catch (error) {
    console.error('Error updating ticket:', error.response?.data || error.message);
    throw new Error('Failed to update ticket');
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    await api.delete(`/tickets/${ticketId}`);
  } catch (error) {
    console.error('Error deleting ticket:', error.response?.data || error.message);
    throw new Error('Failed to delete ticket');
  }
};