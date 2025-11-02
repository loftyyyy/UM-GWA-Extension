# UM GWA Calculator (Chrome Extension)

Automatically calculate your General Weighted Average (GWA) from the University of Mindanao SPR webpage. Optionally exclude PE and NSTP subjects.

Quick start (Developer mode)
1. Clone or download this repository.
2. Open Chrome and go to chrome://extensions/.
3. Enable Developer mode → Load unpacked → select the extension folder.

Usage
1. Open: https://student.umindanao.edu.ph/student/spr
2. Click the extension icon.
3. Toggle exclusions (PE, NSTP) if needed and click "Refresh Calculation".
4. The popup shows GWA, total units, and included subjects.

Files of interest
- manifest.json
- popup.html / popup.js / popup.css
- content.js
- background.js
- icons/

Permissions
- activeTab, scripting, storage, host permissions for umindanao.edu.ph

License
MIT

Report bugs or request features: open an issue on this repository.
