// src/App.js
import React, { useEffect, useState } from "react";
import { fetchHelloMessage } from "./services/api";
import { Layout } from "antd";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";

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

  return <Sidebar />;
};

export default App;
