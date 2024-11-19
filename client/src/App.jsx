// src/App.js
import React, { useEffect, useState } from "react";
import { fetchHelloMessage } from "./services/api";
import { RouterProvider } from 'react-router-dom';
import "./App.css";
import router from "./router.jsx";

const App = () => {
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   const getMessage = async () => {
  //     const data = await fetchHelloMessage();
  //     if (data) {
  //       setMessage(data.message);
  //     }
  //   };

  //   getMessage();
  // }, []);
  console.log(import.meta.env.VITE_API_URL);

  return (
    <RouterProvider router={router} />
  );
};

export default App; 
