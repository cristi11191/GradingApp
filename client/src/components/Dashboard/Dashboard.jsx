import React, { useEffect, useState } from "react";
import RecentProjects from "./RecentProjects";
import RecentEvaluations from "./RecentEvaluations";
import Notifications from "./Notifications";
import QuickStats from "./QuickStats";
import MyProjectCard from "./MyProjectCard";
import "./Dashboard.css";
import { fetchRecentProjects, fetchRecentEvaluations, fetchNotifications, fetchQuickStats, fetchMyProject } from "../../services/apiDashboard.jsx";
import {fetchEvaluationsByUserId} from "../../services/apiEvaluations.jsx";

const Dashboard = () => {
    const [recentProjects, setRecentProjects] = useState([]); // Inițializat ca array
    const [recentEvaluations, setRecentEvaluations] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [quickStats, setQuickStats] = useState({});
    const [myProject, setMyProject] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // const [projects, evaluations, notifications, stats, myProj] = await Promise.all([
            //     fetchRecentProjects(),
            //     fetchEvaluationsByUserId(),
            //     fetchNotifications(),
            //     fetchQuickStats(),
            //     fetchMyProject(),
            // ]);
            // setRecentProjects(projects);
            // setRecentEvaluations(evaluations);
            // setNotifications(notifications);
            // setQuickStats(stats);
            // setMyProject(myProj);


            const evaluations = await fetchEvaluationsByUserId();
            console.log("eval" , evaluations);

            setRecentEvaluations(evaluations);
        };
        fetchData();
    }, []);

    ///>
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="dashboard-grid">
                <div className="quickstats-container">
                    <QuickStats stats={quickStats} />
                </div>
                <MyProjectCard project={myProject} />
                <RecentEvaluations evaluations={recentEvaluations} />
                <RecentProjects projects={recentProjects} />
                <Notifications notifications={notifications} />
            </div>
        </div>
    );
};

export default Dashboard;
