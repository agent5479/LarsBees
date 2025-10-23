// BeeMarshall - Cluster Management Module with Custom Grouping

// Cluster types and their associated colors
const CLUSTER_TYPES = {
    'production': { name: 'Production', color: '#28a745', icon: 'bi-hexagon-fill' },
    'nucleus': { name: 'Nucleus', color: '#17a2b8', icon: 'bi-circle-fill' },
    'queen-rearing': { name: 'Queen Rearing', color: '#ffc107', icon: 'bi-star-fill' },
    'research': { name: 'Research', color: '#6f42c1', icon: 'bi-flask' },
    'education': { name: 'Education', color: '#fd7e14', icon: 'bi-book' },
    'quarantine': { name: 'Quarantine', color: '#dc3545', icon: 'bi-shield-exclamation' },
    'backup': { name: 'Backup', color: '#6c757d', icon: 'bi-archive' },
    'custom': { name: 'Custom', color: '#20c997', icon: 'bi-gear' }
};

// Navigation
function showClusters() {
    hideAllViews();
    document.getElementById('clustersView').classList.remove('hidden');
    renderClusters();
    renderClusterTypeFilter();
}

function renderClusters() {
    const html = clusters.length > 0
        ? clusters.map(c => {
            const deleteBtn = isAdmin ? `
                <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); deleteCluster(${c.id})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            ` : '';
            
            const clusterType = c.clusterType || 'production';
            const typeInfo = CLUSTER_TYPES[clusterType] || CLUSTER_TYPES['custom'];
            
            return `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card cluster-card h-100" data-cluster-type="${clusterType}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title">
                                    <i class="bi ${typeInfo.icon}" style="color: ${typeInfo.color}"></i> 
                                    ${c.name}
                                </h5>
                                <span class="badge" style="background-color: ${typeInfo.color}; color: white;">
                                    ${typeInfo.name}
                                </span>
                            </div>
                            <p class="card-text text-muted">${c.description || 'No description'}</p>
                            <ul class="list-unstyled small">
                                <li><strong>Hives:</strong> ${c.hiveCount}</li>
                                <li><strong>GPS:</strong> ${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}</li>
                                ${c.harvestTimeline ? `<li><strong>Harvest:</strong> ${c.harvestTimeline}</li>` : ''}
                                ${c.sugarRequirements ? `<li><strong>Sugar:</strong> ${c.sugarRequirements}</li>` : ''}
                                ${c.landownerName ? `<li><strong>Landowner:</strong> ${c.landownerName}</li>` : ''}
                                ${c.siteType ? `<li><strong>Site Type:</strong> ${c.siteType}</li>` : ''}
                            </ul>
                            ${c.lastModifiedBy ? `<small class="text-muted"><i class="bi bi-person"></i> ${c.lastModifiedBy}</small>` : ''}
                        </div>
                        <div class="card-footer bg-light">
                            <button class="btn btn-sm btn-outline-warning" onclick="editCluster(${c.id})">
                                <i class="bi bi-pencil"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-outline-info" onclick="viewClusterDetails(${c.id})">
                                <i class="bi bi-eye"></i> View
                            </button>
                            ${deleteBtn}
                        </div>
                    </div>
                </div>
            `;
        }).join('')
        : '<div class="col-12"><p class="text-center text-muted my-5">No clusters yet. Add your first cluster!</p></div>';
    
    document.getElementById('clustersList').innerHTML = html;
}

function renderClusterTypeFilter() {
    const filterContainer = document.getElementById('clusterTypeFilter');
    if (!filterContainer) return;
    
    const filterHtml = `
        <div class="mb-3">
            <label class="form-label"><strong>Filter by Cluster Type:</strong></label>
            <div class="btn-group" role="group">
                <input type="radio" class="btn-check" name="clusterTypeFilter" id="filterAll" value="all" checked>
                <label class="btn btn-outline-secondary" for="filterAll">All Types</label>
                
                ${Object.entries(CLUSTER_TYPES).map(([key, type]) => `
                    <input type="radio" class="btn-check" name="clusterTypeFilter" id="filter${key}" value="${key}">
                    <label class="btn btn-outline-secondary" for="filter${key}" style="border-color: ${type.color}; color: ${type.color};">
                        <i class="bi ${type.icon}"></i> ${type.name}
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    
    filterContainer.innerHTML = filterHtml;
    
    // Add event listeners for filtering
    document.querySelectorAll('input[name="clusterTypeFilter"]').forEach(radio => {
        radio.addEventListener('change', function() {
            filterClustersByType(this.value);
        });
    });
}

function filterClustersByType(type) {
    const clusterCards = document.querySelectorAll('.cluster-card');
    
    clusterCards.forEach(card => {
        if (type === 'all' || card.dataset.clusterType === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function showAddClusterForm() {
    hideAllViews();
    document.getElementById('clusterFormView').classList.remove('hidden');
    document.getElementById('clusterFormTitle').textContent = 'Add New Hive Cluster';
    document.getElementById('clusterForm').reset();
    document.getElementById('clusterId').value = '';
    document.getElementById('anomalySection')?.classList.add('hidden');
    document.getElementById('mapPickerContainer').classList.add('hidden');
    
    // Populate cluster type dropdown
    populateClusterTypeDropdown();
    
    // Setup GPS button
    setTimeout(() => {
        const btn = document.getElementById('useLocationBtn');
        if (btn) {
            btn.onclick = getCurrentLocation;
        }
    }, 100);
}

function populateClusterTypeDropdown() {
    const typeSelect = document.getElementById('clusterType');
    if (!typeSelect) return;
    
    const options = Object.entries(CLUSTER_TYPES).map(([key, type]) => 
        `<option value="${key}" style="color: ${type.color}">
            <i class="bi ${type.icon}"></i> ${type.name}
        </option>`
    ).join('');
    
    typeSelect.innerHTML = `<option value="production">Select cluster type...</option>${options}`;
}

function handleSaveCluster(e) {
    e.preventDefault();
    
    const id = document.getElementById('clusterId').value;
    const cluster = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('clusterName').value,
        description: document.getElementById('clusterDescription').value,
        latitude: parseFloat(document.getElementById('clusterLat').value),
        longitude: parseFloat(document.getElementById('clusterLng').value),
        hiveCount: parseInt(document.getElementById('clusterHiveCount').value),
        harvestTimeline: document.getElementById('clusterHarvest').value,
        sugarRequirements: document.getElementById('clusterSugar').value,
        notes: document.getElementById('clusterNotes').value,
        clusterType: document.getElementById('clusterType').value || 'production',
        landownerName: document.getElementById('landownerName').value,
        landownerPhone: document.getElementById('landownerPhone').value,
        landownerEmail: document.getElementById('landownerEmail').value,
        landownerAddress: document.getElementById('landownerAddress').value,
        siteType: document.getElementById('siteType').value,
        accessType: document.getElementById('accessType').value,
        contactBeforeVisit: document.getElementById('contactBeforeVisit').checked,
        isQuarantine: document.getElementById('isQuarantine').checked,
        lastModifiedBy: currentUser.username,
        lastModifiedAt: new Date().toISOString(),
        createdAt: id ? (clusters.find(c => c.id === parseInt(id))?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };
    
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Saving...', 'syncing');
    database.ref(`clusters/${cluster.id}`).set(cluster)
        .then(() => {
            showSyncStatus('<i class="bi bi-check"></i> Saved by ' + currentUser.username);
            showClusters();
        });
}

function editCluster(id) {
    const cluster = clusters.find(c => c.id === id);
    if (!cluster) return;
    
    hideAllViews();
    document.getElementById('clusterFormView').classList.remove('hidden');
    document.getElementById('clusterFormTitle').textContent = 'Edit: ' + cluster.name;
    document.getElementById('clusterId').value = cluster.id;
    document.getElementById('clusterName').value = cluster.name;
    document.getElementById('clusterDescription').value = cluster.description || '';
    document.getElementById('clusterLat').value = cluster.latitude;
    document.getElementById('clusterLng').value = cluster.longitude;
    document.getElementById('clusterHiveCount').value = cluster.hiveCount;
    document.getElementById('clusterHarvest').value = cluster.harvestTimeline || '';
    document.getElementById('clusterSugar').value = cluster.sugarRequirements || '';
    document.getElementById('clusterNotes').value = cluster.notes || '';
    document.getElementById('clusterType').value = cluster.clusterType || 'production';
    document.getElementById('landownerName').value = cluster.landownerName || '';
    document.getElementById('landownerPhone').value = cluster.landownerPhone || '';
    document.getElementById('landownerEmail').value = cluster.landownerEmail || '';
    document.getElementById('landownerAddress').value = cluster.landownerAddress || '';
    document.getElementById('siteType').value = cluster.siteType || '';
    document.getElementById('accessType').value = cluster.accessType || '';
    document.getElementById('contactBeforeVisit').checked = cluster.contactBeforeVisit || false;
    document.getElementById('isQuarantine').checked = cluster.isQuarantine || false;
    document.getElementById('anomalySection')?.classList.remove('hidden');
    document.getElementById('mapPickerContainer').classList.add('hidden');
    
    // Populate cluster type dropdown
    populateClusterTypeDropdown();
    
    // Setup GPS button
    setTimeout(() => {
        const btn = document.getElementById('useLocationBtn');
        if (btn) {
            btn.onclick = getCurrentLocation;
        }
    }, 100);
}

function viewClusterDetails(id) {
    const cluster = clusters.find(c => c.id === id);
    if (!cluster) return;
    
    const typeInfo = CLUSTER_TYPES[cluster.clusterType] || CLUSTER_TYPES['custom'];
    
    const detailsHtml = `
        <div class="modal fade" id="clusterDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi ${typeInfo.icon}" style="color: ${typeInfo.color}"></i>
                            ${cluster.name}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Basic Information</h6>
                                <p><strong>Type:</strong> <span class="badge" style="background-color: ${typeInfo.color}; color: white;">${typeInfo.name}</span></p>
                                <p><strong>Description:</strong> ${cluster.description || 'No description'}</p>
                                <p><strong>Hive Count:</strong> ${cluster.hiveCount}</p>
                                <p><strong>GPS Coordinates:</strong> ${cluster.latitude.toFixed(6)}, ${cluster.longitude.toFixed(6)}</p>
                                
                                <h6 class="mt-3">Landowner Information</h6>
                                ${cluster.landownerName ? `<p><strong>Name:</strong> ${cluster.landownerName}</p>` : ''}
                                ${cluster.landownerPhone ? `<p><strong>Phone:</strong> ${cluster.landownerPhone}</p>` : ''}
                                ${cluster.landownerEmail ? `<p><strong>Email:</strong> ${cluster.landownerEmail}</p>` : ''}
                                ${cluster.landownerAddress ? `<p><strong>Address:</strong> ${cluster.landownerAddress}</p>` : ''}
                            </div>
                            <div class="col-md-6">
                                <h6>Site Details</h6>
                                <p><strong>Site Type:</strong> ${cluster.siteType || 'Not specified'}</p>
                                <p><strong>Access Type:</strong> ${cluster.accessType || 'Not specified'}</p>
                                <p><strong>Contact Before Visit:</strong> ${cluster.contactBeforeVisit ? 'Yes' : 'No'}</p>
                                <p><strong>Quarantine Status:</strong> ${cluster.isQuarantine ? 'Yes' : 'No'}</p>
                                
                                <h6 class="mt-3">Timeline & Requirements</h6>
                                ${cluster.harvestTimeline ? `<p><strong>Harvest Timeline:</strong> ${cluster.harvestTimeline}</p>` : ''}
                                ${cluster.sugarRequirements ? `<p><strong>Sugar Requirements:</strong> ${cluster.sugarRequirements}</p>` : ''}
                                
                                ${cluster.notes ? `
                                    <h6 class="mt-3">Notes</h6>
                                    <p>${cluster.notes}</p>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="editCluster(${cluster.id}); bootstrap.Modal.getInstance(document.getElementById('clusterDetailsModal')).hide();">
                            <i class="bi bi-pencil"></i> Edit Cluster
                        </button>
                        <button type="button" class="btn btn-success" onclick="scheduleTaskForCluster(${cluster.id}); bootstrap.Modal.getInstance(document.getElementById('clusterDetailsModal')).hide();">
                            <i class="bi bi-calendar-plus"></i> Schedule Task
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('clusterDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', detailsHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('clusterDetailsModal'));
    modal.show();
}

function scheduleTaskForCluster(clusterId) {
    // Pre-fill the schedule form with the selected cluster
    document.getElementById('scheduleCluster').value = clusterId;
    
    // Show the schedule modal
    const modal = new bootstrap.Modal(document.getElementById('scheduleTaskModal'));
    modal.show();
}

function deleteCluster(id) {
    if (!isAdmin) {
        alert('Only Lars (admin) can delete clusters!');
        return;
    }
    
    if (confirm('Delete this cluster? This cannot be undone!')) {
        database.ref(`clusters/${id}`).remove();
    }
}

// Enhanced map with cluster type colors
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.log('Leaflet not yet loaded, will retry...');
        setTimeout(initMap, 500);
        return;
    }
    
    const center = clusters.length > 0 
        ? [clusters[0].latitude, clusters[0].longitude]
        : [-40.6764, 172.6856]; // Collingwood, NZ
    
    // Create map if it doesn't exist
    if (!map) {
        try {
            map = L.map('map').setView(center, 10);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);
            
            console.log('OpenStreetMap initialized successfully');
        } catch (error) {
            console.error('Error creating map:', error);
            return;
        }
    }
    
    // Clear existing markers
    if (map._layers) {
        Object.values(map._layers).forEach(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    }
    markers = [];
    
    // Add marker for each cluster with type-specific colors
    clusters.forEach(cluster => {
        try {
            const typeInfo = CLUSTER_TYPES[cluster.clusterType] || CLUSTER_TYPES['custom'];
            
            // Create custom icon with cluster type color
            const customIcon = L.divIcon({
                className: 'custom-cluster-marker',
                html: `<div style="
                    background-color: ${typeInfo.color};
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 10px;
                "><i class="bi ${typeInfo.icon}"></i></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            
            const marker = L.marker([cluster.latitude, cluster.longitude], { icon: customIcon })
                .bindPopup(`
                    <div style="padding:10px; min-width:200px;">
                        <h6>
                            <a href="#" onclick="viewClusterDetails(${cluster.id}); return false;" style="color: ${typeInfo.color}; text-decoration: none; font-weight: bold; cursor: pointer;">
                                <i class="bi ${typeInfo.icon}"></i> ${cluster.name}
                            </a>
                        </h6>
                        <p class="mb-1"><small>${cluster.description || 'No description'}</small></p>
                        <p class="mb-1"><strong>Type:</strong> <span style="color: ${typeInfo.color};">${typeInfo.name}</span></p>
                        <p class="mb-1"><strong>Hives:</strong> ${cluster.hiveCount}</p>
                        ${cluster.harvestTimeline ? `<p class="mb-1"><strong>Harvest:</strong> ${cluster.harvestTimeline}</p>` : ''}
                        ${cluster.sugarRequirements ? `<p class="mb-1"><strong>Sugar:</strong> ${cluster.sugarRequirements}</p>` : ''}
                        ${cluster.landownerName ? `<p class="mb-1"><strong>Landowner:</strong> ${cluster.landownerName}</p>` : ''}
                        <div class="mt-2 d-grid gap-1">
                            <button class="btn btn-sm btn-primary" onclick="viewClusterDetails(${cluster.id}); return false;">
                                <i class="bi bi-eye"></i> View Details
                            </button>
                            <button class="btn btn-sm btn-success" onclick="scheduleTaskForCluster(${cluster.id}); return false;">
                                <i class="bi bi-calendar-plus"></i> Schedule Task
                            </button>
                            <button class="btn btn-sm btn-outline-warning" onclick="editCluster(${cluster.id}); return false;">
                                <i class="bi bi-pencil"></i> Edit Cluster
                            </button>
                        </div>
                    </div>
                `, {
                    maxWidth: 250,
                    className: 'cluster-popup'
                })
                .on('popupopen', function() {
                    // Ensure popup events work correctly
                    const popup = this.getPopup();
                    const popupElement = popup.getElement();
                    if (popupElement) {
                        popupElement.style.zIndex = '1000';
                    }
                })
                .addTo(map);
            
            markers.push(marker);
        } catch (error) {
            console.error('Error adding marker for cluster:', cluster.name, error);
        }
    });
    
    // Fit bounds to show all markers
    if (clusters.length > 1 && markers.length > 0) {
        try {
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1));
        } catch (error) {
            console.error('Error fitting bounds:', error);
        }
    }
}

// GPS Location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('GPS not supported by your browser');
        return;
    }
    
    showSyncStatus('<i class="bi bi-crosshair"></i> Getting GPS...', 'syncing');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            document.getElementById('clusterLat').value = position.coords.latitude.toFixed(6);
            document.getElementById('clusterLng').value = position.coords.longitude.toFixed(6);
            showSyncStatus('<i class="bi bi-check"></i> Location captured!', 'success');
        },
        (error) => {
            showSyncStatus('<i class="bi bi-x"></i> GPS error', 'error');
            alert('Could not get location: ' + error.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

// Map Picker with OpenStreetMap
function showMapPicker() {
    const container = document.getElementById('mapPickerContainer');
    
    if (typeof L === 'undefined') {
        alert('OpenStreetMap is still loading. Please wait a moment and try again.');
        return;
    }
    
    container.classList.toggle('hidden');
    
    if (!container.classList.contains('hidden')) {
        setTimeout(() => {
            const lat = parseFloat(document.getElementById('clusterLat').value) || -40.6764; // Collingwood, NZ
            const lng = parseFloat(document.getElementById('clusterLng').value) || 172.6856;
            
            // Clear existing map if any
            if (mapPicker) {
                mapPicker.remove();
            }
            
            mapPicker = L.map('mapPicker').setView([lat, lng], 13);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(mapPicker);
            
            let pickerMarker = L.marker([lat, lng], { draggable: true })
                .addTo(mapPicker);
            
            // Click map to move marker
            mapPicker.on('click', (e) => {
                pickerMarker.setLatLng(e.latlng);
                document.getElementById('clusterLat').value = e.latlng.lat.toFixed(6);
                document.getElementById('clusterLng').value = e.latlng.lng.toFixed(6);
            });
            
            // Drag marker
            pickerMarker.on('dragend', (e) => {
                const latlng = e.target.getLatLng();
                document.getElementById('clusterLat').value = latlng.lat.toFixed(6);
                document.getElementById('clusterLng').value = latlng.lng.toFixed(6);
            });
        }, 200);
    }
}
