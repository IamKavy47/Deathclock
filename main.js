import { gsap } from 'gsap';

// Quotes about mortality
const quotes = [
  "Memento mori - Remember that you must die",
  "Time is the fire in which we burn",
  "Life is short, and art long",
  "Every man dies, not every man really lives",
  "Death is not the greatest loss in life. The greatest loss is what dies inside us while we live"
];

// State
let birthYear;
let deathYear;
let timeInterval;

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const timerScreen = document.getElementById('timer-screen');
const lifeForm = document.getElementById('life-form');
const customDeathCheckbox = document.getElementById('customDeath');
const deathYearGroup = document.getElementById('deathYearGroup');
const quoteElement = document.getElementById('quote');

// Initialize
function init() {
  setupEventListeners();
  rotateQuotes();
  loadGoals();
}

// Event Listeners
function setupEventListeners() {
  customDeathCheckbox.addEventListener('change', toggleDeathYearInput);
  lifeForm.addEventListener('submit', handleFormSubmit);
  document.getElementById('save-goal').addEventListener('click', saveGoal);
}

// Toggle death year input visibility
function toggleDeathYearInput(e) {
  deathYearGroup.style.display = e.target.checked ? 'block' : 'none';
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  birthYear = parseInt(document.getElementById('birthYear').value);
  if (customDeathCheckbox.checked) {
    deathYear = parseInt(document.getElementById('deathYear').value);
  } else {
    deathYear = birthYear + 75; // Default life expectancy
  }

  startCountdown();
}

// Start the countdown
function startCountdown() {
  gsap.to(setupScreen, {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      setupScreen.classList.remove('active');
      timerScreen.classList.add('active');
      gsap.from(timerScreen, {
        opacity: 0,
        duration: 1
      });
    }
  });

  updateCountdown();
  timeInterval = setInterval(updateCountdown, 1000);
}

// Update countdown timer
function updateCountdown() {
  const now = new Date();
  const death = new Date(deathYear, 0, 1);
  const timeLeft = death - now;

  if (timeLeft <= 0) {
    clearInterval(timeInterval);
    document.querySelector('.countdown').innerHTML = '<h2>Your time has expired</h2>';
    return;
  }

  const years = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor((timeLeft % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor((timeLeft % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  document.getElementById('years').textContent = years;
  document.getElementById('months').textContent = months;
  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;

  updateProgressBar(now);
}

// Update progress bar
function updateProgressBar(now) {
  const totalLife = new Date(deathYear, 0, 1) - new Date(birthYear, 0, 1);
  const lived = now - new Date(birthYear, 0, 1);
  const progress = (lived / totalLife) * 100;
  
  gsap.to('#progress-bar', {
    width: `${progress}%`,
    duration: 0.5
  });
}

// Rotate quotes
function rotateQuotes() {
  let currentQuote = 0;
  
  function showNextQuote() {
    gsap.to(quoteElement, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        quoteElement.textContent = quotes[currentQuote];
        gsap.to(quoteElement, {
          opacity: 1,
          duration: 1
        });
        currentQuote = (currentQuote + 1) % quotes.length;
      }
    });
  }

  showNextQuote();
  setInterval(showNextQuote, 10000);
}

// Goals functionality
function saveGoal() {
  const goalInput = document.getElementById('goal-input');
  const goal = goalInput.value.trim();
  
  if (goal) {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    goals.push(goal);
    localStorage.setItem('goals', JSON.stringify(goals));
    goalInput.value = '';
    loadGoals();
  }
}

function loadGoals() {
  const savedGoals = document.getElementById('saved-goals');
  const goals = JSON.parse(localStorage.getItem('goals') || '[]');
  
  savedGoals.innerHTML = goals.map(goal => `
    <div class="goal">${goal}</div>
  `).join('');
}

// Initialize the application
init();
