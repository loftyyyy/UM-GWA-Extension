// DOM Elements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');
const errorMessageEl = document.getElementById('error-message');
const gwaValueEl = document.getElementById('gwa-value');
const gwaRemarkEl = document.getElementById('gwa-remark');
const totalUnitsEl = document.getElementById('total-units');
const totalSubjectsEl = document.getElementById('total-subjects');
const gradeListEl = document.getElementById('grade-list');
const retryBtn = document.getElementById('retry-btn');
const refreshBtn = document.getElementById('refresh-btn');

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadGrades();
  
  // Add event listeners
  retryBtn.addEventListener('click', loadGrades);
  refreshBtn.addEventListener('click', loadGrades);
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
    
    // Execute content script to extract grades
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractGradesFromPage,
    });
    
    if (!results || !results[0] || !results[0].result) {
      throw new Error('Unable to extract grades from the page.');
    }
    
    const gradesData = results[0].result;
    
    if (!gradesData.grades || gradesData.grades.length === 0) {
      throw new Error('No grades found on this page. Make sure you are on your SPR page.');
    }
    
    // Calculate GWA
    const gwa = calculateGWA(gradesData.grades);
    
    // Display results
    displayResults(gwa, gradesData.grades);
    
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Function to extract grades from the SPR page
 * This runs in the context of the webpage
 */
function extractGradesFromPage() {
  const grades = [];
  
  // This is a placeholder implementation
  // The actual implementation will depend on the structure of the SPR webpage
  // Students will need to customize this based on their SPR page structure
  
  // Example: Look for table rows with grade information
  const tables = document.querySelectorAll('table');
  
  for (const table of tables) {
    const rows = table.querySelectorAll('tr');
    
    for (const row of rows) {
      const cells = row.querySelectorAll('td');
      
      if (cells.length >= 3) {
        // Try to extract: subject name, grade, units
        // This is a generic approach and may need customization
        const subjectName = cells[0]?.textContent.trim();
        const gradeText = cells[cells.length - 2]?.textContent.trim();
        const unitsText = cells[cells.length - 3]?.textContent.trim();
        
        const grade = parseFloat(gradeText);
        const units = parseFloat(unitsText);
        
        // Check if we have valid grade and units
        if (subjectName && !isNaN(grade) && !isNaN(units) && grade > 0 && units > 0 && grade <= 5.0) {
          grades.push({
            subject: subjectName,
            grade: grade,
            units: units
          });
        }
      }
    }
  }
  
  return { grades };
}

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
  
  return {
    gwa: gwa.toFixed(2),
    remark: remark,
    totalUnits: totalUnits,
    totalSubjects: grades.length
  };
}

/**
 * Get GWA remark based on the grade
 * @param {number} gwa - The calculated GWA
 * @returns {string} - Remark
 */
function getGWARemark(gwa) {
  if (gwa >= 1.0 && gwa <= 1.5) {
    return 'Excellent';
  } else if (gwa > 1.5 && gwa <= 2.0) {
    return 'Very Good';
  } else if (gwa > 2.0 && gwa <= 2.5) {
    return 'Good';
  } else if (gwa > 2.5 && gwa <= 3.0) {
    return 'Satisfactory';
  } else if (gwa > 3.0 && gwa <= 5.0) {
    return 'Passing';
  } else {
    return 'Failed';
  }
}

/**
 * Display results in the popup
 */
function displayResults(gwaData, grades) {
  // Update GWA display
  gwaValueEl.textContent = gwaData.gwa;
  gwaRemarkEl.textContent = gwaData.remark;
  
  // Update stats
  totalUnitsEl.textContent = gwaData.totalUnits;
  totalSubjectsEl.textContent = gwaData.totalSubjects;
  
  // Clear and populate grade list
  gradeListEl.innerHTML = '';
  
  grades.forEach(gradeItem => {
    const gradeDiv = document.createElement('div');
    gradeDiv.className = 'grade-item';
    
    gradeDiv.innerHTML = `
      <span class="subject">${gradeItem.subject}</span>
      <span class="grade">${gradeItem.grade.toFixed(2)}</span>
      <span class="units">${gradeItem.units} units</span>
    `;
    
    gradeListEl.appendChild(gradeDiv);
  });
  
  // Show result section
  showResult();
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
