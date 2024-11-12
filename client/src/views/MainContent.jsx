// src/views/MainContent.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';

const MainContent = () => (
    <div>
        {/* Conținutul specific fiecărei rute */}
        <Outlet />
    </div>
);

export default MainContent;
