import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './CreateQuizPage.css';
import { useAuth } from '../context/AuthContext';

const CreateQuizPage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { quizId: editQuizId } = useParams(); // Get quiz ID from URL for editing
    const [title, setTitle] = useState('');
    const [scoreGoal, setScoreGoal] = useState(1);
    const [anniversaryDate, setAnniversaryDate] = useState('');
    const [congratulationsMessage, setCongratulationsMessage] = useState('');
    const [questions, setQuestions] = useState([{ question: '', answer: '' }]);
    const [rewardContent, setRewardContent] = useState({
        imageUrl: '',
        messageTitle: '',
        messageBody: '',
    });
    const [imageUploadStatus, setImageUploadStatus] = useState(''); // '', 'uploading', 'success', 'error'
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [createdQuizId, setCreatedQuizId] = useState(null);
    const [serverError, setServerError] = useState('');
    const [copyButtonText, setCopyButtonText] = useState('Copy Link');

    const titleRef = useRef(null);
    const scoreGoalRef = useRef(null);
    const anniversaryDateRef = useRef(null);

    useEffect(() => {
        if (editQuizId) {
            const fetchQuizForEdit = async () => {
                try {
                    const response = await fetch(`${API_URL}/api/quiz/edit/${editQuizId}`, {
                        headers: { 'x-auth-token': token }
                    });
                    if (!response.ok) throw new Error('Quiz not found for editing.');
                    const data = await response.json();
                    
                    setTitle(data.title);
                    setScoreGoal(data.scoreGoal);
                    setAnniversaryDate(new Date(data.anniversaryDate).toISOString().split('T')[0]);
                    setCongratulationsMessage(data.congratulationsMessage);
                    setQuestions(data.questions);
                    setRewardContent(data.reward.content || { imageUrl: '', messageTitle: '', messageBody: '' });

                } catch (error) {
                    console.error(error);
                    navigate('/profile');
                }
            };
            if (token) fetchQuizForEdit();
        }
    }, [editQuizId, navigate, token]);

    useEffect(() => {
        if (createdQuizId === null && !editQuizId) {
            setTimeout(() => {
                if (titleRef.current) {
                    titleRef.current.focus();
                }
            }, 100);
        }
    }, [createdQuizId, editQuizId]);

    const handleQuestionChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index][event.target.name] = event.target.value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: '', answer: '' }]);
    };

    const removeQuestion = (index) => {
        if (questions.length <= scoreGoal) {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                questions: `You cannot have fewer than ${scoreGoal} questions.`
            }));
            setTimeout(() => setFormErrors(prev => ({ ...prev, questions: undefined })), 3000);
            return;
        }
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleRewardContentChange = (e) => {
        setRewardContent({ ...rewardContent, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('rewardImage', file);

        setImageUploadStatus('uploading');
        try {
            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: { 'x-auth-token': token },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Image upload failed.');

            setRewardContent(prev => ({ ...prev, imageUrl: data.filePath }));
            setImageUploadStatus('success');
        } catch (err) {
            console.error(err);
            setImageUploadStatus('error');
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Quiz title is required.';
        if (!scoreGoal || scoreGoal < 1) newErrors.scoreGoal = 'Score to win must be at least 1.';
        if (!anniversaryDate) newErrors.anniversaryDate = 'A special date is required.';

        const validQuestions = questions.filter(q => q.question.trim() && q.answer.trim());
        if (validQuestions.length < 1) {
            newErrors.questions = 'You must add at least one complete question.';
        } else if (validQuestions.length < scoreGoal) {
            newErrors.questions = `You need at least ${scoreGoal} valid questions to match your score goal.`;
        }

        setFormErrors(newErrors);
        return newErrors; // Return the errors object
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            if (validationErrors.title) {
                titleRef.current.focus();
            } else if (validationErrors.scoreGoal) {
                scoreGoalRef.current.focus();
            } else if (validationErrors.anniversaryDate) {
                anniversaryDateRef.current.focus();
            }
            return;
        }

        setLoading(true);
        setServerError('');

        const quizDataPayload = {
            title,
            scoreGoal,
            anniversaryDate,
            congratulationsMessage,
            reward: { content: rewardContent },
            questions: questions.filter(q => q.question.trim() && q.answer.trim()),
        };

        try {
            const isEditing = !!editQuizId;
            const url = isEditing 
                ? `${API_URL}/api/quiz/${editQuizId}` 
                : `${API_URL}/api/quiz`;
            
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(quizDataPayload),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to save quiz.');
            }

            if (isEditing) {
                navigate('/profile');
            } else {
                const { quizId } = await response.json();
                setCreatedQuizId(quizId);
            }
        } catch (err) {
            console.error("Quiz save failed:", err);
            setServerError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        const url = `${window.location.origin}/quiz/${createdQuizId}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy Link'), 2000);
        });
    };

    const handleCreateAnother = () => {
        setTitle('');
        setScoreGoal(1);
        setAnniversaryDate('');
        setCongratulationsMessage('');
        setQuestions([{ question: '', answer: '' }]);
        setRewardContent({ imageUrl: '', messageTitle: '', messageBody: '' });
        setImageUploadStatus('');
        setFormErrors({});
        setServerError('');
        setCopyButtonText('Copy Link');

        setCreatedQuizId(null);
    };

    if (createdQuizId) {
        return (
            <div className="main-wrapper">
                <div className="card">
                    <h1>🎉 Quiz Created Successfully!</h1>
                    <p className="subtitle">Share this unique link with someone special.</p>
                    <div className="link-display-box">
                        <input type="text" value={`${window.location.origin}/quiz/${createdQuizId}`} readOnly />
                        <button onClick={handleCopyLink} className="copy-button">{copyButtonText}</button>
                    </div>
                    <div className="summary-buttons">
                        <Link to={`/quiz/${createdQuizId}`} className="interactive-button">Go to Quiz</Link>
                        <button onClick={handleCreateAnother} className="secondary-button">Create Another Quiz</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-wrapper">
            <div className="card">
                <Link to="/" className="back-button" aria-label="Go back to homepage">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </Link>
                <h1 className="form-title">{editQuizId ? 'Edit Your Quiz' : 'Create Your Custom Quiz'}</h1>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-section">
                        <div className="form-group">
                            <label htmlFor="title">Quiz Title</label>
                            <input ref={titleRef} id="title" type="text" placeholder="e.g., Our Story" value={title} onChange={e => setTitle(e.target.value)} className={formErrors.title ? 'input-error' : ''} required />
                            {formErrors.title && <span className="error-message">{formErrors.title}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="scoreGoal">Score to Win</label>
                            <input ref={scoreGoalRef} id="scoreGoal" type="number" value={scoreGoal} onChange={e => setScoreGoal(e.target.value < 1 ? 1 : e.target.value)} min="1" className={formErrors.scoreGoal ? 'input-error' : ''} required onBlur={() => {}} />
                            {formErrors.scoreGoal && <span className="error-message">{formErrors.scoreGoal}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="anniversaryDate">Special Date</label>
                            <input ref={anniversaryDateRef} id="anniversaryDate" type="date" value={anniversaryDate} onChange={e => setAnniversaryDate(e.target.value)} className={formErrors.anniversaryDate ? 'input-error' : ''} required />
                            {formErrors.anniversaryDate && <span className="error-message">{formErrors.anniversaryDate}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="congratulationsMessage">Custom 'Congratulations' Message (Optional)</label>
                            <textarea id="congratulationsMessage" placeholder="e.g., You're the best!" value={congratulationsMessage} onChange={e => setCongratulationsMessage(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Optional Unlocked Content</h3>
                        <p className="reward-info">The date countdown is always shown. You can also add an image and/or a special message below to be revealed.</p>
                        
                        <div className="form-group">
                            <h4>Add an Image (Optional)</h4>
                            <label htmlFor="image-upload" className="file-upload-label">{imageUploadStatus === 'uploading' ? 'Uploading...' : 'Choose Image'}</label>
                            <input id="image-upload" type="file" onChange={handleImageUpload} accept="image/*" className="file-upload-input" />
                            {imageUploadStatus === 'error' && <p className="error-message">Upload failed. Please try another image.</p>}
                            {rewardContent.imageUrl && <div className="image-preview-container"><img src={rewardContent.imageUrl} alt="Reward preview" className="image-preview" /></div>}
                        </div>
                        <div className="form-group">
                            <h4>Add a Message to the Image/Reward (Optional)</h4>
                            <input type="text" name="messageTitle" placeholder="Message Title (shown on image)" value={rewardContent.messageTitle} onChange={handleRewardContentChange} />
                            <textarea name="messageBody" placeholder="Your special message (shown in fullscreen view)..." value={rewardContent.messageBody} onChange={handleRewardContentChange} />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Questions</h3>
                        {formErrors.questions && <span className="error-message error-message-centered">{formErrors.questions}</span>}
                        {questions.map((q, index) => (
                            <div key={index} className="question-row">
                                <span className="question-number">{index + 1}</span>
                                <div className="question-inputs">
                                    <input name="question" type="text" placeholder="Enter your question" value={q.question} onChange={e => handleQuestionChange(index, e)} />
                                    <input name="answer" type="text" placeholder="Enter the answer" value={q.answer} onChange={e => handleQuestionChange(index, e)} />
                                </div>
                                <button type="button" onClick={() => removeQuestion(index)} className="remove-question-btn" aria-label="Remove question">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addQuestion} className="secondary-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add Another Question
                        </button>
                    </div>

                    <button type="submit" disabled={loading} className="interactive-button">
                        {loading ? 'Creating...' : (
                            <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg> {editQuizId ? 'Save Changes' : 'Create & Get Link'}</>
                        )}
                    </button>
                    {serverError && <p className="error-message error-message-centered">{serverError}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreateQuizPage;