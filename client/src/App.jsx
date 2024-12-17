// src/App.js
import React, { useEffect, useState } from "react";
import { RouterProvider } from 'react-router-dom';
import "./App.css";
import router from "./router.jsx";

const App = () => {
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
  }
  return (
    <RouterProvider router={router} />
  );
};

export default App; 
