document.addEventListener("DOMContentLoaded", () => {
  const fixedStartDate = "2021-02-23";

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
  
  function calculateAndDisplay() {
    const startDate = new Date(fixedStartDate);
    const endDate = new Date();
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dom.startDateDisplay.textContent = startDate.toLocaleDateString('en-US', options);
    dom.endDateDisplay.textContent = endDate.toLocaleDateString('en-US', options);

    checkSpecialOccasions(startDate, endDate);
    
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
    
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
  
  function checkSpecialOccasions(startDate, currentDate) {
    const startDay = startDate.getDate();
    const startMonth = startDate.getMonth();
    
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    if (startMonth === currentMonth && startDay === currentDay) {
      applyAnniversaryTheme();
      return;
    }
    
    if (startDay === currentDay) {
      applyHeartsDayTheme();
      return;
    }
    
    if (currentMonth === 9 && currentDay === 31) {
      applyHalloweenTheme();
      return;
    }
    
    if (currentMonth === 11 && currentDay === 25) {
      applyChristmasTheme();
      return;
    }
    
    if (currentMonth === 0 && currentDay === 1) {
      applyNewYearTheme();
      return;
    }
    
    const easterDate = calculateEaster(currentYear);
    if (currentMonth === easterDate.getMonth() && currentDay === easterDate.getDate()) {
      applyEasterTheme();
      return;
    }
    
    removeSpecialThemes();
  }
  
  function calculateEaster(year) {
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
  
  function applyHeartsDayTheme() {
    clearAllThemesAndEffects();
    dom.body.classList.add('hearts-day');
    startInfiniteFloating('hearts', 1500);
    startInfiniteFloating('emojis', 2000);
    addSpecialMessage("❤️ Happy Monthsary! ❤️");
  }
  
  function applyAnniversaryTheme() {
    clearAllThemesAndEffects();
    dom.body.classList.add('anniversary');
    startInfiniteFloating('hearts', 1200);
    startInfiniteFloating('emojis', 1800);
    startInfiniteFloating('confetti', 1000);
    addSpecialMessage("🎉 Happy Anniversary! 🎉");
  }
  
  function applyHalloweenTheme() {
    clearAllThemesAndEffects();
    dom.body.classList.add('halloween');
    startInfiniteFloating('halloween', 1500);
    addSpecialMessage("🎃 Happy Halloween! 🎃");
  }
  
  function applyChristmasTheme() {
    clearAllThemesAndEffects();
    dom.body.classList.add('christmas');
    startInfiniteFloating('christmas', 1300);
    startInfiniteFloating('confetti', 1600);
    addSpecialMessage("🎄 Merry Christmas! 🎄");
  }
  
  function applyNewYearTheme() {
    clearAllThemesAndEffects();
    dom.body.classList.add('new-year');
    startInfiniteFloating('new-year', 1000);
    startInfiniteFloating('confetti', 800);
    addSpecialMessage("🎆 Happy New Year! 🎆");
  }
  
  function applyEasterTheme() {
    clearAllThemesAndEffects();
    dom.body.classList.add('easter');
    startInfiniteFloating('easter', 1500);
    addSpecialMessage("🐰 Happy Easter! 🐰");
  }
  
  function removeSpecialThemes() {
    clearAllThemesAndEffects();
  }

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
        const confettiElement = document.createElement('div');
        const randomLeftConfetti = Math.random();
        
        confettiElement.style.setProperty('--random-left', randomLeftConfetti);
        confettiElement.classList.add('confetti');
        
        const colors = ['#4361ee', '#3a0ca3', '#4cc9f0', '#f72585', '#7209b7'];
        confettiElement.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(confettiElement);
        
        setTimeout(() => {
          if (confettiElement.parentNode) {
            confettiElement.parentNode.removeChild(confettiElement);
          }
        }, 5000);
        return;
      case 'sparkles':
        const sparkleElement = document.createElement('div');
        const randomLeftSparkle = Math.random();
        
        sparkleElement.style.setProperty('--random-left', randomLeftSparkle);
        sparkleElement.classList.add('sparkle');
        
        document.body.appendChild(sparkleElement);
        
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
    
    const clickHandler = () => {
      element.classList.add('popped');
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 500);
      element.removeEventListener('click', clickHandler);
    };
    element.addEventListener('click', clickHandler);

    document.body.appendChild(element);
    
  }
  
  function addSpecialMessage(message) {
    // Remove any existing special message
    const existingMessage = document.querySelector('.special-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('special-message');
    messageElement.textContent = message;
    
    dom.mainWrapper.insertBefore(messageElement, dom.quoteContainer);
  }
  
  async function displayRandomQuote() {
    dom.quoteText.classList.add('text-fade-out');
    dom.quoteAuthor.classList.add('text-fade-out');

    setTimeout(async () => {
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

      dom.quoteText.classList.remove('text-fade-out');
      dom.quoteAuthor.classList.remove('text-fade-out');

      const randomAnimation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
      dom.quoteText.classList.add(randomAnimation);
      dom.quoteAuthor.classList.add(randomAnimation);

      requestAnimationFrame(() => {
        dom.quoteText.classList.remove(randomAnimation);
        dom.quoteAuthor.classList.remove(randomAnimation);
      });

      setTimeout(displayRandomQuote, 10000);
    }, 500);
  }
  
  function handleCorrectAnswer() {
    hideAllModals();
    score++;
    
    if (score >= scoreGoal) {
      dom.resultCloseBtn.textContent = "Okay";
      dom.resultCloseBtn.classList.remove('hidden');
      dom.tryAgainBtn.classList.add('hidden');
      dom.cancelBtn.classList.add('hidden');

      dom.resultEmoji.textContent = "🎉";
      dom.resultMessage.textContent = "Congratulations! You've unlocked the details!";
      showModal(dom.resultModal);
      
      for (let i = 0; i < 50; i++) {
        setTimeout(() => createSingleFloatingElement('confetti'), i * 50);
      }
      
      dom.dateDetailsCard.classList.remove('hidden');
      dom.showDetailsBtn.classList.add('hidden');
      
      score = 0;
      
      clearTimeout(detailsTimeout);
      detailsTimeout = setTimeout(() => {
        dom.dateDetailsCard.classList.add('hidden');
        dom.showDetailsBtn.classList.remove('hidden');
      }, 60000);
    } else {
      dom.resultEmoji.textContent = "✅";
      dom.resultMessage.textContent = `Correct! Only ${scoreGoal - score} more to go!`;
      
      dom.tryAgainBtn.textContent = "Next Question";
      dom.tryAgainBtn.classList.remove('hidden');
      dom.cancelBtn.classList.add('hidden');
      dom.resultCloseBtn.classList.add('hidden');
      
      showModal(dom.resultModal);

      for (let i = 0; i < 20; i++) {
        setTimeout(() => createSingleFloatingElement('confetti'), i * 50);
      }
    }
  }

  function handleWrongAnswer() {
    wrongAnswerCount++;
    hideAllModals();
    const randomMsg = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
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
    dom.qaInput.value = "";
  }

  function askNewQuestion() {
    dom.modalScore.textContent = `Score: ${score} / ${scoreGoal}`;

    if (availableQuestions.length === 0) {
      availableQuestions = [...questions];
    }

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];

    dom.qaQuestion.textContent = currentQuestion.question;
    showModal(dom.qaModal);
    dom.qaInput.focus();
  }

  dom.showDetailsBtn.addEventListener('click', () => {
    if (currentQuestion) {
      availableQuestions.splice(availableQuestions.indexOf(currentQuestion), 1);
    }
    score = 0;
    wrongAnswerCount = 0;
    availableQuestions = [...questions];
    askNewQuestion();
  });

  dom.tryAgainBtn.addEventListener('click', () => {
    dom.tryAgainBtn.textContent = "Try Again";
    hideModal(dom.resultModal);
    askNewQuestion();
  });
  
  dom.qaSubmitBtn.addEventListener('click', () => {
    checkAnswer();
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
      dom.cancelBtn.click();
    } else {
      correctlyAnsweredIDs = [];
      hideModal(dom.qaModal);
    }
  });
  dom.cancelBtn.addEventListener('click', () => {
    hideAllModals();

    const randomMsg = cancelMessages[Math.floor(Math.random() * cancelMessages.length)];

    dom.resultEmoji.textContent = randomMsg.emoji;
    dom.resultMessage.textContent = randomMsg.msg;

    dom.resultCloseBtn.textContent = "Okay";
    dom.resultCloseBtn.classList.remove('hidden');
    dom.tryAgainBtn.classList.add('hidden');
    dom.cancelBtn.classList.add('hidden');

    showModal(dom.resultModal);

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
      questions = [{ question: "What year did the relationship start?", answer: "2023" }];
      wrongMessages = [{ msg: "That's not quite right. Try again!", emoji: "🤔" }];
      cancelMessages = [{ msg: "Quitting so soon?", emoji: "😜" }];
    }

    calculateAndDisplay();
    displayRandomQuote();
    setInterval(calculateAndDisplay, 60000);
  }

  initializeApp();
});