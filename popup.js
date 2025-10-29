// DOM Elements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');
const errorMessageEl = document.getElementById('error-message');
const gwaValueEl = document.getElementById('gwa-value');
const gwaRemarkEl = document.getElementById('gwa-remark');
const gwaScaleEl = document.getElementById('gwa-scale');
const totalUnitsEl = document.getElementById('total-units');
const totalSubjectsEl = document.getElementById('total-subjects');
const totalWeightedEl = document.getElementById('total-weighted');
const gradeListEl = document.getElementById('grade-list');
const retryBtn = document.getElementById('retry-btn');
const refreshBtn = document.getElementById('refresh-btn');
const excludePeCheckbox = document.getElementById('exclude-pe');
const excludeNstpCheckbox = document.getElementById('exclude-nstp');

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings, then calculate
  chrome.storage.sync.get({ excludePE: false, excludeNSTP: false }, (res) => {
    excludePeCheckbox.checked = !!res.excludePE;
    if (excludeNstpCheckbox) excludeNstpCheckbox.checked = !!res.excludeNSTP;
    loadGrades();
  });
  
  // Add event listeners
  retryBtn.addEventListener('click', loadGrades);
  refreshBtn.addEventListener('click', loadGrades);
  excludePeCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ excludePE: excludePeCheckbox.checked }, () => {
      loadGrades();
    });
  });
  if (excludeNstpCheckbox) {
    excludeNstpCheckbox.addEventListener('change', () => {
      chrome.storage.sync.set({ excludeNSTP: excludeNstpCheckbox.checked }, () => {
        loadGrades();
      });
    });
  }
});

/**
 * Load grades from the current tab
 */
async function loadGrades() {
  showLoading();
  
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      throw new Error('No active tab found');
    }
    
    // Check if we're on a UM website
    if (!tab.url.includes('umindanao.edu.ph')) {
      throw new Error('Please navigate to your UM SPR webpage first.');
    }
    
    // Load settings and ask the content script to extract
    const { excludePE, excludeNSTP } = await chrome.storage.sync.get({ excludePE: false, excludeNSTP: false });
    const gradesData = await chrome.tabs.sendMessage(tab.id, { action: 'extractGrades', excludePE, excludeNSTP });
    
    if (!gradesData.grades || gradesData.grades.length === 0) {
      throw new Error('No grades found on this page. Make sure you are on your SPR page.');
    }
    
    // Content script already applies exclude and filters 0.0; keep a safety guard
    let validGrades = gradesData.grades.filter(g => typeof g.grade === 'number' && g.grade > 0 && g.units > 0);
    // Safety: also filter in popup in case content filter missed anything
    if (excludeNSTP) {
      validGrades = validGrades.filter(g => {
        const code = (g.subject || '').toUpperCase();
        const title = (g.title || '').toUpperCase();
        return !(code.startsWith('NSTP') || title.includes('NATIONAL SERVICE TRAINING PROGRAM'));
      });
    }
    
    if (validGrades.length === 0) {
      throw new Error('No completed subjects found to compute GWA.');
    }
    
    // Calculate GWA
    const gwa = calculateGWA(validGrades);
    
    // Display results
    displayResults(gwa, validGrades);
    
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Function to extract grades from the SPR page
 * This runs in the context of the webpage
 */
// Extraction is handled by the content script now

/**
 * Calculate GWA from grades
 * @param {Array} grades - Array of grade objects with grade and units
 * @returns {Object} - GWA data
 */
function calculateGWA(grades) {
  let totalWeightedGrade = 0;
  let totalUnits = 0;
  
  for (const gradeItem of grades) {
    totalWeightedGrade += gradeItem.grade * gradeItem.units;
    totalUnits += gradeItem.units;
  }
  
  const gwa = totalUnits > 0 ? totalWeightedGrade / totalUnits : 0;
  const remark = getGWARemark(gwa);
  const scale = getGWAScale(gwa);
  
  return {
    gwa: gwa.toFixed(2),
    remark: remark,
    scale: scale,
    totalUnits: totalUnits,
    totalSubjects: grades.length,
    totalWeighted: totalWeightedGrade.toFixed(2)
  };
}

/**
 * Get GWA remark based on the grade
 * @param {number} gwa - The calculated GWA
 * @returns {string} - Remark
 */
function getGWARemark(gwa) {
  // UM scale uses a 1.0–4.0 range, with higher being better in the given data
  if (gwa >= 4.0) return 'High Distinction (A)';
  if (gwa >= 3.5) return 'Distinction (B+)';
  if (gwa >= 3.0) return 'Very Good (B-)';
  if (gwa >= 2.5) return 'Good (C+)';
  if (gwa >= 2.0) return 'Average (C-)';
  if (gwa >= 1.0) return 'Fail (F)';
  return 'Fail (F)';
}

/**
 * Display results in the popup
 */
function displayResults(gwaData, grades) {
  // Update GWA display
  gwaValueEl.textContent = gwaData.gwa;
  gwaRemarkEl.textContent = gwaData.remark;
  if (gwaScaleEl) gwaScaleEl.textContent = `Scale: ${gwaData.scale}`;
  
  // Update stats
  totalUnitsEl.textContent = gwaData.totalUnits;
  totalSubjectsEl.textContent = gwaData.totalSubjects;
  if (totalWeightedEl) totalWeightedEl.textContent = gwaData.totalWeighted;
  
  // Clear and populate grade list
  gradeListEl.innerHTML = '';
  const headerDiv = document.createElement('div');
  headerDiv.className = 'grade-header';
  headerDiv.innerHTML = `
    <span>Subject</span>
    <span>Title</span>
    <span>Grade</span>
    <span>Units</span>
  `;
  gradeListEl.appendChild(headerDiv);
  
  grades.forEach(gradeItem => {
    const gradeDiv = document.createElement('div');
    gradeDiv.className = 'grade-item';
    
    gradeDiv.innerHTML = `
      <span class="subject">${gradeItem.subject}</span>
      <span class="title" style="opacity:.8;">${gradeItem.title || ''}</span>
      <span class="grade">${gradeItem.grade.toFixed(2)}</span>
      <span class="units">${gradeItem.units} units</span>
    `;
    
    gradeListEl.appendChild(gradeDiv);
  });
  
  // Show result section
  showResult();
}

// Map GWA to scale band based on provided table
function getGWAScale(gwa) {
  if (gwa >= 4.0) return '96-100';
  if (gwa >= 3.5) return '90-95';
  if (gwa >= 3.0) return '85-89';
  if (gwa >= 2.5) return '80-84';
  if (gwa >= 2.0) return '75-79';
  return '<75';
}

// Filter out PE subjects (PAHF code or PE keywords)
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

/**
 * Show loading state
 */
function showLoading() {
  loadingEl.classList.remove('hidden');
  errorEl.classList.add('hidden');
  resultEl.classList.add('hidden');
}

/**
 * Show error state
 */
function showError(message) {
  errorMessageEl.textContent = message;
  errorEl.classList.remove('hidden');
  loadingEl.classList.add('hidden');
  resultEl.classList.add('hidden');
}

/**
 * Show result state
 */
function showResult() {
  resultEl.classList.remove('hidden');
  loadingEl.classList.add('hidden');
  errorEl.classList.add('hidden');
}
