import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="confirm-modal-content">
                <div className="confirm-icon">🗑️</div>
                <h3>Are you sure?</h3>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="delete-confirm-btn">
                        Yes, Delete It
                    </button>
                    <button onClick={onCancel} className="secondary-button">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;