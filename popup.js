// Toggle the pause state
function togglePause() {
  isPaused = !isPaused;

  if (isPaused) {
    // Pause the timer
    clearInterval(timerInterval);
    timerStatusElement.style.display = "block";
    editorElement.disabled = true;
  } else {
    // Resume the timer
    startTimer();
    editorElement.disabled = false;
    editorElement.focus();
  }

  updatePauseButtonState();
  saveWritingProgress();
}

// Update the pause button appearance based on state
function updatePauseButtonState() {
  if (isPaused) {
    pauseButton.classList.add("paused");

    // Update SVG icons
    if (pauseIcon && playIcon) {
      pauseIcon.style.display = "none";
      playIcon.style.display = "block";
    }

    // Update text fallback
    if (pauseText && playText) {
      pauseText.style.display = "none";
      playText.style.display = "block";
    }

    timerStatusElement.style.display = "block";
    timerStatusElement.textContent = "Paused";
  } else {
    pauseButton.classList.remove("paused");

    // Update SVG icons
    if (pauseIcon && playIcon) {
      pauseIcon.style.display = "block";
      playIcon.style.display = "none";
    }

    // Update text fallback
    if (pauseText && playText) {
      pauseText.style.display = "block";
      playText.style.display = "none";
    }

    timerStatusElement.style.display = "none";
  }
} // Prompts database
const prompts = [
  "Describe an old memory that still makes you smile.",
  "Rewrite a scene from your favorite movie from a different character's perspective.",
  "Write about a place you've never been but would love to visit.",
  "Describe the most interesting person you met this week.",
  "If you could have any superpower, what would it be and how would you use it?",
  "Write a letter to your future self 10 years from now.",
  "Describe your perfect day from start to finish.",
  "Write about a challenge you overcame and what you learned from it.",
  "If your pet could talk, what would they say about you?",
  "Write a short story that includes a bicycle, a mysterious letter, and the smell of freshly baked bread.",
  "What would you do if you won the lottery tomorrow?",
  "Describe your favorite meal in elaborate detail.",
  "Write about a time when you felt out of your comfort zone.",
  "If you could have dinner with anyone, living or dead, who would it be and why?",
  "Describe your hometown to someone who has never been there.",
  "Write about a skill you want to learn and why it interests you.",
  "If you could relive one day of your life, which would it be?",
  "Write a story that begins with the line: 'The door opened by itself.'",
  "Describe a moment when you felt truly at peace.",
  "If you could change one thing about the world, what would it be?",
  "Write about your most prized possession and why it matters to you.",
  "Describe the view outside your window in poetic detail.",
  "Write about a time when you were surprised by kindness.",
  "If you could transport yourself into any book or movie, which would you choose?",
  "Describe the most beautiful natural scene you've ever witnessed.",
  "Write about a lesson you learned the hard way.",
  "If you could have a conversation with your teenage self, what would you say?",
  "Describe your dream home in detail.",
  "Write about a sound, smell, or taste that instantly transports you to childhood.",
  "If you could master any musical instrument, which would you choose and why?",
];

// DOM elements
const promptElement = document.getElementById("prompt");
const timerElement = document.getElementById("timer");
const timerStatusElement = document.getElementById("timerStatus");
const editorElement = document.getElementById("editor");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");
const analyzeButton = document.getElementById("analyzeButton");
const feedbackContainer = document.getElementById("feedbackContainer");
const grammarIssues = document.getElementById("grammarIssues");
const overusedWords = document.getElementById("overusedWords");
const passiveVoice = document.getElementById("passiveVoice");
const streakCountElement = document.getElementById("streakCount");
const totalWordsElement = document.getElementById("totalWords");
const completedPromptsElement = document.getElementById("completedPrompts");
const pauseIcon = document.getElementById("pauseIcon");
const playIcon = document.getElementById("playIcon");
const pauseText = document.getElementById("pauseText");
const playText = document.getElementById("playText");
const timeInput = document.getElementById("timeInput");
const timePresets = document.querySelectorAll(".time-preset");
const settingsContainer = document.getElementById("settingsContainer");

// Variables
let timeLeft = 20 * 60; // 20 minutes in seconds
let initialTimeInMinutes = 20; // Default time is 20 minutes
let timerInterval;
let currentDate = new Date().toDateString();
let stats = {
  lastWritingDate: "",
  streak: 0,
  totalWords: 0,
  completedPrompts: 0,
};
let autoSaveInterval;
let isPaused = false;

// Initialize the app
function init() {
  loadStats();
  updateStatsDisplay();
  displayDailyPrompt();
  loadWritingProgress();

  // Initialize time input with last used value or default
  chrome.storage.local.get(["lastTimeSelection"], function (data) {
    if (data.lastTimeSelection) {
      initialTimeInMinutes = data.lastTimeSelection;
      timeInput.value = initialTimeInMinutes;
      updateTimerWithNewTime();
    }
  });

  // Set up time preset buttons
  timePresets.forEach((button) => {
    button.addEventListener("click", function () {
      const presetTime = parseInt(this.dataset.time);
      timeInput.value = presetTime;
      updateTimerWithNewTime();
    });
  });

  // Handle manual time input changes
  timeInput.addEventListener("change", updateTimerWithNewTime);

  startButton.addEventListener("click", startWriting);
  pauseButton.addEventListener("click", togglePause);
  resetButton.addEventListener("click", confirmReset);
  analyzeButton.addEventListener("click", analyzeWriting);

  // Hide timer controls initially
  pauseButton.parentElement.style.display = "none";

  // Save progress when window/tab is closed
  window.addEventListener("beforeunload", saveWritingProgress);
}

// Confirm reset timer
function confirmReset() {
  if (
    confirm(
      "Reset the timer? This will keep your writing but restart the timer."
    )
  ) {
    resetTimer();
  }
}

// Reset the timer
function resetTimer() {
  // Clear existing intervals
  clearInterval(timerInterval);

  // Reset time to initial value
  timeLeft = initialTimeInMinutes * 60;
  updateTimerDisplay();

  // If not paused, restart the timer
  if (!isPaused) {
    startTimer();
  }

  // Save the state
  saveWritingProgress();
}

// Update timer display when time selection changes
function updateTimerWithNewTime() {
  // Validate input
  let minutes = parseInt(timeInput.value);

  // Enforce min/max bounds
  if (isNaN(minutes) || minutes < 1) {
    minutes = 1;
    timeInput.value = 1;
  } else if (minutes > 60) {
    minutes = 60;
    timeInput.value = 60;
  }

  initialTimeInMinutes = minutes;
  timeLeft = minutes * 60;
  updateTimerDisplay();

  // Save the time selection
  chrome.storage.local.set({
    lastTimeSelection: minutes,
  });
}

// Load prompts and check if we need a new one today
function displayDailyPrompt() {
  chrome.storage.local.get(["currentPrompt", "promptDate"], function (data) {
    if (data.promptDate === currentDate && data.currentPrompt) {
      // Use today's saved prompt
      promptElement.textContent = data.currentPrompt;
    } else {
      // Generate a new prompt for today
      const randomIndex = Math.floor(Math.random() * prompts.length);
      const todaysPrompt = prompts[randomIndex];
      promptElement.textContent = todaysPrompt;

      // Save today's prompt
      chrome.storage.local.set({
        currentPrompt: todaysPrompt,
        promptDate: currentDate,
      });
    }
  });
}

// Load user stats from storage
function loadStats() {
  chrome.storage.local.get(["writingStats"], function (data) {
    if (data.writingStats) {
      stats = data.writingStats;

      // Check if we need to update the streak
      const lastDate = new Date(stats.lastWritingDate);
      const today = new Date();

      // If last writing date was yesterday, maintain streak
      if (lastDate && isYesterday(lastDate, today)) {
        // Streak continues
      }
      // If it's been more than a day, reset streak
      else if (
        lastDate &&
        !isSameDay(lastDate, today) &&
        !isYesterday(lastDate, today)
      ) {
        stats.streak = 0;
        saveStats();
      }
    }
  });
}

// Save user stats to storage
function saveStats() {
  chrome.storage.local.set({
    writingStats: stats,
  });
}

// Update the stats display
function updateStatsDisplay() {
  streakCountElement.textContent = stats.streak;
  totalWordsElement.textContent = stats.totalWords;
  completedPromptsElement.textContent = stats.completedPrompts;
}

// Start the writing session
function startWriting() {
  editorElement.disabled = false;
  editorElement.focus();
  startButton.disabled = true;

  // Show timer controls
  pauseButton.parentElement.style.display = "flex";

  // Hide settings during writing
  settingsContainer.style.display = "none";

  // Reset pause state
  isPaused = false;
  updatePauseButtonState();

  // Load any saved time if we're resuming a session
  chrome.storage.local.get(["writingSession"], function (data) {
    if (data.writingSession && data.writingSession.date === currentDate) {
      if (data.writingSession.timeLeft && data.writingSession.timeLeft > 0) {
        timeLeft = data.writingSession.timeLeft;
        initialTimeInMinutes = Math.ceil(timeLeft / 60);
        updateTimerDisplay();

        // Check if we were paused
        if (data.writingSession.isPaused) {
          isPaused = true;
          updatePauseButtonState();
          timerStatusElement.style.display = "block";
          return; // Don't start the timer if we were paused
        }
      }
    } else {
      // Start fresh with the selected time
      timeLeft = initialTimeInMinutes * 60;
      updateTimerDisplay();
    }

    startTimer();

    // Set up auto-save every 5 seconds
    autoSaveInterval = setInterval(saveWritingProgress, 5000);
  });
}

// Start the timer
function startTimer() {
  // Clear any existing interval first
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerStatusElement.style.display = "none";
  timerInterval = setInterval(updateTimer, 1000);
}

// Update the timer display
function updateTimer() {
  timeLeft--;
  updateTimerDisplay();

  // Save state periodically
  saveWritingProgress();

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    clearInterval(autoSaveInterval);
    timerElement.textContent = "Time's up!";
    editorElement.disabled = true;
    analyzeButton.disabled = false;
  }
}

// Update the timer display without decrementing the time
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Analyze the written content
function analyzeWriting() {
  const text = editorElement.value.trim();

  if (text.length === 0) {
    alert("You haven't written anything!");
    return;
  }

  // Update stats
  const wordCount = countWords(text);
  stats.totalWords += wordCount;
  stats.completedPrompts += 1;
  stats.streak += 1;
  stats.lastWritingDate = currentDate;
  saveStats();
  updateStatsDisplay();

  // Basic grammar and style analysis
  performTextAnalysis(text);

  // Show feedback container
  feedbackContainer.style.display = "block";

  // Clear the session data since we've completed this writing session
  clearWritingSession();
}

// Count words in text
function countWords(text) {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

// Perform basic text analysis
function performTextAnalysis(text) {
  // Basic grammar checks (simplified)
  const basicGrammarIssues = checkBasicGrammar(text);
  grammarIssues.innerHTML =
    basicGrammarIssues.length > 0
      ? `<p>Grammar suggestions:</p><ul>${basicGrammarIssues
          .map((issue) => `<li>${issue}</li>`)
          .join("")}</ul>`
      : "<p>No major grammar issues found!</p>";

  // Find overused words
  const wordFrequency = findOverusedWords(text);
  const overusedWordsList = Object.entries(wordFrequency)
    .filter(([word, count]) => count > 3 && word.length > 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  overusedWords.innerHTML =
    overusedWordsList.length > 0
      ? overusedWordsList
          .map(([word, count]) => `"${word}" (${count} times)`)
          .join("<br>")
      : "No significantly overused words found.";

  // Check for passive voice (simplified)
  const passiveInstances = findPassiveVoice(text);
  passiveVoice.innerHTML =
    passiveInstances.length > 0
      ? passiveInstances.map((instance) => `"${instance}"`).join("<br>")
      : "No passive voice instances detected.";
}

// Basic grammar checks (simplified version)
function checkBasicGrammar(text) {
  const issues = [];

  // Check for double spaces
  if (text.includes("  ")) {
    issues.push("Multiple spaces detected - consider using single spaces.");
  }

  // Check for repeated punctuation
  if (/[!]{2,}/.test(text) || /[?]{2,}/.test(text)) {
    issues.push(
      "Multiple exclamation or question marks - consider using just one for formal writing."
    );
  }

  // Check for capitalization after periods
  const sentences = text.split(". ");
  for (let i = 0; i < sentences.length - 1; i++) {
    const nextChar = sentences[i + 1].charAt(0);
    if (
      nextChar.length > 0 &&
      nextChar === nextChar.toLowerCase() &&
      /[a-z]/.test(nextChar)
    ) {
      issues.push(
        "Some sentences may be missing capitalization after periods."
      );
      break;
    }
  }

  return issues;
}

// Find overused words
function findOverusedWords(text) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const commonWords = [
    "the",
    "and",
    "for",
    "that",
    "was",
    "with",
    "this",
    "from",
    "have",
    "are",
    "were",
  ];

  const frequency = {};

  words.forEach((word) => {
    if (!commonWords.includes(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  return frequency;
}

// Find passive voice (simplified)
function findPassiveVoice(text) {
  const passivePatterns = [
    /\b(?:am|is|are|was|were|be|been|being)\s+(\w+ed)\b/gi,
    /\b(?:has|have|had)\s+been\s+(\w+ed)\b/gi,
  ];

  let passiveInstances = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

  sentences.forEach((sentence) => {
    passivePatterns.forEach((pattern) => {
      if (pattern.test(sentence)) {
        passiveInstances.push(sentence.trim());
      }
    });
  });

  // Return unique instances
  return [...new Set(passiveInstances)].slice(0, 5);
}

// Helper functions for date comparison
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isYesterday(date1, date2) {
  const yesterday = new Date(date2);
  yesterday.setDate(date2.getDate() - 1);
  return isSameDay(date1, yesterday);
}

// Save the current writing progress
function saveWritingProgress() {
  // Only save if there's something to save
  if (editorElement.value || timeLeft < initialTimeInMinutes * 60) {
    chrome.storage.local.set({
      writingSession: {
        text: editorElement.value,
        timeLeft: timeLeft,
        initialTime: initialTimeInMinutes,
        date: currentDate,
        inProgress: !editorElement.disabled || isPaused,
        isPaused: isPaused,
      },
    });
  }
}

// Load previous writing progress
function loadWritingProgress() {
  chrome.storage.local.get(["writingSession"], function (data) {
    if (data.writingSession && data.writingSession.date === currentDate) {
      // Restore text
      if (data.writingSession.text) {
        editorElement.value = data.writingSession.text;
      }

      // Restore time settings
      if (data.writingSession.initialTime) {
        initialTimeInMinutes = data.writingSession.initialTime;
        timeInput.value = initialTimeInMinutes;
      }

      // Restore pause state
      isPaused = data.writingSession.isPaused || false;

      // If session was in progress, enable continue button
      if (data.writingSession.inProgress) {
        startButton.textContent = "Continue Writing";
        analyzeButton.disabled = true;

        // If we were paused, update the UI accordingly
        if (isPaused) {
          pauseButton.parentElement.style.display = "flex";
          updatePauseButtonState();
        }

        // Hide settings if we're in the middle of a session
        settingsContainer.style.display = "none";
      } else if (data.writingSession.timeLeft <= 0) {
        // Session is complete
        editorElement.disabled = true;
        startButton.disabled = true;
        analyzeButton.disabled = false;
        timerElement.textContent = "Time's up!";
        settingsContainer.style.display = "none";
      }
    }
  });
}

// Clear writing session data after analysis is complete
function clearWritingSession() {
  chrome.storage.local.remove("writingSession");
  clearInterval(autoSaveInterval);
  clearInterval(timerInterval);

  // Hide timer controls
  pauseButton.parentElement.style.display = "none";
  timerStatusElement.style.display = "none";

  // Show settings container again
  settingsContainer.style.display = "flex";

  // Reset to last selected time
  updateTimerWithNewTime();
}

// Initialize the app when the document is loaded
document.addEventListener("DOMContentLoaded", init);
