/*
  ==========================================
  TRINIDAD FIELD MANAGEMENT SYSTEM
  WEST REGION MAP JAVASCRIPT
  ==========================================
  
  This JavaScript file handles the interactive map functionality for the West region of Trinidad.
  Similar to other regions but with boundaries specifically set for Western Trinidad areas.
  Features: single-click blue markers, double-click red markers, draggable markers.
*/

// Initialize the Leaflet map for the West region of Trinidad
// Configure boundaries for Western areas including Diego Martin, Carenage, Chaguaramas
var map = L.map('map', {
    zoomControl: true,                               // Shows zoom in/out buttons
    scrollWheelZoom: true,                          // Allows mouse wheel zooming
    doubleClickZoom: true,                          // Allows double-click to zoom
    dragging: true,                                 // Allows map panning by dragging
    minZoom: 13,                                    // Minimum zoom level for West region
    maxZoom: 14,                                    // Maximum zoom level for detailed view
    maxBounds: [[10.575, -61.595], [10.805, -61.455]], // West region boundaries
    maxBoundsViscosity: 1.0,                        // How strongly map resists going outside bounds
    zoomSnap: 0.1,                                  // Zoom level precision
    zoomDelta: 0.1                                  // Zoom step size when using controls
}).setView([10.702, -61.512], 13.3);               // Initial center (West Trinidad) and zoom

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var blueIcon = L.icon({
    iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
    iconSize: [37, 37],
    iconAnchor: [18, 37],
});

var redIcon = L.icon({
    iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
    iconSize: [37, 37],
    iconAnchor: [18, 37],
});

let clickTimeout = null;

map.on('click', function(e) {
    if (clickTimeout !== null) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
        addMarker(e.latlng, 'red');
    } else {
        clickTimeout = setTimeout(function() {
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

    marker.on('contextmenu', function() {
        map.removeLayer(marker);
    });
}

// Load or init technicians in localStorage
function loadTechnicians() {
    const data = localStorage.getItem('technicians');
    if (data) {
        return JSON.parse(data);
    } else {
        const defaultTechs = [
            { id: 1, name: 'John Doe', status: 'Available', location: 'Maraval', iconColor: 'blue' },
            { id: 2, name: 'Jane Smith', status: 'On-route', location: 'Westmoorings', iconColor: 'red' },
            { id: 3, name: 'Carlos Perez', status: 'On site', location: 'St. James', iconColor: 'blue' }
        ];
        localStorage.setItem('technicians', JSON.stringify(defaultTechs));
        return defaultTechs;
    }
}

let technicians = loadTechnicians();

function saveTechnicians() {
    localStorage.setItem('technicians', JSON.stringify(technicians));
}

// Find John Doe's technician object
function getJohnDoe() {
    return technicians.find(t => t.name === 'John Doe');
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
        if (tech.name === 'John Doe') {
            let jdStatus = localStorage.getItem('JohnDoeStatus');
            if (!jdStatus) jdStatus = tech.status;
            statusLabel.textContent = `Status: ${jdStatus}`;
        } else {
            statusLabel.textContent = `Status: ${tech.status}`;
        }
        card.appendChild(statusLabel);

        const locationInput = document.createElement('input');
        locationInput.type = 'text';
        // For John Doe: load location from localStorage if available
        if (tech.name === 'John Doe') {
            let jdLocation = localStorage.getItem('JohnDoeLocation');
            locationInput.value = jdLocation ? jdLocation : tech.location;
        } else {
            locationInput.value = tech.location;
        }

        locationInput.className = 'tech-location-input';
        locationInput.title = "Edit technician's assigned location";

        locationInput.addEventListener('change', (e) => {
            if (tech.name === 'John Doe') {
                // Save John Doe location separately in localStorage
                localStorage.setItem('JohnDoeLocation', e.target.value);
            }
            tech.location = e.target.value;
            saveTechnicians();
        });

        card.appendChild(locationInput);

        container.appendChild(card);
    });
}

renderTechnicianBar();
