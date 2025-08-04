var map = L.map('map', {
  zoomControl: true,
  scrollWheelZoom: true,
  doubleClickZoom: true,
  dragging: true,
  minZoom: 10.6,
  maxZoom: 14,
  zoomSnap: 0.1,
  zoomDelta: 0.1,
  maxBounds: [
    [9.95, -61.90],   // SW corner – enough to show Cedros and the southwestern tip
    [10.32, -60.50]   // NE corner – just below Central's southern border
  ],
  maxBoundsViscosity: 1.0
}).setView([10.13, -61.25], 10.9);
// Centered between Princes Town and Debe, nudged east to compensate for the tail



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

// Load technician data specific to South region
// Uses unique localStorage key to prevent conflicts with other regions
function loadTechnicians() {
  // Force update - clear old data and reload with complete team
  localStorage.removeItem('south_technicians');
  
  // Initialize complete technicians for South region (matches config.js)
  const defaultTechs = [
    { id: 13, name: 'Adesh Moonsammy', status: 'Available', location: 'San Fernando', iconColor: 'blue' },
    { id: 14, name: 'Kamala Seepersad', status: 'Busy', location: 'Point Fortin', iconColor: 'red' },
    { id: 15, name: 'Joel Gonzales', status: 'Available', location: 'Princes Town', iconColor: 'blue' },
    { id: 16, name: 'Reshma Ramdass', status: 'On-route', location: 'Penal', iconColor: 'red' }
  ];
  localStorage.setItem('south_technicians', JSON.stringify(defaultTechs));
  return defaultTechs;
}

let technicians = loadTechnicians();

// Save technician data changes to South region storage
function saveTechnicians() {
  localStorage.setItem('south_technicians', JSON.stringify(technicians));
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