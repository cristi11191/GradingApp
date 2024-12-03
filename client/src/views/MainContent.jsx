// src/views/MainContent.jsx

import React from 'react';
import { rolesConfig } from '../config/rolesConfig.jsx';
import NotFound from "./NotFound.jsx"; // Assuming you have a rolesConfig file
import { useParams } from 'react-router-dom';

export default function MainContent() {
    const location = window.location;

    const matchPath = (pathname, configPath) => {
        const pathRegex = new RegExp(
            `^${configPath.replace(/:[^\s/]+/g, '([^/]+)')}$`
        );
        return pathRegex.test(pathname);
    };

    // Match the current route path with the configuration
    const currentConfig = Object.values(rolesConfig).find(config =>
        matchPath(location.pathname, config.path)
    );

    // Extract the component associated with the path, fallback to a default if not found
    const Component = currentConfig ? currentConfig.component : NotFound;

    return <Component />;
}