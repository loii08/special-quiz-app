import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { isAuthenticated, setAuthModalOpen } = useAuth();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            setAuthModalOpen(true, 'login');
        }
    };

    return (
        <div className="main-wrapper">
            <div className="card landing-page-card">
                <h1>Create, Share, and Play!</h1>
                <p className="subtitle">Build personalized quizzes for someone special in just a few clicks.</p>

                <div className="features-grid">
                    <div className="feature-item">
                        <span className="feature-icon">✍️</span>
                        <h3>1. Create</h3>
                        <p>Design a custom quiz with your own questions, answers, and a secret message.</p>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🔗</span>
                        <h3>2. Share</h3>
                        <p>Get a unique, shareable link to send to your friend, partner, or family member.</p>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">💖</span>
                        <h3>3. Play</h3>
                        <p>They play the quiz to unlock the special date details and your congratulations message!</p>
                    </div>
                </div>

                <button 
                    onClick={() => isAuthenticated ? navigate('/profile') : setAuthModalOpen(true, 'login')} 
                    className="interactive-button"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default HomePage;