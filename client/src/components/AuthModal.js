import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

const AuthModal = () => {
    const { authModalView, setAuthModalOpen, login } = useAuth();
    const navigate = useNavigate();

    const [view, setView] = useState(authModalView);

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const modalBodyRef = useRef(null);

    useEffect(() => {
        setView(authModalView);
    }, [authModalView]);

    const switchView = (newView) => {
        setError('');
        setView(newView);
    };

    const handleLoginChange = e => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleRegisterChange = e => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

    const handleLoginSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.errors ? data.errors[0].msg : 'Login failed.');
            login(data.token);
            setAuthModalOpen(false);
            if (data.hasQuizzes) {
                navigate('/profile');
            } else {
                navigate('/create');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegisterSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.errors ? data.errors[0].msg : 'Registration failed.');
            login(data.token);
            setAuthModalOpen(false);
            navigate('/create');
        } catch (err) {
            setError(err.message);
        }
    };

    const loginForm = (
        <div className="form-container">
            <h1 className="form-title">Sign In</h1>
            <form onSubmit={handleLoginSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="login-email">Email Address</label>
                    <input id="login-email" type="email" name="email" value={loginData.email} onChange={handleLoginChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <input id="login-password" type="password" name="password" value={loginData.password} onChange={handleLoginChange} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="interactive-button">Login</button>
            </form>
            <p className="form-footer-text">
                Don't have an account? <button onClick={() => switchView('register')} className="link-button">Sign Up</button>
            </p>
        </div>
    );

    const registerForm = (
        <div className="form-container">
            <h1 className="form-title">Sign Up</h1>
            <form onSubmit={handleRegisterSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="register-name">Name</label>
                    <input id="register-name" type="text" name="name" value={registerData.name} onChange={handleRegisterChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="register-email">Email Address</label>
                    <input id="register-email" type="email" name="email" value={registerData.email} onChange={handleRegisterChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="register-password">Password</label>
                    <input id="register-password" type="password" name="password" value={registerData.password} onChange={handleRegisterChange} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="primary-button">Register</button>
            </form>
            <p className="form-footer-text">
                Already have an account? <button onClick={() => switchView('login')} className="link-button">Sign In</button>
            </p>
        </div>
    );

    return (
        <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
            <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-icon" onClick={() => setAuthModalOpen(false)} aria-label="Close modal">&times;</button>
                <div ref={modalBodyRef} className="auth-modal-body" key={view}>
                    {view === 'login' && loginForm}
                    {view === 'register' && registerForm}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;