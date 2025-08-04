// Setup map
var map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    dragging: true,
    minZoom: 13,
    maxZoom: 14,
    maxBounds: [[10.575, -61.595], [10.805, -61.455]],
    maxBoundsViscosity: 1.0,
    zoomSnap: 0.1,
    zoomDelta: 0.1
}).setView([10.702, -61.512], 13.3);

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

// Load technician data specific to West region
// Uses unique localStorage key to prevent conflicts with other regions
function loadTechnicians() {
    // Force update - clear old data and reload with complete team
    localStorage.removeItem('west_technicians');
    
    // Initialize complete technicians for West region (matches config.js)
    const defaultTechs = [
        { id: 1, name: 'Rajesh Maharaj', status: 'Available', location: 'Maraval', iconColor: 'blue' },
        { id: 2, name: 'Keisha Mohammed', status: 'On-route', location: 'Westmoorings', iconColor: 'red' },
        { id: 3, name: 'Anil Persad', status: 'On site', location: 'St. James', iconColor: 'blue' },
        { id: 4, name: 'Shania Williams', status: 'Available', location: 'Diego Martin', iconColor: 'blue' }
    ];
    localStorage.setItem('west_technicians', JSON.stringify(defaultTechs));
    return defaultTechs;
}

let technicians = loadTechnicians();

// Save technician data changes to West region storage
function saveTechnicians() {
    localStorage.setItem('west_technicians', JSON.stringify(technicians));
}

// Find Rajesh Maharaj's technician object
function getRajeshMaharaj() {
    return technicians.find(t => t.name === 'Rajesh Maharaj');
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
        if (tech.name === 'Rajesh Maharaj') {
            let jdStatus = localStorage.getItem('RajeshMaharajStatus');
            if (!jdStatus) jdStatus = tech.status;
            statusLabel.textContent = `Status: ${jdStatus}`;
        } else {
            statusLabel.textContent = `Status: ${tech.status}`;
        }
        card.appendChild(statusLabel);

        const locationInput = document.createElement('input');
        locationInput.type = 'text';
        // For John Doe: load location from localStorage if available
        if (tech.name === 'Rajesh Maharaj') {
            let jdLocation = localStorage.getItem('RajeshMaharajLocation');
            locationInput.value = jdLocation ? jdLocation : tech.location;
        } else {
            locationInput.value = tech.location;
        }

        locationInput.className = 'tech-location-input';
        locationInput.title = "Edit technician's assigned location";

        locationInput.addEventListener('change', (e) => {
            if (tech.name === 'Rajesh Maharaj') {
                // Save Rajesh location for tech.html synchronization
                localStorage.setItem('RajeshMaharajLocation', e.target.value);
            }
            tech.location = e.target.value;
            saveTechnicians();
            
            // Trigger storage event for cross-tab synchronization
            window.dispatchEvent(new StorageEvent('storage', {
                key: tech.name === 'Rajesh Maharaj' ? 'RajeshMaharajLocation' : null,
                newValue: e.target.value
            }));
        });

        card.appendChild(locationInput);

        container.appendChild(card);
    });
}

renderTechnicianBar();