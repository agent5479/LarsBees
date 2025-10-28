// BeeMarshall - Standalone JavaScript Application
// All data stored in browser's localStorage

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

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tasks if not exists
    if (!localStorage.getItem('tasks')) {
        localStorage.setItem('tasks', JSON.stringify(DEFAULT_TASKS));
    }
    
    // Check if logged in
    if (localStorage.getItem('loggedIn') === 'true') {
        showMainApp();
    }
    
    // Setup login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('siteForm').addEventListener('submit', handleSaveSite);
    document.getElementById('actionForm').addEventListener('submit', handleLogAction);
    
    // Set today's date as default
    document.getElementById('actionDate').valueAsDate = new Date();
});

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('loginPassword').value;
    const storedPassword = localStorage.getItem('appPassword');
    
    if (!storedPassword) {
        // First time setup
        localStorage.setItem('appPassword', password);
        localStorage.setItem('loggedIn', 'true');
        alert('Password set successfully! Remember this password for future logins.');
        showMainApp();
    } else if (password === storedPassword) {
        localStorage.setItem('loggedIn', 'true');
        showMainApp();
    } else {
        alert('Incorrect password!');
    }
}

function logout() {
    localStorage.setItem('loggedIn', 'false');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginPassword').value = '';
}

function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    showDashboard();
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

// Data Management
function getSites() {
    const sites = localStorage.getItem('sites');
    return sites ? JSON.parse(sites) : [];
}

function saveSites(sites) {
    localStorage.setItem('sites', JSON.stringify(sites));
}

function getActions() {
    const actions = localStorage.getItem('actions');
    return actions ? JSON.parse(actions) : [];
}

function saveActions(actions) {
    localStorage.setItem('actions', JSON.stringify(actions));
}

// Dashboard
function updateDashboard() {
    const sites = getSites();
    const actions = getActions();
    
    // Update stats
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
    const sites = getSites();
    
    const mapOptions = {
        zoom: 10,
        center: sites.length > 0 
            ? { lat: sites[0].latitude, lng: sites[0].longitude }
            : { lat: 40.7128, lng: -74.0060 },
        mapTypeId: 'terrain'
    };
    
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    // Add markers for each site
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
    
    // Fit bounds if multiple markers
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
    const sites = getSites();
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
    
    const sites = getSites();
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
    
    if (id) {
        // Update existing
        const index = sites.findIndex(c => c.id === parseInt(id));
        sites[index] = site;
    } else {
        // Add new
        sites.push(site);
    }
    
    saveSites(sites);
    showSites();
}

function editSite(id) {
    const sites = getSites();
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
        let sites = getSites();
        sites = sites.filter(c => c.id !== id);
        saveSites(sites);
        renderSites();
    }
}

// Actions
function populateActionForm() {
    const sites = getSites();
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    
    // Populate site dropdown
    const siteSelect = document.getElementById('actionSite');
    siteSelect.innerHTML = '<option value="">Select a site...</option>' +
        sites.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    // Populate task checkboxes
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
    
    // Get selected tasks
    const selectedTasks = Array.from(document.querySelectorAll('.task-checkbox:checked'))
        .map(cb => parseInt(cb.value));
    
    if (selectedTasks.length === 0) {
        alert('Please select at least one task');
        return;
    }
    
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const actions = getActions();
    
    // Create action for each selected task
    selectedTasks.forEach(taskId => {
        const task = tasks.find(t => t.id === taskId);
        actions.push({
            id: Date.now() + Math.random(),
            siteId: siteId,
            taskId: taskId,
            taskName: task.name,
            date: date,
            notes: notes,
            createdAt: new Date().toISOString()
        });
    });
    
    saveActions(actions);
    alert(`Successfully logged ${selectedTasks.length} action(s)!`);
    showActions();
}

function renderActions() {
    const actions = getActions().reverse();
    const sites = getSites();
    
    const actionsHtml = actions.length > 0
        ? actions.map(action => {
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
        let actions = getActions();
        actions = actions.filter(a => a.id !== id && a.id.toString() !== id.toString());
        saveActions(actions);
        renderActions();
        updateDashboard();
    }
}

// Export/Import Data
function exportData() {
    const data = {
        sites: getSites(),
        actions: getActions(),
        tasks: JSON.parse(localStorage.getItem('tasks')),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `larsbees-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (confirm('This will replace all current data. Continue?')) {
                localStorage.setItem('sites', JSON.stringify(data.sites));
                localStorage.setItem('actions', JSON.stringify(data.actions));
                localStorage.setItem('tasks', JSON.stringify(data.tasks));
                alert('Data imported successfully!');
                showDashboard();
            }
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
}

