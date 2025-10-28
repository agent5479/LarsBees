// BeeMarshall - Enhanced Firebase Version with Comprehensive Features
// For Lars + Employee field use

// COMPREHENSIVE TASK LIST - Organized by Category
const COMPREHENSIVE_TASKS = [
    // INSPECTION TASKS (Category 1)
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
    
    // FEEDING TASKS (Category 2)
    { id: 201, name: 'Sugar Syrup 1:1 (Spring)', category: 'Feeding', common: true },
    { id: 202, name: 'Sugar Syrup 2:1 (Fall)', category: 'Feeding', common: true },
    { id: 203, name: 'Pollen Substitute', category: 'Feeding', common: false },
    { id: 204, name: 'Pollen Patty', category: 'Feeding', common: true },
    { id: 205, name: 'Fondant Feeding', category: 'Feeding', common: false },
    { id: 206, name: 'Candy Board', category: 'Feeding', common: false },
    { id: 207, name: 'Emergency Feeding', category: 'Feeding', common: false },
    { id: 208, name: 'Protein Supplement', category: 'Feeding', common: false },
    
    // TREATMENT TASKS (Category 3)
    { id: 301, name: 'Varroa Treatment - Formic Acid', category: 'Treatment', common: false },
    { id: 302, name: 'Varroa Treatment - Oxalic Acid', category: 'Treatment', common: false },
    { id: 303, name: 'Varroa Treatment - Apivar', category: 'Treatment', common: false },
    { id: 304, name: 'Varroa Treatment - Other', category: 'Treatment', common: false },
    { id: 305, name: 'Nosema Treatment', category: 'Treatment', common: false },
    { id: 306, name: 'Small Hive Beetle Treatment', category: 'Treatment', common: false },
    { id: 307, name: 'Wax Moth Treatment', category: 'Treatment', common: false },
    { id: 308, name: 'Tracheal Mite Treatment', category: 'Treatment', common: false },
    
    // HARVEST TASKS (Category 4)
    { id: 401, name: 'Honey Harvest', category: 'Harvest', common: true },
    { id: 402, name: 'Comb Honey Harvest', category: 'Harvest', common: false },
    { id: 403, name: 'Wax Collection', category: 'Harvest', common: false },
    { id: 404, name: 'Propolis Collection', category: 'Harvest', common: false },
    { id: 405, name: 'Pollen Collection', category: 'Harvest', common: false },
    { id: 406, name: 'Frame Extraction', category: 'Harvest', common: true },
    { id: 407, name: 'Honey Bottling', category: 'Harvest', common: false },
    
    // MAINTENANCE TASKS (Category 5)
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
    
    // SEASONAL PREP (Category 6)
    { id: 601, name: 'Spring Buildup Prep', category: 'Seasonal', common: false },
    { id: 602, name: 'Summer Ventilation Setup', category: 'Seasonal', common: false },
    { id: 603, name: 'Fall Winterization', category: 'Seasonal', common: false },
    { id: 604, name: 'Winter Insulation', category: 'Seasonal', common: false },
    { id: 605, name: 'Spring Cleanup', category: 'Seasonal', common: false },
    
    // QUEEN MANAGEMENT (Category 7)
    { id: 701, name: 'Requeen Colony', category: 'Queen Management', common: false },
    { id: 702, name: 'Add Queen Cell', category: 'Queen Management', common: false },
    { id: 703, name: 'Split Colony', category: 'Queen Management', common: false },
    { id: 704, name: 'Combine Colonies', category: 'Queen Management', common: false },
    { id: 705, name: 'Swarm Prevention', category: 'Queen Management', common: false },
    { id: 706, name: 'Swarm Capture', category: 'Queen Management', common: false },
    { id: 707, name: 'Nuc Creation', category: 'Queen Management', common: false },
    { id: 708, name: 'Queen Introduction', category: 'Queen Management', common: false },
    
    // PROBLEMS & EMERGENCIES (Category 8)
    { id: 801, name: 'Queenless Colony Found', category: 'Problems', common: false },
    { id: 802, name: 'Laying Worker Present', category: 'Problems', common: false },
    { id: 803, name: 'Robbing Observed', category: 'Problems', common: false },
    { id: 804, name: 'Absconding Risk', category: 'Problems', common: false },
    { id: 805, name: 'Disease Quarantine', category: 'Problems', common: false },
    { id: 806, name: 'Pest Emergency', category: 'Problems', common: false },
    { id: 807, name: 'Weak Colony Identified', category: 'Problems', common: false },
    { id: 808, name: 'Aggressive Behavior', category: 'Problems', common: false },
    
    // MEASUREMENTS & RECORDS (Category 9)
    { id: 901, name: 'Hive Weight Measurement', category: 'Records', common: false },
    { id: 902, name: 'Temperature Check', category: 'Records', common: false },
    { id: 903, name: 'Humidity Check', category: 'Records', common: false },
    { id: 904, name: 'Photo Documentation', category: 'Records', common: true },
    { id: 905, name: 'Sample Collection', category: 'Records', common: false },
    { id: 906, name: 'Equipment Inventory', category: 'Records', common: false },
    { id: 907, name: 'Varroa Count', category: 'Records', common: false }
];

// User ID (from password)
let userId = null;
let currentUser = null;

// Local cache
let sites = [];
let actions = [];
let tasks = COMPREHENSIVE_TASKS;

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

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check if logged in
    userId = localStorage.getItem('userId');
    currentUser = localStorage.getItem('currentUser') || 'User';
    
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
    
    // Setup geolocation button if present
    setupGeolocation();
});

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('loginPassword').value;
    const username = document.getElementById('loginUsername') ? document.getElementById('loginUsername').value : 'User';
    
    if (!password) {
        alert('Please enter a password');
        return;
    }
    
    userId = simpleHash(password);
    currentUser = username || 'User';
    localStorage.setItem('userId', userId);
    localStorage.setItem('currentUser', currentUser);
    
    showMainApp();
    loadDataFromFirebase();
}

function logout() {
    userId = null;
    currentUser = null;
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginPassword').value = '';
}

function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Update user name in navbar if present
    const userNameEl = document.getElementById('currentUserName');
    if (userNameEl) {
        userNameEl.textContent = currentUser;
    }
    
    showDashboard();
}

// Geolocation setup
function setupGeolocation() {
    // Add click handler for "Use My Location" button if it exists
    const geoButton = document.getElementById('useLocationBtn');
    if (geoButton) {
        geoButton.addEventListener('click', getCurrentLocation);
    }
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    
    showSyncStatus('<i class="bi bi-crosshair"></i> Getting location...', 'syncing');
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            document.getElementById('siteLat').value = position.coords.latitude.toFixed(6);
            document.getElementById('siteLng').value = position.coords.longitude.toFixed(6);
            showSyncStatus('<i class="bi bi-check"></i> Location captured!', 'success');
        },
        function(error) {
            showSyncStatus('<i class="bi bi-x"></i> Could not get location', 'error');
            console.error('Geolocation error:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
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
    database.ref(`users/${userId}/actions`).on('value', (snapshot) => {
        const data = snapshot.val();
        actions = data ? Object.values(data) : [];
        updateDashboard();
        if (document.getElementById('actionsView').classList.contains('hidden') === false) {
            renderActions();
        }
        showSyncStatus('<i class="bi bi-cloud-check"></i> Synced');
    });
    
    // Initialize tasks if not exists
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

function saveSiteToFirebase(site) {
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Saving...', 'syncing');
    site.lastModifiedBy = currentUser;
    site.lastModifiedAt = new Date().toISOString();
    
    return database.ref(`tenants/${userId}/sites/${site.id}`).set(site)
        .then(() => {
            showSyncStatus('<i class="bi bi-cloud-check"></i> Saved by ' + currentUser);
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
    action.loggedBy = currentUser;
    
    return database.ref(`users/${userId}/actions/${action.id}`).set(action)
        .then(() => {
            showSyncStatus('<i class="bi bi-cloud-check"></i> Logged by ' + currentUser);
        })
        .catch((error) => {
            showSyncStatus('<i class="bi bi-exclamation-triangle"></i> Error saving', 'error');
            console.error('Error:', error);
        });
}

function deleteActionFromFirebase(actionId) {
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Deleting...', 'syncing');
    return database.ref(`users/${userId}/actions/${actionId}`).remove()
        .then(() => {
            showSyncStatus('<i class="bi bi-cloud-check"></i> Deleted');
        })
        .catch((error) => {
            showSyncStatus('<i class="bi bi-exclamation-triangle"></i> Error deleting', 'error');
            console.error('Error:', error);
        });
}

// Navigation (same as before)
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
            const loggedBy = action.loggedBy || 'Unknown';
            return `
                <div class="action-item">
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong>${action.taskName}</strong> - ${siteName}
                            <br><small class="text-muted">${action.date} • Logged by: ${loggedBy}</small>
                        </div>
                    </div>
                    ${action.notes ? `<p class="mb-0 mt-1"><small>${action.notes}</small></p>` : ''}
                </div>
            `;
        }).join('')
        : '<p class="text-muted">No actions recorded yet.</p>';
    
    document.getElementById('recentActions').innerHTML = recentActionsHtml;
}

// Rest of the functions remain the same but I'll add the comprehensive task list to populateActionForm...

// Actions - Enhanced with comprehensive task list
function populateActionForm() {
    const siteSelect = document.getElementById('actionSite');
    siteSelect.innerHTML = '<option value="">Select a site...</option>' +
        sites.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    // Group tasks by category
    const tasksByCategory = {};
    tasks.forEach(task => {
        if (!tasksByCategory[task.category]) {
            tasksByCategory[task.category] = [];
        }
        tasksByCategory[task.category].push(task);
    });
    
    // Create filter for common tasks
    const taskCheckboxesHtml = `
        <div class="col-12 mb-3">
            <div class="btn-group" role="group">
                <input type="radio" class="btn-check" name="taskFilter" id="filterAll" checked onclick="filterTasks('all')">
                <label class="btn btn-outline-warning" for="filterAll">All Tasks</label>
                
                <input type="radio" class="btn-check" name="taskFilter" id="filterCommon" onclick="filterTasks('common')">
                <label class="btn btn-outline-success" for="filterCommon">Common Only</label>
            </div>
        </div>
        ${Object.keys(tasksByCategory).sort().map(category => `
            <div class="col-md-6 mb-3">
                <h6 class="text-warning border-bottom pb-2"><i class="bi bi-tag"></i> ${category}</h6>
                ${tasksByCategory[category].map(task => `
                    <div class="form-check task-item ${task.common ? 'common-task' : ''}" data-common="${task.common}">
                        <input class="form-check-input task-checkbox" type="checkbox" value="${task.id}" id="task${task.id}">
                        <label class="form-check-label" for="task${task.id}">
                            ${task.name} ${task.common ? '<span class="badge badge-sm bg-success">Common</span>' : ''}
                        </label>
                    </div>
                `).join('')}
            </div>
        `).join('')}
    `;
    
    document.getElementById('taskCheckboxes').innerHTML = taskCheckboxesHtml;
}

function filterTasks(filter) {
    const allTasks = document.querySelectorAll('.task-item');
    allTasks.forEach(task => {
        if (filter === 'all') {
            task.style.display = '';
        } else if (filter === 'common') {
            task.style.display = task.dataset.common === 'true' ? '' : 'none';
        }
    });
}

// Continue with other functions (handleLogAction, renderActions, etc. - same as before but with user tracking)

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
            taskCategory: task.category,
            date: date,
            notes: notes,
            createdAt: new Date().toISOString()
        };
        return saveActionToFirebase(action);
    });
    
    Promise.all(promises).then(() => {
        alert(`Successfully logged ${selectedTasks.length} action(s) by ${currentUser}!`);
        showActions();
    });
}

function renderActions() {
    const sortedActions = [...actions].reverse();
    
    const actionsHtml = sortedActions.length > 0
        ? sortedActions.map(action => {
            const site = sites.find(c => c.id === action.siteId);
            const siteName = site ? site.name : 'Unknown';
            const loggedBy = action.loggedBy || 'Unknown';
            return `
                <div class="action-item">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="d-flex align-items-center mb-1">
                                <span class="badge bg-secondary me-2">${action.taskCategory || 'Task'}</span>
                                <strong>${action.taskName}</strong>
                            </div>
                            <div class="text-muted">
                                <small>
                                    <i class="bi bi-geo-alt"></i> ${siteName} • 
                                    <i class="bi bi-calendar"></i> ${action.date} • 
                                    <i class="bi bi-person"></i> ${loggedBy}
                                </small>
                            </div>
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

// Site functions (add individual hive management later)
function renderSites() {
    const sitesHtml = sites.length > 0
        ? sites.map(site => {
            const lastModified = site.lastModifiedBy ? `Last updated by ${site.lastModifiedBy}` : '';
            return `
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
                            ${lastModified ? `<small class="text-muted"><i class="bi bi-person"></i> ${lastModified}</small>` : ''}
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
            `;
        }).join('')
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
        createdAt: id ? sites.find(c => c.id === parseInt(id)).createdAt : new Date().toISOString()
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

// Google Maps (same as before)
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

