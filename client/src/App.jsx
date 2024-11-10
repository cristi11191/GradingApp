// src/App.js
import React, { useEffect, useState } from "react";
import { fetchHelloMessage } from "./services/api";
import { Layout } from "antd";

const { Header, Sider } = Layout;
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
    <Layout>
      <Sider className="sidebar">sidebar</Sider>
    </Layout>
  );
};

export default App;
