import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import "./Sidebar.css";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const HandleProjects = () =>{
    navigate("/projects");
  }
  const HandleDashboard = () =>{
    navigate("/dashboard");
  }

  // const toggleCollapse = () => {
  //   setCollapsed(!collapsed);
  // };

  return (
    <Layout>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} className="sidebar">
        <HomeIcon className="homeIcon" />
        <div className="menu-container">
          <Menu theme="dark" mode="inline">
            <Menu.Item key="dashboard" icon={<DashboardIcon />} onClick={HandleDashboard}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="myproject" icon={<AssignmentIcon />}>
              My Project
            </Menu.Item>
            <Menu.Item key="projects" icon={<FolderIcon />} onClick={HandleProjects}>
              Projects
            </Menu.Item>
          </Menu>
        </div>
        <div className="bottom-items">
          <div className="account">
            <AccountBoxIcon />
            {!collapsed && <span>User</span>}
            <Menu theme="dark" mode="inline" className="menu-logout">
              <Menu.Item key="logout" icon={<LogoutIcon />}  onClick={handleLogout}>
                Log Out
              </Menu.Item>
            </Menu>
          </div>
        </div>
      </Sider>
      {/*<button onClick={toggleCollapse} className="toggle-button">*/}
      {/*  {collapsed ? "Expand" : "Collapse"}*/}
      {/*</button>*/}
    </Layout>
  );
};

export default Sidebar;
