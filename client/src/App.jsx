// src/App.js
import React, { useEffect, useState } from 'react';
import { fetchHelloMessage } from './services/api';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getMessage = async () => {
      const data = await fetchHelloMessage();
      if (data) {
        setMessage(data.message);
      }
    };

    getMessage();
  }, []);

  return (
    <div>
      <h1>React Frontend Cristin 2</h1>
      <p>Message from backend: {message}</p>
    </div>
  );
};

export default App;
