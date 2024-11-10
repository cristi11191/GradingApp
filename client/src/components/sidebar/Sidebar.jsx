import React from "react";
import { Layout, Menu } from "antd";
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderIcon from '@mui/icons-material/Folder';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import "./Sidebar.css";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Layout>
      <Sider className="sidebar">
        <HomeIcon className="homeIcon" />
        <div className="menu-container">
          <Menu theme="dark" mode="inline">
            <Menu.Item key="dashboard" icon={<DashboardIcon />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="myproject" icon={<AssignmentIcon />}>
              My Project
            </Menu.Item>
            <Menu.Item key="projects" icon={<FolderIcon />}>
              Projects
            </Menu.Item>
          </Menu>
        </div>
        <Menu theme="dark" mode="inline" className="menu-logout">
          <Menu.Item key="logout" icon={<LogoutIcon />}>
            Log Out
          </Menu.Item>
        </Menu>
        <div className="account">
          <AccountBoxIcon  />
          User
        </div>
      </Sider>
    </Layout>
  );
};

export default Sidebar;
