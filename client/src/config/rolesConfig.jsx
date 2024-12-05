import Dashboard from '../components/Dashboard/Dashboard.jsx';
import Projects from "../components/Projects/Projects.jsx";
import MyProject from "../components/MyProject/MyProject.jsx";
import Evaluation from "../components/Evaluation/Evaluation.jsx";
import ProjectDetails from "../components/Projects/ProjectDetails.jsx";
import AdminDashboard from "../components/AdminDashboard/AdminDashboard.jsx";
import DashboardIcon from "@mui/icons-material/Dashboard";
import React from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
import GradeIcon from "@mui/icons-material/Grade";

export const rolesConfig = {
    admin: {
        label: 'Admin Dashboard',
        path: '/admin',
        component: AdminDashboard,
        icon: <DashboardIcon />,
        roles: ['admin'], // Multiple roles can access this
    },
    dashboard: {
        label: 'Dashboard',
        path: '/dashboard',
        icon: <DashboardIcon />,
        component: Dashboard,
        roles: ['user'], // Multiple roles can access this
    },
    projects: {
        label: 'Projects',
        path: '/projects',
        icon: <FolderIcon />,
        component: Projects,
        roles: ['user','admin'], // Only admin and manager can access this
    },
    myproject: {
        label: 'My Project',
        path: '/myproject',
        icon: <AssignmentIcon />,
        component: MyProject,
        roles: ['user'], // Only admins can manage roles
    },
    evaluation: {
        label: 'Evaluation',
        path: '/evaluation',
        icon: <GradeIcon />,
        component: Evaluation,
        roles: ['user'], // Only admins can manage roles
    },
    projectdetails: {
        label: 'Project Details',
        path: '/project/:projectId',
        component: ProjectDetails,
    },

    // Add more roles and paths as needed
};