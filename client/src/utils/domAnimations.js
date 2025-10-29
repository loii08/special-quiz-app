const funnyEmojis = ['😭', '💔', '👎', '😡', '😤', '😵'];

export const createFallingEmojis = (count) => {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const element = document.createElement('div');
            element.style.setProperty('--random-left', Math.random());
            element.classList.add('floating-emoji');
            element.textContent = funnyEmojis[Math.floor(Math.random() * funnyEmojis.length)];
            
            const size = 20 + Math.random() * 20;
            element.style.fontSize = `${size}px`;
            
            const duration = 8 + Math.random() * 7;
            element.style.animationDuration = `${duration}s`;

            document.body.appendChild(element);

            setTimeout(() => {
                element.remove();
            }, duration * 1000);
        }, i * 150);
    }
};