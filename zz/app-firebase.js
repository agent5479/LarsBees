// BeeMarshall - Firebase Cloud Sync Version
// Data synced across all browsers/devices using Firebase

// Default task types
const DEFAULT_TASKS = [
    { id: 1, name: 'General Inspection', category: 'Inspection' },
    { id: 2, name: 'Queen Check', category: 'Inspection' },
    { id: 3, name: 'Brood Pattern Check', category: 'Inspection' },
    { id: 4, name: 'Pest Inspection', category: 'Inspection' },
    { id: 5, name: 'Sugar Syrup Feeding', category: 'Feeding' },
    { id: 6, name: 'Pollen Patty', category: 'Feeding' },
    { id: 7, name: 'Fondant Feeding', category: 'Feeding' },
    { id: 8, name: 'Varroa Treatment', category: 'Treatment' },
    { id: 9, name: 'Nosema Treatment', category: 'Treatment' },
    { id: 10, name: 'Small Hive Beetle Treatment', category: 'Treatment' },
    { id: 11, name: 'Honey Harvest', category: 'Harvest' },
    { id: 12, name: 'Wax Harvest', category: 'Harvest' },
    { id: 13, name: 'Propolis Harvest', category: 'Harvest' },
    { id: 14, name: 'Add Super', category: 'Maintenance' },
    { id: 15, name: 'Remove Super', category: 'Maintenance' },
    { id: 16, name: 'Replace Frames', category: 'Maintenance' },
    { id: 17, name: 'Hive Repair', category: 'Maintenance' },
    { id: 18, name: 'Swarm Collection', category: 'Events' },
    { id: 19, name: 'Split Colony', category: 'Events' },
    { id: 20, name: 'Combine Colonies', category: 'Events' },
    { id: 21, name: 'Requeen', category: 'Events' }
];

// User ID (simple hash of password for single-user system)
let userId = null;

// Local cache
let sites = [];
let actions = [];
let tasks = DEFAULT_TASKS;

// Sync status
function showSyncStatus(message, type = 'success') {
    const indicator = document.getElementById('syncIndicator');
    const syncText = document.getElementById('syncText');
    
    indicator.classList.remove('hidden', 'syncing', 'error');
    
    if (type === 'syncing') {
        indicator.classList.add('syncing');
    } else if (type === 'error') {
        indicator.classList.add('error');
    }
    
    syncText.innerHTML = message;
    indicator.classList.remove('hidden');
    
    if (type !== 'syncing') {
        setTimeout(() => {
            indicator.classList.add('hidden');
        }, 3000);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check if logged in
    userId = localStorage.getItem('userId');
    if (userId) {
        showMainApp();
        loadDataFromFirebase();
    }
    
    // Setup forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('siteForm').addEventListener('submit', handleSaveSite);
    document.getElementById('actionForm').addEventListener('submit', handleLogAction);
    
    // Set today's date
    document.getElementById('actionDate').valueAsDate = new Date();
});

// Simple hash function for password
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'user_' + Math.abs(hash).toString(36);
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('loginPassword').value;
    
    if (!password) {
        alert('Please enter a password');
        return;
    }
    
    userId = simpleHash(password);
    localStorage.setItem('userId', userId);
    
    showMainApp();
    loadDataFromFirebase();
}

function logout() {
    userId = null;
    localStorage.removeItem('userId');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginPassword').value = '';
}

function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    showDashboard();
}

// Firebase Data Management
function loadDataFromFirebase() {
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Loading...', 'syncing');
    
    // Listen for sites
    database.ref(`tenants/${userId}/sites`).on('value', (snapshot) => {
        const data = snapshot.val();
        sites = data ? Object.values(data) : [];
        updateDashboard();
        if (document.getElementById('sitesView').classList.contains('hidden') === false) {
            renderSites();
        }
        showSyncStatus('<i class="bi bi-cloud-check"></i> Synced');
    });
    
    // Listen for actions
    database.ref(`tenants/${userId}/actions`).on('value', (snapshot) => {
        const data = snapshot.val();
        actions = data ? Object.values(data) : [];
        updateDashboard();
        if (document.getElementById('actionsView').classList.contains('hidden') === false) {
            renderActions();
        }
        showSyncStatus('<i class="bi bi-cloud-check"></i> Synced');
    });
    
    // Initialize tasks if not exists
    database.ref(`tenants/${userId}/tasks`).once('value', (snapshot) => {
        if (!snapshot.exists()) {
            DEFAULT_TASKS.forEach(task => {
                database.ref(`tenants/${userId}/tasks/${task.id}`).set(task);
            });
        }
    });
}

function saveSiteToFirebase(site) {
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Saving...', 'syncing');
    return database.ref(`tenants/${userId}/sites/${site.id}`).set(site)
        .then(() => {
            showSyncStatus('<i class="bi bi-cloud-check"></i> Saved');
        })
        .catch((error) => {
            showSyncStatus('<i class="bi bi-exclamation-triangle"></i> Error saving', 'error');
            console.error('Error:', error);
        });
}

function deleteSiteFromFirebase(siteId) {
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Deleting...', 'syncing');
    return database.ref(`tenants/${userId}/sites/${siteId}`).remove()
        .then(() => {
            showSyncStatus('<i class="bi bi-cloud-check"></i> Deleted');
        })
        .catch((error) => {
            showSyncStatus('<i class="bi bi-exclamation-triangle"></i> Error deleting', 'error');
            console.error('Error:', error);
        });
}

function saveActionToFirebase(action) {
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Saving...', 'syncing');
    return database.ref(`tenants/${userId}/actions/${action.id}`).set(action)
        .then(() => {
            showSyncStatus('<i class="bi bi-cloud-check"></i> Saved');
        })
        .catch((error) => {
            showSyncStatus('<i class="bi bi-exclamation-triangle"></i> Error saving', 'error');
            console.error('Error:', error);
        });
}

function deleteActionFromFirebase(actionId) {
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Deleting...', 'syncing');
    return database.ref(`tenants/${userId}/actions/${actionId}`).remove()
        .then(() => {
            showSyncStatus('<i class="bi bi-cloud-check"></i> Deleted');
        })
        .catch((error) => {
            showSyncStatus('<i class="bi bi-exclamation-triangle"></i> Error deleting', 'error');
            console.error('Error:', error);
        });
}

// Navigation
function hideAllViews() {
    document.getElementById('dashboardView').classList.add('hidden');
    document.getElementById('sitesView').classList.add('hidden');
    document.getElementById('siteFormView').classList.add('hidden');
    document.getElementById('actionsView').classList.add('hidden');
    document.getElementById('logActionView').classList.add('hidden');
}

function showDashboard() {
    hideAllViews();
    document.getElementById('dashboardView').classList.remove('hidden');
    updateDashboard();
}

function showSites() {
    hideAllViews();
    document.getElementById('sitesView').classList.remove('hidden');
    renderSites();
}

function showActions() {
    hideAllViews();
    document.getElementById('actionsView').classList.remove('hidden');
    renderActions();
}

function showAddSiteForm() {
    hideAllViews();
    document.getElementById('siteFormView').classList.remove('hidden');
    document.getElementById('siteFormTitle').textContent = 'Add Hive Site';
    document.getElementById('siteForm').reset();
    document.getElementById('siteId').value = '';
}

function showLogActionForm() {
    hideAllViews();
    document.getElementById('logActionView').classList.remove('hidden');
    populateActionForm();
}

// Dashboard
function updateDashboard() {
    const totalHives = sites.reduce((sum, c) => sum + (c.hiveCount || 0), 0);
    document.getElementById('statSites').textContent = sites.length;
    document.getElementById('statHives').textContent = totalHives;
    document.getElementById('statActions').textContent = actions.length;
    
    // Update map
    if (typeof google !== 'undefined') {
        initMap();
    }
    
    // Recent actions
    const recentActions = actions.slice(-10).reverse();
    const recentActionsHtml = recentActions.length > 0 
        ? recentActions.map(action => {
            const site = sites.find(c => c.id === action.siteId);
            const siteName = site ? site.name : 'Unknown';
            return `
                <div class="action-item">
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong>${action.taskName}</strong> - ${siteName}
                            <br><small class="text-muted">${action.date}</small>
                        </div>
                    </div>
                    ${action.notes ? `<p class="mb-0 mt-1"><small>${action.notes}</small></p>` : ''}
                </div>
            `;
        }).join('')
        : '<p class="text-muted">No actions recorded yet.</p>';
    
    document.getElementById('recentActions').innerHTML = recentActionsHtml;
}

// Google Maps
let map;
let markers = [];

function initMap() {
    const mapOptions = {
        zoom: 10,
        center: sites.length > 0 
            ? { lat: sites[0].latitude, lng: sites[0].longitude }
            : { lat: 40.7128, lng: -74.0060 },
        mapTypeId: 'terrain'
    };
    
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    sites.forEach(site => {
        const marker = new google.maps.Marker({
            position: { lat: site.latitude, lng: site.longitude },
            map: map,
            title: site.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#FFC107',
                fillOpacity: 0.8,
                strokeColor: '#FF9800',
                strokeWeight: 2
            }
        });
        
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h6><strong>${site.name}</strong></h6>
                    <p class="mb-1"><small>${site.description || 'No description'}</small></p>
                    <p class="mb-0"><strong>Hives:</strong> ${site.hiveCount}</p>
                </div>
            `
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
        
        markers.push(marker);
    });
    
    if (sites.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        sites.forEach(site => {
            bounds.extend(new google.maps.LatLng(site.latitude, site.longitude));
        });
        map.fitBounds(bounds);
    }
}

// Sites
function renderSites() {
    const sitesHtml = sites.length > 0
        ? sites.map(site => `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card site-card h-100" onclick="editSite(${site.id})">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="bi bi-geo-alt-fill text-warning"></i> ${site.name}
                        </h5>
                        <p class="card-text text-muted">${site.description || 'No description'}</p>
                        <ul class="list-unstyled">
                            <li><strong>Hives:</strong> ${site.hiveCount}</li>
                            ${site.harvestTimeline ? `<li><strong>Harvest:</strong> ${site.harvestTimeline}</li>` : ''}
                            ${site.sugarRequirements ? `<li><strong>Sugar:</strong> ${site.sugarRequirements}</li>` : ''}
                        </ul>
                    </div>
                    <div class="card-footer bg-light">
                        <button class="btn btn-sm btn-outline-warning" onclick="event.stopPropagation(); editSite(${site.id})">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); deleteSite(${site.id})">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('')
        : '<div class="col-12"><p class="text-center text-muted">No sites yet. Add your first site!</p></div>';
    
    document.getElementById('sitesList').innerHTML = sitesHtml;
}

function handleSaveSite(e) {
    e.preventDefault();
    
    const id = document.getElementById('siteId').value;
    
    const site = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('siteName').value,
        description: document.getElementById('siteDescription').value,
        latitude: parseFloat(document.getElementById('siteLat').value),
        longitude: parseFloat(document.getElementById('siteLng').value),
        hiveCount: parseInt(document.getElementById('siteHiveCount').value),
        harvestTimeline: document.getElementById('siteHarvest').value,
        sugarRequirements: document.getElementById('siteSugar').value,
        notes: document.getElementById('siteNotes').value,
        createdAt: new Date().toISOString()
    };
    
    saveSiteToFirebase(site).then(() => {
        showSites();
    });
}

function editSite(id) {
    const site = sites.find(c => c.id === id);
    
    if (site) {
        hideAllViews();
        document.getElementById('siteFormView').classList.remove('hidden');
        document.getElementById('siteFormTitle').textContent = 'Edit Hive Site';
        
        document.getElementById('siteId').value = site.id;
        document.getElementById('siteName').value = site.name;
        document.getElementById('siteDescription').value = site.description || '';
        document.getElementById('siteLat').value = site.latitude;
        document.getElementById('siteLng').value = site.longitude;
        document.getElementById('siteHiveCount').value = site.hiveCount;
        document.getElementById('siteHarvest').value = site.harvestTimeline || '';
        document.getElementById('siteSugar').value = site.sugarRequirements || '';
        document.getElementById('siteNotes').value = site.notes || '';
    }
}

function deleteSite(id) {
    if (confirm('Are you sure you want to delete this site?')) {
        deleteSiteFromFirebase(id).then(() => {
            renderSites();
        });
    }
}

// Actions
function populateActionForm() {
    const siteSelect = document.getElementById('actionSite');
    siteSelect.innerHTML = '<option value="">Select a site...</option>' +
        sites.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    const tasksByCategory = {};
    tasks.forEach(task => {
        if (!tasksByCategory[task.category]) {
            tasksByCategory[task.category] = [];
        }
        tasksByCategory[task.category].push(task);
    });
    
    const taskCheckboxesHtml = Object.keys(tasksByCategory).map(category => `
        <div class="col-md-6 mb-3">
            <h6 class="text-muted">${category}</h6>
            ${tasksByCategory[category].map(task => `
                <div class="form-check">
                    <input class="form-check-input task-checkbox" type="checkbox" value="${task.id}" id="task${task.id}">
                    <label class="form-check-label" for="task${task.id}">${task.name}</label>
                </div>
            `).join('')}
        </div>
    `).join('');
    
    document.getElementById('taskCheckboxes').innerHTML = taskCheckboxesHtml;
}

function handleLogAction(e) {
    e.preventDefault();
    
    const siteId = parseInt(document.getElementById('actionSite').value);
    const date = document.getElementById('actionDate').value;
    const notes = document.getElementById('actionNotes').value;
    
    if (!siteId) {
        alert('Please select a site');
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
            id: Date.now() + Math.random(),
            siteId: siteId,
            taskId: taskId,
            taskName: task.name,
            date: date,
            notes: notes,
            createdAt: new Date().toISOString()
        };
        return saveActionToFirebase(action);
    });
    
    Promise.all(promises).then(() => {
        alert(`Successfully logged ${selectedTasks.length} action(s)!`);
        showActions();
    });
}

function renderActions() {
    const sortedActions = [...actions].reverse();
    
    const actionsHtml = sortedActions.length > 0
        ? sortedActions.map(action => {
            const site = sites.find(c => c.id === action.siteId);
            const siteName = site ? site.name : 'Unknown';
            return `
                <div class="action-item">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="d-flex align-items-center mb-1">
                                <span class="badge bg-secondary me-2">${action.taskName}</span>
                                <strong>${siteName}</strong>
                            </div>
                            <small class="text-muted">
                                <i class="bi bi-calendar"></i> ${action.date}
                            </small>
                            ${action.notes ? `<p class="mb-0 mt-2"><small>${action.notes}</small></p>` : ''}
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteAction('${action.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('')
        : '<p class="text-muted">No actions recorded yet.</p>';
    
    document.getElementById('actionsList').innerHTML = actionsHtml;
}

function deleteAction(id) {
    if (confirm('Delete this action?')) {
        deleteActionFromFirebase(id).then(() => {
            renderActions();
        });
    }
}

