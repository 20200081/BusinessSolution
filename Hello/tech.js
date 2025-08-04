/*
  ==========================================
  TRINIDAD FIELD MANAGEMENT SYSTEM
  TECHNICIAN STATUS CARD JAVASCRIPT
  ==========================================
  
  This JavaScript file handles the technician status card functionality.
  It manages status updates, location display, and local storage persistence.
  Updates are synchronized across browser tabs for real-time coordination.
*/

// Wait for the page to fully load before initializing technician status functionality
window.addEventListener('DOMContentLoaded', () => {
    // Get references to the status dropdown and location display elements
    const statusDropdown = document.getElementById('status-dropdown');
    const locationSpan = document.getElementById('location');

    // Load saved technician status from browser storage, default to 'Available'
    let jdStatus = localStorage.getItem('JohnDoeStatus') || 'Available';
    
    // Load saved assigned location from browser storage, default message if none set
    let jdLocation = localStorage.getItem('JohnDoeLocation') || 'No location set';

    // Set the initial values in the interface based on saved data
    statusDropdown.value = jdStatus;        // Update dropdown to show current status
    locationSpan.textContent = jdLocation;  // Display current assigned location

    // Event listener for when technician changes their status
    // Automatically saves the new status to local storage
    statusDropdown.addEventListener('change', (e) => {
        localStorage.setItem('JohnDoeStatus', e.target.value);
    });

    // Listen for changes from other browser tabs (real-time synchronization)
    // This ensures the interface updates if managers change the technician's assignment
    window.addEventListener('storage', (e) => {
        // Update location display if managers assign a new location
        if (e.key === 'JohnDoeLocation') {
            locationSpan.textContent = e.newValue || 'No location set';
        }
        
        // Update status if changed from another tab or manager interface
        if (e.key === 'JohnDoeStatus') {
            statusDropdown.value = e.newValue || 'Available';
        }
    });
});
