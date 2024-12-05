import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import GradeIcon from '@mui/icons-material/Grade';
import "./Sidebar.css";
import {rolesConfig} from "../../config/rolesConfig.jsx";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('name');
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

  const handleNavigation = (path) => navigate(path);
  // Array-ul de obiecte pentru `Menu`
  const menuItemsTop = Object.keys(rolesConfig)
      .filter((key) => key !== "projectdetails") // Exclude "Project Details"
      .map((key) => {
        const config = rolesConfig[key];
        return {
          key,
          icon: config.icon || <MenuIcon />, // Default icon
          label: !collapsed && config.label,
          onClick: () => handleNavigation(config.path),
          roles: config.roles,
        };
      });

  const menuItemsBottom = [
    {
      key: 'logout',
      icon: <LogoutIcon />,
      label: 'Log Out',
      onClick: handleLogout,
    },

  ];
  const userRole = localStorage.getItem('role');
  const filteredMenuItems = menuItemsTop.filter(item =>
      !item.roles || item.roles.includes(userRole) // Include if no roles are specified
  );
  return (
    <Layout id="layout">
      <Sider collapsed={collapsed} className="sidebar">
        <div className="menu-icon-container" onClick={handleToggleCollapse}>
          <MenuIcon className="menu-icon" />
        </div>
        <div className="menu-container">
          <Menu theme="dark" mode="inline" items={filteredMenuItems} />
        </div>
        <div className="bottom-items">
          <div className="account">
            <AccountBoxIcon />
            {!collapsed && <span>{username}</span>}
          </div>
          <Menu theme="dark" mode="inline" items={menuItemsBottom} />
        </div>
      </Sider>
    </Layout>
  );
};

export default Sidebar;
