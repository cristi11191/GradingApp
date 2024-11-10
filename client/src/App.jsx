// src/App.js
import React, { useEffect, useState } from "react";
import { fetchHelloMessage } from "./services/api";

const App = () => {
  const [message, setMessage] = useState("");

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
      <h1>React Frontend</h1>
      <h2>My first committ Gladissss😋</h2>
      <h1> Cristinel </h1>
      <p>Message from backend: {message}</p>
    </div>
  );
};

export default App;
