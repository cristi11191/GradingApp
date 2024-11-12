import Dashboard from '../components/Dashboard/Dashboard.jsx';
import Projects from "../components/Projects/Projects.jsx";
import MyProject from "../components/MyProject/MyProject.jsx";

export const rolesConfig = {
    dashboard: {
        label: 'Dashboard',
        path: '/dashboard',
        component: Dashboard,
        roles: ['user','admin'], // Multiple roles can access this
    },
    projects: {
        label: 'Projects',
        path: '/projects',
        component: Projects,
        roles: ['user'], // Only admin and manager can access this
    },
    myproject: {
        label: 'My Project',
        path: '/myproject',
        component: MyProject,
        roles: ['user','admin'], // Only admins can manage roles
    },

    // Add more roles and paths as needed
};