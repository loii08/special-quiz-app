import React, { useState, useEffect } from 'react';
import ImageRewardCard from './ImageRewardCard.js';
import MessageRewardCard from './MessageRewardCard.js';
import ImageDetailModal from './ImageDetailModal.js';

const localQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { text: "Get busy living or get busy dying.", author: "Stephen King" },
    { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
];

const QuoteCard = ({ unlockedReward }) => {
    const [quote, setQuote] = useState({ text: 'Loading...', author: '' });
    const [source, setSource] = useState('local'); // 'local' or 'api'
    const [isImageModalOpen, setImageModalOpen] = useState(false);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await fetch("https://api.realinspire.live/v1/quotes/random");
                if (!response.ok) throw new Error('Network response was not ok.');
                
                const data = await response.json();
                if (data && data.length > 0) {
                    setQuote({ text: data[0].content, author: data[0].author });
                    setSource('api');
                } else {
                    throw new Error('API returned no data');
                }
            } catch (error) {
                console.error("Failed to fetch API quote, using fallback:", error);
                const fallbackQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
                setQuote({ text: fallbackQuote.text, author: fallbackQuote.author });
                setSource('local');
            }
        };

        fetchQuote();

        const intervalId = setInterval(fetchQuote, 10000);

        return () => clearInterval(intervalId);
    }, []);

    if (unlockedReward && unlockedReward.content) {
        const { imageUrl, messageBody } = unlockedReward.content;

        if (imageUrl) {
            return (
                <>
                    <ImageRewardCard 
                        imageUrl={imageUrl} 
                        title={unlockedReward.content.messageTitle}
                        onClick={() => setImageModalOpen(true)}
                    />
                    {isImageModalOpen && (
                        <ImageDetailModal 
                            {...unlockedReward.content}
                            body={unlockedReward.content.messageBody}
                            onClose={() => setImageModalOpen(false)}
                        />
                    )}
                </>
            );
        }
        if (messageBody) {
            return <MessageRewardCard title={unlockedReward.content.messageTitle} body={messageBody} />;
        }
    }

    return (
        <div className="card quote-card">
            <div className={`quote-source-indicator ${source}-source`}></div>
            <blockquote className="quote-text">{quote.text}</blockquote>
            {quote.author && <figcaption className="quote-author">— {quote.author}</figcaption>}
        </div>
    );
};

export default QuoteCard;