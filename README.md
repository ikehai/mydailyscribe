# Daily Writing Companion Chrome Extension

A Chrome extension that helps you build a daily writing habit with guided prompts, timed sessions, and automated feedback.

## Features

1. **Daily Prompt Generator**

   - Randomly serves a new writing prompt each day
   - Eliminates decision fatigue on what to write about

2. **Time-Boxed Editor**

   - 20-minute timer to keep writing sessions manageable
   - Focused writing environment without distractions

3. **Automated Feedback**

   - Basic grammar and style suggestions
   - Highlights overused words
   - Detects passive voice instances

4. **Streaks & Stats**
   - Tracks your daily writing streak
   - Counts total words written
   - Records completed writing prompts

## Installation Instructions

### Method 1: From Chrome Web Store (Coming Soon)

1. Visit the Chrome Web Store
2. Search for "Daily Writing Companion"
3. Click "Add to Chrome"

### Method 2: Manual Installation

1. Download or clone this repository
2. Create the images folder and add icon16.png, icon48.png, and icon128.png files
   - You can use any image editing software to create simple icons or find free ones online
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" by toggling the switch in the top right corner
5. Click "Load unpacked" button
6. Select the folder containing the extension files
7. The extension should now appear in your Chrome toolbar

## How to Use

1. Click the Daily Writing Companion icon in your Chrome toolbar
2. Read today's writing prompt
3. Click "Start Writing" when you're ready to begin
4. Write continuously until the 20-minute timer runs out
5. Click "Analyze Writing" to get feedback and save your progress
6. Return tomorrow to continue your streak!

## File Structure

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

## Custom Prompts

You can modify the prompts array in `popup.js` to add your own writing prompts.

## Future Enhancements

- Integration with more advanced grammar and style checking APIs
- Export options for your writing
- Custom timer settings
- Prompt categories and difficulty levels
- Dark mode option

## License

MIT License

## Credits

Created by [Your Name]
