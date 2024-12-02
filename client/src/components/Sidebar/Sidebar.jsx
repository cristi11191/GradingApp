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

  const HandleProjects = () => {
    navigate("/projects");
  };
  const HandleMyProject = () => {
    navigate("/myproject");
  };

  const HandleDashboard = () => {
    navigate("/dashboard");
  };

  const HandleEvaluation=()=>{
    navigate("/evaluation");
  }

  // Array-ul de obiecte pentru `Menu`
  const menuItemsTop = [
    {
      key: 'dashboard',
      icon: <DashboardIcon />,
      label: 'Dashboard',
      onClick: HandleDashboard,
    },
    {
      key: 'myproject',
      icon: <AssignmentIcon />,
      label: 'My Project',
      onClick: HandleMyProject,
    },
    {
      key: 'projects',
      icon: <FolderIcon />,
      label: 'Projects',
      onClick: HandleProjects,
    },
    {
      key: 'evaluation',
      icon: <GradeIcon />,
      label: 'Evaluation',
      onClick: HandleEvaluation,
    },
    
  ];
  const menuItemsBottom=[
    {
      key: 'logout',
      icon: <LogoutIcon />,
      label: 'Log Out',
      onClick: handleLogout,
    },

  ];
  return (
    <Layout id="layout">
      <Sider collapsed={collapsed} className="sidebar">
        <div className="menu-icon-container" onClick={handleToggleCollapse}>
          <MenuIcon className="menu-icon" />
        </div>
        <div className="menu-container">
          <Menu theme="dark" mode="inline" items={menuItemsTop} />
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
