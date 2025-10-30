import React, { useState, useEffect, useRef, useCallback } from 'react';
import { spawn as launchConfetti } from '../utils/canvasConfetti.js';
import { createFallingEmojis } from '../utils/domAnimations.js';

import './QuizModal.css';
const QuizModal = ({ gameData, onSuccess, onClose }) => {
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [availableWrongMessages, setAvailableWrongMessages] = useState([]);
    const [globalWrongMessages, setGlobalWrongMessages] = useState([]);
    const [availableCancelMessages, setAvailableCancelMessages] = useState([]);
    const [globalCancelMessages, setGlobalCancelMessages] = useState([]);
    const [modalState, setModalState] = useState('asking'); // asking, correct, wrong, cancelled, won
    const [resultData, setResultData] = useState({ emoji: '', msg: '' });
    const inputRef = useRef(null);
    const modalContentRef = useRef(null); // Ref for the entire modal content
    const emojiRef = useRef(null); // Ref for the result emoji element

    const scoreGoal = gameData?.scoreGoal || 1;

    const askNewQuestion = useCallback((questionsPool) => {
        if (questionsPool.length > 0) {
            const questionIndex = Math.floor(Math.random() * questionsPool.length); 
            setCurrentQuestion(questionsPool[questionIndex]);
        }
    }, []);

    useEffect(() => {
        if (gameData && gameData.questions.length > 0) {
            if (availableQuestions.length === 0) {
                const initialQuestions = [...gameData.questions];
                setAvailableQuestions(initialQuestions);
                askNewQuestion(initialQuestions);
            }
        }
    }, [gameData, availableQuestions.length, askNewQuestion]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const [wrongRes, cancelRes] = await Promise.all([
                    fetch(`/api/messages/wrong`),
                    fetch(`/api/messages/cancel`)
                ]);
                setGlobalWrongMessages(await wrongRes.json());
                setGlobalCancelMessages(await cancelRes.json());
            } catch (error) {
                console.error("Failed to fetch global messages:", error);
            }
        };
        fetchMessages();
    }, []);

    useEffect(() => {
        if (modalState === 'asking' && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
        }
    }, [modalState]);

    const handleAnswerSubmit = () => {
        if (!userAnswer.trim() || !currentQuestion) return;

        if (userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
            const newScore = score + 1;
            setScore(newScore);
            
            const newQuestionsPool = availableQuestions.filter(q => q._id !== currentQuestion._id); // Use _id from MongoDB
            setAvailableQuestions(newQuestionsPool);
            setUserAnswer('');

            if (newScore >= scoreGoal) {
                setResultData({ emoji: '🎉', msg: gameData.congratulationsMessage || "Congratulations! You did it! 🎉" });
                setModalState('won');
                setTimeout(() => triggerBurst(200), 50);
            } else {
                setResultData({ emoji: '✅', msg: `Correct! Only ${scoreGoal - newScore} more to go!` });
                triggerBurst(80);
                setModalState('correct');
                if (newQuestionsPool.length > 0) {
                    askNewQuestion(newQuestionsPool);
                }
            }
        } else {
            setWrongAnswerCount(prevCount => prevCount + 1);

            let messagePool = availableWrongMessages.length > 0 ? [...availableWrongMessages] : [...globalWrongMessages];

            if (messagePool.length === 0) {
                messagePool = globalWrongMessages.length > 0 ? [...globalWrongMessages] : [{ msg: "That's not quite right. Try again!", emoji: "🤔" }];
            }

            const randomMsgIndex = Math.floor(Math.random() * messagePool.length);
            const randomMsg = messagePool[randomMsgIndex];
            setAvailableWrongMessages(messagePool.filter((_, index) => index !== randomMsgIndex));
            setResultData(randomMsg);
            setModalState('wrong');
        }
    };

    const handleNextQuestion = () => {
        setUserAnswer('');
        setModalState('asking');
    };

    const handleTryAgain = () => {
        askNewQuestion(availableQuestions);
        setUserAnswer('');
        setModalState('asking');
    };

    const handleCancel = () => {
        let messagePool = availableCancelMessages.length > 0 ? [...availableCancelMessages] : [...globalCancelMessages];

        if (messagePool.length === 0) {
            messagePool = globalCancelMessages.length > 0 ? [...globalCancelMessages] : [{ msg: "Quitting so soon?", emoji: "😜" }];
        }

        const randomMsgIndex = Math.floor(Math.random() * messagePool.length);
        const randomMsg = messagePool[randomMsgIndex];
        setAvailableCancelMessages(messagePool.filter((_, index) => index !== randomMsgIndex));

        createFallingEmojis(12);
        setResultData(randomMsg);
        setModalState('cancelled');
    };

    const triggerBurst = (count) => {
        if (modalContentRef.current) {
            const rect = modalContentRef.current.getBoundingClientRect();
            launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, count);
        }
    };

    const handleIconClose = () => {
        if (modalState === 'wrong' || wrongAnswerCount > 0) {
            handleCancel();
        } else {
            onClose();
        }
    };

    const renderContent = () => {
        switch (modalState) {
            case 'correct':
            case 'wrong':
            case 'cancelled':
            case 'won':
                return (
                    <div className="result-modal-content">
                        <span ref={emojiRef} className="result-emoji" role="img" aria-label="Result emoji">{resultData.emoji}</span>
                        <p>{resultData.msg}</p>
                        <div className="modal-buttons">
                            {modalState === 'correct' && <button onClick={handleNextQuestion}>Next Question</button>}
                            {modalState === 'wrong' && <button onClick={handleTryAgain}>Try Again</button>} 
                            {modalState === 'cancelled' && <button className="close-btn" onClick={onClose}>Okay</button>}
                            {modalState === 'won' && <button onClick={onSuccess}>Okay</button>}
                        </div>
                    </div>
                );
            case 'asking':
            default:
                return (
                    <>
                        <h3>{currentQuestion?.question}</h3>
                        <div className="modal-score">Score: {score} / {scoreGoal}</div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyUp={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                            placeholder="Your answer..."
                        />
                        <div className="modal-buttons">
                            <button onClick={handleAnswerSubmit}>Submit</button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="modal-overlay">
            <div ref={modalContentRef} className="modal-content">
                {modalState !== 'correct' && modalState !== 'cancelled' && modalState !== 'won' && (
                    <button className="modal-close-icon" onClick={handleIconClose} aria-label="Close modal">
                        &times;
                    </button>
                )}
                {renderContent()}
            </div>
        </div>
    );
};

export default QuizModal;