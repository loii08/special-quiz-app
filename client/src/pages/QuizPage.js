import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QuoteCard from '../components/QuoteCard.js';
import DateDetailsCard from '../components/DateDetailsCard.js';
import ImageRewardCard from '../components/ImageRewardCard.js';
import QuizModal from '../components/QuizModal.js';
import MessageRewardCard from '../components/MessageRewardCard.js';
import NotFoundPage from './NotFoundPage.js';
import { useTheme } from '../context/ThemeContext.js';

const SpecialMessage = ({ message }) => (
    <div className="special-message">{message}</div>
);

const specialOccasions = [
    { name: 'anniversary', condition: (start, current) => start.getMonth() === current.getMonth() && start.getDate() === current.getDate(), message: "🎉 Happy Anniversary! 🎉" },
    { name: 'valentines', condition: (start, current) => current.getMonth() === 1 && current.getDate() === 14, message: "💖 Happy Valentine's Day! 💖" },
    { name: 'christmas', condition: (start, current) => current.getMonth() === 11 && current.getDate() === 25, message: "🎄 Merry Christmas! 🎄" },
];

const QuizPage = () => {
    const { quizId } = useParams();
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isDetailsVisible, setDetailsVisible] = useState(false);
    const [isQuizOpen, setQuizOpen] = useState(false);
    const [activeOccasion, setActiveOccasion] = useState(null);
    const { setSpecialTheme } = useTheme();

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/quiz/${quizId}`);
                if (!response.ok) {
                    throw new Error('Quiz not found. Maybe the link is old or incorrect?');
                }
                const data = await response.json();
                setQuizData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizData();
    }, [quizId]);

    useEffect(() => {
        if (quizData) {
            const startDate = new Date(quizData.anniversaryDate);
            const currentDate = new Date();
            let foundOccasion = null;

            for (const occasion of specialOccasions) {
                if (occasion.condition(startDate, currentDate)) {
                    foundOccasion = occasion;
                    break;
                }
            }

            if (foundOccasion) {
                setActiveOccasion(foundOccasion);
                setSpecialTheme(foundOccasion.name);
            }
        }

        return () => setSpecialTheme(null);
    }, [quizData, setSpecialTheme]);

    const handleQuizSuccess = () => {
        setQuizOpen(false);
        setDetailsVisible(true);
        setTimeout(() => setDetailsVisible(false), 60000);
    };

    if (loading) {
        return <div className="main-wrapper"><div className="card"><h1>Loading Quiz...</h1></div></div>;
    }

    if (error) {
        return <NotFoundPage />;
    }

    return (
        <div className="main-wrapper">
            {activeOccasion && <SpecialMessage message={activeOccasion.message} />}
            <QuoteCard unlockedReward={isDetailsVisible ? quizData.reward : null} />

            {isDetailsVisible && <DateDetailsCard anniversaryDate={quizData.anniversaryDate} />}

            {!isDetailsVisible && (
                <button className="interactive-button" onClick={() => setQuizOpen(true)} disabled={!quizData}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                    {quizData.title || "Unlock Our Story"}
                </button>
            )}

            {isQuizOpen && quizData && (
                <QuizModal
                    gameData={quizData}
                    onSuccess={handleQuizSuccess}
                    onClose={() => setQuizOpen(false)}
                />
            )}

        </div>
    );
};

export default QuizPage;