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

function validateCoordinates() {
    const lat = parseFloat(document.getElementById('clusterLat').value);
    const lng = parseFloat(document.getElementById('clusterLng').value);
    
    const latField = document.getElementById('clusterLat');
    const lngField = document.getElementById('clusterLng');
    
    // Reset validation classes
    latField.classList.remove('is-valid', 'is-invalid');
    lngField.classList.remove('is-valid', 'is-invalid');
    
    // Validate latitude
    if (!isNaN(lat) && lat >= -90 && lat <= 90) {
        latField.classList.add('is-valid');
    } else if (latField.value.trim() !== '') {
        latField.classList.add('is-invalid');
    }
    
    // Validate longitude
    if (!isNaN(lng) && lng >= -180 && lng <= 180) {
        lngField.classList.add('is-valid');
    } else if (lngField.value.trim() !== '') {
        lngField.classList.add('is-invalid');
    }
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
    
    // Validate coordinates
    const lat = parseFloat(document.getElementById('clusterLat').value);
    const lng = parseFloat(document.getElementById('clusterLng').value);
    
    if (isNaN(lat) || isNaN(lng)) {
        alert('Please enter valid GPS coordinates.');
        return;
    }
    
    if (lat < -90 || lat > 90) {
        alert('Latitude must be between -90 and 90 degrees.');
        return;
    }
    
    if (lng < -180 || lng > 180) {
        alert('Longitude must be between -180 and 180 degrees.');
        return;
    }
    
    const id = document.getElementById('clusterId').value;
    const cluster = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('clusterName').value,
        description: document.getElementById('clusterDescription').value,
        latitude: parseFloat(document.getElementById('clusterLat').value) || 0,
        longitude: parseFloat(document.getElementById('clusterLng').value) || 0,
        hiveCount: parseInt(document.getElementById('clusterHiveCount').value),
        // Hive strength breakdown
        hiveStrength: {
            strong: parseInt(document.getElementById('hiveStrong').value) || 0,
            medium: parseInt(document.getElementById('hiveMedium').value) || 0,
            weak: parseInt(document.getElementById('hiveWeak').value) || 0,
            nuc: parseInt(document.getElementById('hiveNUC').value) || 0,
            dead: parseInt(document.getElementById('hiveDead').value) || 0
        },
        // Hive stack configuration
        hiveStacks: {
            doubles: parseInt(document.getElementById('stackDoubles').value) || 0,
            topSplits: parseInt(document.getElementById('stackTopSplits').value) || 0,
            singles: parseInt(document.getElementById('stackSingles').value) || 0,
            nucs: parseInt(document.getElementById('stackNUCs').value) || 0,
            empty: parseInt(document.getElementById('stackEmpty').value) || 0
        },
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
    
    // Use tenant-specific path for data isolation
    const tenantPath = currentTenantId ? `tenants/${currentTenantId}/clusters` : 'clusters';
    database.ref(`${tenantPath}/${cluster.id}`).set(cluster)
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
    // Ensure coordinates are properly formatted as numbers
    const lat = parseFloat(cluster.latitude);
    const lng = parseFloat(cluster.longitude);
    
    console.log('Editing cluster coordinates:', { 
        original: { lat: cluster.latitude, lng: cluster.longitude },
        parsed: { lat, lng }
    });
    
    document.getElementById('clusterLat').value = isNaN(lat) ? '' : lat.toFixed(6);
    document.getElementById('clusterLng').value = isNaN(lng) ? '' : lng.toFixed(6);
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
    
    // Populate hive strength breakdown
    if (cluster.hiveStrength) {
        document.getElementById('hiveStrong').value = cluster.hiveStrength.strong || 0;
        document.getElementById('hiveMedium').value = cluster.hiveStrength.medium || 0;
        document.getElementById('hiveWeak').value = cluster.hiveStrength.weak || 0;
        document.getElementById('hiveNUC').value = cluster.hiveStrength.nuc || 0;
        document.getElementById('hiveDead').value = cluster.hiveStrength.dead || 0;
    }
    
    // Populate stack configuration
    if (cluster.hiveStacks) {
        document.getElementById('stackDoubles').value = cluster.hiveStacks.doubles || 0;
        document.getElementById('stackTopSplits').value = cluster.hiveStacks.topSplits || 0;
        document.getElementById('stackSingles').value = cluster.hiveStacks.singles || 0;
        document.getElementById('stackNUCs').value = cluster.hiveStacks.nucs || 0;
        document.getElementById('stackEmpty').value = cluster.hiveStacks.empty || 0;
    }
    
    // Update the breakdown summaries
    updateHiveStrengthTotals();
    updateStackTotals();
    
    document.getElementById('anomalySection')?.classList.remove('hidden');
    document.getElementById('mapPickerContainer').classList.add('hidden');
    
    // Populate cluster type dropdown
    populateClusterTypeDropdown();
    
    // Add event listeners for coordinate validation
    document.getElementById('clusterLat').addEventListener('blur', validateCoordinates);
    document.getElementById('clusterLng').addEventListener('blur', validateCoordinates);
    
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
        // Use tenant-specific path for data isolation
        const tenantPath = currentTenantId ? `tenants/${currentTenantId}/clusters` : 'clusters';
        database.ref(`${tenantPath}/${id}`).remove();
    }
}

// Update map with new cluster data
function updateMapWithClusters() {
    console.log('🔄 Updating map with cluster data...');
    if (map && clusters && clusters.length > 0) {
        renderClusters();
    } else if (map) {
        console.log('📍 Map exists but no clusters to render');
    } else {
        console.log('🗺️ Map not initialized yet');
    }
}

// Activate map when user clicks the placeholder
function activateMap() {
    console.log('🗺️ User clicked to activate map...');
    
    // Hide placeholder
    const placeholder = document.getElementById('mapPlaceholder');
    const mapElement = document.getElementById('map');
    
    if (placeholder && mapElement) {
        placeholder.style.display = 'none';
        mapElement.style.display = 'block';
        
        // Initialize map
        initMap();
        
        console.log('✅ Map activated and initialized');
    } else {
        console.error('❌ Map elements not found');
    }
}

// Enhanced map with cluster type colors
function initMap() {
    console.log('🗺️ Initializing map...');
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.log('❌ Map element not found');
        return;
    }
    
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.log('⏳ Leaflet not yet loaded, will retry...');
        setTimeout(initMap, 500);
        return;
    }
    
    // Always use Collingwood, NZ as default center
    const center = [-40.6764, 172.6856]; // Collingwood, NZ
    console.log('📍 Map center set to Collingwood, NZ');
    
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
    
    // Only render clusters if we have data
    if (!clusters || clusters.length === 0) {
        console.log('📍 No clusters to render yet');
        return;
    }
    
    console.log(`📍 Rendering ${clusters.length} clusters on map`);
    
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
            
            // Get pending tasks for this cluster
            const clusterTasks = scheduledTasks.filter(task => 
                task.clusterId === cluster.id && !task.completed
            ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            
            const marker = L.marker([cluster.latitude, cluster.longitude], { icon: customIcon })
                .bindPopup(`
                    <div style="padding:10px; min-width:250px;">
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
                        
                        ${clusterTasks.length > 0 ? `
                            <div class="mt-3">
                                <h6 class="mb-2"><i class="bi bi-list-check"></i> Pending Tasks (${clusterTasks.length})</h6>
                                <div class="pending-tasks-list" style="max-height: 150px; overflow-y: auto;">
                                    ${clusterTasks.slice(0, 5).map(task => {
                                        const taskName = getTaskDisplayName(null, task.taskId);
                                        const dueDate = new Date(task.dueDate);
                                        const isOverdue = dueDate < new Date();
                                        const priorityClass = task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'secondary';
                                        
                                        return `
                                            <div class="pending-task-item mb-2 p-2" style="border-left: 3px solid var(--${priorityClass}); background: rgba(0,0,0,0.05); border-radius: 3px;">
                                                <div class="d-flex justify-content-between align-items-start">
                                                    <div class="flex-grow-1">
                                                        <strong style="font-size: 0.85rem;">${taskName}</strong>
                                                        <br><small class="text-muted">Due: ${dueDate.toLocaleDateString()}</small>
                                                        ${isOverdue ? '<br><span class="badge bg-danger" style="font-size: 0.7rem;">OVERDUE</span>' : ''}
                                                        ${task.priority !== 'normal' ? `<br><span class="badge bg-${priorityClass}" style="font-size: 0.7rem;">${task.priority.toUpperCase()}</span>` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                    ${clusterTasks.length > 5 ? `<small class="text-muted">... and ${clusterTasks.length - 5} more tasks</small>` : ''}
                                </div>
                            </div>
                        ` : `
                            <div class="mt-3">
                                <p class="text-muted mb-0"><i class="bi bi-check-circle"></i> No pending tasks</p>
                            </div>
                        `}
                        
                        <div class="mt-3 d-grid gap-1">
                            <button class="btn btn-sm btn-primary" onclick="viewClusterDetails(${cluster.id}); return false;">
                                <i class="bi bi-eye"></i> View Details
                            </button>
                            <button class="btn btn-sm btn-success" onclick="scheduleTaskForCluster(${cluster.id}); return false;">
                                <i class="bi bi-calendar-plus"></i> Schedule Task
                            </button>
                            <button class="btn btn-sm btn-outline-warning" onclick="editCluster(${cluster.id}); return false;">
                                <i class="bi bi-pencil"></i> Edit Cluster
                            </button>
                            ${clusterTasks.length > 0 ? `
                                <button class="btn btn-sm btn-outline-info" onclick="showScheduledTasks(); return false;">
                                    <i class="bi bi-list-check"></i> View All Tasks
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `, {
                    maxWidth: 300,
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
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            
            document.getElementById('clusterLat').value = lat;
            document.getElementById('clusterLng').value = lng;
            
            // Trigger validation to show success state
            validateCoordinates();
            
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
