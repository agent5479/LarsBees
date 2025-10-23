// BeeMarshall Pro - Comprehensive Apiary Management
// Real-time sync for Lars + Employee

// COMPREHENSIVE TASK LIST
const COMPREHENSIVE_TASKS = [
    // INSPECTION (Common field tasks)
    { id: 101, name: 'General Hive Inspection', category: 'Inspection', common: true },
    { id: 102, name: 'Queen Check (Present & Laying)', category: 'Inspection', common: true },
    { id: 103, name: 'Queen Marking', category: 'Inspection', common: false },
    { id: 104, name: 'Brood Pattern Inspection', category: 'Inspection', common: true },
    { id: 105, name: 'Comb Condition Check', category: 'Inspection', common: false },
    { id: 106, name: 'Population Assessment', category: 'Inspection', common: true },
    { id: 107, name: 'Food Stores Check', category: 'Inspection', common: true },
    { id: 108, name: 'Varroa Mite Inspection', category: 'Inspection', common: true },
    { id: 109, name: 'Small Hive Beetle Check', category: 'Inspection', common: true },
    { id: 110, name: 'Wax Moth Check', category: 'Inspection', common: false },
    { id: 111, name: 'Disease Inspection (AFB/EFB)', category: 'Inspection', common: false },
    { id: 112, name: 'Nosema Check', category: 'Inspection', common: false },
    { id: 113, name: 'Chalkbrood Inspection', category: 'Inspection', common: false },
    { id: 114, name: 'Entrance Activity Observation', category: 'Inspection', common: true },
    { id: 115, name: 'Temperament Assessment', category: 'Inspection', common: false },
    
    // FEEDING
    { id: 201, name: 'Sugar Syrup 1:1 (Spring Build-up)', category: 'Feeding', common: true },
    { id: 202, name: 'Sugar Syrup 2:1 (Fall Prep)', category: 'Feeding', common: true },
    { id: 203, name: 'Pollen Substitute', category: 'Feeding', common: false },
    { id: 204, name: 'Pollen Patty', category: 'Feeding', common: true },
    { id: 205, name: 'Fondant Feeding', category: 'Feeding', common: false },
    { id: 206, name: 'Candy Board', category: 'Feeding', common: false },
    { id: 207, name: 'Emergency Feeding', category: 'Feeding', common: false },
    { id: 208, name: 'Protein Supplement', category: 'Feeding', common: false },
    
    // TREATMENT
    { id: 301, name: 'Varroa Treatment - Formic Acid', category: 'Treatment', common: false },
    { id: 302, name: 'Varroa Treatment - Oxalic Acid', category: 'Treatment', common: false },
    { id: 303, name: 'Varroa Treatment - Apivar Strips', category: 'Treatment', common: false },
    { id: 304, name: 'Varroa Treatment - Other Method', category: 'Treatment', common: false },
    { id: 305, name: 'Nosema Treatment', category: 'Treatment', common: false },
    { id: 306, name: 'Small Hive Beetle Treatment', category: 'Treatment', common: false },
    { id: 307, name: 'Wax Moth Treatment', category: 'Treatment', common: false },
    { id: 308, name: 'Tracheal Mite Treatment', category: 'Treatment', common: false },
    
    // HARVEST
    { id: 401, name: 'Honey Harvest', category: 'Harvest', common: true },
    { id: 402, name: 'Comb Honey Harvest', category: 'Harvest', common: false },
    { id: 403, name: 'Wax Collection', category: 'Harvest', common: false },
    { id: 404, name: 'Propolis Collection', category: 'Harvest', common: false },
    { id: 405, name: 'Pollen Collection', category: 'Harvest', common: false },
    { id: 406, name: 'Frame Extraction', category: 'Harvest', common: true },
    { id: 407, name: 'Honey Bottling/Packaging', category: 'Harvest', common: false },
    
    // MAINTENANCE
    { id: 501, name: 'Add Honey Super', category: 'Maintenance', common: true },
    { id: 502, name: 'Remove Honey Super', category: 'Maintenance', common: true },
    { id: 503, name: 'Add Brood Box', category: 'Maintenance', common: false },
    { id: 504, name: 'Replace Old Frames', category: 'Maintenance', common: false },
    { id: 505, name: 'Add Foundation', category: 'Maintenance', common: false },
    { id: 506, name: 'Hive Repair/Painting', category: 'Maintenance', common: false },
    { id: 507, name: 'Stand Repair', category: 'Maintenance', common: false },
    { id: 508, name: 'Entrance Reducer - Install', category: 'Maintenance', common: true },
    { id: 509, name: 'Entrance Reducer - Remove', category: 'Maintenance', common: true },
    { id: 510, name: 'Queen Excluder - Install', category: 'Maintenance', common: true },
    { id: 511, name: 'Queen Excluder - Remove', category: 'Maintenance', common: true },
    { id: 512, name: 'Bottom Board Cleaning', category: 'Maintenance', common: false },
    { id: 513, name: 'Mouse Guard - Install', category: 'Maintenance', common: true },
    { id: 514, name: 'Mouse Guard - Remove', category: 'Maintenance', common: true },
    { id: 515, name: 'Ventilation Adjustment', category: 'Maintenance', common: false },
    
    // SEASONAL PREP
    { id: 601, name: 'Spring Buildup Preparation', category: 'Seasonal', common: false },
    { id: 602, name: 'Summer Ventilation Setup', category: 'Seasonal', common: false },
    { id: 603, name: 'Fall Winterization', category: 'Seasonal', common: true },
    { id: 604, name: 'Winter Insulation', category: 'Seasonal', common: false },
    { id: 605, name: 'Spring Cleanup', category: 'Seasonal', common: false },
    
    // QUEEN MANAGEMENT
    { id: 701, name: 'Requeen Colony', category: 'Queen Management', common: false },
    { id: 702, name: 'Add Queen Cell', category: 'Queen Management', common: false },
    { id: 703, name: 'Split Colony', category: 'Queen Management', common: false },
    { id: 704, name: 'Combine Colonies', category: 'Queen Management', common: false },
    { id: 705, name: 'Swarm Prevention Measures', category: 'Queen Management', common: false },
    { id: 706, name: 'Swarm Capture', category: 'Queen Management', common: false },
    { id: 707, name: 'Nuc Creation', category: 'Queen Management', common: false },
    { id: 708, name: 'Queen Introduction', category: 'Queen Management', common: false },
    
    // PROBLEMS & EMERGENCIES
    { id: 801, name: 'Queenless Colony Found', category: 'Problems', common: false },
    { id: 802, name: 'Laying Worker Present', category: 'Problems', common: false },
    { id: 803, name: 'Robbing Observed', category: 'Problems', common: false },
    { id: 804, name: 'Absconding Risk', category: 'Problems', common: false },
    { id: 805, name: 'Disease Quarantine', category: 'Problems', common: false },
    { id: 806, name: 'Pest Emergency Response', category: 'Problems', common: false },
    { id: 807, name: 'Weak Colony Identified', category: 'Problems', common: false },
    { id: 808, name: 'Aggressive Behavior Noted', category: 'Problems', common: false },
    
    // MEASUREMENTS & RECORDS
    { id: 901, name: 'Hive Weight Measurement', category: 'Records', common: false },
    { id: 902, name: 'Temperature Check', category: 'Records', common: false },
    { id: 903, name: 'Humidity Check', category: 'Records', common: false },
    { id: 904, name: 'Photo Documentation', category: 'Records', common: true },
    { id: 905, name: 'Sample Collection', category: 'Records', common: false },
    { id: 906, name: 'Equipment Inventory', category: 'Records', common: false },
    { id: 907, name: 'Varroa Mite Count', category: 'Records', common: false }
];

// Global variables
let userId = null;
let currentUser = null;
let clusters = [];
let actions = [];
let individualHives = [];
let tasks = COMPREHENSIVE_TASKS;
let map = null;
let markers = [];
let mapPicker = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    userId = localStorage.getItem('userId');
    currentUser = localStorage.getItem('currentUser');
    
    if (userId && currentUser) {
        showMainApp();
        loadDataFromFirebase();
    }
    
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('clusterForm').addEventListener('submit', handleSaveCluster);
    document.getElementById('actionForm').addEventListener('submit', handleLogAction);
    document.getElementById('actionDate').valueAsDate = new Date();
    
    // Display today's date
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const todayEl = document.getElementById('todayDate');
    if (todayEl) todayEl.textContent = today;
});

// Sync status indicator
function showSyncStatus(message, type = 'success') {
    const indicator = document.getElementById('syncIndicator');
    const syncText = document.getElementById('syncText');
    
    indicator.classList.remove('hidden', 'syncing', 'error');
    
    if (type === 'syncing') indicator.classList.add('syncing');
    else if (type === 'error') indicator.classList.add('error');
    
    syncText.innerHTML = message;
    indicator.classList.remove('hidden');
    
    if (type !== 'syncing') {
        setTimeout(() => indicator.classList.add('hidden'), 3000);
    }
}

// Hash function
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return 'user_' + Math.abs(hash).toString(36);
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('loginPassword').value;
    const username = document.getElementById('loginUsername').value;
    
    if (!password || !username) {
        alert('Please enter both name and password');
        return;
    }
    
    userId = simpleHash(password);
    currentUser = username;
    localStorage.setItem('userId', userId);
    localStorage.setItem('currentUser', currentUser);
    
    showMainApp();
    loadDataFromFirebase();
}

function logout() {
    if (confirm('Logout? Changes are saved automatically.')) {
        userId = null;
        currentUser = null;
        localStorage.removeItem('userId');
        localStorage.removeItem('currentUser');
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }
}

function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('currentUserName').textContent = currentUser;
    showDashboard();
}

// Firebase data loading
function loadDataFromFirebase() {
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Loading...', 'syncing');
    
    database.ref(`users/${userId}/clusters`).on('value', (snapshot) => {
        clusters = snapshot.val() ? Object.values(snapshot.val()) : [];
        updateDashboard();
        if (!document.getElementById('clustersView').classList.contains('hidden')) renderClusters();
        showSyncStatus('<i class="bi bi-cloud-check"></i> Synced');
    });
    
    database.ref(`users/${userId}/actions`).on('value', (snapshot) => {
        actions = snapshot.val() ? Object.values(snapshot.val()) : [];
        updateDashboard();
        if (!document.getElementById('actionsView').classList.contains('hidden')) renderActions();
        showSyncStatus('<i class="bi bi-cloud-check"></i> Synced');
    });
    
    database.ref(`users/${userId}/individualHives`).on('value', (snapshot) => {
        individualHives = snapshot.val() ? Object.values(snapshot.val()) : [];
    });
    
    database.ref(`users/${userId}/tasks`).once('value', (snapshot) => {
        if (!snapshot.exists()) {
            COMPREHENSIVE_TASKS.forEach(task => {
                database.ref(`users/${userId}/tasks/${task.id}`).set(task);
            });
        } else {
            tasks = Object.values(snapshot.val());
        }
    });
}

// Geolocation
function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation not supported by your browser');
        return;
    }
    
    showSyncStatus('<i class="bi bi-crosshair"></i> Getting GPS location...', 'syncing');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            document.getElementById('clusterLat').value = position.coords.latitude.toFixed(6);
            document.getElementById('clusterLng').value = position.coords.longitude.toFixed(6);
            showSyncStatus('<i class="bi bi-check"></i> Location captured!', 'success');
        },
        (error) => {
            showSyncStatus('<i class="bi bi-x"></i> Could not get location', 'error');
            alert('Error: ' + error.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

// Map picker
function showMapPicker() {
    const container = document.getElementById('mapPickerContainer');
    container.classList.toggle('hidden');
    
    if (!container.classList.contains('hidden')) {
        setTimeout(() => {
            const lat = parseFloat(document.getElementById('clusterLat').value) || 40.7128;
            const lng = parseFloat(document.getElementById('clusterLng').value) || -74.0060;
            
            mapPicker = new google.maps.Map(document.getElementById('mapPicker'), {
                zoom: 12,
                center: { lat, lng },
                mapTypeId: 'hybrid'
            });
            
            let pickerMarker = new google.maps.Marker({
                position: { lat, lng },
                map: mapPicker,
                draggable: true
            });
            
            mapPicker.addListener('click', (e) => {
                pickerMarker.setPosition(e.latLng);
                document.getElementById('clusterLat').value = e.latLng.lat().toFixed(6);
                document.getElementById('clusterLng').value = e.latLng.lng().toFixed(6);
            });
            
            pickerMarker.addListener('dragend', (e) => {
                document.getElementById('clusterLat').value = e.latLng.lat().toFixed(6);
                document.getElementById('clusterLng').value = e.latLng.lng().toFixed(6);
            });
        }, 100);
    }
}

// Initialize use location button
setTimeout(() => {
    const btn = document.getElementById('useLocationBtn');
    if (btn) btn.addEventListener('click', getCurrentLocation);
}, 1000);

// Navigation
function hideAllViews() {
    ['dashboardView', 'clustersView', 'clusterFormView', 'actionsView', 'logActionView', 'clusterDetailView', 'individualHivesView'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
}

function showDashboard() {
    hideAllViews();
    document.getElementById('dashboardView').classList.remove('hidden');
    updateDashboard();
}

function showClusters() {
    hideAllViews();
    document.getElementById('clustersView').classList.remove('hidden');
    renderClusters();
}

function showActions() {
    hideAllViews();
    document.getElementById('actionsView').classList.remove('hidden');
    populateActionFilters();
    renderActions();
}

function showAddClusterForm() {
    hideAllViews();
    document.getElementById('clusterFormView').classList.remove('hidden');
    document.getElementById('clusterFormTitle').textContent = 'Add New Hive Cluster';
    document.getElementById('clusterForm').reset();
    document.getElementById('clusterId').value = '';
    document.getElementById('breakIntoHivesSection').classList.add('hidden');
    document.getElementById('mapPickerContainer').classList.add('hidden');
}

function showLogActionForm() {
    hideAllViews();
    document.getElementById('logActionView').classList.remove('hidden');
    populateActionForm();
}

// Dashboard
function updateDashboard() {
    const totalHives = clusters.reduce((sum, c) => sum + (c.hiveCount || 0), 0);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeekActions = actions.filter(a => new Date(a.date) >= weekAgo).length;
    
    document.getElementById('statClusters').textContent = clusters.length;
    document.getElementById('statHives').textContent = totalHives;
    document.getElementById('statActions').textContent = actions.length;
    document.getElementById('statThisWeek').textContent = thisWeekActions;
    
    if (typeof google !== 'undefined') initMap();
    
    const recentActions = [...actions].reverse().slice(0, 10);
    const recentHtml = recentActions.length > 0 
        ? recentActions.map(a => {
            const cluster = clusters.find(c => c.id === a.clusterId);
            return `
                <div class="action-item">
                    <div><strong>${a.taskName}</strong> - ${cluster ? cluster.name : 'Unknown'}</div>
                    <small class="text-muted">${a.date} • ${a.loggedBy || 'User'}</small>
                    ${a.notes ? `<p class="mb-0 mt-1"><small>${a.notes}</small></p>` : ''}
                </div>
            `;
        }).join('')
        : '<p class="text-muted">No actions yet. Log your first action!</p>';
    
    document.getElementById('recentActions').innerHTML = recentHtml;
}

// Google Maps
function initMap() {
    if (!document.getElementById('map')) return;
    
    const center = clusters.length > 0 
        ? { lat: clusters[0].latitude, lng: clusters[0].longitude }
        : { lat: 40.7128, lng: -74.0060 };
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center,
        mapTypeId: 'terrain'
    });
    
    markers.forEach(m => m.setMap(null));
    markers = [];
    
    clusters.forEach(cluster => {
        const marker = new google.maps.Marker({
            position: { lat: cluster.latitude, lng: cluster.longitude },
            map,
            title: cluster.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#FFC107',
                fillOpacity: 0.8,
                strokeColor: '#FF9800',
                strokeWeight: 2
            }
        });
        
        const info = new google.maps.InfoWindow({
            content: `<div style="padding:10px"><h6><strong>${cluster.name}</strong></h6><p class="mb-1">${cluster.description||'No description'}</p><p class="mb-0"><strong>Hives:</strong> ${cluster.hiveCount}</p></div>`
        });
        
        marker.addListener('click', () => info.open(map, marker));
        markers.push(marker);
    });
    
    if (clusters.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        clusters.forEach(c => bounds.extend(new google.maps.LatLng(c.latitude, c.longitude)));
        map.fitBounds(bounds);
    }
}

// Clusters
function renderClusters() {
    const html = clusters.length > 0
        ? clusters.map(c => `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card cluster-card h-100">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-geo-alt-fill text-warning"></i> ${c.name}</h5>
                        <p class="card-text text-muted">${c.description || 'No description'}</p>
                        <ul class="list-unstyled">
                            <li><strong>Hives:</strong> ${c.hiveCount}</li>
                            ${c.harvestTimeline ? `<li><strong>Harvest:</strong> ${c.harvestTimeline}</li>` : ''}
                            ${c.sugarRequirements ? `<li><strong>Sugar:</strong> ${c.sugarRequirements}</li>` : ''}
                        </ul>
                        ${c.lastModifiedBy ? `<small class="text-muted">Updated by ${c.lastModifiedBy}</small>` : ''}
                    </div>
                    <div class="card-footer bg-light">
                        <button class="btn btn-sm btn-outline-info" onclick="viewClusterDetail(${c.id})">
                            <i class="bi bi-eye"></i> View
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="editCluster(${c.id})">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteCluster(${c.id})">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('')
        : '<div class="col-12"><p class="text-center text-muted my-5">No clusters yet. Add your first cluster to get started!</p></div>';
    
    document.getElementById('clustersList').innerHTML = html;
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
        lastModifiedBy: currentUser,
        lastModifiedAt: new Date().toISOString(),
        createdAt: id ? (clusters.find(c => c.id === parseInt(id))?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };
    
    saveClusterToFirebase(cluster);
    showClusters();
}

function editCluster(id) {
    const cluster = clusters.find(c => c.id === id);
    if (!cluster) return;
    
    hideAllViews();
    document.getElementById('clusterFormView').classList.remove('hidden');
    document.getElementById('clusterFormTitle').textContent = 'Edit Hive Cluster';
    document.getElementById('clusterId').value = cluster.id;
    document.getElementById('clusterName').value = cluster.name;
    document.getElementById('clusterDescription').value = cluster.description || '';
    document.getElementById('clusterLat').value = cluster.latitude;
    document.getElementById('clusterLng').value = cluster.longitude;
    document.getElementById('clusterHiveCount').value = cluster.hiveCount;
    document.getElementById('clusterHarvest').value = cluster.harvestTimeline || '';
    document.getElementById('clusterSugar').value = cluster.sugarRequirements || '';
    document.getElementById('clusterNotes').value = cluster.notes || '';
    document.getElementById('breakIntoHivesSection').classList.remove('hidden');
    document.getElementById('mapPickerContainer').classList.add('hidden');
}

function deleteCluster(id) {
    if (confirm('Delete this cluster? This cannot be undone.')) {
        database.ref(`users/${userId}/clusters/${id}`).remove();
    }
}

function viewClusterDetail(id) {
    const cluster = clusters.find(c => c.id === id);
    if (!cluster) return;
    
    hideAllViews();
    document.getElementById('clusterDetailView').classList.remove('hidden');
    document.getElementById('clusterDetailName').textContent = cluster.name;
    
    const info = `
        <p class="lead">${cluster.description || 'No description'}</p>
        <ul class="list-unstyled">
            <li><strong>Hives:</strong> ${cluster.hiveCount}</li>
            <li><strong>GPS:</strong> ${cluster.latitude.toFixed(4)}, ${cluster.longitude.toFixed(4)}</li>
            ${cluster.harvestTimeline ? `<li><strong>Harvest:</strong> ${cluster.harvestTimeline}</li>` : ''}
            ${cluster.sugarRequirements ? `<li><strong>Sugar:</strong> ${cluster.sugarRequirements}</li>` : ''}
            ${cluster.notes ? `<li><strong>Notes:</strong> ${cluster.notes}</li>` : ''}
        </ul>
        <button class="btn btn-warning" onclick="editCluster(${cluster.id})">Edit</button>
        <button class="btn btn-outline-danger" onclick="deleteCluster(${cluster.id})">Delete</button>
    `;
    document.getElementById('clusterDetailInfo').innerHTML = info;
    
    // Show actions for this cluster
    const clusterActions = actions.filter(a => a.clusterId === id).reverse();
    const actionsHtml = clusterActions.length > 0
        ? clusterActions.map(a => `
            <div class="action-item">
                <strong>${a.taskName}</strong><br>
                <small class="text-muted">${a.date} • ${a.loggedBy || 'User'}</small>
                ${a.notes ? `<p class="mb-0 mt-1"><small>${a.notes}</small></p>` : ''}
            </div>
        `).join('')
        : '<p class="text-muted">No actions for this cluster yet.</p>';
    document.getElementById('clusterActions').innerHTML = actionsHtml;
    
    // Show individual hives if any
    const hives = individualHives.filter(h => h.clusterId === id);
    const hivesHtml = hives.length > 0
        ? hives.map(h => `
            <div class="border-bottom pb-2 mb-2">
                <strong>${h.hiveName}</strong>
                <span class="badge bg-${h.status === 'healthy' ? 'success' : h.status === 'infected' ? 'danger' : 'warning'}">${h.status}</span>
                ${h.notes ? `<br><small>${h.notes}</small>` : ''}
            </div>
        `).join('')
        : '<p class="text-muted">No individual hives tracked. Cluster managed as whole.</p>';
    document.getElementById('individualHivesForCluster').innerHTML = hivesHtml;
}

// Actions - Enhanced
function populateActionForm() {
    const clusterSelect = document.getElementById('actionCluster');
    clusterSelect.innerHTML = '<option value="">Select a cluster...</option>' +
        clusters.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    const tasksByCategory = {};
    tasks.forEach(task => {
        if (!tasksByCategory[task.category]) tasksByCategory[task.category] = [];
        tasksByCategory[task.category].push(task);
    });
    
    const html = Object.keys(tasksByCategory).sort().map(category => `
        <div class="col-md-6 mb-3 category-section">
            <h6 class="category-header"><i class="bi bi-tag-fill"></i> ${category}</h6>
            ${tasksByCategory[category].map(task => `
                <div class="form-check task-checkbox-item ${task.common ? 'common-task' : ''}" data-common="${task.common}">
                    <input class="form-check-input task-checkbox" type="checkbox" value="${task.id}" id="task${task.id}">
                    <label class="form-check-label" for="task${task.id}">
                        ${task.name}
                        ${task.common ? '<span class="badge bg-success badge-sm">Common</span>' : ''}
                    </label>
                </div>
            `).join('')}
        </div>
    `).join('');
    
    document.getElementById('taskCheckboxes').innerHTML = `<div class="row">${html}</div>`;
}

function filterTaskCheckboxes(filter) {
    document.querySelectorAll('.task-checkbox-item').forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.common === 'true') ? '' : 'none';
    });
}

function loadIndividualHivesForAction() {
    const clusterId = parseInt(document.getElementById('actionCluster').value);
    const hives = individualHives.filter(h => h.clusterId === clusterId);
    
    if (hives.length > 0) {
        const select = document.getElementById('actionIndividualHive');
        select.innerHTML = '<option value="">All hives in cluster</option>' +
            hives.map(h => `<option value="${h.id}">${h.hiveName} (${h.status})</option>`).join('');
        document.getElementById('individualHiveSelectContainer').classList.remove('hidden');
    } else {
        document.getElementById('individualHiveSelectContainer').classList.add('hidden');
    }
}

function handleLogAction(e) {
    e.preventDefault();
    
    const clusterId = parseInt(document.getElementById('actionCluster').value);
    const date = document.getElementById('actionDate').value;
    const notes = document.getElementById('actionNotes').value;
    const individualHiveId = document.getElementById('actionIndividualHive')?.value || null;
    
    if (!clusterId) {
        alert('Please select a cluster');
        return;
    }
    
    const selectedTasks = Array.from(document.querySelectorAll('.task-checkbox:checked'))
        .map(cb => parseInt(cb.value));
    
    if (selectedTasks.length === 0) {
        alert('Please select at least one task');
        return;
    }
    
    const promises = selectedTasks.map(taskId => {
        const task = tasks.find(t => t.id === taskId);
        const action = {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            clusterId,
            individualHiveId: individualHiveId || null,
            taskId,
            taskName: task.name,
            taskCategory: task.category,
            date,
            notes,
            loggedBy: currentUser,
            createdAt: new Date().toISOString()
        };
        return database.ref(`users/${userId}/actions/${action.id}`).set(action);
    });
    
    Promise.all(promises).then(() => {
        alert(`✅ Successfully logged ${selectedTasks.length} action(s) by ${currentUser}!`);
        showActions();
    });
}

function populateActionFilters() {
    const clusterFilter = document.getElementById('filterCluster');
    clusterFilter.innerHTML = '<option value="">All Clusters</option>' +
        clusters.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    const categories = [...new Set(tasks.map(t => t.category))].sort();
    const categoryFilter = document.getElementById('filterCategory');
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function filterActions() {
    renderActions();
}

function renderActions() {
    const clusterFilter = document.getElementById('filterCluster')?.value;
    const categoryFilter = document.getElementById('filterCategory')?.value;
    
    let filtered = [...actions];
    if (clusterFilter) filtered = filtered.filter(a => a.clusterId == clusterFilter);
    if (categoryFilter) filtered = filtered.filter(a => a.taskCategory === categoryFilter);
    
    const html = filtered.reverse().length > 0
        ? filtered.map(a => {
            const cluster = clusters.find(c => c.id === a.clusterId);
            const hive = individualHives.find(h => h.id === a.individualHiveId);
            return `
                <div class="action-item">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="mb-1">
                                <span class="badge bg-secondary">${a.taskCategory || 'Task'}</span>
                                <strong>${a.taskName}</strong>
                            </div>
                            <div class="text-muted small">
                                <i class="bi bi-geo-alt"></i> ${cluster ? cluster.name : 'Unknown'}
                                ${hive ? ` • Hive: ${hive.hiveName}` : ''}
                                <br>
                                <i class="bi bi-calendar"></i> ${a.date} • 
                                <i class="bi bi-person"></i> ${a.loggedBy || 'User'}
                            </div>
                            ${a.notes ? `<p class="mb-0 mt-2"><small>${a.notes}</small></p>` : ''}
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteAction('${a.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('')
        : '<p class="text-center text-muted my-5">No actions found.</p>';
    
    document.getElementById('actionsList').innerHTML = html;
}

function deleteAction(id) {
    if (confirm('Delete this action?')) {
        database.ref(`users/${userId}/actions/${id}`).remove();
    }
}

// Individual Hives (Anomaly System)
function breakIntoIndividualHives() {
    const clusterId = parseInt(document.getElementById('clusterId').value);
    const cluster = clusters.find(c => c.id === clusterId);
    
    if (!cluster) return;
    
    const hiveCount = cluster.hiveCount;
    const confirmed = confirm(`Break "${cluster.name}" into ${hiveCount} individually tracked hives?\n\nThis is useful for infection management or when you need to track specific hives.`);
    
    if (confirmed) {
        for (let i = 1; i <= hiveCount; i++) {
            const hive = {
                id: `${clusterId}_hive_${i}`,
                clusterId: clusterId,
                hiveName: `Hive ${i}`,
                status: 'healthy',
                notes: '',
                createdAt: new Date().toISOString(),
                createdBy: currentUser
            };
            database.ref(`users/${userId}/individualHives/${hive.id}`).set(hive);
        }
        alert(`✅ Created ${hiveCount} individual hive records!`);
        viewClusterDetail(clusterId);
    }
}

// Firebase operations
function saveClusterToFirebase(cluster) {
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Saving...', 'syncing');
    database.ref(`users/${userId}/clusters/${cluster.id}`).set(cluster)
        .then(() => showSyncStatus('<i class="bi bi-cloud-check"></i> Saved by ' + currentUser))
        .catch(err => showSyncStatus('<i class="bi bi-x"></i> Error', 'error'));
}

