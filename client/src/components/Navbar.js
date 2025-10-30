import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, setAuthModalOpen } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const onProfilePage = location.pathname === '/profile';

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to homepage after logout
    };

    const authLinks = (
        <>
            {!onProfilePage && (
                <>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><button onClick={handleLogout} className="link-button">Logout</button></li>
                </>
            )}
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