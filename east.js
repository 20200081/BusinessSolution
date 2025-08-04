var map = L.map('map', {
  zoomControl: true,
  scrollWheelZoom: true,
  doubleClickZoom: true,
  dragging: true,
  minZoom: 11,
  maxZoom: 14,
  zoomSnap: 0.1,
  zoomDelta: 0.1,
  maxBounds: [
    [10.50, -61.45],  // SW corner - Tunapuna area west edge
    [10.85, -60.75]   // NE corner - far east coast
  ],
  maxBoundsViscosity: 1.0
}).setView([10.65, -61.375], 11.2);  // Shift center ~0.075 degrees west (from -61.30 to -61.375)







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

// Load technician data specific to East region  
// Uses unique localStorage key to prevent conflicts with other regions
function loadTechnicians() {
  // Force update - clear old data and reload with complete team
  localStorage.removeItem('east_technicians');
  
  // Initialize complete technicians for East region (matches config.js)
  const defaultTechs = [
    { id: 5, name: 'Ravi Ramsingh', status: 'Available', location: 'Arima', iconColor: 'blue' },
    { id: 6, name: 'Priya Dookie', status: 'On-route', location: 'Valencia', iconColor: 'red' },
    { id: 7, name: 'Kevin Boodoo', status: 'Available', location: 'Sangre Grande', iconColor: 'blue' },
    { id: 8, name: 'Alicia Singh', status: 'Dispatched', location: 'Tunapuna', iconColor: 'red' }
  ];
  localStorage.setItem('east_technicians', JSON.stringify(defaultTechs));
  return defaultTechs;
}

let technicians = loadTechnicians();

// Save technician data changes to East region storage
function saveTechnicians() {
  localStorage.setItem('east_technicians', JSON.stringify(technicians));
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