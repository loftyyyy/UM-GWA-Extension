/**
 * Content Script for UM GWA Extension
 * This script runs on the UM SPR webpage to interact with the page content
 */

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractGrades') {
    const gradesData = extractGrades();
    sendResponse(gradesData);
  }
  return true; // Keep the message channel open for async response
});

/**
 * Extract grades from the current SPR page
 * This function analyzes the page structure and extracts grade information
 */
function extractGrades() {
  const grades = [];
  
  // Try multiple strategies to find grade information
  
  // Strategy 1: Look for tables with grade data
  const tables = document.querySelectorAll('table');
  
  for (const table of tables) {
    const rows = table.querySelectorAll('tr');
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.querySelectorAll('td, th');
      
      if (cells.length >= 3) {
        // Extract text content from cells
        const cellTexts = Array.from(cells).map(cell => cell.textContent.trim());
        
        // Try to identify subject, grade, and units
        // This is a generic approach - customize based on actual SPR structure
        for (let j = 0; j < cellTexts.length - 2; j++) {
          const possibleSubject = cellTexts[j];
          const possibleUnits = parseFloat(cellTexts[j + 1]);
          const possibleGrade = parseFloat(cellTexts[j + 2]);
          
          // Validate if this looks like valid grade data
          if (
            possibleSubject &&
            possibleSubject.length > 3 &&
            !isNaN(possibleUnits) &&
            !isNaN(possibleGrade) &&
            possibleUnits > 0 &&
            possibleUnits <= 10 &&
            possibleGrade >= 1.0 &&
            possibleGrade <= 5.0
          ) {
            grades.push({
              subject: possibleSubject,
              units: possibleUnits,
              grade: possibleGrade
            });
          }
        }
      }
    }
  }
  
  // Strategy 2: Look for specific class names or IDs (customize as needed)
  // Example: const gradeRows = document.querySelectorAll('.grade-row');
  
  // Strategy 3: Look for definition lists or other structures
  // This can be expanded based on the actual SPR page structure
  
  // Remove duplicates
  const uniqueGrades = [];
  const seen = new Set();
  
  for (const grade of grades) {
    const key = `${grade.subject}-${grade.units}-${grade.grade}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueGrades.push(grade);
    }
  }
  
  return {
    grades: uniqueGrades,
    source: 'content-script',
    url: window.location.href,
    timestamp: new Date().toISOString()
  };
}

/**
 * Highlight grades on the page (optional feature for debugging)
 */
function highlightGrades() {
  const tables = document.querySelectorAll('table');
  
  for (const table of tables) {
    const cells = table.querySelectorAll('td');
    
    for (const cell of cells) {
      const text = cell.textContent.trim();
      const value = parseFloat(text);
      
      // Highlight cells that look like grades
      if (!isNaN(value) && value >= 1.0 && value <= 5.0) {
        cell.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
        cell.style.border = '1px solid rgba(102, 126, 234, 0.3)';
      }
    }
  }
}

// Optional: Auto-detect when page is loaded
window.addEventListener('load', () => {
  console.log('UM GWA Extension: Content script loaded');
  
  // Store page info for debugging
  chrome.storage.local.set({
    lastPageUrl: window.location.href,
    lastPageTitle: document.title,
    lastVisited: new Date().toISOString()
  });
});
