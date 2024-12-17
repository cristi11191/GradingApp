import React from "react";

const Notifications = () => {
    // if (!Array.isArray(notifications)) {
    //     return <div className="card"><h2>Notifications</h2><p>No notifications available.</p></div>;
    // }

    return (
        <div className="card">
            <h2>Notifications</h2>
            <ul>
                {/*{notifications.map((notification, index) => (*/}
                {/*    <li key={index}>*/}
                {/*        {notification.message} - {new Date(notification.date).toLocaleDateString()}*/}
                {/*    </li>*/}
                {/*))}*/}
            </ul>
        </div>
    );
};

export default Notifications;
