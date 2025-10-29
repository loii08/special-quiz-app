import React from 'react';
import './RewardCard.css';

const MessageRewardCard = ({ title, body }) => {
    return (
        <div className="card reward-card message-reward-card">
            {title && <h2 className="reward-title">{title}</h2>}
            <p className="reward-body">{body}</p>
        </div>
    );
};

export default MessageRewardCard;