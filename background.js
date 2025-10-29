/**
 * Background Service Worker for UM GWA Extension
 * Handles background tasks and extension lifecycle events
 */

// Extension installation/update handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('UM GWA Extension installed');
    
    // Set default settings
    chrome.storage.local.set({
      version: '1.0.0',
      installDate: new Date().toISOString(),
      settings: {
        autoCalculate: true,
        showNotifications: true
      }
    });
    
    // Open welcome page (optional)
    // chrome.tabs.create({ url: 'welcome.html' });
  } else if (details.reason === 'update') {
    console.log('UM GWA Extension updated');
  }
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'calculateGWA') {
    // Process GWA calculation request
    handleGWACalculation(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'getSettings') {
    chrome.storage.local.get('settings', (data) => {
      sendResponse({ success: true, settings: data.settings || {} });
    });
    return true;
  }
  
  if (request.action === 'saveSettings') {
    chrome.storage.local.set({ settings: request.settings }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

/**
 * Handle GWA calculation
 */
async function handleGWACalculation(data) {
  if (!data || !data.grades || data.grades.length === 0) {
    throw new Error('No grades provided');
  }
  
  let totalWeightedGrade = 0;
  let totalUnits = 0;
  
  for (const grade of data.grades) {
    if (grade.grade && grade.units) {
      totalWeightedGrade += grade.grade * grade.units;
      totalUnits += grade.units;
    }
  }
  
  const gwa = totalUnits > 0 ? totalWeightedGrade / totalUnits : 0;
  
  return {
    gwa: gwa.toFixed(2),
    totalUnits: totalUnits,
    totalSubjects: data.grades.length,
    calculatedAt: new Date().toISOString()
  };
}

/**
 * Monitor tab updates to detect SPR pages
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('umindanao.edu.ph')) {
    // SPR page detected
    console.log('UM webpage detected:', tab.url);
    
    // Badge to indicate extension is active on this page
    chrome.action.setBadgeText({ text: '✓', tabId: tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#667eea', tabId: tabId });
  }
});

/**
 * Clear badge when tab is closed or navigated away
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.action.setBadgeText({ text: '', tabId: tabId });
});

/**
 * Handle extension icon click (optional additional behavior)
 */
chrome.action.onClicked.addListener((tab) => {
  // Default behavior is to open popup, but we can add additional logic here if needed
  console.log('Extension icon clicked on tab:', tab.id);
});

console.log('UM GWA Extension: Background service worker initialized');
