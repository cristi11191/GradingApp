// src/api.js
const API_BASE_URL = 'https://gradingapp-qfjw.onrender.com';//'http://localhost:5000';

export const fetchHelloMessage = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/hello`);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
