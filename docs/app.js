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
    document.getElementById('clusterForm').addEventListener('submit', handleSaveCluster);
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
    document.getElementById('clusterFormView').classList.add('hidden');
    document.getElementById('actionsView').classList.add('hidden');
    document.getElementById('logActionView').classList.add('hidden');
}

function showDashboard() {
    hideAllViews();
    document.getElementById('dashboardView').classList.remove('hidden');
    updateDashboard();
}

function showClusters() {
    hideAllViews();
    document.getElementById('sitesView').classList.remove('hidden');
    renderClusters();
}

function showActions() {
    hideAllViews();
    document.getElementById('actionsView').classList.remove('hidden');
    renderActions();
}

function showAddClusterForm() {
    hideAllViews();
    document.getElementById('clusterFormView').classList.remove('hidden');
    document.getElementById('clusterFormTitle').textContent = 'Add Hive Cluster';
    document.getElementById('clusterForm').reset();
    document.getElementById('clusterId').value = '';
}

function showLogActionForm() {
    hideAllViews();
    document.getElementById('logActionView').classList.remove('hidden');
    populateActionForm();
}

// Data Management
function getClusters() {
    const clusters = localStorage.getItem('clusters');
    return clusters ? JSON.parse(clusters) : [];
}

function saveClusters(clusters) {
    localStorage.setItem('clusters', JSON.stringify(clusters));
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
    const clusters = getClusters();
    const actions = getActions();
    
    // Update stats
    const totalHives = clusters.reduce((sum, c) => sum + (c.hiveCount || 0), 0);
    document.getElementById('statClusters').textContent = clusters.length;
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
            const cluster = clusters.find(c => c.id === action.clusterId);
            const clusterName = cluster ? cluster.name : 'Unknown';
            return `
                <div class="action-item">
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong>${action.taskName}</strong> - ${clusterName}
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
    const clusters = getClusters();
    
    const mapOptions = {
        zoom: 10,
        center: clusters.length > 0 
            ? { lat: clusters[0].latitude, lng: clusters[0].longitude }
            : { lat: 40.7128, lng: -74.0060 },
        mapTypeId: 'terrain'
    };
    
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    // Add markers for each cluster
    clusters.forEach(cluster => {
        const marker = new google.maps.Marker({
            position: { lat: cluster.latitude, lng: cluster.longitude },
            map: map,
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
        
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h6><strong>${cluster.name}</strong></h6>
                    <p class="mb-1"><small>${cluster.description || 'No description'}</small></p>
                    <p class="mb-0"><strong>Hives:</strong> ${cluster.hiveCount}</p>
                </div>
            `
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
        
        markers.push(marker);
    });
    
    // Fit bounds if multiple markers
    if (clusters.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        clusters.forEach(cluster => {
            bounds.extend(new google.maps.LatLng(cluster.latitude, cluster.longitude));
        });
        map.fitBounds(bounds);
    }
}

// Clusters
function renderClusters() {
    const clusters = getClusters();
    const clustersHtml = clusters.length > 0
        ? clusters.map(cluster => `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card cluster-card h-100" onclick="editCluster(${cluster.id})">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="bi bi-geo-alt-fill text-warning"></i> ${cluster.name}
                        </h5>
                        <p class="card-text text-muted">${cluster.description || 'No description'}</p>
                        <ul class="list-unstyled">
                            <li><strong>Hives:</strong> ${cluster.hiveCount}</li>
                            ${cluster.harvestTimeline ? `<li><strong>Harvest:</strong> ${cluster.harvestTimeline}</li>` : ''}
                            ${cluster.sugarRequirements ? `<li><strong>Sugar:</strong> ${cluster.sugarRequirements}</li>` : ''}
                        </ul>
                    </div>
                    <div class="card-footer bg-light">
                        <button class="btn btn-sm btn-outline-warning" onclick="event.stopPropagation(); editCluster(${cluster.id})">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); deleteCluster(${cluster.id})">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('')
        : '<div class="col-12"><p class="text-center text-muted">No clusters yet. Add your first cluster!</p></div>';
    
    document.getElementById('sitesList').innerHTML = clustersHtml;
}

function handleSaveCluster(e) {
    e.preventDefault();
    
    const clusters = getClusters();
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
        createdAt: new Date().toISOString()
    };
    
    if (id) {
        // Update existing
        const index = clusters.findIndex(c => c.id === parseInt(id));
        clusters[index] = cluster;
    } else {
        // Add new
        clusters.push(cluster);
    }
    
    saveClusters(clusters);
    showClusters();
}

function editCluster(id) {
    const clusters = getClusters();
    const cluster = clusters.find(c => c.id === id);
    
    if (cluster) {
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
    }
}

function deleteCluster(id) {
    if (confirm('Are you sure you want to delete this cluster?')) {
        let clusters = getClusters();
        clusters = clusters.filter(c => c.id !== id);
        saveClusters(clusters);
        renderClusters();
    }
}

// Actions
function populateActionForm() {
    const clusters = getClusters();
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    
    // Populate cluster dropdown
    const clusterSelect = document.getElementById('actionCluster');
    clusterSelect.innerHTML = '<option value="">Select a cluster...</option>' +
        clusters.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
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
    
    const clusterId = parseInt(document.getElementById('actionCluster').value);
    const date = document.getElementById('actionDate').value;
    const notes = document.getElementById('actionNotes').value;
    
    if (!clusterId) {
        alert('Please select a cluster');
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
            clusterId: clusterId,
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
    const clusters = getClusters();
    
    const actionsHtml = actions.length > 0
        ? actions.map(action => {
            const cluster = clusters.find(c => c.id === action.clusterId);
            const clusterName = cluster ? cluster.name : 'Unknown';
            return `
                <div class="action-item">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="d-flex align-items-center mb-1">
                                <span class="badge bg-secondary me-2">${action.taskName}</span>
                                <strong>${clusterName}</strong>
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
        clusters: getClusters(),
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
                localStorage.setItem('clusters', JSON.stringify(data.clusters));
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

