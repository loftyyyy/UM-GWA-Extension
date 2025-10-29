# Contributing to UM GWA Extension

Thank you for your interest in contributing to the UM GWA Extension! This document provides guidelines and information for developers.

## 🎯 Customization Guide

The extension's grade extraction logic needs to be customized based on the actual structure of the UM SPR webpage. Here's how to do it:

### Step 1: Inspect the SPR Page

1. Navigate to your UM SPR page
2. Right-click on the page and select "Inspect" or press `F12`
3. Look for the table or structure containing your grades
4. Note the HTML structure, class names, and IDs

### Step 2: Customize the Grade Extraction

Edit the `extractGradesFromPage()` function in **popup.js** (around line 84) to match your SPR page structure.

**Example customizations:**

```javascript
// If grades are in a table with class "grade-table"
const gradeTable = document.querySelector('.grade-table');
const rows = gradeTable.querySelectorAll('tr');

// If subject names are in elements with class "subject-name"
const subjects = document.querySelectorAll('.subject-name');

// If grades are in a specific column (e.g., 4th column)
const grade = cells[3]?.textContent.trim();
```

### Step 3: Update Content Script (Optional)

If you want more advanced features, you can also customize **content.js** to extract grades more intelligently.

## 🛠️ Development Workflow

### Prerequisites

- Node.js and npm (optional, for linting and formatting)
- A Chromium-based browser (Chrome, Edge) or Firefox

### Setting Up Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/loftyyyy/UM-GWA-Extension.git
   cd UM-GWA-Extension
   ```

2. Install development dependencies (optional):
   ```bash
   npm install
   ```

3. Load the extension in your browser:
   - **Chrome/Edge**: 
     - Go to `chrome://extensions/` or `edge://extensions/`
     - Enable "Developer mode"
     - Click "Load unpacked"
     - Select the extension directory
   
   - **Firefox**:
     - Go to `about:debugging`
     - Click "This Firefox"
     - Click "Load Temporary Add-on"
     - Select `manifest.json`

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to the code

3. Test your changes:
   - Reload the extension in your browser
   - Navigate to the SPR page
   - Click the extension icon to test

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

5. Push and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Code Style

- Use consistent indentation (2 spaces)
- Add comments for complex logic
- Use meaningful variable and function names
- Keep functions small and focused

### Linting (if npm is installed)

```bash
npm run lint
```

### Formatting (if npm is installed)

```bash
npm run format
```

## 🐛 Reporting Bugs

If you find a bug, please open an issue with:

- A clear title and description
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Browser version and OS

## 💡 Feature Requests

We welcome feature requests! Please open an issue with:

- A clear description of the feature
- Why this feature would be useful
- Any implementation ideas you have

## 🧪 Testing Checklist

Before submitting a pull request, ensure:

- [ ] The extension loads without errors
- [ ] The popup displays correctly
- [ ] GWA calculation is accurate
- [ ] No console errors appear
- [ ] The extension works on the actual SPR page
- [ ] Code follows the project's style guidelines
- [ ] README is updated if needed

## 📚 Useful Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

## 🤝 Community Guidelines

- Be respectful and constructive
- Help others learn and grow
- Focus on the code, not the person
- Welcome newcomers warmly

## 📧 Getting Help

If you need help:

1. Check the README.md for documentation
2. Look through existing issues
3. Open a new issue with your question
4. Tag it as "question"

---

Thank you for contributing to making UM students' lives easier! 🎓
