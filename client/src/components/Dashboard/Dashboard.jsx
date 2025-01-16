// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import RecentProjects from "./RecentProjects";
import RecentEvaluations from "./RecentEvaluations";
import Notifications from "./Notifications";
import MyProjectCard from "./MyProjectCard";
import "./Dashboard.css";
import { fetchAllProjects } from "../../services/apiProject.jsx";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await fetchAllProjects();
            setProjects(data);
        };
        fetchProjects();
    }, []);
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="dashboard-grid">
                {/*<div className="quickstats-container">*/}
                {/*    <QuickStats/>*/}
                {/*</div>*/}
                <MyProjectCard  />
                <RecentEvaluations projects={projects} />
                <RecentProjects />
                <Notifications/>
            </div>
        </div>
    );
};

export default Dashboard;
