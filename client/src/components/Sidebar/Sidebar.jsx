import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
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

  useEffect(() => {
    const layoutElement = document.getElementById("layout");
    if (layoutElement) {
      if (collapsed) {
        layoutElement.classList.add("closed");
      } else {
        layoutElement.classList.remove("closed");
      }
    }
  }, [collapsed]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const HandleProjects = () => {
    navigate("/projects");
  };

  const HandleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <Layout id="layout">
      <Sider collapsed={collapsed} className="sidebar">
        <div className="menu-icon-container" onClick={handleToggleCollapse}>
          <MenuIcon className="menu-icon" />
        </div>
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
              <Menu.Item key="logout" icon={<LogoutIcon />} onClick={handleLogout}>
                Log Out
              </Menu.Item>
            </Menu>
          </div>
        </div>
      </Sider>
    </Layout>
  );
};

export default Sidebar;
