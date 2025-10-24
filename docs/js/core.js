// BeeMarshall - Core Application Logic
// Master User: Lars (can add employees, delete records)
// Employees: Can add/view, cannot delete

// Version Management
const APP_VERSION = '0.96';
const VERSION_HISTORY = [
    { version: '0.91', date: '2024-12-19', changes: ['Fixed dashboard loading issue', 'Enhanced login system', 'Added welcome popup', 'Improved map initialization'] },
    { version: '0.92', date: '2024-12-19', changes: ['Added version tag to login screen', 'Implemented lazy map loading', 'Enhanced error prevention', 'Improved user experience'] },
    { version: '0.94', date: '2024-12-19', changes: ['Sales-ready deployment', 'New Firebase project integration', 'Terms of use and privacy declarations', 'Removed migration tools', 'Enhanced security and data isolation'] },
    { version: '0.96', date: '2024-12-19', changes: ['Added Demo user account for client demonstrations', 'Enhanced hive strength breakdown system', 'Improved cluster editing with detailed breakdowns', 'Updated reports with comprehensive data integration'] }
];

// Master account credentials
const MASTER_USERNAME = 'GBTech';
const MASTER_PASSWORD = '1q2w3e!Q@W#E';

// Multi-tenant admin accounts with GBTech as master
const ADMIN_ACCOUNTS = {
    'GBTech': {
        username: 'GBTech',
        password: '1q2w3e!Q@W#E',
        tenantId: 'gbtech',
        role: 'master_admin'
    },
    'Lars': {
        username: 'Lars',
        password: 'LarsHoney2025!',
        tenantId: 'lars',
        role: 'admin'
    },
    'Demo': {
        username: 'Demo',
        password: 'Password1!',
        tenantId: 'demo',
        role: 'demo_admin'
    }
};

// Global variables
let currentUser = null;
let isAdmin = false;
let currentTenantId = null; // For data isolation
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
    console.log('🚀 DOM Content Loaded - Initializing BeeMarshall...');
    console.log(`📦 BeeMarshall v${APP_VERSION} - Professional Apiary Management System`);
    
    // Update version display
    updateVersionDisplay();
    
    // Initialize system status
    updateSystemStatus();
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    const savedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    const savedTenantId = localStorage.getItem('currentTenantId');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAdmin = savedIsAdmin;
        currentTenantId = savedTenantId;
        console.log('🏢 Restored tenant:', currentTenantId);
        showMainApp();
        loadDataFromFirebase();
    } else {
        checkFirstTimeSetup();
    }
    
    // Setup event listeners with error checking
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('✅ Login form found, adding event listener');
        loginForm.addEventListener('submit', function(e) {
            console.log('📝 Form submit event triggered');
            handleLogin(e);
        });
        
        // Also add click listener to the submit button for debugging
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', function(e) {
                console.log('🖱️ Login button clicked');
            });
        }
    } else {
        console.error('❌ Login form not found!');
    }
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
    // Check if tenant structure exists for GBTech
    database.ref('tenants/gbtech/master/initialized').once('value', (snapshot) => {
        if (!snapshot.exists()) {
            // Auto-initialize master account in tenant structure
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
    
    database.ref('tenants/gbtech/master/initialized').set(true).then(() => {
        return database.ref('tenants/gbtech/master/admin').set(masterUser);
    }).then(() => {
        console.log('✅ Master account initialized successfully in tenant structure');
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

// Test login functions for debugging
window.testLarsLogin = function() {
    console.log('🧪 Testing Lars login...');
    document.getElementById('loginUsername').value = 'Lars';
    document.getElementById('loginPassword').value = 'LarsHoney2025!';
    handleLogin({ preventDefault: () => {} });
};

window.testGBTechLogin = function() {
    console.log('🧪 Testing GBTech login...');
    document.getElementById('loginUsername').value = 'GBTech';
    document.getElementById('loginPassword').value = '1q2w3e!Q@W#E';
    handleLogin({ preventDefault: () => {} });
};

// Automated data migration function
function autoMigrateLarsData() {
    console.log('🔄 Starting automated data migration for Lars...');
    
    let migrationPromises = [];
    let migrationCount = 0;
    let totalMigrations = 5;
    
    // Migrate clusters
    database.ref('clusters').once('value', (snapshot) => {
        const oldClusters = snapshot.val();
        if (oldClusters) {
            console.log('📦 Auto-migrating clusters...');
            migrationPromises.push(
                database.ref(`tenants/lars/clusters`).set(oldClusters).then(() => {
                    console.log('✅ Clusters migrated successfully');
                    migrationCount++;
                })
            );
        } else {
            migrationCount++;
        }
    });
    
    // Migrate actions
    database.ref('actions').once('value', (snapshot) => {
        const oldActions = snapshot.val();
        if (oldActions) {
            console.log('📦 Auto-migrating actions...');
            migrationPromises.push(
                database.ref(`tenants/lars/actions`).set(oldActions).then(() => {
                    console.log('✅ Actions migrated successfully');
                    migrationCount++;
                })
            );
        } else {
            migrationCount++;
        }
    });
    
    // Migrate scheduled tasks
    database.ref('scheduledTasks').once('value', (snapshot) => {
        const oldTasks = snapshot.val();
        if (oldTasks) {
            console.log('📦 Auto-migrating scheduled tasks...');
            migrationPromises.push(
                database.ref(`tenants/lars/scheduledTasks`).set(oldTasks).then(() => {
                    console.log('✅ Scheduled tasks migrated successfully');
                    migrationCount++;
                })
            );
        } else {
            migrationCount++;
        }
    });
    
    // Migrate employees
    database.ref('employees').once('value', (snapshot) => {
        const oldEmployees = snapshot.val();
        if (oldEmployees) {
            console.log('📦 Auto-migrating employees...');
            migrationPromises.push(
                database.ref(`tenants/lars/employees`).set(oldEmployees).then(() => {
                    console.log('✅ Employees migrated successfully');
                    migrationCount++;
                })
            );
        } else {
            migrationCount++;
        }
    });
    
    // Migrate individual hives
    database.ref('individualHives').once('value', (snapshot) => {
        const oldHives = snapshot.val();
        if (oldHives) {
            console.log('📦 Auto-migrating individual hives...');
            migrationPromises.push(
                database.ref(`tenants/lars/individualHives`).set(oldHives).then(() => {
                    console.log('✅ Individual hives migrated successfully');
                    migrationCount++;
                })
            );
        } else {
            migrationCount++;
        }
    });
    
    // Wait for all migrations to complete
    Promise.all(migrationPromises).then(() => {
        console.log('🎉 Automated migration completed successfully!');
        showSyncStatus('', 'success');
        
        // Reload data after migration
        setTimeout(() => {
            loadDataFromFirebase();
        }, 1500);
    }).catch(error => {
        console.error('❌ Migration error:', error);
        showSyncStatus('', 'error');
    });
}

// Manual migration function (for backup)
window.migrateLarsData = function() {
    autoMigrateLarsData();
};

// Force migration function with UI feedback
window.forceMigrateLarsData = function() {
    console.log('🔄 Force migrating Lars data...');
    
    // Show migration button as loading
    const migrationButton = document.getElementById('migrationButton');
    if (migrationButton) {
        migrationButton.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Migrating...';
        migrationButton.disabled = true;
    }
    
    // Check if Lars is logged in
    const currentTenantId = localStorage.getItem('currentTenantId');
    if (currentTenantId !== 'lars') {
        alert('❌ Migration only available for Lars account. Please log in as Lars first.');
        if (migrationButton) {
            migrationButton.innerHTML = '<i class="bi bi-arrow-repeat"></i> Migrate Lars Data';
            migrationButton.disabled = false;
        }
        return;
    }
    
    // Run migration
    autoMigrateLarsData();
    
    // Show success message after a delay
    setTimeout(() => {
        alert('✅ Lars data migration completed! Please refresh the page to see your data.');
        if (migrationButton) {
            migrationButton.innerHTML = '<i class="bi bi-check-circle"></i> Migration Complete';
            migrationButton.classList.remove('btn-warning');
            migrationButton.classList.add('btn-success');
        }
    }, 3000);
};

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

// Test login function for debugging
window.testLogin = function() {
    console.log('🧪 Testing login system...');
    document.getElementById('loginUsername').value = 'Lars';
    document.getElementById('loginPassword').value = 'LarsHoney2025!';
    console.log('✅ Test credentials set. Click login button to test.');
}

// Console command for manual data migration
window.migrateData = function() {
    console.log('🔄 Manual data migration initiated...');
    console.log('Current tenant:', localStorage.getItem('currentTenantId'));
    
    if (localStorage.getItem('currentTenantId') === 'lars') {
        console.log('📦 Migrating Lars data...');
        autoMigrateLarsData();
    } else {
        console.log('❌ Migration only available for Lars account');
        console.log('Please log in as Lars first, then run: migrateData()');
    }
};

// Force login function for debugging
window.forceLogin = function() {
    console.log('🚀 Force login - bypassing authentication...');
    currentUser = {
        username: 'Lars',
        role: 'admin',
        createdAt: new Date().toISOString()
    };
    isAdmin = true;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('isAdmin', 'true');
    
    clusters = [];
    actions = [];
    scheduledTasks = [];
    employees = [];
    
    showMainApp();
    updateDashboard();
    console.log('✅ Force login completed');
}

// Enhanced Login Status and Debugging Functions
function showLoginStatus(type, message, isLoading = false) {
    const statusDiv = document.getElementById('loginStatus');
    const statusText = document.getElementById('loginStatusText');
    const loginButton = document.getElementById('loginButton');
    const loginButtonText = document.getElementById('loginButtonText');
    const loginSpinner = document.getElementById('loginSpinner');
    
    if (statusDiv && statusText) {
        statusDiv.className = `alert alert-${type}`;
        statusText.textContent = message;
        statusDiv.classList.remove('d-none');
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.classList.add('d-none');
            }, 3000);
        }
    }
    
    if (loginButton && loginButtonText && loginSpinner) {
        if (isLoading) {
            loginButton.disabled = true;
            loginButtonText.textContent = 'Authenticating...';
            loginSpinner.classList.remove('d-none');
        } else {
            loginButton.disabled = false;
            loginButtonText.textContent = 'Login';
            loginSpinner.classList.add('d-none');
        }
    }
}

function updateDebugInfo(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function updateSystemStatus() {
    // Update system status
    updateDebugInfo('systemStatus', 'System ready');
    updateDebugInfo('versionInfo', `v${APP_VERSION}`);
    
    // Check Firebase status
    if (typeof database !== 'undefined') {
        updateDebugInfo('firebaseStatus', 'Connected');
        database.ref('master/initialized').once('value', (snapshot) => {
            if (snapshot.exists()) {
                updateDebugInfo('sessionInfo', 'Master account exists');
            } else {
                updateDebugInfo('sessionInfo', 'First time setup required');
            }
        }).catch(error => {
            updateDebugInfo('firebaseStatus', 'Connection failed');
            updateDebugInfo('lastError', error.message);
        });
    } else {
        updateDebugInfo('firebaseStatus', 'Not initialized');
        updateDebugInfo('sessionInfo', 'Fallback mode available');
    }
}

// Welcome Popup Functions
function showWelcomePopup() {
    console.log('🎉 Showing welcome popup - dashboard fully loaded!');
    
    // Update welcome message with user info
    const welcomeUserName = document.getElementById('welcomeUserName');
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    if (welcomeUserName) {
        welcomeUserName.textContent = `Welcome back, ${currentUser.username}!`;
    }
    
    if (welcomeMessage) {
        welcomeMessage.textContent = `Your apiary management system is ready. All data has been synchronized and the dashboard is fully operational.`;
    }
    
    // Update quick stats
    updateWelcomeStats();
    
    // Show the modal
    const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
    welcomeModal.show();
    
    // Update debug info
    updateDebugInfo('systemStatus', 'Dashboard fully loaded');
    console.log('✅ Welcome popup displayed - all systems operational');
}

function updateWelcomeStats() {
    // Calculate totals
    const clustersCount = clusters.length;
    const hivesCount = clusters.reduce((total, cluster) => total + (cluster.hiveCount || 0), 0);
    const tasksCount = scheduledTasks.length;
    const actionsCount = actions.length;
    
    // Update the display
    const welcomeClustersCount = document.getElementById('welcomeClustersCount');
    const welcomeHivesCount = document.getElementById('welcomeHivesCount');
    const welcomeTasksCount = document.getElementById('welcomeTasksCount');
    const welcomeActionsCount = document.getElementById('welcomeActionsCount');
    
    if (welcomeClustersCount) welcomeClustersCount.textContent = clustersCount;
    if (welcomeHivesCount) welcomeHivesCount.textContent = hivesCount;
    if (welcomeTasksCount) welcomeTasksCount.textContent = tasksCount;
    if (welcomeActionsCount) welcomeActionsCount.textContent = actionsCount;
    
    console.log(`📊 Welcome stats: ${clustersCount} clusters, ${hivesCount} hives, ${tasksCount} tasks, ${actionsCount} actions`);
}

function dismissWelcomeModal() {
    console.log('👋 Welcome modal dismissed - user ready to start');
    updateDebugInfo('systemStatus', 'User acknowledged welcome - ready for use');
}

// Version Management Functions
function updateVersionDisplay() {
    const versionElements = document.querySelectorAll('.version-tag .badge');
    versionElements.forEach(element => {
        element.innerHTML = `<i class="bi bi-tag-fill me-1"></i>v${APP_VERSION}`;
    });
    console.log(`🏷️ Version display updated to v${APP_VERSION}`);
}

function getVersionInfo() {
    return {
        current: APP_VERSION,
        history: VERSION_HISTORY,
        latest: VERSION_HISTORY[VERSION_HISTORY.length - 1]
    };
}

function getVersionChanges(version = APP_VERSION) {
    const versionInfo = VERSION_HISTORY.find(v => v.version === version);
    return versionInfo ? versionInfo.changes : [];
}

// Debug function to show version information
window.showVersionInfo = function() {
    const info = getVersionInfo();
    console.log('📦 BeeMarshall Version Information:');
    console.log('Current Version: v${info.current}');
    console.log('Version History:', info.history);
    console.log('Latest Changes:', info.latest.changes);
    return info;
}

// Test function to verify dashboard is working
window.testDashboard = function() {
    console.log('🧪 Testing dashboard functionality...');
    console.log('Current User:', currentUser);
    console.log('Is Admin:', isAdmin);
    console.log('Clusters:', clusters.length);
    console.log('Actions:', actions.length);
    console.log('Scheduled Tasks:', scheduledTasks.length);
    console.log('Dashboard should be visible now');
    
    // Check if main app is visible
    const loginScreen = document.getElementById('loginScreen');
    const mainApp = document.getElementById('mainApp');
    
    console.log('Login Screen Hidden:', loginScreen.classList.contains('hidden'));
    console.log('Main App Visible:', !mainApp.classList.contains('hidden'));
    
    return {
        user: currentUser,
        isAdmin: isAdmin,
        data: { clusters: clusters.length, actions: actions.length, tasks: scheduledTasks.length },
        ui: { 
            loginHidden: loginScreen.classList.contains('hidden'),
            mainVisible: !mainApp.classList.contains('hidden')
        }
    };
}

// Simplified Robust Authentication System
function handleLogin(e) {
    e.preventDefault();
    console.log('🔐 Login form submitted - handleLogin function called');
    console.log('🔍 Event details:', e);
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    console.log('👤 Username:', username);
    console.log('🔑 Password length:', password.length);
    console.log('🔍 Form elements found:', {
        usernameField: !!document.getElementById('loginUsername'),
        passwordField: !!document.getElementById('loginPassword'),
        loginButton: !!document.getElementById('loginButton')
    });
    
    // Show loading state
    showLoginStatus('info', 'Authenticating...', true);
    updateDebugInfo('systemStatus', 'Authenticating user...');
    
    if (!username || !password) {
        showLoginStatus('danger', 'Please enter both username and password', false);
        updateDebugInfo('lastError', 'Missing username or password');
        return;
    }
    
    // MULTI-TENANT AUTHENTICATION SYSTEM
    console.log('🔄 Using multi-tenant authentication system...');
    updateDebugInfo('firebaseStatus', 'Using multi-tenant auth system');
    
    // Check credentials against admin accounts
    const adminAccount = Object.values(ADMIN_ACCOUNTS).find(account => 
        account.username.toLowerCase() === username.toLowerCase() && account.password === password
    );
    
    if (adminAccount) {
        console.log('✅ Admin login successful:', adminAccount.username);
        showLoginStatus('success', `Login successful! Welcome ${adminAccount.username}!`, false);
        updateDebugInfo('systemStatus', 'Multi-tenant authentication successful');
        
        // Set user data with tenant isolation
        currentUser = {
            username: adminAccount.username,
            role: adminAccount.role,
            tenantId: adminAccount.tenantId,
            createdAt: new Date().toISOString()
        };
        currentTenantId = adminAccount.tenantId;
        isAdmin = true;
        
        // Store in localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('currentTenantId', currentTenantId);
        
        // Initialize data for this tenant
        clusters = [];
        actions = [];
        scheduledTasks = [];
        employees = [];
        
        // Delay to show success message then redirect
        setTimeout(() => {
            console.log('🚀 Redirecting to dashboard...');
            console.log('🏢 Tenant ID:', currentTenantId);
            showMainApp();
            loadDataFromFirebase();
        }, 1500);
        
        return;
    } else {
        console.log('❌ Invalid credentials');
        showLoginStatus('danger', 'Invalid credentials. Available accounts: Lars, GBTech', false);
        updateDebugInfo('lastError', 'Invalid username or password');
        return;
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
            showLoginStatus('success', 'Login successful! Welcome back, ' + admin.username + '!', false);
            updateDebugInfo('systemStatus', 'Authentication successful');
            
            currentUser = admin;
            isAdmin = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('isAdmin', 'true');
            
            // Delay to show success message
            setTimeout(() => {
                showMainApp();
                loadDataFromFirebase();
            }, 1500);
            return;
        }
        
        // Check if employee (tenant-specific)
        console.log('Checking employees for tenant:', currentTenantId);
        const employeePath = currentTenantId ? `tenants/${currentTenantId}/employees` : 'employees';
        database.ref(employeePath).once('value', (empSnapshot) => {
            const employeesList = empSnapshot.val() || {};
            console.log('Employees:', employeesList);
            
            const employee = Object.values(employeesList).find(emp => 
                emp.username.toLowerCase() === username.toLowerCase() && emp.passwordHash === passwordHash
            );
            
            if (employee) {
                console.log('Employee login successful');
                clearTimeout(firebaseTimeout); // Clear the fallback timeout
                showLoginStatus('success', 'Login successful! Welcome, ' + employee.username + '!', false);
                updateDebugInfo('systemStatus', 'Employee authentication successful');
                
                currentUser = employee;
                isAdmin = false;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                localStorage.setItem('isAdmin', 'false');
                
                // Delay to show success message
                setTimeout(() => {
                    showMainApp();
                    loadDataFromFirebase();
                }, 1500);
            } else {
                console.log('Login failed - no match');
                showLoginStatus('danger', 'Invalid username or password. Please check your credentials and try again.', false);
                updateDebugInfo('lastError', 'No matching user found');
            }
        }).catch(error => {
            console.error('Employee check error:', error);
            showLoginStatus('danger', 'Error checking credentials. Please try again.', false);
            updateDebugInfo('lastError', 'Employee check failed: ' + error.message);
        });
    }).catch(error => {
        console.error('Admin check error:', error);
        showLoginStatus('danger', 'Error checking credentials. Please try again.', false);
        updateDebugInfo('lastError', 'Admin check failed: ' + error.message);
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
    
    // Initialize dashboard
    showDashboard();
    
    // Show welcome popup after a short delay to ensure everything is loaded
    setTimeout(() => {
        showWelcomePopup();
    }, 1000);
}

// Show dashboard without initializing map (for initial load)
function showDashboardWithoutMap() {
    hideAllViews();
    document.getElementById('dashboardView').classList.remove('hidden');
    updateDashboardStats(); // Only update stats, not map
}

// Update only dashboard stats without map
function updateDashboardStats() {
    const totalHives = clusters.reduce((sum, c) => sum + (c.hiveCount || 0), 0);
    
    // Check for overdue tasks and update flagged count
    checkAndFlagOverdueTasks();
    const overdueTasks = scheduledTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return !task.completed && taskDate < new Date();
    }).length;
    
    const flaggedCount = actions.filter(a => a.flag && a.flag !== '').length + overdueTasks;
    
    // Animate number changes
    animateNumber(document.getElementById('statClusters'), clusters.length);
    animateNumber(document.getElementById('statHives'), totalHives);
    animateNumber(document.getElementById('statActions'), actions.length);
    animateNumber(document.getElementById('statFlagged'), flaggedCount);
    
    // Update quick stats
    updateQuickStats();
}

// Load data from Firebase with tenant isolation
// Prevent multiple simultaneous data loads
let isLoadingData = false;

function loadDataFromFirebase() {
    if (isLoadingData) {
        console.log('⏳ Data loading already in progress, skipping...');
        return;
    }
    
    isLoadingData = true;
    showSyncStatus('', 'syncing');
    
    if (!currentTenantId) {
        console.error('❌ No tenant ID found');
        isLoadingData = false;
        return;
    }
    
    console.log('🏢 Loading data for tenant:', currentTenantId);
    
    // Load tenant-specific data - simplified approach
    let dataLoadCount = 0;
    const totalDataTypes = 4; // clusters, actions, individualHives, scheduledTasks
    
    function checkAllDataLoaded() {
        dataLoadCount++;
        console.log(`📊 Data load progress: ${dataLoadCount}/${totalDataTypes}`);
        if (dataLoadCount >= totalDataTypes) {
            console.log('✅ All data loaded, updating dashboard');
            console.log('🔍 Final data state:', {
                clusters: clusters.length,
                actions: actions.length,
                scheduledTasks: scheduledTasks.length,
                individualHives: individualHives.length
            });
            isLoadingData = false;
            // Small delay to ensure data is properly set
            setTimeout(() => {
                updateDashboard();
            }, 100);
        }
    }
    
    database.ref(`tenants/${currentTenantId}/clusters`).on('value', (snapshot) => {
        const data = snapshot.val();
        console.log('🔍 Raw clusters data for', currentTenantId + ':', data);
        clusters = data ? Object.values(data) : [];
        console.log('📊 Clusters loaded for', currentTenantId + ':', clusters.length);
        console.log('📊 Clusters array:', clusters);
        
        if (clusters.length === 0) {
            console.log('📭 No clusters found - starting fresh');
            showSyncStatus('', 'success');
        } else {
            showSyncStatus('', 'success');
        }
        checkAllDataLoaded();
    }, (error) => {
        console.log('❌ Tenant clusters access failed:', error.message);
        showSyncStatus('', 'error');
        checkAllDataLoaded();
    });
    
    database.ref(`tenants/${currentTenantId}/actions`).on('value', (snapshot) => {
        const data = snapshot.val();
        console.log('🔍 Raw actions data for', currentTenantId + ':', data);
        actions = data ? Object.values(data) : [];
        console.log('📊 Actions loaded for', currentTenantId + ':', actions.length);
        console.log('📊 Actions array:', actions);
        checkAllDataLoaded();
    }, (error) => {
        console.log('❌ Tenant actions access failed:', error.message);
        checkAllDataLoaded();
    });
    
    database.ref(`tenants/${currentTenantId}/individualHives`).on('value', (snapshot) => {
        individualHives = snapshot.val() ? Object.values(snapshot.val()) : [];
        console.log('📊 Individual hives loaded for', currentTenantId + ':', individualHives.length);
        checkAllDataLoaded();
    }, (error) => {
        console.log('❌ Tenant hives access failed:', error.message);
        checkAllDataLoaded();
    });
    
    database.ref(`tenants/${currentTenantId}/scheduledTasks`).on('value', (snapshot) => {
        scheduledTasks = snapshot.val() ? Object.values(snapshot.val()) : [];
        console.log('📊 Scheduled tasks loaded for', currentTenantId + ':', scheduledTasks.length);
        updateScheduledTasksPreview();
        checkAllDataLoaded();
    }, (error) => {
        console.log('❌ Tenant tasks access failed:', error.message);
        checkAllDataLoaded();
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
    if (!currentTenantId) {
        console.error('❌ No tenant ID for employee loading');
        return;
    }
    
    database.ref(`tenants/${currentTenantId}/employees`).on('value', (snapshot) => {
        employees = snapshot.val() ? Object.values(snapshot.val()) : [];
        renderEmployees();
    });
}
