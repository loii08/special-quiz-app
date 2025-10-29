import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [colorMode, setColorMode] = useState('dark');
    const [specialTheme, setSpecialTheme] = useState(null);

    useEffect(() => {
        // A special theme takes precedence over the light/dark mode
        if (specialTheme) {
            document.body.className = specialTheme;
        } else {
            document.body.className = colorMode === 'light' ? 'light-mode' : '';
        }
    }, [colorMode, specialTheme]);

    const toggleColorMode = () => {
        setColorMode(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const value = {
        colorMode,
        toggleColorMode,
        specialTheme,
        setSpecialTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};