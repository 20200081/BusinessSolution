/*
  ==========================================
  TRINIDAD FIELD MANAGEMENT SYSTEM
  EAST REGION MAP JAVASCRIPT
  ==========================================
  
  This JavaScript file handles the interactive map functionality for the East region of Trinidad.
  Covers eastern areas including Arima, Sangre Grande, and coastal regions.
  Features: single-click blue markers, double-click red markers, draggable markers.
*/

// Initialize the Leaflet map for the East region of Trinidad
// Configure boundaries for Eastern areas from Tunapuna to the far east coast
var map = L.map('map', {
  zoomControl: true,        // Shows zoom in/out buttons
  scrollWheelZoom: true,    // Allows mouse wheel zooming
  doubleClickZoom: true,    // Allows double-click to zoom
  dragging: true,           // Allows map panning by dragging
  minZoom: 11,             // Minimum zoom level for East region (wider area)
  maxZoom: 14,             // Maximum zoom level for detailed view
  zoomSnap: 0.1,           // Zoom level precision
  zoomDelta: 0.1,          // Zoom step size when using controls
  maxBounds: [
    [10.50, -61.45],       // SW corner - Tunapuna area west edge
    [10.85, -60.75]        // NE corner - far east coast
  ],
  maxBoundsViscosity: 1.0  // How strongly map resists going outside bounds
}).setView([10.65, -61.375], 11.2);  // Initial center (East Trinidad) shifted west for balance







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
    { id: 4, name: 'Kevin Ali', status: 'Available', location: 'Arima', iconColor: 'blue' },
    { id: 5, name: 'Priya Maharaj', status: 'On-route', location: 'Valencia', iconColor: 'red' }
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
