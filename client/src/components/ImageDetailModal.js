import React, { useEffect } from 'react';
import './ImageDetailModal.css';

const ImageDetailModal = ({ imageUrl, title, body, onClose }) => {
    useEffect(() => {
        document.body.classList.add('modal-open');

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, []);

    if (!imageUrl) return null;

    return (
        <div className="image-detail-modal-overlay" onClick={onClose}>
            <div className="image-detail-modal-wrapper" onClick={e => e.stopPropagation()}>
                <button className="modal-close-icon" onClick={onClose} aria-label="Close modal">&times;</button>
                <div className="image-detail-modal-content">
                    <div className="fullscreen-image-container">
                        <img src={imageUrl} alt={title || 'Reward Image'} className="fullscreen-image" />
                    </div>
                    <div className="fullscreen-text-content">
                        {title && <h2 className="fullscreen-title">{title}</h2>}
                        {body && <p className="fullscreen-body">{body}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageDetailModal;