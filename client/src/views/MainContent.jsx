// src/views/MainContent.jsx

import React from 'react';
import { rolesConfig } from '../config/rolesConfig.jsx';
import NotFound from "./NotFound.jsx"; // Assuming you have a rolesConfig file

export default function MainContent() {
    const location = window.location;

    // Match the current route path with the configuration
    const currentConfig = Object.values(rolesConfig).find(
        config => config.path === location.pathname
    );

    // Extract the component associated with the path, fallback to a default if not found
    const Component = currentConfig ? currentConfig.component : NotFound;

    return <Component />;
}