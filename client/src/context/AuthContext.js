import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('login');

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const setAuthModalOpen = (isOpen, view = 'login') => {
        if (isOpen) {
            setAuthModalView(view);
        }
        setIsAuthModalOpen(isOpen);
    };

    const isAuthenticated = !!token;

    const value = {
        token,
        isAuthenticated,
        isAuthModalOpen,
        authModalView,
        setAuthModalOpen,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};