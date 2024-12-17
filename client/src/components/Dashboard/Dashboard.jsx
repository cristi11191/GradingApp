// eslint-disable-next-line no-unused-vars
import React from "react";
import RecentProjects from "./RecentProjects";
import RecentEvaluations from "./RecentEvaluations";
import Notifications from "./Notifications";
import QuickStats from "./QuickStats";
import MyProjectCard from "./MyProjectCard";
import "./Dashboard.css";

const Dashboard = () => {

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="dashboard-grid">
                <div className="quickstats-container">
                    <QuickStats/>
                </div>
                <MyProjectCard  />
                <RecentEvaluations />
                <RecentProjects />
                <Notifications/>
            </div>
        </div>
    );
};

export default Dashboard;
