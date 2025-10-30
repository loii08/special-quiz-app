import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import './ProfilePage.css';

const ProfilePage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [quizCount, setQuizCount] = useState(0);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copyStatus, setCopyStatus] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState(null);
    const { 
        token, 
        logout, 
    } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [quizzesRes, userRes] = await Promise.all([
                    fetch(`/api/quiz/my-quizzes`, { headers: { 'x-auth-token': token } }),
                    fetch(`/api/users/me`, { headers: { 'x-auth-token': token } })
                ]);

                if (!quizzesRes.ok) throw new Error('Failed to fetch quizzes');
                if (!userRes.ok) throw new Error('Failed to fetch user data');

                const quizzesData = await quizzesRes.json();
                const userData = await userRes.json();

                setQuizzes(quizzesData.quizzes);
                setQuizCount(quizzesData.quizCount);
                setUser(userData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token]);

    const handleCopyLink = (quizId) => {
        const url = `${window.location.origin}/quiz/${quizId}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopyStatus({ [quizId]: 'Copied!' });
            setTimeout(() => setCopyStatus(prev => ({ ...prev, [quizId]: undefined })), 2000);
        });
    };

    const handleDeleteRequest = (quizId) => {
        setQuizToDelete(quizId);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!quizToDelete) return;
        try {
            const response = await fetch(`/api/quiz/${quizToDelete}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (!response.ok) throw new Error('Failed to delete quiz');
            // Refresh the list of quizzes
            setQuizzes(prevQuizzes => prevQuizzes.filter(q => q._id !== quizToDelete));
        } catch (error) {
            console.error(error);
            alert('Could not delete the quiz. Please try again.');
        } finally {
            setShowConfirmModal(false);
            setQuizToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setQuizToDelete(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="main-wrapper">
                <div className="card">
                    <div className="skeleton user-profile-header-skeleton">
                        <div className="skeleton-avatar"></div>
                        <div className="skeleton-line skeleton-line-lg"></div>
                        <div className="skeleton-line skeleton-line-md"></div>
                    </div>
                    <div className="skeleton profile-header-skeleton">
                        <div className="skeleton-line skeleton-line-xl"></div>
                        <div className="skeleton-button"></div>
                    </div>
                    <div className="skeleton quiz-list-skeleton">
                        <div className="skeleton-quiz-item"></div>
                        <div className="skeleton-quiz-item"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-wrapper">
            {showConfirmModal && (
                <ConfirmModal
                    message="This quiz will be permanently deleted. This action cannot be undone."
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
            <div className="profile-page-container">
                {user && (
                    <div className="card user-details-card">
                        <Link to="/" className="back-button" aria-label="Go back to homepage">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </Link>
                        <div className="user-profile-header">
                            <div className="user-avatar">
                                {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </div>
                            <h2>{user.name}</h2>
                            <p className="user-email">{user.email}</p>
                        </div>
                        <div className="user-stats">
                            <div className="stat-item">
                                <span className="stat-value">{quizCount} / 3 </span>
                                <span className="stat-label">Quizzes Created</span>
                            </div>
                        </div>
                        <div className="user-card-actions">
                            <button onClick={handleLogout} className="user-card-logout-btn">Sign Out</button>
                        </div>
                    </div>
                )}
                <div className="card quizzes-card">
                    {user && quizzes.length > 0 ? (
                        <>
                            <div className="profile-header">
                                <h1>My Quizzes</h1>
                                <div className="profile-actions-group">
                                    {quizCount < 3 ? (
                                        <Link to="/create" className="primary-button">Create New Quiz</Link>
                                    ) : (
                                        <button className="primary-button" disabled title="You have reached the maximum limit of 3 quizzes.">
                                            Create New Quiz
                                        </button>
                                    )}
                                    <span className="quiz-counter">{quizCount} / 3</span>
                                </div>
                            </div>
                            <ul className="quiz-list">
                                {quizzes.map(quiz => (
                                    <li key={quiz._id} className="quiz-list-item">
                                        <div className="quiz-info">
                                            <Link to={`/quiz/${quiz.quizId}`}>{quiz.title}</Link>
                                            <span className="quiz-date">Created on: {new Date(quiz.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="quiz-actions">
                                            <button onClick={() => handleCopyLink(quiz.quizId)} className="action-btn copy-btn" title="Copy Link">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                <span className="action-btn-text">{copyStatus[quiz.quizId] || 'Copy'}</span>
                                            </button>
                                            <button onClick={() => navigate(`/edit/${quiz._id}`)} className="action-btn edit-btn" title="Edit Quiz">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                <span className="action-btn-text">Edit</span>
                                            </button>
                                            <button onClick={() => handleDeleteRequest(quiz._id)} className="action-btn delete-btn" title="Delete Quiz">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                <span className="action-btn-text">Delete</span>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : user && ( // Only show the "empty" message if the user is loaded
                        <div className="no-quizzes-container">
                            <span className="no-quizzes-icon">✍️</span>
                            <h2>Your quiz collection is empty!</h2>
                            <p className="no-quizzes-message">It's time to create your first personalized quiz.</p>
                            <Link to="/create" className="interactive-button">Create Your First Quiz</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;