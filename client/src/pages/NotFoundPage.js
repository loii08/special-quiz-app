import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="main-wrapper">
            <div className="card">
                <div className="not-found-content">
                    <h1 className="not-found-title">404</h1>
                    <h2>Page Not Found</h2>
                    <p>The quiz you're looking for might have been moved, deleted, or the link is incorrect.</p>
                    <Link to="/" className="interactive-button">Return Home</Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;