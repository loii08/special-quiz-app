import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, setAuthModalOpen } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            setAuthModalOpen(true, 'login');
        }
    }, [isAuthenticated, setAuthModalOpen, navigate]);

    return isAuthenticated ? children : null;
};

export default PrivateRoute;