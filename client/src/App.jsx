// src/App.js
import React, { useEffect, useState } from "react";
import { RouterProvider } from 'react-router-dom';
import "./App.css";
import router from "./router.jsx";

const App = () => {

  return (
    <RouterProvider router={router} />
  );
};

export default App; 
