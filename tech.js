window.addEventListener('DOMContentLoaded', () => {
    const statusDropdown = document.getElementById('status-dropdown');
    const locationSpan = document.getElementById('location');

    // Get saved status or use default
    let jdStatus = localStorage.getItem('RajeshMaharajStatus') || 'Available';
    // Get saved location or say none set
    let jdLocation = localStorage.getItem('RajeshMaharajLocation') || 'No location set';

    statusDropdown.value = jdStatus;
    locationSpan.textContent = jdLocation;

    // Update status when changed
    statusDropdown.addEventListener('change', (e) => {
        localStorage.setItem('RajeshMaharajStatus', e.target.value);
    });

    // Function to check for location updates from manager
    function updateLocationDisplay() {
        const currentLocation = localStorage.getItem('RajeshMaharajLocation') || 'No location set';
        if (locationSpan.textContent !== currentLocation) {
            locationSpan.textContent = currentLocation;
        }
    }

    // Check for location updates every 2 seconds
    setInterval(updateLocationDisplay, 2000);

    // Update UI if localStorage changes from other tabs (cross-tab communication)
    window.addEventListener('storage', (e) => {
        if (e.key === 'RajeshMaharajLocation') {
            locationSpan.textContent = e.newValue || 'No location set';
        }
        if (e.key === 'RajeshMaharajStatus') {
            statusDropdown.value = e.newValue || 'Available';
        }
    });
});