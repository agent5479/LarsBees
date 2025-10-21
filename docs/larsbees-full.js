// LarsBees - Full Multi-User System with Master Admin
// Master User: Lars (can add employees, delete records)
// Employees: Can add/view, cannot delete

// COMPREHENSIVE TASK LIST (70+ tasks)
const COMPREHENSIVE_TASKS = [
    // INSPECTION (15 tasks)
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
    
    // FEEDING (8 tasks)
    { id: 201, name: 'Sugar Syrup 1:1 (Spring Build-up)', category: 'Feeding', common: true },
    { id: 202, name: 'Sugar Syrup 2:1 (Fall Prep)', category: 'Feeding', common: true },
    { id: 203, name: 'Pollen Substitute', category: 'Feeding', common: false },
    { id: 204, name: 'Pollen Patty', category: 'Feeding', common: true },
    { id: 205, name: 'Fondant Feeding', category: 'Feeding', common: false },
    { id: 206, name: 'Candy Board', category: 'Feeding', common: false },
    { id: 207, name: 'Emergency Feeding', category: 'Feeding', common: false },
    { id: 208, name: 'Protein Supplement', category: 'Feeding', common: false },
    
    // TREATMENT (8 tasks)
    { id: 301, name: 'Varroa Treatment - Formic Acid', category: 'Treatment', common: false },
    { id: 302, name: 'Varroa Treatment - Oxalic Acid', category: 'Treatment', common: false },
    { id: 303, name: 'Varroa Treatment - Apivar Strips', category: 'Treatment', common: false },
    { id: 304, name: 'Varroa Treatment - Other', category: 'Treatment', common: false },
    { id: 305, name: 'Nosema Treatment', category: 'Treatment', common: false },
    { id: 306, name: 'Small Hive Beetle Treatment', category: 'Treatment', common: false },
    { id: 307, name: 'Wax Moth Treatment', category: 'Treatment', common: false },
    { id: 308, name: 'Tracheal Mite Treatment', category: 'Treatment', common: false },
    
    // HARVEST (7 tasks)
    { id: 401, name: 'Honey Harvest', category: 'Harvest', common: true },
    { id: 402, name: 'Comb Honey Harvest', category: 'Harvest', common: false },
    { id: 403, name: 'Wax Collection', category: 'Harvest', common: false },
    { id: 404, name: 'Propolis Collection', category: 'Harvest', common: false },
    { id: 405, name: 'Pollen Collection', category: 'Harvest', common: false },
    { id: 406, name: 'Frame Extraction', category: 'Harvest', common: true },
    { id: 407, name: 'Honey Bottling/Packaging', category: 'Harvest', common: false },
    
    // MAINTENANCE (15 tasks)
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
    
    // SEASONAL (5 tasks)
    { id: 601, name: 'Spring Buildup Preparation', category: 'Seasonal', common: false },
    { id: 602, name: 'Summer Ventilation Setup', category: 'Seasonal', common: false },
    { id: 603, name: 'Fall Winterization', category: 'Seasonal', common: true },
    { id: 604, name: 'Winter Insulation', category: 'Seasonal', common: false },
    { id: 605, name: 'Spring Cleanup', category: 'Seasonal', common: false },
    
    // QUEEN MANAGEMENT (8 tasks)
    { id: 701, name: 'Requeen Colony', category: 'Queen Management', common: false },
    { id: 702, name: 'Add Queen Cell', category: 'Queen Management', common: false },
    { id: 703, name: 'Split Colony', category: 'Queen Management', common: false },
    { id: 704, name: 'Combine Colonies', category: 'Queen Management', common: false },
    { id: 705, name: 'Swarm Prevention Measures', category: 'Queen Management', common: false },
    { id: 706, name: 'Swarm Capture', category: 'Queen Management', common: false },
    { id: 707, name: 'Nuc Creation', category: 'Queen Management', common: false },
    { id: 708, name: 'Queen Introduction', category: 'Queen Management', common: false },
    
    // PROBLEMS & EMERGENCIES (8 tasks)
    { id: 801, name: 'Queenless Colony Found', category: 'Problems', common: false },
    { id: 802, name: 'Laying Worker Present', category: 'Problems', common: false },
    { id: 803, name: 'Robbing Observed', category: 'Problems', common: false },
    { id: 804, name: 'Absconding Risk', category: 'Problems', common: false },
    { id: 805, name: 'Disease Quarantine', category: 'Problems', common: false },
    { id: 806, name: 'Pest Emergency Response', category: 'Problems', common: false },
    { id: 807, name: 'Weak Colony Identified', category: 'Problems', common: false },
    { id: 808, name: 'Aggressive Behavior Noted', category: 'Problems', common: false },
    
    // RECORDS & MEASUREMENTS (7 tasks)
    { id: 901, name: 'Hive Weight Measurement', category: 'Records', common: false },
    { id: 902, name: 'Temperature Check', category: 'Records', common: false },
    { id: 903, name: 'Humidity Check', category: 'Records', common: false },
    { id: 904, name: 'Photo Documentation', category: 'Records', common: true },
    { id: 905, name: 'Sample Collection', category: 'Records', common: false },
    { id: 906, name: 'Equipment Inventory', category: 'Records', common: false },
    { id: 907, name: 'Varroa Mite Count', category: 'Records', common: false }
];

// Master account credentials
const MASTER_USERNAME = 'Lars';
const MASTER_PASSWORD = 'LarsHoney2025!';

// Global variables
let currentUser = null;
let isAdmin = false;
let clusters = [];
let actions = [];
let individualHives = [];
let scheduledTasks = [];
let employees = [];
let tasks = COMPREHENSIVE_TASKS;
let deletedTasks = {}; // Archive of deleted tasks for historical record display
let map = null;
let markers = [];
let mapPicker = null;

// Offline support
let isOnline = navigator.onLine;
let syncQueue = []; // Queue of pending changes to sync
let syncInProgress = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('currentUser');
    const savedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAdmin = savedIsAdmin;
        showMainApp();
        loadDataFromFirebase();
    } else {
        checkFirstTimeSetup();
    }
    
    // Setup event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('clusterForm').addEventListener('submit', handleSaveCluster);
    document.getElementById('actionForm').addEventListener('submit', handleLogAction);
    document.getElementById('addEmployeeForm')?.addEventListener('submit', handleAddEmployee);
    document.getElementById('scheduleTaskForm')?.addEventListener('submit', handleScheduleTask);
    document.getElementById('addTaskForm')?.addEventListener('submit', handleAddTask);
    document.getElementById('actionDate').valueAsDate = new Date();
    
    // Enhanced sticky navbar on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Offline/Online detection
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load pending sync queue from localStorage
    loadSyncQueue();
    
    // Update sync status on load
    updateSyncStatus();
    
    // Note: GPS button listener added when form is shown
});

// Check if this is first time setup and initialize master account
function checkFirstTimeSetup() {
    database.ref('master/initialized').once('value', (snapshot) => {
        if (!snapshot.exists()) {
            // Auto-initialize master account
            initializeMasterAccount();
        }
    });
}

function initializeMasterAccount() {
    const masterUser = {
        username: MASTER_USERNAME,
        passwordHash: simpleHash(MASTER_PASSWORD),
        role: 'admin',
        createdAt: new Date().toISOString()
    };
    
    database.ref('master/initialized').set(true).then(() => {
        return database.ref('master/admin').set(masterUser);
    }).then(() => {
        console.log('✅ Master account initialized successfully');
        console.log('Username:', MASTER_USERNAME);
        console.log('Password hash:', simpleHash(MASTER_PASSWORD));
    }).catch(error => {
        console.error('❌ Failed to initialize master account:', error);
    });
}

// Emergency reset function - call from browser console if needed
window.resetMasterAccount = function() {
    console.log('🔄 Resetting master account...');
    initializeMasterAccount();
    alert('Master account reset! Try logging in again with:\nUsername: Lars\nPassword: LarsHoney2025!');
}

// Authentication - Master User System
function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    console.log('Username:', username);
    
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    
    // Check if Firebase is ready
    if (typeof database === 'undefined') {
        alert('System is still loading. Please wait a moment and try again.');
        return;
    }
    
    // Check if master user exists
    database.ref('master/initialized').once('value', (snapshot) => {
        console.log('Master initialized:', snapshot.exists());
        
        if (!snapshot.exists()) {
            // First time setup - create master account
            if (username.toLowerCase() === 'lars' || username.toLowerCase() === 'admin') {
                setupMasterUser(username, password);
            } else {
                alert('First time setup: Please use username "Lars" to create the master account.');
            }
        } else {
            // Existing system - check credentials
            validateLogin(username, password);
        }
    }).catch(error => {
        console.error('Firebase error:', error);
        alert('Database connection error. Please check your internet connection and try again.');
    });
}

// Password visibility toggles
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('loginPassword');
    const icon = document.getElementById('passwordToggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

function toggleEmployeePasswordVisibility() {
    const passwordInput = document.getElementById('newEmployeePassword');
    const icon = document.getElementById('employeePasswordToggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

function setupMasterUser(username, password) {
    const masterUser = {
        username: username,
        passwordHash: simpleHash(password),
        role: 'admin',
        createdAt: new Date().toISOString()
    };
    
    database.ref('master/initialized').set(true);
    database.ref('master/admin').set(masterUser);
    
    currentUser = masterUser;
    isAdmin = true;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('isAdmin', 'true');
    
    alert(`✅ Master account created for ${username}!\n\nYou can now add employees from the Team menu.`);
    showMainApp();
    loadDataFromFirebase();
}

function validateLogin(username, password) {
    console.log('🔐 Validating login for:', username);
    const passwordHash = simpleHash(password);
    console.log('🔑 Password hash:', passwordHash);
    
    // Check if admin
    database.ref('master/admin').once('value', (snapshot) => {
        const admin = snapshot.val();
        console.log('👤 Admin data from Firebase:', admin);
        
        if (admin) {
            console.log('   - Username match:', admin.username.toLowerCase() === username.toLowerCase());
            console.log('   - Password hash match:', admin.passwordHash === passwordHash);
            console.log('   - Expected hash:', admin.passwordHash);
            console.log('   - Provided hash:', passwordHash);
        }
        
        if (admin && admin.username.toLowerCase() === username.toLowerCase() && admin.passwordHash === passwordHash) {
            console.log('✅ Admin login successful');
            currentUser = admin;
            isAdmin = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('isAdmin', 'true');
            showMainApp();
            loadDataFromFirebase();
            return;
        }
        
        // Check if employee
        console.log('Checking employees...');
        database.ref('employees').once('value', (empSnapshot) => {
            const employeesList = empSnapshot.val() || {};
            console.log('Employees:', employeesList);
            
            const employee = Object.values(employeesList).find(emp => 
                emp.username.toLowerCase() === username.toLowerCase() && emp.passwordHash === passwordHash
            );
            
            if (employee) {
                console.log('Employee login successful');
                currentUser = employee;
                isAdmin = false;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                localStorage.setItem('isAdmin', 'false');
                showMainApp();
                loadDataFromFirebase();
            } else {
                console.log('Login failed - no match');
                alert('❌ Invalid username or password!');
            }
        }).catch(error => {
            console.error('Employee check error:', error);
            alert('Error checking credentials. Please try again.');
        });
    }).catch(error => {
        console.error('Admin check error:', error);
        alert('Error checking credentials. Please try again.');
    });
}

function handleAddEmployee(e) {
    e.preventDefault();
    
    if (!isAdmin) {
        alert('Only Lars (admin) can add employees!');
        return;
    }
    
    const name = document.getElementById('newEmployeeName').value.trim();
    const password = document.getElementById('newEmployeePassword').value;
    
    if (!name || !password) {
        alert('Please enter both name and password');
        return;
    }
    
    const employeeId = 'emp_' + Date.now();
    const employee = {
        id: employeeId,
        username: name,
        passwordHash: simpleHash(password),
        role: 'employee',
        createdAt: new Date().toISOString(),
        createdBy: currentUser.username
    };
    
    database.ref(`employees/${employeeId}`).set(employee)
        .then(() => {
            alert(`✅ Employee "${name}" added successfully!\n\nThey can login with:\nUsername: ${name}\nPassword: [the password you set]`);
            document.getElementById('addEmployeeForm').reset();
            loadEmployees();
        });
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

function logout() {
    if (confirm('Logout? All changes are automatically saved.')) {
        currentUser = null;
        isAdmin = false;
        localStorage.clear();
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        location.reload();
    }
}

function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('currentUserDisplay').textContent = currentUser.username;
    
    if (isAdmin) {
        document.getElementById('adminBadge').classList.remove('hidden');
        document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('employee-hidden'));
    } else {
        document.getElementById('adminBadge').classList.add('hidden');
        document.querySelectorAll('.admin-only').forEach(el => el.classList.add('employee-hidden'));
    }
    
    showDashboard();
}

// Sync status
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

// Load data from Firebase
function loadDataFromFirebase() {
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Loading...', 'syncing');
    
    database.ref('clusters').on('value', (snapshot) => {
        clusters = snapshot.val() ? Object.values(snapshot.val()) : [];
        updateDashboard();
        showSyncStatus('<i class="bi bi-cloud-check"></i> Synced');
    });
    
    database.ref('actions').on('value', (snapshot) => {
        actions = snapshot.val() ? Object.values(snapshot.val()) : [];
        updateDashboard();
    });
    
    database.ref('individualHives').on('value', (snapshot) => {
        individualHives = snapshot.val() ? Object.values(snapshot.val()) : [];
    });
    
    database.ref('scheduledTasks').on('value', (snapshot) => {
        scheduledTasks = snapshot.val() ? Object.values(snapshot.val()) : [];
        updateScheduledTasksPreview();
    });
    
    if (isAdmin) {
        loadEmployees();
    }
    
    // Initialize and listen for tasks
    database.ref('tasks').on('value', (snapshot) => {
        if (!snapshot.exists()) {
            // First time: populate with default tasks
            COMPREHENSIVE_TASKS.forEach(task => {
                database.ref(`tasks/${task.id}`).set(task);
            });
        } else {
            tasks = Object.values(snapshot.val());
            // Refresh task management view if it's open
            if (!document.getElementById('manageTasksView')?.classList.contains('hidden')) {
                renderTasksList();
            }
        }
    });
    
    // Load deleted tasks archive for historical reference
    database.ref('deletedTasks').on('value', (snapshot) => {
        deletedTasks = snapshot.val() || {};
    });
}

function loadEmployees() {
    database.ref('employees').on('value', (snapshot) => {
        employees = snapshot.val() ? Object.values(snapshot.val()) : [];
        renderEmployees();
    });
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
            const lat = parseFloat(document.getElementById('clusterLat').value) || -41.27; // Tasman, NZ
            const lng = parseFloat(document.getElementById('clusterLng').value) || 173.28;
            
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

// Navigation
function hideAllViews() {
    ['dashboardView', 'clustersView', 'clusterFormView', 'actionsView', 'logActionView', 'scheduledView', 'flaggedView', 'employeesView', 'manageTasksView'].forEach(id => {
        document.getElementById(id)?.classList.add('hidden');
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
    document.getElementById('anomalySection')?.classList.add('hidden');
    document.getElementById('mapPickerContainer').classList.add('hidden');
    
    // Setup GPS button
    setTimeout(() => {
        const btn = document.getElementById('useLocationBtn');
        if (btn) {
            btn.onclick = getCurrentLocation;
        }
    }, 100);
}

function showLogActionForm() {
    hideAllViews();
    document.getElementById('logActionView').classList.remove('hidden');
    populateActionForm();
}

function showScheduledTasks() {
    hideAllViews();
    document.getElementById('scheduledView').classList.remove('hidden');
    renderScheduledTasks();
}

function showFlagged() {
    hideAllViews();
    document.getElementById('flaggedView').classList.remove('hidden');
    renderFlaggedItems();
}

function showEmployees() {
    if (!isAdmin) {
        alert('Only Lars (admin) can access employee management!');
        return;
    }
    hideAllViews();
    document.getElementById('employeesView').classList.remove('hidden');
    renderEmployees();
}

// Dashboard
function updateDashboard() {
    const totalHives = clusters.reduce((sum, c) => sum + (c.hiveCount || 0), 0);
    const flaggedCount = actions.filter(a => a.flag && a.flag !== '').length;
    
    document.getElementById('statClusters').textContent = clusters.length;
    document.getElementById('statHives').textContent = totalHives;
    document.getElementById('statActions').textContent = actions.length;
    document.getElementById('statFlagged').textContent = flaggedCount;
    
    // Show flagged alert if any
    const urgentFlagged = actions.filter(a => a.flag === 'urgent');
    if (urgentFlagged.length > 0) {
        const flaggedHtml = urgentFlagged.slice(0, 3).map(a => {
            const cluster = clusters.find(c => c.id === a.clusterId);
            return `<div class="mb-2"><strong>${cluster?.name || 'Unknown'}:</strong> ${a.taskName} - ${a.notes}</div>`;
        }).join('');
        document.getElementById('flaggedItemsList').innerHTML = flaggedHtml;
        document.getElementById('flaggedAlert').classList.remove('hidden');
    } else {
        document.getElementById('flaggedAlert').classList.add('hidden');
    }
    
    if (typeof L !== 'undefined') {
        initMap();
    }
    
    const recentActions = [...actions].reverse().slice(0, 10);
    const recentHtml = recentActions.length > 0 
        ? recentActions.map(a => {
            const cluster = clusters.find(c => c.id === a.clusterId);
            const flagIcon = a.flag === 'urgent' ? '🚨' : a.flag === 'warning' ? '⚠️' : a.flag === 'info' ? 'ℹ️' : '';
            const displayTaskName = getTaskDisplayName(a.taskName, a.taskId);
            return `
                <div class="action-item ${a.flag ? 'flag-' + a.flag : ''}">
                    <div><strong>${flagIcon} ${displayTaskName}</strong> - ${cluster?.name || 'Unknown'}</div>
                    <small class="text-muted">${a.date} • ${a.loggedBy || 'User'}</small>
                    ${a.notes ? `<p class="mb-0 mt-1"><small>${a.notes}</small></p>` : ''}
                </div>
            `;
        }).join('')
        : '<p class="text-muted">No actions yet.</p>';
    
    document.getElementById('recentActions').innerHTML = recentHtml;
    
    updateScheduledTasksPreview();
}

function updateScheduledTasksPreview() {
    const pending = scheduledTasks.filter(t => !t.completed);
    const html = pending.length > 0
        ? pending.slice(0, 5).map(t => {
            const cluster = clusters.find(c => c.id === t.clusterId);
            const task = tasks.find(tk => tk.id === t.taskId);
            const displayTaskName = task ? task.name : getTaskDisplayName(null, t.taskId);
            const priorityBadge = t.priority === 'urgent' ? 'danger' : t.priority === 'high' ? 'warning' : 'secondary';
            return `
                <div class="scheduled-task p-2 mb-2 rounded">
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong>${displayTaskName}</strong>
                            <span class="badge bg-${priorityBadge}">${t.priority || 'normal'}</span>
                            <br><small>${cluster?.name || 'Unknown'}</small>
                        </div>
                        <button class="btn btn-sm btn-success" onclick="completeScheduledTask('${t.id}')">
                            <i class="bi bi-check"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('')
        : '<p class="text-muted">No scheduled tasks.</p>';
    
    document.getElementById('scheduledTasksPreview').innerHTML = html;
}

// OpenStreetMap with Leaflet.js - No API key needed!
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
        : [-41.27, 173.28]; // Tasman region, New Zealand
    
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
    
    // Add marker for each cluster
    clusters.forEach(cluster => {
        try {
            const marker = L.marker([cluster.latitude, cluster.longitude])
                .bindPopup(`
                    <div style="padding:10px; min-width:200px;">
                        <h6><strong>${cluster.name}</strong></h6>
                        <p class="mb-1"><small>${cluster.description || 'No description'}</small></p>
                        <p class="mb-0"><strong>Hives:</strong> ${cluster.hiveCount}</p>
                        ${cluster.harvestTimeline ? `<p class="mb-0"><strong>Harvest:</strong> ${cluster.harvestTimeline}</p>` : ''}
                        ${cluster.sugarRequirements ? `<p class="mb-0"><strong>Sugar:</strong> ${cluster.sugarRequirements}</p>` : ''}
                    </div>
                `)
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

// Clusters
function renderClusters() {
    const html = clusters.length > 0
        ? clusters.map(c => {
            const deleteBtn = isAdmin ? `
                <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); deleteCluster(${c.id})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            ` : '';
            
            return `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card cluster-card h-100">
                        <div class="card-body">
                            <h5 class="card-title"><i class="bi bi-geo-alt-fill text-warning"></i> ${c.name}</h5>
                            <p class="card-text text-muted">${c.description || 'No description'}</p>
                            <ul class="list-unstyled small">
                                <li><strong>Hives:</strong> ${c.hiveCount}</li>
                                <li><strong>GPS:</strong> ${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}</li>
                                ${c.harvestTimeline ? `<li><strong>Harvest:</strong> ${c.harvestTimeline}</li>` : ''}
                                ${c.sugarRequirements ? `<li><strong>Sugar:</strong> ${c.sugarRequirements}</li>` : ''}
                            </ul>
                            ${c.lastModifiedBy ? `<small class="text-muted"><i class="bi bi-person"></i> ${c.lastModifiedBy}</small>` : ''}
                        </div>
                        <div class="card-footer bg-light">
                            <button class="btn btn-sm btn-outline-warning" onclick="editCluster(${c.id})">
                                <i class="bi bi-pencil"></i> Edit
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
    document.getElementById('anomalySection')?.classList.remove('hidden');
    document.getElementById('mapPickerContainer').classList.add('hidden');
    
    // Setup GPS button
    setTimeout(() => {
        const btn = document.getElementById('useLocationBtn');
        if (btn) {
            btn.onclick = getCurrentLocation;
        }
    }, 100);
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

function breakIntoIndividualHives() {
    const clusterId = parseInt(document.getElementById('clusterId').value);
    const cluster = clusters.find(c => c.id === clusterId);
    
    if (!cluster) return;
    
    const confirmed = confirm(`Break "${cluster.name}" into ${cluster.hiveCount} individually tracked hives for anomaly management?`);
    
    if (confirmed) {
        for (let i = 1; i <= cluster.hiveCount; i++) {
            const hive = {
                id: `${clusterId}_hive_${i}`,
                clusterId,
                hiveName: `Hive ${i}`,
                status: 'healthy',
                notes: '',
                createdBy: currentUser.username,
                createdAt: new Date().toISOString()
            };
            database.ref(`individualHives/${hive.id}`).set(hive);
        }
        alert(`✅ Created ${cluster.hiveCount} individual hive records!`);
    }
}

// Actions
function populateActionForm() {
    const clusterSelect = document.getElementById('actionCluster');
    clusterSelect.innerHTML = '<option value="">Select cluster...</option>' +
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
                        ${task.common ? '<span class="badge bg-success badge-sm">★</span>' : ''}
                    </label>
                </div>
            `).join('')}
        </div>
    `).join('');
    
    document.getElementById('taskCheckboxes').innerHTML = `<div class="row">${html}</div>`;
    filterTaskCheckboxes('common');
}

function filterTaskCheckboxes(filter) {
    document.querySelectorAll('.task-checkbox-item').forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.common === 'true') ? '' : 'none';
    });
}

function loadClusterHives() {
    const clusterId = parseInt(document.getElementById('actionCluster').value);
    const hives = individualHives.filter(h => h.clusterId === clusterId);
    
    if (hives.length > 0) {
        const select = document.getElementById('actionHive');
        select.innerHTML = '<option value="">All hives in cluster</option>' +
            hives.map(h => `<option value="${h.id}">${h.hiveName} (${h.status})</option>`).join('');
        document.getElementById('individualHiveSelect').classList.remove('hidden');
    } else {
        document.getElementById('individualHiveSelect').classList.add('hidden');
    }
}

function handleLogAction(e) {
    e.preventDefault();
    
    const clusterId = parseInt(document.getElementById('actionCluster').value);
    const date = document.getElementById('actionDate').value;
    const notes = document.getElementById('actionNotes').value;
    const flag = document.getElementById('actionFlag').value;
    const individualHiveId = document.getElementById('actionHive')?.value || null;
    
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
    
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Logging actions...', 'syncing');
    
    const promises = selectedTasks.map(taskId => {
        const task = tasks.find(t => t.id === taskId);
        const action = {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            clusterId,
            individualHiveId,
            taskId,
            taskName: task.name,
            taskCategory: task.category,
            date,
            notes,
            flag,
            loggedBy: currentUser.username,
            createdAt: new Date().toISOString()
        };
        return database.ref(`actions/${action.id}`).set(action);
    });
    
    Promise.all(promises).then(() => {
        showSyncStatus(`<i class="bi bi-check"></i> ${selectedTasks.length} action(s) logged by ${currentUser.username}`);
        document.getElementById('actionForm').reset();
        document.getElementById('actionDate').valueAsDate = new Date();
        showActions();
    });
}

function populateActionFilters() {
    const clusterFilter = document.getElementById('filterCluster');
    clusterFilter.innerHTML = '<option value="">All Clusters</option>' +
        clusters.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    const categories = [...new Set(tasks.map(t => t.category))].sort();
    document.getElementById('filterCategory').innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    
    const employeeNames = [...new Set(actions.map(a => a.loggedBy))].filter(Boolean);
    document.getElementById('filterEmployee').innerHTML = '<option value="">All Employees</option>' +
        employeeNames.map(name => `<option value="${name}">${name}</option>`).join('');
}

function renderActions() {
    const clusterFilter = document.getElementById('filterCluster')?.value;
    const categoryFilter = document.getElementById('filterCategory')?.value;
    const employeeFilter = document.getElementById('filterEmployee')?.value;
    
    let filtered = [...actions];
    if (clusterFilter) filtered = filtered.filter(a => a.clusterId == clusterFilter);
    if (categoryFilter) filtered = filtered.filter(a => a.taskCategory === categoryFilter);
    if (employeeFilter) filtered = filtered.filter(a => a.loggedBy === employeeFilter);
    
    const html = filtered.reverse().length > 0
        ? filtered.map(a => {
            const cluster = clusters.find(c => c.id === a.clusterId);
            const hive = individualHives.find(h => h.id === a.individualHiveId);
            const flagIcon = a.flag === 'urgent' ? '🚨' : a.flag === 'warning' ? '⚠️' : a.flag === 'info' ? 'ℹ️' : '';
            const deleteBtn = isAdmin ? `
                <button class="btn btn-sm btn-outline-danger" onclick="deleteAction('${a.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            ` : '';
            
            const displayTaskName = getTaskDisplayName(a.taskName, a.taskId);
            const isDeletedTask = displayTaskName.startsWith('[Deleted:');
            
            return `
                <div class="action-item ${a.flag ? 'flag-' + a.flag : ''}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="mb-1">
                                ${flagIcon} <span class="badge bg-secondary">${a.taskCategory || 'Task'}</span>
                                <strong class="${isDeletedTask ? 'text-muted' : ''}">${displayTaskName}</strong>
                            </div>
                            <div class="text-muted small">
                                <i class="bi bi-geo-alt"></i> ${cluster?.name || 'Unknown'}
                                ${hive ? ` • <i class="bi bi-hexagon"></i> ${hive.hiveName}` : ''}
                                <br>
                                <i class="bi bi-calendar"></i> ${a.date} • 
                                <i class="bi bi-person"></i> ${a.loggedBy || 'Unknown'}
                            </div>
                            ${a.notes ? `<p class="mb-0 mt-2"><small><strong>Notes:</strong> ${a.notes}</small></p>` : ''}
                        </div>
                        ${deleteBtn}
                    </div>
                </div>
            `;
        }).join('')
        : '<p class="text-center text-muted my-5">No actions found.</p>';
    
    document.getElementById('actionsList').innerHTML = html;
}

function deleteAction(id) {
    if (!isAdmin) {
        alert('Only Lars (admin) can delete actions!');
        return;
    }
    
    if (confirm('Delete this action? This cannot be undone!')) {
        database.ref(`actions/${id}`).remove();
    }
}

// Scheduled Tasks
function showScheduleTaskModal() {
    const clusterSelect = document.getElementById('scheduleCluster');
    clusterSelect.innerHTML = '<option value="">Select cluster...</option>' +
        clusters.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    const taskSelect = document.getElementById('scheduleTask');
    taskSelect.innerHTML = '<option value="">Select task...</option>' +
        tasks.map(t => `<option value="${t.id}">${t.category}: ${t.name}</option>`).join('');
    
    const modal = new bootstrap.Modal(document.getElementById('scheduleTaskModal'));
    modal.show();
}

function handleScheduleTask(e) {
    e.preventDefault();
    
    const task = {
        id: Date.now().toString(),
        clusterId: parseInt(document.getElementById('scheduleCluster').value),
        taskId: parseInt(document.getElementById('scheduleTask').value),
        dueDate: document.getElementById('scheduleDueDate').value,
        priority: document.getElementById('schedulePriority').value,
        notes: document.getElementById('scheduleNotes').value,
        completed: false,
        createdBy: currentUser.username,
        createdAt: new Date().toISOString()
    };
    
    database.ref(`scheduledTasks/${task.id}`).set(task)
        .then(() => {
            alert('✅ Task scheduled!');
            bootstrap.Modal.getInstance(document.getElementById('scheduleTaskModal')).hide();
            document.getElementById('scheduleTaskForm').reset();
        });
}

function renderScheduledTasks() {
    const pending = scheduledTasks.filter(t => !t.completed);
    const html = pending.length > 0
        ? pending.map(t => {
            const cluster = clusters.find(c => c.id === t.clusterId);
            const task = tasks.find(tk => tk.id === t.taskId);
            const displayTaskName = task ? task.name : getTaskDisplayName(null, t.taskId);
            const priorityClass = t.priority === 'urgent' ? 'danger' : t.priority === 'high' ? 'warning' : 'secondary';
            return `
                <div class="card mb-3 scheduled-task">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5>${displayTaskName}</h5>
                                <p class="mb-1"><i class="bi bi-geo-alt"></i> ${cluster?.name || 'Unknown'}</p>
                                <p class="mb-1"><small><i class="bi bi-calendar"></i> Due: ${t.dueDate || 'Not set'}</small></p>
                                <span class="badge bg-${priorityClass}">${t.priority || 'normal'}</span>
                                ${t.notes ? `<p class="mt-2"><small>${t.notes}</small></p>` : ''}
                            </div>
                            <div>
                                <button class="btn btn-success" onclick="completeScheduledTask('${t.id}')">
                                    <i class="bi bi-check-circle"></i> Complete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('')
        : '<p class="text-muted">No scheduled tasks.</p>';
    
    document.getElementById('scheduledTasksList').innerHTML = html;
}

function completeScheduledTask(id) {
    database.ref(`scheduledTasks/${id}`).update({ completed: true, completedBy: currentUser.username, completedAt: new Date().toISOString() })
        .then(() => {
            alert('✅ Task marked as complete!');
        });
}

// Flagged Items
function renderFlaggedItems() {
    const flagged = actions.filter(a => a.flag && a.flag !== '');
    const html = flagged.reverse().length > 0
        ? flagged.map(a => {
            const cluster = clusters.find(c => c.id === a.clusterId);
            const flagClass = a.flag === 'urgent' ? 'danger' : a.flag === 'warning' ? 'warning' : 'info';
            const flagIcon = a.flag === 'urgent' ? '🚨' : a.flag === 'warning' ? '⚠️' : 'ℹ️';
            
            return `
                <div class="card mb-3 border-${flagClass}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5>${flagIcon} ${a.taskName}</h5>
                                <p class="mb-1"><i class="bi bi-geo-alt"></i> ${cluster?.name || 'Unknown'}</p>
                                <p class="mb-1"><small><i class="bi bi-calendar"></i> ${a.date} • <i class="bi bi-person"></i> ${a.loggedBy}</small></p>
                                <span class="badge bg-${flagClass}">${a.flag.toUpperCase()}</span>
                                ${a.notes ? `<p class="mt-2">${a.notes}</p>` : ''}
                            </div>
                            ${isAdmin ? `<button class="btn btn-sm btn-outline-secondary" onclick="unflagAction('${a.id}')"><i class="bi bi-flag"></i> Unflag</button>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('')
        : '<p class="text-center text-muted my-5">No flagged items. Flag important events for team visibility!</p>';
    
    document.getElementById('flaggedItemsList2').innerHTML = html;
}

function unflagAction(id) {
    database.ref(`actions/${id}/flag`).set('');
}

// Employee Management
function renderEmployees() {
    const html = employees.length > 0
        ? `<div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Added</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${employees.map(emp => `
                        <tr>
                            <td><i class="bi bi-person"></i> ${emp.username}</td>
                            <td><span class="badge bg-info">${emp.role}</span></td>
                            <td><small>${new Date(emp.createdAt).toLocaleDateString()}</small></td>
                            <td>
                                <button class="btn btn-sm btn-outline-danger" onclick="removeEmployee('${emp.id}')">
                                    <i class="bi bi-trash"></i> Remove
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`
        : '<p class="text-muted">No employees yet. Add your first employee above!</p>';
    
    document.getElementById('employeesList').innerHTML = html;
}

function removeEmployee(id) {
    if (confirm('Remove this employee? They will no longer be able to login.')) {
        database.ref(`employees/${id}`).remove();
    }
}

// ============================================
// TASK MANAGEMENT (ADMIN ONLY)
// ============================================

// Helper function to safely get task name (handles deleted tasks)
function getTaskDisplayName(taskName, taskId) {
    // If task exists in current tasks, use it
    const currentTask = tasks.find(t => t.name === taskName || t.id === taskId);
    if (currentTask) {
        return currentTask.name;
    }
    
    // Check if it's a deleted task
    if (taskId && deletedTasks[taskId]) {
        return `[Deleted: ${deletedTasks[taskId].name}]`;
    }
    
    // Fallback to the stored name with deleted indicator
    if (taskName) {
        return `[Deleted: ${taskName}]`;
    }
    
    return '[Unknown Task]';
}

function showManageTasks() {
    if (!isAdmin) {
        alert('Only administrators can manage tasks.');
        return;
    }
    hideAllViews();
    document.getElementById('manageTasksView').classList.remove('hidden');
    renderTasksList();
}

function renderTasksList() {
    // Group tasks by category
    const tasksByCategory = {};
    tasks.forEach(task => {
        if (!tasksByCategory[task.category]) {
            tasksByCategory[task.category] = [];
        }
        tasksByCategory[task.category].push(task);
    });
    
    // Sort categories alphabetically
    const sortedCategories = Object.keys(tasksByCategory).sort();
    
    const html = sortedCategories.map(category => `
        <div class="category-section mb-4">
            <div class="d-flex justify-content-between align-items-center category-header">
                <h5 class="mb-0"><i class="bi bi-folder2-open"></i> ${category}</h5>
                <span class="badge bg-dark">${tasksByCategory[category].length} tasks</span>
            </div>
            <div class="table-responsive mt-2">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th style="width: 60%">Task Name</th>
                            <th style="width: 20%">Common</th>
                            <th style="width: 20%">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tasksByCategory[category].map(task => `
                            <tr>
                                <td>${task.name}</td>
                                <td>
                                    ${task.common 
                                        ? '<span class="badge bg-success">Quick List</span>' 
                                        : '<span class="badge bg-secondary">Full List</span>'}
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary" onclick="editTask(${task.id})" title="Edit">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})" title="Delete">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `).join('');
    
    document.getElementById('tasksList').innerHTML = html || '<p class="text-muted">No tasks found. Add your first task above!</p>';
}

// Add new task
function handleAddTask(e) {
    e.preventDefault();
    
    const categorySelect = document.getElementById('newTaskCategory').value;
    const categoryCustom = document.getElementById('newTaskCategoryCustom').value.trim();
    const category = categoryCustom || categorySelect;
    const name = document.getElementById('newTaskName').value.trim();
    const common = document.getElementById('newTaskCommon').checked;
    
    if (!category) {
        alert('Please select or enter a category.');
        return;
    }
    
    if (!name) {
        alert('Please enter a task name.');
        return;
    }
    
    // Generate new ID (max existing ID + 1)
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
    const newId = maxId + 1;
    
    const newTask = {
        id: newId,
        name: name,
        category: category,
        common: common
    };
    
    // Save to Firebase
    database.ref(`tasks/${newId}`).set(newTask).then(() => {
        alert(`✅ Task "${name}" added successfully!`);
        document.getElementById('addTaskForm').reset();
        // Tasks will be reloaded automatically from Firebase listener
    }).catch(error => {
        console.error('Error adding task:', error);
        alert('❌ Error adding task. Please try again.');
    });
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newName = prompt(`Edit task name:\n\nCurrent: ${task.name}\n\nEnter new name:`, task.name);
    if (newName && newName.trim() && newName.trim() !== task.name) {
        task.name = newName.trim();
        database.ref(`tasks/${taskId}`).update({ name: task.name }).then(() => {
            alert('✅ Task updated successfully!');
            // Tasks will be reloaded automatically from Firebase listener
        }).catch(error => {
            console.error('Error updating task:', error);
            alert('❌ Error updating task. Please try again.');
        });
    }
}

function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Check how many actions use this task
    const affectedActions = actions.filter(a => a.task === task.name || a.taskId === taskId);
    const affectedScheduled = scheduledTasks.filter(t => t.taskId === taskId);
    const totalAffected = affectedActions.length + affectedScheduled.length;
    
    let warningMessage = `⚠️ DELETE TASK\n\n` +
        `Task: ${task.name}\n` +
        `Category: ${task.category}\n\n`;
    
    if (totalAffected > 0) {
        warningMessage += `🚨 WARNING: This task is used in ${totalAffected} record(s):\n`;
        if (affectedActions.length > 0) {
            warningMessage += `   • ${affectedActions.length} completed action(s)\n`;
        }
        if (affectedScheduled.length > 0) {
            warningMessage += `   • ${affectedScheduled.length} scheduled task(s)\n`;
        }
        warningMessage += `\n`;
        warningMessage += `These records will show as "[Deleted: ${task.name}]" but will NOT be deleted.\n`;
        warningMessage += `Historical data will be preserved.\n\n`;
    }
    
    warningMessage += `Are you sure you want to delete this task?`;
    
    const confirmDelete = confirm(warningMessage);
    
    if (confirmDelete) {
        // Archive the task name before deleting for reference
        database.ref(`deletedTasks/${taskId}`).set({
            id: taskId,
            name: task.name,
            category: task.category,
            deletedAt: new Date().toISOString(),
            deletedBy: currentUser.username
        });
        
        database.ref(`tasks/${taskId}`).remove().then(() => {
            if (totalAffected > 0) {
                alert(`✅ Task deleted.\n\n${totalAffected} historical record(s) will now show as "[Deleted: ${task.name}]"`);
            } else {
                alert('✅ Task deleted successfully!');
            }
            // Tasks will be reloaded automatically from Firebase listener
        }).catch(error => {
            console.error('Error deleting task:', error);
            alert('❌ Error deleting task. Please try again.');
        });
    }
}

// ============================================
// CSV EXPORT FUNCTIONS (ADMIN ONLY)
// ============================================

function exportAllDataToCSV() {
    if (!isAdmin) {
        alert('Only administrators can export data.');
        return;
    }
    
    // Show export options
    const choice = confirm(
        '📊 FULL DATA EXPORT\n\n' +
        'This will export all your data to CSV files:\n\n' +
        '✓ Hive Clusters\n' +
        '✓ All Actions/Logs\n' +
        '✓ Individual Hives\n' +
        '✓ Scheduled Tasks\n' +
        '✓ Employees\n\n' +
        'Click OK to continue, or Cancel to abort.'
    );
    
    if (!choice) return;
    
    // Export all datasets
    exportClustersCSV();
    setTimeout(() => exportActionsCSV(), 500);
    setTimeout(() => exportIndividualHivesCSV(), 1000);
    setTimeout(() => exportScheduledTasksCSV(), 1500);
    setTimeout(() => exportEmployeesCSV(), 2000);
    
    setTimeout(() => {
        alert('✅ All data exported successfully!\n\nCheck your Downloads folder for the CSV files.\n\nFiles exported:\n- clusters.csv\n- actions.csv\n- individual_hives.csv\n- scheduled_tasks.csv\n- employees.csv');
    }, 2500);
}

// Export Clusters
function exportClustersCSV() {
    const csvData = [
        ['ID', 'Name', 'Description', 'Latitude', 'Longitude', 'Hive Count', 'Harvest Timeline', 'Sugar Requirements', 'Status', 'Notes', 'Created', 'Last Modified']
    ];
    
    clusters.forEach(cluster => {
        csvData.push([
            cluster.id,
            cluster.name,
            cluster.description || '',
            cluster.latitude,
            cluster.longitude,
            cluster.hiveCount,
            cluster.harvestTimeline || '',
            cluster.sugarRequirements || '',
            cluster.status || 'Active',
            cluster.notes || '',
            cluster.createdAt || '',
            cluster.lastModified || ''
        ]);
    });
    
    downloadCSV(csvData, 'clusters.csv');
}

// Export Actions
function exportActionsCSV() {
    const csvData = [
        ['ID', 'Date', 'Cluster Name', 'Cluster ID', 'Task', 'Category', 'Employee', 'Notes', 'Flag Level', 'Flag Reason', 'Created']
    ];
    
    actions.forEach(action => {
        const cluster = clusters.find(c => c.id === action.clusterId);
        csvData.push([
            action.id,
            action.date,
            cluster ? cluster.name : 'Unknown',
            action.clusterId,
            action.task,
            action.category || '',
            action.employee || currentUser.username,
            action.notes || '',
            action.flagLevel || '',
            action.flagReason || '',
            action.createdAt || ''
        ]);
    });
    
    downloadCSV(csvData, 'actions.csv');
}

// Export Individual Hives
function exportIndividualHivesCSV() {
    const csvData = [
        ['ID', 'Cluster Name', 'Cluster ID', 'Hive Number', 'Status', 'Notes', 'Last Inspection', 'Created']
    ];
    
    individualHives.forEach(hive => {
        const cluster = clusters.find(c => c.id === hive.clusterId);
        csvData.push([
            hive.id,
            cluster ? cluster.name : 'Unknown',
            hive.clusterId,
            hive.hiveNumber,
            hive.status || 'Active',
            hive.notes || '',
            hive.lastInspection || '',
            hive.createdAt || ''
        ]);
    });
    
    downloadCSV(csvData, 'individual_hives.csv');
}

// Export Scheduled Tasks
function exportScheduledTasksCSV() {
    const csvData = [
        ['ID', 'Cluster Name', 'Cluster ID', 'Task', 'Category', 'Scheduled Date', 'Due Date', 'Priority', 'Status', 'Notes', 'Created By', 'Created']
    ];
    
    scheduledTasks.forEach(task => {
        const cluster = clusters.find(c => c.id === task.clusterId);
        csvData.push([
            task.id,
            cluster ? cluster.name : 'Unknown',
            task.clusterId,
            task.task,
            task.category || '',
            task.scheduledDate || '',
            task.dueDate || '',
            task.priority || 'Medium',
            task.status || 'Pending',
            task.notes || '',
            task.createdBy || '',
            task.createdAt || ''
        ]);
    });
    
    downloadCSV(csvData, 'scheduled_tasks.csv');
}

// Export Employees
function exportEmployeesCSV() {
    const csvData = [
        ['ID', 'Username', 'Role', 'Created', 'Status']
    ];
    
    // Add admin
    csvData.push([
        'admin',
        MASTER_USERNAME,
        'Admin',
        'System',
        'Active'
    ]);
    
    // Add employees
    employees.forEach(emp => {
        csvData.push([
            emp.id,
            emp.username,
            emp.role || 'Employee',
            emp.createdAt || '',
            'Active'
        ]);
    });
    
    downloadCSV(csvData, 'employees.csv');
}

// Helper function to convert array to CSV and download
function downloadCSV(data, filename) {
    // Convert array to CSV string
    const csvContent = data.map(row => {
        return row.map(cell => {
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            const cellStr = String(cell || '');
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
        }).join(',');
    }).join('\n');
    
    // Add BOM for Excel compatibility with UTF-8
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`✅ Exported: ${filename}`);
}

// ============================================
// OFFLINE SUPPORT & SYNC QUEUE
// ============================================

// Load sync queue from localStorage
function loadSyncQueue() {
    const saved = localStorage.getItem('syncQueue');
    if (saved) {
        try {
            syncQueue = JSON.parse(saved);
            console.log(`📦 Loaded ${syncQueue.length} pending change(s) from local storage`);
        } catch (e) {
            console.error('Error loading sync queue:', e);
            syncQueue = [];
        }
    }
}

// Save sync queue to localStorage
function saveSyncQueue() {
    localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
}

// Add change to sync queue
function queueChange(operation, path, data) {
    const change = {
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        operation: operation, // 'set', 'update', 'remove'
        path: path,
        data: data,
        timestamp: new Date().toISOString(),
        user: currentUser?.username || 'Unknown'
    };
    
    syncQueue.push(change);
    saveSyncQueue();
    updateSyncStatus();
    
    console.log(`📝 Queued ${operation} to ${path} (${syncQueue.length} pending)`);
    
    // Try to sync immediately if online
    if (isOnline) {
        processSyncQueue();
    }
}

// Process the sync queue
async function processSyncQueue() {
    if (syncInProgress || syncQueue.length === 0 || !isOnline) {
        return;
    }
    
    syncInProgress = true;
    updateSyncStatus('syncing');
    
    console.log(`🔄 Processing ${syncQueue.length} queued change(s)...`);
    
    const errors = [];
    
    // Process queue items one by one
    while (syncQueue.length > 0 && isOnline) {
        const change = syncQueue[0];
        
        try {
            await syncChangeToFirebase(change);
            // Success - remove from queue
            syncQueue.shift();
            saveSyncQueue();
            console.log(`✅ Synced: ${change.operation} ${change.path}`);
        } catch (error) {
            console.error(`❌ Failed to sync: ${change.operation} ${change.path}`, error);
            errors.push({ change, error });
            // Don't remove from queue - will retry later
            break; // Stop processing on first error
        }
    }
    
    syncInProgress = false;
    
    if (syncQueue.length === 0) {
        console.log('✅ All changes synced successfully!');
        updateSyncStatus('synced');
        setTimeout(() => updateSyncStatus(), 3000); // Clear status after 3s
    } else {
        updateSyncStatus('pending');
    }
}

// Sync a single change to Firebase
function syncChangeToFirebase(change) {
    return new Promise((resolve, reject) => {
        const ref = database.ref(change.path);
        
        switch (change.operation) {
            case 'set':
                ref.set(change.data)
                    .then(resolve)
                    .catch(reject);
                break;
            case 'update':
                ref.update(change.data)
                    .then(resolve)
                    .catch(reject);
                break;
            case 'remove':
                ref.remove()
                    .then(resolve)
                    .catch(reject);
                break;
            default:
                reject(new Error('Unknown operation: ' + change.operation));
        }
    });
}

// Handle online event
function handleOnline() {
    console.log('🌐 Connection restored!');
    isOnline = true;
    updateSyncStatus();
    
    // Process any pending changes
    if (syncQueue.length > 0) {
        setTimeout(() => {
            processSyncQueue();
        }, 1000); // Wait 1 second to ensure stable connection
    }
}

// Handle offline event
function handleOffline() {
    console.log('📡 Connection lost - working offline');
    isOnline = false;
    updateSyncStatus('offline');
}

// Update sync status indicator
function updateSyncStatus(status) {
    const indicator = document.getElementById('syncIndicator');
    const text = document.getElementById('syncText');
    
    if (!indicator || !text) return;
    
    // Auto-detect status if not provided
    if (!status) {
        if (!isOnline) {
            status = 'offline';
        } else if (syncQueue.length > 0) {
            status = 'pending';
        } else {
            status = 'hidden';
        }
    }
    
    switch (status) {
        case 'syncing':
            indicator.className = 'sync-indicator syncing';
            text.innerHTML = `<i class="bi bi-arrow-repeat spin"></i> Syncing ${syncQueue.length} change(s)...`;
            indicator.classList.remove('hidden');
            break;
        case 'synced':
            indicator.className = 'sync-indicator';
            text.innerHTML = '<i class="bi bi-check-circle"></i> All changes synced!';
            indicator.classList.remove('hidden');
            break;
        case 'pending':
            indicator.className = 'sync-indicator syncing';
            text.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${syncQueue.length} change(s) pending`;
            indicator.classList.remove('hidden');
            break;
        case 'offline':
            indicator.className = 'sync-indicator error';
            text.innerHTML = `<i class="bi bi-wifi-off"></i> Offline - ${syncQueue.length} change(s) queued`;
            indicator.classList.remove('hidden');
            break;
        case 'hidden':
        default:
            indicator.classList.add('hidden');
            break;
    }
}

// Manual sync trigger
function manualSync() {
    if (!isOnline) {
        alert('⚠️ No internet connection.\n\nYour changes are saved locally and will sync automatically when connection is restored.');
        return;
    }
    
    if (syncQueue.length === 0) {
        alert('✅ All changes are already synced!');
        return;
    }
    
    processSyncQueue();
}

// Wrapper for Firebase write operations with offline support
function firebaseWrite(operation, path, data) {
    if (isOnline && syncQueue.length === 0) {
        // Online and no pending changes - write directly
        const ref = database.ref(path);
        switch (operation) {
            case 'set':
                return ref.set(data);
            case 'update':
                return ref.update(data);
            case 'remove':
                return ref.remove();
        }
    } else {
        // Offline or has pending changes - queue it
        queueChange(operation, path, data);
        return Promise.resolve(); // Return resolved promise
    }
}

