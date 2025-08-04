/*
  ==========================================
  TRINIDAD FIELD MANAGEMENT SYSTEM
  SOUTH REGION MAP JAVASCRIPT
  ==========================================
  
  This JavaScript file handles the interactive map functionality for the South region of Trinidad.
  Covers southern areas including San Fernando, Princes Town, Point Fortin, and Cedros.
  Features: single-click blue markers, double-click red markers, draggable markers.
*/

// Initialize the Leaflet map for the South region of Trinidad
// Configure boundaries for Southern areas from San Fernando to the southwestern peninsula
var map = L.map('map', {
  zoomControl: true,        // Shows zoom in/out buttons
  scrollWheelZoom: true,    // Allows mouse wheel zooming
  doubleClickZoom: true,    // Allows double-click to zoom
  dragging: true,           // Allows map panning by dragging
  minZoom: 10.6,           // Minimum zoom level for South region
  maxZoom: 14,             // Maximum zoom level for detailed view
  zoomSnap: 0.1,           // Zoom level precision
  zoomDelta: 0.1,          // Zoom step size when using controls
  maxBounds: [
    [9.95, -61.90],        // SW corner – enough to show Cedros and the southwestern tip
    [10.32, -60.50]        // NE corner – just below Central's southern border
  ],
  maxBoundsViscosity: 1.0  // How strongly map resists going outside bounds
}).setView([10.13, -61.25], 10.9);  // Centered between Princes Town and Debe, nudged east to compensate for the tail



L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const blueIcon = L.icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
  iconSize: [37, 37],
  iconAnchor: [18, 37]
});

const redIcon = L.icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
  iconSize: [37, 37],
  iconAnchor: [18, 37]
});

let clickTimeout = null;

map.on('click', function(e) {
  if (clickTimeout !== null) {
    clearTimeout(clickTimeout);
    clickTimeout = null;
    addMarker(e.latlng, 'red');
  } else {
    clickTimeout = setTimeout(() => {
      addMarker(e.latlng, 'blue');
      clickTimeout = null;
    }, 300);
  }
});

function addMarker(latlng, color) {
  let marker = L.marker(latlng, {
    draggable: true,
    icon: color === 'red' ? redIcon : blueIcon
  }).addTo(map);

  marker.on('contextmenu', () => map.removeLayer(marker));
}

function loadTechnicians() {
  const data = localStorage.getItem('technicians');
  if (data) {
    return JSON.parse(data);
  }
  const defaultTechs = [
    { id: 6, name: 'Amrita Singh', status: 'Available', location: 'San Fernando', iconColor: 'blue' },
    { id: 7, name: 'Ravi Deonarine', status: 'Busy', location: 'Point Fortin', iconColor: 'red' }
  ];
  localStorage.setItem('technicians', JSON.stringify(defaultTechs));
  return defaultTechs;
}

let technicians = loadTechnicians();

function saveTechnicians() {
  localStorage.setItem('technicians', JSON.stringify(technicians));
}

function renderTechnicianBar() {
  const container = document.getElementById('tech-status-bar');
  container.innerHTML = '';

  technicians.forEach(tech => {
    const card = document.createElement('div');
    card.className = 'tech-card';

    const icon = document.createElement('img');
    icon.className = 'tech-icon';
    icon.src = tech.iconColor === 'red'
      ? 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png'
      : 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png';
    icon.alt = `${tech.name} icon`;
    card.appendChild(icon);

    const nameLabel = document.createElement('div');
    nameLabel.textContent = tech.name;
    nameLabel.style.fontWeight = 'bold';
    card.appendChild(nameLabel);

    const statusLabel = document.createElement('div');
    statusLabel.textContent = `Status: ${tech.status}`;
    card.appendChild(statusLabel);

    const locationInput = document.createElement('input');
    locationInput.type = 'text';
    locationInput.value = tech.location;
    locationInput.className = 'tech-location-input';
    locationInput.title = "Edit technician's assigned location";

    locationInput.addEventListener('change', (e) => {
      tech.location = e.target.value;
      saveTechnicians();
    });

    card.appendChild(locationInput);
    container.appendChild(card);
  });
}

renderTechnicianBar();
