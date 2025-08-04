
/*
  ==========================================
  CENTRAL REGION MAP CONTROLLER
  Trinidad Field Management System
  ==========================================
  
  JavaScript controller for Central Trinidad region map interface.
  Handles interactive mapping, technician tracking, marker placement,
  and real-time status updates using Leaflet.js and local storage.
  
  Key Features:
  - Interactive map with click-to-place markers
  - Technician status management and persistence
  - Real-time location tracking and updates
  - Drag-and-drop marker functionality
*/

// Initialize interactive map for Central Trinidad region
// Configured with specific boundaries and zoom limits for optimal viewing
var map = L.map('map', {
  zoomControl: true,        // Enable zoom in/out controls
  scrollWheelZoom: true,    // Allow mouse wheel zooming
  doubleClickZoom: true,    // Enable double-click zoom functionality
  dragging: true,           // Allow map panning via mouse drag
  minZoom: 10.8,           // Prevent zooming out beyond useful detail level
  maxZoom: 14,             // Prevent zooming in beyond map data resolution
  zoomSnap: 0.1,           // Fine-grained zoom level control
  zoomDelta: 0.1,          // Smooth zoom increment steps
  // Geographic boundaries for Central Trinidad region
  maxBounds: [
    [10.30, -61.70],       // Southwest corner (Couva area)
    [10.60, -60.75]        // Northeast corner (Chaguanas area)
  ],
  maxBoundsViscosity: 1.0  // Strict boundary enforcement
}).setView([10.45, -61.22], 11.0);  // Center map on Central Trinidad

// Add OpenStreetMap tile layer for geographic data
// Provides roads, buildings, and terrain information
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'  // Required OSM attribution
}).addTo(map);

// Define custom marker icons for different technician states
// Blue markers indicate available technicians or standard locations
const blueIcon = L.icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
  iconSize: [37, 37],      // Consistent marker size
  iconAnchor: [18, 37]     // Icon anchor point for precise positioning
});

// Red markers indicate dispatched technicians or priority locations
const redIcon = L.icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
  iconSize: [37, 37],
  iconAnchor: [18, 37]
});

// Click detection system to differentiate single vs double clicks
let clickTimeout = null;

// Map click event handler with single/double click detection
// Single click: places blue marker (available technician)
// Double click: places red marker (dispatched/priority)
map.on('click', function(e) {
  if (clickTimeout !== null) {
    // Double-click detected - clear single-click timer and place red marker
    clearTimeout(clickTimeout);
    clickTimeout = null;
    addMarker(e.latlng, 'red');
  } else {
    // Potential single-click - set timer to place blue marker
    clickTimeout = setTimeout(() => {
      addMarker(e.latlng, 'blue');
      clickTimeout = null;
    }, 300);  // 300ms delay allows double-click detection
  }
});

// Create and place interactive marker on map
// Markers are draggable and can be removed via right-click
function addMarker(latlng, color) {
  let marker = L.marker(latlng, {
    draggable: true,                              // Allow marker repositioning
    icon: color === 'red' ? redIcon : blueIcon   // Select appropriate icon
  }).addTo(map);

  // Right-click context menu removes marker from map
  marker.on('contextmenu', () => map.removeLayer(marker));
}

// Technician data management using browser local storage
// Ensures data persistence across browser sessions and page reloads

// Load existing technician data or initialize with defaults
function loadTechnicians() {
  const data = localStorage.getItem('central_technicians');
  if (data) {
    // Parse and return existing technician data
    return JSON.parse(data);
  }
  
  // Initialize default technicians for Central region
  const defaultTechs = [
    { id: 6, name: 'Ravi Singh', status: 'Available', location: 'Chaguanas', iconColor: 'blue' },
    { id: 7, name: 'Alicia Boodram', status: 'Dispatched', location: 'Couva', iconColor: 'red' }
  ];
  
  // Save default data to local storage for future sessions
  localStorage.setItem('central_technicians', JSON.stringify(defaultTechs));
  return defaultTechs;
}

// Global technicians array for current session
let technicians = loadTechnicians();

// Persist technician data changes to local storage
function saveTechnicians() {
  localStorage.setItem('central_technicians', JSON.stringify(technicians));
}

// Render technician status bar with interactive elements
// Creates visual cards showing each technician's current status and location
function renderTechnicianBar() {
  const container = document.getElementById('tech-status-bar');
  container.innerHTML = ''; // Clear existing content

  technicians.forEach(tech => {
    // Create individual technician card container
    const card = document.createElement('div');
    card.className = 'tech-card';

    // Add status icon based on technician's current state
    const icon = document.createElement('img');
    icon.className = 'tech-icon';
    icon.src = tech.iconColor === 'red'
      ? 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png'
      : 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png';
    icon.alt = `${tech.name} icon`;
    card.appendChild(icon);

    // Display technician name prominently
    const nameLabel = document.createElement('div');
    nameLabel.textContent = tech.name;
    nameLabel.style.fontWeight = 'bold';
    card.appendChild(nameLabel);

    // Show current status (Available, Dispatched, etc.)
    const statusLabel = document.createElement('div');
    statusLabel.textContent = `Status: ${tech.status}`;
    card.appendChild(statusLabel);

    // Editable location input for assignment management
    const locationInput = document.createElement('input');
    locationInput.type = 'text';
    locationInput.value = tech.location;
    locationInput.className = 'tech-location-input';
    locationInput.title = "Edit technician's assigned location";

    // Save location changes to local storage automatically
    locationInput.addEventListener('change', (e) => {
      tech.location = e.target.value;
      saveTechnicians();
    });

    card.appendChild(locationInput);
    container.appendChild(card);
  });
}

// Initialize technician status bar on page load
renderTechnicianBar();
