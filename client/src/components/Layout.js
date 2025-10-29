import React, { useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { init as initConfetti } from '../utils/canvasConfetti.js';
import Navbar from './Navbar.js';
import AuthModal from './AuthModal.js';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext.js';

const Layout = ({ children }) => {
    const { colorMode, toggleColorMode, specialTheme } = useTheme();
    const { isAuthModalOpen } = useAuth();

    useEffect(() => {
        const canvas = document.getElementById('confetti-canvas');
        if (canvas) {
            initConfetti(canvas);
        }
    }, []);

    return (
        <>
            {isAuthModalOpen && <AuthModal />}
            <Navbar />
            <canvas id="confetti-canvas"></canvas>
            {children}
            <footer className="footer">
                <span>ChanLoii © 2025 • Created by Kenneth</span>
                <ThemeToggle colorMode={colorMode} toggleColorMode={toggleColorMode} isSpecialOccasion={!!specialTheme} />
            </footer>
        </>
    );
};

export default Layout;