// BeeMarshall - Core Application Logic
// Master User: Lars (can add employees, delete records)
// Employees: Can add/view, cannot delete

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

// Seasonal requirements
let seasonalRequirements = []; // Array of {taskId, taskName, dueDate, category, frequency}

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
    document.getElementById('addRequirementForm')?.addEventListener('submit', handleAddRequirement);
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

// Debug function - call from browser console to test password hashing
window.testPasswordHash = function() {
    const testPassword = 'LarsHoney2025!';
    const hash = simpleHash(testPassword);
    console.log('Test password:', testPassword);
    console.log('Generated hash:', hash);
    console.log('Expected hash for LarsHoney2025!:', hash);
    return hash;
}

// Debug function - check Firebase connection
window.checkFirebaseConnection = function() {
    console.log('🔍 Checking Firebase connection...');
    if (typeof database === 'undefined') {
        console.log('❌ Firebase database not initialized');
        return false;
    }
    
    database.ref('master/initialized').once('value', (snapshot) => {
        console.log('✅ Firebase connected');
        console.log('Master initialized:', snapshot.exists());
        if (snapshot.exists()) {
            database.ref('master/admin').once('value', (adminSnapshot) => {
                const admin = adminSnapshot.val();
                console.log('Admin data:', admin);
            });
        }
    }).catch(error => {
        console.log('❌ Firebase error:', error);
    });
    
    return true;
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
        console.error('Firebase database not initialized');
        console.log('Using fallback authentication...');
        
        // Fallback authentication for development/demo
        if (username.toLowerCase() === 'lars' && password === 'LarsHoney2025!') {
            console.log('✅ Fallback admin login successful');
            currentUser = {
                username: 'Lars',
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            isAdmin = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('isAdmin', 'true');
            showMainApp();
            // Initialize with empty data for demo
            clusters = [];
            actions = [];
            scheduledTasks = [];
            employees = [];
            updateDashboard();
            return;
        } else {
            alert('Database connection error. Please check your internet connection and try again.\n\nFor demo purposes, use:\nUsername: Lars\nPassword: LarsHoney2025!');
            return;
        }
    }
    
    // Additional fallback - if Firebase fails after initialization
    const firebaseTimeout = setTimeout(() => {
        console.log('⚠️ Firebase timeout - using fallback authentication');
        if (username.toLowerCase() === 'lars' && password === 'LarsHoney2025!') {
            console.log('✅ Timeout fallback admin login successful');
            currentUser = {
                username: 'Lars',
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            isAdmin = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('isAdmin', 'true');
            showMainApp();
            clusters = [];
            actions = [];
            scheduledTasks = [];
            employees = [];
            updateDashboard();
        }
    }, 5000); // 5 second timeout
    
    // Check if master user exists
    console.log('🔍 Checking Firebase connection...');
    database.ref('master/initialized').once('value', (snapshot) => {
        console.log('Master initialized:', snapshot.exists());
        
        if (!snapshot.exists()) {
            console.log('🆕 First time setup detected');
            // First time setup - create master account
            if (username.toLowerCase() === 'lars' || username.toLowerCase() === 'admin') {
                setupMasterUser(username, password);
            } else {
                alert('First time setup: Please use username "Lars" to create the master account.');
            }
        } else {
            console.log('✅ Existing system - validating credentials');
            // Existing system - check credentials
            validateLogin(username, password);
        }
    }).catch(error => {
        console.error('❌ Firebase error:', error);
        alert('Database connection error. Please check your internet connection and try again.\n\nError: ' + error.message);
    });
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
    console.log('🔑 Password being checked:', password);
    
    // Check if admin
    database.ref('master/admin').once('value', (snapshot) => {
        const admin = snapshot.val();
        console.log('👤 Admin data from Firebase:', admin);
        
        if (admin) {
            console.log('   - Username match:', admin.username.toLowerCase() === username.toLowerCase());
            console.log('   - Password hash match:', admin.passwordHash === passwordHash);
            console.log('   - Expected hash:', admin.passwordHash);
            console.log('   - Provided hash:', passwordHash);
            console.log('   - Admin username:', admin.username);
            console.log('   - Input username:', username);
        } else {
            console.log('❌ No admin data found in Firebase');
        }
        
        if (admin && admin.username.toLowerCase() === username.toLowerCase() && admin.passwordHash === passwordHash) {
            console.log('✅ Admin login successful');
            clearTimeout(firebaseTimeout); // Clear the fallback timeout
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
                clearTimeout(firebaseTimeout); // Clear the fallback timeout
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
    
    // Load seasonal requirements
    database.ref('seasonalRequirements').on('value', (snapshot) => {
        seasonalRequirements = snapshot.val() ? Object.values(snapshot.val()) : [];
        // Refresh if on seasonal requirements page
        if (!document.getElementById('seasonalRequirementsView')?.classList.contains('hidden')) {
            renderSeasonalRequirements();
            renderComplianceStatus();
        }
    });
}

function loadEmployees() {
    database.ref('employees').on('value', (snapshot) => {
        employees = snapshot.val() ? Object.values(snapshot.val()) : [];
        renderEmployees();
    });
}
