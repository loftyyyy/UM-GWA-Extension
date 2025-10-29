# UM GWA Calculator (Chrome Extension)

Calculate your General Weighted Average (GWA) from the University of Mindanao SPR page automatically. Includes options to exclude PE (PAHF) and NSTP subjects from the computation.

## Features

- Extracts grades and units directly from the SPR table
- Computes weighted GWA = sum(grade × units) / sum(units)
- Optionally exclude PE subjects (PAHF, PE keywords)
- Optionally exclude NSTP subjects
- Shows total units, total subjects, and total weighted grade

## Requirements

- Google Chrome 88+ (Manifest V3)
- Access to your UM SPR page

## Installation (Developer Mode)

1. Download or clone this repository to your local machine.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable “Developer mode” (top right toggle).
4. Click “Load unpacked” and select the folder `UM-GWA-Extension`.
5. The “UM GWA Calculator” extension should now appear in your extensions list.

### Optional: Update the extension icons to match the theme

This repo includes maroon/gold SVG icon sources in `icons/`:

- `icons/um_icon_16.svg`
- `icons/um_icon_48.svg`
- `icons/um_icon_128.svg`

Chrome action icons require PNG. Export each SVG to PNG at sizes 16×16, 48×48, 128×128 and replace the existing files with the exact names used in `manifest.json`:

- `icons/icon16.png`
- `icons/icon48.png`
- `icons/icon128.png`

You can export using any vector tool or an online converter. After replacing, reload the extension in `chrome://extensions/`.

## Usage

1. Navigate to your SPR page: `https://student.umindanao.edu.ph/student/spr`
2. Click the extension icon (pin it to the toolbar for quick access).
3. In the popup:
   - Toggle “Exclude PE subjects (e.g., PAHF)” if you want to remove PE from the calculation.
   - Toggle “Exclude NSTP” if you want to remove NSTP from the calculation.
   - Click “Refresh Calculation” to recompute after changing toggles.
4. The popup shows:
   - Your GWA
   - Total Units, Subjects, and Total Weighted (sum of grade × units)
   - The list of subjects included in the computation

## How It Works

- The content script parses the SPR table rows (skipping semester header rows), reading subject code, title, final grade, and units.
- The popup requests extracted data from the content script and computes the weighted average.
- Grades with `0.0` are treated as in progress and excluded automatically.
- PE and NSTP exclusions are applied in the content script and also validated in the popup for safety.

## Permissions Explained

- `activeTab` and `scripting`: Run extraction on the current SPR tab when you open the popup.
- `storage`: Save your exclude options (PE, NSTP) so they persist.
- `host_permissions`: Allow the extension to run on `umindanao.edu.ph` pages.

## Troubleshooting

- Not seeing results? Ensure you are on the exact SPR page and the table is visible.
- If the popup says it can’t extract grades, reload the SPR page and try again.
- If PE/NSTP isn’t excluded as expected, toggle the setting off and on, click “Refresh Calculation,” and ensure the subject codes/titles on the site match common patterns (e.g., `PAHF`, `NSTP`). Share any different naming you see to improve matching.

## Development Notes

- Manifest V3 is used. Background service worker is `background.js`.
- Content script: `content.js` handles extraction and filtering.
- Popup UI and logic: `popup.html`, `popup.css`, `popup.js`.

## License

MIT

# UM GWA Extension

A browser extension that automatically calculates your General Weighted Average (GWA) from the University of Mindanao's Student Performance Record (SPR) webpage.

## 📋 Overview

This extension eliminates the need for manual GWA computation by automatically extracting grades from your SPR and calculating your weighted average. Simply view your SPR page, and the extension will do the rest!

## ✨ Features

- **Automatic Grade Detection**: Extracts grades directly from the SPR webpage
- **Real-time GWA Calculation**: Instantly computes your General Weighted Average
- **User-Friendly Interface**: Clean and intuitive popup design
- **Lightweight**: Minimal resource usage
- **Privacy-Focused**: All calculations are done locally in your browser

## 🚀 Installation

### For Chrome/Edge

1. Download or clone this repository
   ```bash
   git clone https://github.com/loftyyyy/UM-GWA-Extension.git
   ```

2. Open your browser and navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`

3. Enable "Developer mode" (toggle in the top right corner)

4. Click "Load unpacked" and select the extension directory

5. The UM GWA Extension icon should now appear in your browser toolbar

### For Firefox

1. Download or clone this repository

2. Open Firefox and navigate to `about:debugging`

3. Click "This Firefox" in the left sidebar

4. Click "Load Temporary Add-on"

5. Navigate to the extension directory and select the `manifest.json` file

## 📖 Usage

1. Navigate to your University of Mindanao SPR webpage

2. Click on the UM GWA Extension icon in your browser toolbar

3. The extension will automatically:
   - Detect your grades from the current page
   - Calculate your GWA based on credit units
   - Display the result in the popup

4. View your computed GWA and grade breakdown

## 🛠️ Technical Details

### File Structure

```
UM-GWA-Extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup logic and GWA calculation
├── content.js            # Content script for SPR page interaction
├── background.js         # Background service worker
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

### GWA Calculation Formula

```
GWA = Σ(Grade × Credit Units) / Σ(Credit Units)
```

Where:
- Grade: The numerical grade for each subject
- Credit Units: The number of units for each subject

## 🔧 Development

### Prerequisites

- A modern web browser (Chrome, Edge, Firefox, or Safari)
- Basic knowledge of HTML, CSS, and JavaScript

### Building from Source

No build process is required. This is a pure JavaScript extension that can be loaded directly into your browser.

### Testing

1. Make your changes to the code
2. Reload the extension in your browser:
   - Chrome/Edge: Go to extensions page and click the reload icon
   - Firefox: Click "Reload" in about:debugging
3. Test on the SPR webpage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🎓 About

Created for University of Mindanao students to simplify GWA calculation from the SPR system.

## ⚠️ Disclaimer

This extension is not officially affiliated with the University of Mindanao. It is a student-created tool to assist with grade calculations.

## 📧 Contact

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for UM Students**