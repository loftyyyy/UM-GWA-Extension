/**
 * Content Script for UM GWA Extension
 * This script runs on the UM SPR webpage to interact with the page content
 */

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractGrades') {
    const excludePE = !!request.excludePE;
    const excludeNSTP = !!request.excludeNSTP;
    const gradesData = extractGrades({ excludePE, excludeNSTP });
    sendResponse(gradesData);
    return true;
  }
  return false;
});

/**
 * Extract grades from the current SPR page
 * This function analyzes the page structure and extracts grade information
 */
function extractGrades(options = {}) {
  const { excludePE = false, excludeNSTP = false } = options;
  const collected = [];
  
  const tables = Array.from(document.querySelectorAll('table.table'));
  const target = tables.find(t => t.querySelector('thead') && t.querySelector('tbody')) || tables[0];
  if (!target) {
    return wrapResult([]);
  }
  
  const rows = Array.from(target.querySelectorAll('tbody tr'));
  for (const row of rows) {
    if (row.classList.contains('tr-primary-marker')) continue;
    const tds = row.querySelectorAll('td');
    if (tds.length < 4) continue;
    
    const courseCode = (tds[0].textContent || '').trim();
    const title = (tds[1].textContent || '').trim();
    const gradeVal = parseFloat((tds[2].textContent || '').trim());
    const unitsVal = parseFloat((tds[3].textContent || '').trim());
    
    if (!courseCode || !title) continue;
    if (isNaN(gradeVal) || isNaN(unitsVal)) continue;
    if (gradeVal < 0 || gradeVal > 5) continue;
    if (unitsVal <= 0 || unitsVal > 10) continue;
    
    collected.push({ subject: courseCode, title, grade: gradeVal, units: unitsVal });
  }
  
  // Filter out in-progress (grade 0.0) and optionally PE subjects
  let filtered = collected.filter(g => g.grade > 0 && g.units > 0);
  if (excludePE) {
    filtered = filterOutPE(filtered);
  }
  if (excludeNSTP) {
    filtered = filterOutNSTP(filtered);
  }
  
  return wrapResult(filtered);
}

function filterOutPE(grades) {
  const isPE = (g) => {
    const code = (g.subject || '').toUpperCase();
    const title = (g.title || '').toUpperCase();
    if (code.startsWith('PAHF')) return true;
    if (/\bPE\b/.test(code)) return true;
    if (title.includes('PHYSICAL EDUCATION')) return true;
    if (title.includes('DANCE AND SPORTS')) return true;
    if (title.includes('EXERCISE-BASED FITNESS')) return true;
    if (title.includes('MOVEMENT COMPETENCY')) return true;
    return false;
  };
  return grades.filter(g => !isPE(g));
}

function filterOutNSTP(grades) {
  const isNSTP = (g) => {
    const code = (g.subject || '').toUpperCase();
    const title = (g.title || '').toUpperCase();
    if (code.startsWith('NSTP')) return true;
    if (title.includes('NATIONAL SERVICE TRAINING PROGRAM')) return true;
    return false;
  };
  return grades.filter(g => !isNSTP(g));
}

function wrapResult(grades) {
  // Deduplicate identical entries
  const out = [];
  const seen = new Set();
  for (const g of grades) {
    const key = `${g.subject}|${g.title}|${g.units}|${g.grade}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(g);
    }
  }
  return {
    grades: out,
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
