# Daily Writing Companion: Chrome Extension Documentation

## Overview

Daily Writing Companion is a Chrome extension designed to help users build a consistent writing habit. It provides daily writing prompts, a customizable timer, progress tracking, and basic writing analysis. The extension focuses on simplicity and flexibility to accommodate different writing schedules and preferences.

## Core Features

1. **Daily Writing Prompts**: Provides a random prompt each day to eliminate decision fatigue
2. **Flexible Timer**: Customizable writing sessions from 1-60 minutes
3. **Pause & Resume**: Ability to pause writing sessions and continue later
4. **Progress Saving**: Automatically saves work across browser sessions
5. **Streak Tracking**: Counts consecutive days of writing
6. **Basic Writing Analysis**: Grammar suggestions, overused word detection, passive voice identification
7. **Responsive UI**: Clean interface with timer controls and status indicators

## Technical Implementation

### File Structure

```
daily-writing-companion/
├── popup.html          # Main extension UI
├── popup.js            # Extension functionality
├── manifest.json       # Extension configuration
└── images/             # Icon images
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Key Components

#### 1. Manifest.json

```json
{
  "manifest_version": 3,
  "name": "Daily Writing Companion",
  "version": "1.0",
  "description": "Daily writing prompts, timed writing sessions, and helpful feedback to build your writing habit.",
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png"
    }
  },
  "permissions": ["storage"],
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  }
}
```

#### 2. UI Elements

- **Prompt Display**: Shows the daily writing prompt
- **Time Selection**: Input field and preset buttons (5, 10, 20, 30 mins)
- **Timer Controls**: Start/continue, pause/resume, and reset buttons
- **Editor**: Text area for writing
- **Analysis Section**: Grammar feedback, overused words, passive voice detection
- **Stats Display**: Day streak, total words, completed prompts

#### 3. Key JavaScript Functions

- `startWriting()`: Initiates or resumes writing session
- `togglePause()`: Pauses/resumes the timer
- `resetTimer()`: Resets timer to initial time
- `updateTimerWithNewTime()`: Updates timer when custom time is selected
- `analyzeWriting()`: Performs basic text analysis
- `saveWritingProgress()`: Saves current state to Chrome storage
- `loadWritingProgress()`: Restores state from Chrome storage

### Data Storage

The extension uses Chrome's storage API to persist:

1. **Writing Session Data**:

   - Current text content
   - Remaining time
   - Session state (paused/active)
   - Current date

2. **User Preferences**:

   - Last selected time duration

3. **Statistics**:
   - Day streak
   - Total words written
   - Completed prompts

### Features in Detail

#### Writing Prompts System

- 30 built-in prompts covering various topics
- Randomly selects one prompt per day
- Consistent prompt throughout the day

#### Flexible Timing

- Custom time input (1-60 minutes)
- Quick preset buttons
- Timer display with minutes:seconds format

#### Pause/Resume Functionality

- Visual indicators for paused state
- Pause button toggles between play/pause icons
- Status indicator shows when paused

#### Writing Analysis

- Basic grammar checks (capitalization, repeated punctuation)
- Overused word detection (frequency analysis)
- Passive voice identification (pattern matching)

#### Progress Tracking

- Day streak calculation (resets if day is missed)
- Word count tracking
- Completed prompts counter

## User Experience Flow

1. **First Time**:

   - User sees default 20-minute timer and daily prompt
   - Can adjust time using input field or presets
   - Clicks "Start Writing" to begin

2. **Writing Session**:

   - Timer counts down
   - User can pause/resume as needed
   - Settings panel hides during writing

3. **Session Completion**:

   - Timer reaches zero
   - "Analyze Writing" button becomes enabled
   - Click analyzes content and updates stats

4. **Returning User**:
   - Extension remembers in-progress sessions
   - Shows "Continue Writing" if session was paused
   - Preserves time remaining and content

## Extension Description

```
Daily Writing Companion: Build Your Writing Habit

Daily Writing Companion is the perfect tool for anyone looking to develop a consistent writing practice without the overwhelm. Whether you're a budding novelist, a busy professional working on your communication skills, or simply someone who wants to journal more regularly, this extension removes the friction that keeps you from writing daily.

Write More, Stress Less

Finding time to write can be challenging. Daily Writing Companion simplifies the process by providing a fresh writing prompt each day along with a flexible, focused writing environment you can customize to fit your schedule.

Key Features

• Fresh Daily Prompts: Never stare at a blank page again. Each day brings a new thought-provoking prompt to spark your creativity.

• Flexible Timer: Set your writing session for exactly how long you have available—whether it's a quick 5-minute session during your coffee break or a deeper 45-minute writing session.

• Pause & Resume: Life happens. Easily pause your writing session when interrupted and pick up exactly where you left off later.

• Progress Tracking: Build momentum with streak counting, word tracking, and progress statistics that celebrate your consistency.

• Writing Analysis: Receive instant feedback on grammar, overused words, and writing style to help improve your skills with each session.

• Distraction-Free: A clean, focused interface keeps you engaged with your writing instead of fiddling with settings.

Perfect For:

• Writers building a daily practice
• Professionals improving communication skills
• Students developing writing fluency
• Anyone wanting to journal more consistently
• People with busy, unpredictable schedules

Daily Writing Companion remembers your preferences and saves your progress automatically, so you never lose your work—even if you close your browser or switch tabs.

Turn writing from a chore into a habit you look forward to. Install Daily Writing Companion today and write your first streak-worthy session in minutes.

"Write daily, write better, write for you."
```

## Development Considerations

1. **Storage Limitations**: Chrome storage has size limits (~5MB)
2. **Extension Context**: Writing is saved per browser/device, not synced
3. **Simplicity Focus**: Intentionally minimal features to reduce friction
4. **Future Extensions**: Potential for cloud sync, more advanced analysis, custom prompts

## Installation Instructions

For users:

1. Download the extension from Chrome Web Store or as a ZIP file
2. If using ZIP, go to chrome://extensions/
3. Enable Developer Mode
4. Click "Load unpacked" and select the extension folder

For development:

1. Clone the repository
2. Make necessary modifications
3. Test using Chrome's "Load unpacked" option
4. Publish through Chrome Web Store Developer Dashboard ($5 registration fee)

## Prompt Engineering Notes

When discussing this extension with an LLM:

- Emphasize the focus on habit building and reducing friction
- Highlight the balance between flexibility (custom timing, pause feature) and consistency (daily prompts, streak tracking)
- Note that analysis is intentionally basic to avoid overwhelming users
- Explain that storage is local to maintain privacy and avoid login requirements
