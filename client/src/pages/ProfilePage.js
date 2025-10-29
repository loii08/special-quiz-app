import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

const ProfilePage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [quizCount, setQuizCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [copyStatus, setCopyStatus] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`/api/quiz/my-quizzes`, {
                    headers: { 'x-auth-token': token }
                });
                if (!response.ok) throw new Error('Failed to fetch quizzes');
                const data = await response.json();
                setQuizzes(data.quizzes);
                setQuizCount(data.quizCount);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchQuizzes();
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

    if (loading) {
        return <div className="main-wrapper"><div className="card"><h1>Loading Your Quizzes...</h1></div></div>;
    }

    return (
        <div className="main-wrapper">
            <div className="card">
                {showConfirmModal && (
                    <ConfirmModal
                        message="This quiz will be permanently deleted. This action cannot be undone."
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                    />
                )}
                <div className="profile-header">
                    <h1>My Quizzes</h1>
                    <div className="profile-actions-group">
                        <Link to="/create" className="primary-button">Create New Quiz</Link>
                        <span className="quiz-counter">{quizCount} / 3</span>
                    </div>
                </div>
                {quizzes.length > 0 ? (
                    <ul className="quiz-list">
                        {quizzes.map(quiz => (
                            <li key={quiz._id} className="quiz-list-item">
                                <div className="quiz-info">
                                    <Link to={`/quiz/${quiz.quizId}`}>{quiz.title}</Link>
                                    <span className="quiz-date">Created on: {new Date(quiz.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="quiz-actions">
                                    <button onClick={() => handleCopyLink(quiz.quizId)} className="action-btn copy-btn" title="Copy Link">{copyStatus[quiz.quizId] || 'Copy'}</button>
                                    <button onClick={() => navigate(`/edit/${quiz._id}`)} className="action-btn edit-btn" title="Edit Quiz">Edit</button>
                                    <button onClick={() => handleDeleteRequest(quiz._id)} className="action-btn delete-btn" title="Delete Quiz">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-quizzes-message">You haven't created any quizzes yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;