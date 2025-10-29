import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, setAuthModalOpen } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to homepage after logout
    };

    const authLinks = (
        <>
            <li><Link to="/profile">My Quizzes</Link></li>
            <li><button onClick={handleLogout} className="logout-button">Sign Out</button></li>
        </>
    );

    const guestLinks = (
        <>
            <li><button onClick={() => setAuthModalOpen(true, 'login')} className="link-button">Login</button></li>
            <li><button onClick={() => setAuthModalOpen(true, 'register')} className="register-button">Sign Up</button></li>
        </>
    );

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src="/kb-logo.png" alt="Special Quiz App Logo" />
                    Special Quiz
                </Link>
                <ul className="nav-menu">
                    {isAuthenticated ? authLinks : guestLinks}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;