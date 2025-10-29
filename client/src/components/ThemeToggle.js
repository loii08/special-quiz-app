import React from 'react';

import './ThemeToggle.css';
const ThemeToggle = ({ colorMode, toggleColorMode, isSpecialOccasion }) => {
    if (isSpecialOccasion) {
        return null;
    }

    return (
        <div className="theme-toggle-container">
            <label className="theme-toggle" htmlFor="theme-toggle-checkbox" title={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}>
                <input type="checkbox" id="theme-toggle-checkbox" onChange={toggleColorMode} checked={colorMode === 'dark'} />
                <div className="slider"></div>
            </label>
        </div>
    );
};

export default ThemeToggle;