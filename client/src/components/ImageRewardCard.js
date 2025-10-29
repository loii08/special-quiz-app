import React from 'react';
import './RewardCard.css';

const ImageRewardCard = ({ imageUrl, title, onClick }) => {
    return (
        <div className="card reward-card image-reward-card" onClick={onClick}>
            {imageUrl && (
                <div className="image-container">
                    <img src={imageUrl} alt={title || 'Reward Image'} className="reward-image" />
                    {title && <span className="image-title-overlay">{title}</span>}
                </div>
            )}
        </div>
    );
};

export default ImageRewardCard;