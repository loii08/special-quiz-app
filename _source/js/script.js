document.addEventListener("DOMContentLoaded", () => {
  const fixedStartDate = "2023-02-23";

  // Cache DOM elements
  const dom = {
    startDateDisplay: document.getElementById("startDateDisplay"),
    endDateDisplay: document.getElementById("endDateDisplay"),
    years: document.getElementById("years"),
    months: document.getElementById("months"),
    days: document.getElementById("days"),
    totalDays: document.getElementById("totalDays"),
    totalMonths: document.getElementById("totalMonths"),
    quoteContainer: document.getElementById("quoteContainer"),
    quoteText: document.getElementById("quoteText"),
    quoteAuthor: document.getElementById("quoteAuthor"),
    quoteSourceIndicator: document.getElementById("quoteSourceIndicator"),
    dateDetailsCard: document.getElementById("dateDetailsCard"),
    showDetailsBtn: document.getElementById("showDetailsBtn"),
    qaModal: document.getElementById("qaModal"),
    qaQuestion: document.getElementById("qaQuestion"),
    qaInput: document.getElementById("qaInput"),
    qaSubmitBtn: document.getElementById("qaSubmitBtn"),
    qaCloseBtn: document.getElementById("qaCloseBtn"),
    resultModal: document.getElementById("resultModal"),
    modalScore: document.getElementById("modalScore"),
    resultEmoji: document.getElementById("resultEmoji"),
    resultMessage: document.getElementById("resultMessage"),
    resultCloseBtn: document.getElementById("resultCloseBtn"),
    tryAgainBtn: document.getElementById("tryAgainBtn"),
    cancelBtn: document.getElementById("cancelBtn"),
    body: document.body,
    mainWrapper: document.querySelector('.main-wrapper')
  };

  // Game data will be loaded from game-data.json
  let questions = [];
  let wrongMessages = [];
  let cancelMessages = [];
  let correctlyAnsweredIDs = [];

  let currentQuestion = null;
  let detailsTimeout = null;
  let score = 0;
  let wrongAnswerCount = 0;
  const scoreGoal = 5;

  function showModal(modal) {
    modal.classList.remove('hidden');
  }

  function hideModal(modal) {
    modal.classList.add('hidden');
  }

  function hideAllModals() {
    hideModal(dom.qaModal);
    hideModal(dom.resultModal);
  }

  let activeIntervals = [];

  const localQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "Whoever is happy will make others happy too.", author: "Anne Frank" },
    { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
    { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
    { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
    { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
    { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
    { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas A. Edison" }
  ];
  
  // Animation types
  const animationTypes = [
    'fade-out', 'slide-up', 'slide-down', 'slide-in-right', 
    'slide-in-left', 'zoom-in', 'flip-in', 'bounce-in', 'rotate-in'
  ];
  
  /**
   * Calculates and displays the time span.
   */
  function calculateAndDisplay() {
    const startDate = new Date(fixedStartDate);
    const endDate = new Date(); // Use today's date
    
    // --- 1. Display Formatted Dates ---
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dom.startDateDisplay.textContent = startDate.toLocaleDateString('en-US', options);
    dom.endDateDisplay.textContent = endDate.toLocaleDateString('en-US', options);

    // --- 2. Check for special occasions and apply themes ---
    checkSpecialOccasions(startDate, endDate);
    
    // --- 3. Calculate and Display Time Span ---
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
    
    // Calculate total months (using average days per month)
    const diffMonths = (diffDays / 30.436875).toFixed(1);
    
    dom.totalDays.textContent = `Total: ${diffDays.toLocaleString()} days`;
    dom.totalMonths.textContent = `Total: ${diffMonths} months`;
    
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();
    
    if (days < 0) {
      months--;
      const daysInPrevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
      days += daysInPrevMonth;
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    dom.years.textContent = years;
    dom.months.textContent = months;
    dom.days.textContent = days;
  }
  
  /**
   * Checks for special occasions and applies appropriate themes
   */
  function checkSpecialOccasions(startDate, currentDate) {
    const startDay = startDate.getDate();
    const startMonth = startDate.getMonth();
    
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Check for anniversary (same month and day)
    if (startMonth === currentMonth && startDay === currentDay) {
      applyAnniversaryTheme();
      return;
    }
    
    // Check for hearts day (same day of month)
    if (startDay === currentDay) {
      applyHeartsDayTheme();
      return;
    }
    
    // Check for Halloween (October 31)
    if (currentMonth === 9 && currentDay === 31) {
      applyHalloweenTheme();
      return;
    }
    
    // Check for Christmas (December 25)
    if (currentMonth === 11 && currentDay === 25) {
      applyChristmasTheme();
      return;
    }
    
    // Check for New Year (January 1)
    if (currentMonth === 0 && currentDay === 1) {
      applyNewYearTheme();
      return;
    }
    
    // Check for Easter (simplified calculation - first Sunday after first full moon after March 21)
    const easterDate = calculateEaster(currentYear);
    if (currentMonth === easterDate.getMonth() && currentDay === easterDate.getDate()) {
      applyEasterTheme();
      return;
    }
    
    // Default theme (no special occasion)
    removeSpecialThemes();
  }
  
  /**
   * Calculates Easter date for a given year
   */
  function calculateEaster(year) {
    // Anonymous Gregorian algorithm
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    
    return new Date(year, month - 1, day);
  }
  
  /**
   * Applies Hearts Day theme
   */
  function applyHeartsDayTheme() {
    clearAllThemesAndEffects();
    dom.body.classList.add('hearts-day');
    startInfiniteFloating('hearts', 1500);
    startInfiniteFloating('emojis', 2000);
    addSpecialMessage("❤️ Happy Monthsary! ❤️");
  }
  
  /**
   * Applies Anniversary theme
   */
  function applyAnniversaryTheme() {
    clearAllThemesAndEffects();
    dom.body.classList.add('anniversary');
    startInfiniteFloating('hearts', 1200);
    startInfiniteFloating('emojis', 1800);
    startInfiniteFloating('confetti', 1000);
    addSpecialMessage("🎉 Happy Anniversary! 🎉");
  }
  
  /**
   * Applies Halloween theme
   */
  function applyHalloweenTheme() {
    clearAllThemesAndEffects();
    dom.body.classList.add('halloween');
    startInfiniteFloating('halloween', 1500);
    addSpecialMessage("🎃 Happy Halloween! 🎃");
  }
  
  /**
   * Applies Christmas theme
   */
  function applyChristmasTheme() {
    clearAllThemesAndEffects();
    dom.body.classList.add('christmas');
    startInfiniteFloating('christmas', 1300);
    startInfiniteFloating('confetti', 1600);
    addSpecialMessage("🎄 Merry Christmas! 🎄");
  }
  
  /**
   * Applies New Year theme
   */
  function applyNewYearTheme() {
    clearAllThemesAndEffects();
    dom.body.classList.add('new-year');
    startInfiniteFloating('new-year', 1000);
    startInfiniteFloating('confetti', 800);
    addSpecialMessage("🎆 Happy New Year! 🎆");
  }
  
  /**
   * Applies Easter theme
   */
  function applyEasterTheme() {
    clearAllThemesAndEffects();
    dom.body.classList.add('easter');
    startInfiniteFloating('easter', 1500);
    addSpecialMessage("🐰 Happy Easter! 🐰");
  }
  
  /**
   * Removes special occasion themes
   */
  function removeSpecialThemes() {
    clearAllThemesAndEffects();
  }

  /**
   * Clears all active intervals and removes theme classes and messages.
   */
  function clearAllThemesAndEffects() {
    activeIntervals.forEach(clearInterval);
    activeIntervals = [];

    dom.body.classList.remove('hearts-day', 'anniversary', 'halloween', 'christmas', 'new-year', 'easter');

    const existingMessage = document.querySelector('.special-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const floatingElements = document.querySelectorAll('.floating-heart, .floating-emoji, .confetti, .sparkle');
    floatingElements.forEach(el => el.remove());
  }

  function startInfiniteFloating(type, interval) {
    const intervalId = setInterval(() => createSingleFloatingElement(type), interval);
    activeIntervals.push(intervalId);
  }

  function createSingleFloatingElement(type) {
    let elements = [];
    
    // Define emojis based on type
    switch(type) {
      case 'hearts':
        elements = ['💖', '💕', '💘', '💝', '💓', '💗', '💞'];
        break;
      case 'emojis':
        elements = ['😍', '🥰', '😘', '❤️', '✨', '🌟'];
        break;
      case 'halloween':
        elements = ['🎃', '👻', '🕷️', '🕸️', '💀', '🦇', '🍬', '🍭'];
        break;
      case 'christmas':
        elements = ['🎄', '🎅', '🤶', '🦌', '⭐', '🔔', '🎁', '🧦'];
        break;
      case 'new-year':
        elements = ['🎆', '🎇', '✨', '🌟', '🥳', '🎊', '🎉'];
        break;
      case 'easter':
        elements = ['🐰', '🐣', '🐤', '🌷', '🌸', '🥚', '🌼'];
        break;
      case 'funny':
        elements = ['😭', '💔', '👎', '😡', '😤'];
        break;
      case 'confetti':
        // For confetti, we'll create colored divs instead of emojis
        const confettiElement = document.createElement('div');
        const randomLeftConfetti = Math.random();
        
        confettiElement.style.setProperty('--random-left', randomLeftConfetti);
        confettiElement.classList.add('confetti');
        
        // Random color for confetti
        const colors = ['#4361ee', '#3a0ca3', '#4cc9f0', '#f72585', '#7209b7'];
        confettiElement.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(confettiElement);
        
        // Remove element after animation completes
        setTimeout(() => {
          if (confettiElement.parentNode) {
            confettiElement.parentNode.removeChild(confettiElement);
          }
        }, 5000);
        return;
      case 'sparkles':
        // For sparkles, create small white divs
        const sparkleElement = document.createElement('div');
        const randomLeftSparkle = Math.random();
        
        sparkleElement.style.setProperty('--random-left', randomLeftSparkle);
        sparkleElement.classList.add('sparkle');
        
        document.body.appendChild(sparkleElement);
        
        // Remove element after animation completes
        setTimeout(() => {
          if (sparkleElement.parentNode) {
            sparkleElement.parentNode.removeChild(sparkleElement);
          }
        }, 3000);
        return;
    }
    
    const element = document.createElement('div');
    const randomLeft = Math.random();
    const randomEmoji = elements[Math.floor(Math.random() * elements.length)];
    
    element.style.setProperty('--random-left', randomLeft);
    element.classList.add('floating-emoji');
    element.textContent = randomEmoji;
    
    const size = 20 + Math.random() * 20;
    element.style.fontSize = `${size}px`;
    
    const duration = 8 + Math.random() * 7;
    element.style.animationDuration = `${duration}s`;
    
    document.body.appendChild(element);
    
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, duration * 1000);
  }
  
  /**
   * Adds a special message above the quotes
   */
  function addSpecialMessage(message) {
    // Remove any existing special message
    const existingMessage = document.querySelector('.special-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('special-message');
    messageElement.textContent = message;
    
    // Insert the message above the quote container
    dom.mainWrapper.insertBefore(messageElement, dom.quoteContainer);
  }
  
  /**
   * Displays a random quote with animation
   */
  async function displayRandomQuote() {
    // Animate out the text only
    dom.quoteText.classList.add('text-fade-out');
    dom.quoteAuthor.classList.add('text-fade-out');

    // Wait for fade-out to complete before fetching new content
    setTimeout(async () => {
      
      // Fetch new content
      try {
        const response = await fetch("https://api.realinspire.live/v1/quotes/random");
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        if (data && data.length > 0) {
          dom.quoteText.textContent = data[0].content;
          dom.quoteAuthor.textContent = `— ${data[0].author}`;
        }
        dom.quoteSourceIndicator.className = 'quote-source-indicator api-source';
      } catch (error) {
        console.error("Failed to fetch quote:", error);
        const fallbackQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
        dom.quoteText.textContent = fallbackQuote.text;
        dom.quoteAuthor.textContent = `— ${fallbackQuote.author}`;
        dom.quoteSourceIndicator.className = 'quote-source-indicator local-source';
      }

      // Animate in with new content
      // Select a random animation for the new quote to enter with
      dom.quoteText.classList.remove('text-fade-out');
      dom.quoteAuthor.classList.remove('text-fade-out');

      const randomAnimation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
      dom.quoteText.classList.add(randomAnimation);
      dom.quoteAuthor.classList.add(randomAnimation);

      requestAnimationFrame(() => {
        dom.quoteText.classList.remove(randomAnimation);
        dom.quoteAuthor.classList.remove(randomAnimation);
      });

      // Schedule the next quote change
      setTimeout(displayRandomQuote, 10000);
    }, 500); // This timeout should match the CSS transition duration for 'fade-out'
  }
  
  function handleCorrectAnswer() {
    hideAllModals();
    score++;
    
    if (score >= scoreGoal) {
      // Goal reached!
      dom.resultCloseBtn.textContent = "Okay"; // Change button text
      dom.resultCloseBtn.classList.remove('hidden');
      dom.tryAgainBtn.classList.add('hidden');
      dom.cancelBtn.classList.add('hidden');

      dom.resultEmoji.textContent = "🎉";
      dom.resultMessage.textContent = "Congratulations! You've unlocked the details!";
      showModal(dom.resultModal);
      
      // Show confetti
      for (let i = 0; i < 50; i++) {
        setTimeout(() => createSingleFloatingElement('confetti'), i * 50);
      }
      
      // Show details
      dom.dateDetailsCard.classList.remove('hidden');
      dom.showDetailsBtn.classList.add('hidden'); // Hide the button
      
      // Reset score for next time
      score = 0;
      
      // Set timer to hide details after 1 minute
      clearTimeout(detailsTimeout); // Clear any existing timer
      detailsTimeout = setTimeout(() => {
        dom.dateDetailsCard.classList.add('hidden');
        dom.showDetailsBtn.classList.remove('hidden'); // Show the button again
      }, 60000);
    } else {
      // Correct, but goal not reached yet. Show intermediate success message.
      dom.resultEmoji.textContent = "✅";
      dom.resultMessage.textContent = `Correct! Only ${scoreGoal - score} more to go!`;
      
      // Show "Next Question" button
      dom.tryAgainBtn.textContent = "Next Question";
      dom.tryAgainBtn.classList.remove('hidden');
      dom.cancelBtn.classList.add('hidden');
      dom.resultCloseBtn.classList.add('hidden');
      
      showModal(dom.resultModal);

      // Show a small confetti burst
      for (let i = 0; i < 20; i++) {
        setTimeout(() => createSingleFloatingElement('confetti'), i * 50);
      }
    }
  }

  function handleWrongAnswer() {
    wrongAnswerCount++;
    hideAllModals();
    const randomMsg = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
    // Show "Try Again" and "Cancel", hide the single "Close" button
    dom.tryAgainBtn.classList.remove('hidden');
    dom.cancelBtn.classList.remove('hidden');
    dom.resultCloseBtn.classList.add('hidden');

    dom.resultEmoji.textContent = randomMsg.emoji;
    dom.resultMessage.textContent = randomMsg.msg;
    showModal(dom.resultModal);
  }

  function checkAnswer() {
    const userAnswer = dom.qaInput.value.trim();
    if (!userAnswer) return;

    if (userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
      if (currentQuestion && !correctlyAnsweredIDs.includes(currentQuestion.ID)) {
        correctlyAnsweredIDs.push(currentQuestion.ID);
      }
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
    dom.qaInput.value = ""; // Clear input
  }

  function askNewQuestion() {
    // Update score display inside the modal
    dom.modalScore.textContent = `Score: ${score} / ${scoreGoal}`;

    // If we've run out of unique questions, reset the pool
    if (availableQuestions.length === 0) {
      availableQuestions = [...questions];
    }

    // Select a random question
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];

    dom.qaQuestion.textContent = currentQuestion.question;
    showModal(dom.qaModal);
    dom.qaInput.focus();
  }

  // --- Event Listeners ---
  dom.showDetailsBtn.addEventListener('click', () => {
    // When a new game starts, remove the last answered question from the pool
    if (currentQuestion) {
      availableQuestions.splice(availableQuestions.indexOf(currentQuestion), 1);
    }
    // Reset game state when starting a new game
    score = 0;
    wrongAnswerCount = 0;
    availableQuestions = [...questions]; // Create a fresh pool of questions
    askNewQuestion();
  });

  dom.tryAgainBtn.addEventListener('click', () => {
    dom.tryAgainBtn.textContent = "Try Again"; // Reset button text
    hideModal(dom.resultModal);
    askNewQuestion();
  });
  
  dom.qaSubmitBtn.addEventListener('click', () => {
    checkAnswer();
    // Remove the answered question from the pool if correct
    if (userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
      availableQuestions.splice(availableQuestions.indexOf(currentQuestion), 1);
    }
  });

  dom.qaSubmitBtn.addEventListener('click', checkAnswer);
  dom.qaInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  });

  dom.qaCloseBtn.addEventListener('click', () => {
    if (wrongAnswerCount > 0) {
      // If user made a mistake, closing is treated as cancelling.
      dom.cancelBtn.click(); // Programmatically click the cancel button
    } else {
      // If no mistakes, just close the modal and reset the game.
      correctlyAnsweredIDs = [];
      hideModal(dom.qaModal);
    }
  });
  dom.cancelBtn.addEventListener('click', () => {
    hideAllModals();

    // Select a random cancel message
    const randomMsg = cancelMessages[Math.floor(Math.random() * cancelMessages.length)];

    // Update the result modal content
    dom.resultEmoji.textContent = randomMsg.emoji;
    dom.resultMessage.textContent = randomMsg.msg;

    // Reconfigure buttons to show only "Okay"
    dom.resultCloseBtn.textContent = "Okay";
    dom.resultCloseBtn.classList.remove('hidden');
    dom.tryAgainBtn.classList.add('hidden');
    dom.cancelBtn.classList.add('hidden');

    showModal(dom.resultModal);

    // Show a burst of "funny" emoji confetti
    for (let i = 0; i < 20; i++) {
      setTimeout(() => createSingleFloatingElement('funny'), i * 100);
    }
  });
  dom.resultCloseBtn.addEventListener('click', () => hideModal(dom.resultModal));
  document.addEventListener('click', (e) => {
    if (e.target === dom.qaModal || e.target === dom.resultModal) {
      hideAllModals();
    }
  });

  async function initializeApp() {
    try {
      const response = await fetch('_source/js/game-data.json');
      if (!response.ok) throw new Error('Network response was not ok for game data.');
      const gameData = await response.json();
      questions = gameData.questions;
      wrongMessages = gameData.wrongMessages;
      cancelMessages = gameData.cancelMessages;
    } catch (error) {
      console.error("Could not load game data from JSON file:", error);
      // Fallback to a single question if the JSON fails to load
      questions = [{ question: "What year did the relationship start?", answer: "2023" }];
      wrongMessages = [{ msg: "That's not quite right. Try again!", emoji: "🤔" }];
      cancelMessages = [{ msg: "Quitting so soon?", emoji: "😜" }];
    }

    // Initialize the application
    calculateAndDisplay();
    // Initial call to start the quote cycle
    displayRandomQuote();
    // Update time calculations every minute
    setInterval(calculateAndDisplay, 60000);
  }

  initializeApp();
});