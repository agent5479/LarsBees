// BeeMarshall - Employee Management Module

function showEmployees() {
    // Check permission
    if (!canManageEmployees()) {
        showPermissionDeniedAlert('access employee management');
        return;
    }
    hideAllViews();
    document.getElementById('employeesView').classList.remove('hidden');
    if (typeof updateActiveNav === 'function') {
        updateActiveNav('Team');
    }
    renderEmployees();
}

function handleAddEmployee(e) {
    e.preventDefault();
    
    // Check permission
    if (!canManageEmployees()) {
        showPermissionDeniedAlert('add employees');
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
        isActive: false, // New employees start as inactive
        createdAt: new Date().toISOString(),
        createdBy: currentUser.username,
        tenantId: currentTenantId, // Store the tenant ID of the admin who created this employee
        activationCode: generateActivationCode(), // Generate unique activation code
        temporaryPassword: null, // Will be set when activated
        temporaryPasswordExpiry: null, // Will be set when activated
        deviceRemembered: false, // Device remembering status
        lastLogin: null, // Track last login
        passwordChanged: false // Track if password has been changed from temporary
    };
    
    // Use tenant-specific path for data isolation
    const tenantPath = currentTenantId ? `tenants/${currentTenantId}/employees` : 'employees';
    database.ref(`${tenantPath}/${employeeId}`).set(employee)
        .then(() => {
            beeMarshallAlert(`✅ Employee "${name}" added successfully!\n\nStatus: Pending Activation\nUsername: ${name}\nPassword: [the password you set]\n\nClick "Activate" to enable login access.`, 'success');
            document.getElementById('addEmployeeForm').reset();
            loadEmployees();
        });
}

function renderEmployees() {
    const html = employees.length > 0
        ? `<div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Added</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${employees.map(emp => `
                        <tr>
                            <td><i class="bi bi-person"></i> ${emp.username}</td>
                            <td><span class="badge bg-info">${emp.role}</span></td>
                            <td>
                                ${emp.isActive ? 
                                    '<span class="badge bg-success"><i class="bi bi-check-circle"></i> Active</span>' : 
                                    '<span class="badge bg-warning"><i class="bi bi-clock"></i> Pending</span>'
                                }
                            </td>
                            <td><small>${new Date(emp.createdAt).toLocaleDateString()}</small></td>
                            <td>
                                ${!emp.isActive ? 
                                    `<button class="btn btn-sm btn-success me-2" onclick="activateEmployee('${emp.id}')">
                                        <i class="bi bi-check-circle"></i> Activate
                                    </button>` : 
                                    `<button class="btn btn-sm btn-outline-warning me-2" onclick="deactivateEmployee('${emp.id}')">
                                        <i class="bi bi-pause-circle"></i> Deactivate
                                    </button>`
                                }
                                ${emp.isActive ? 
                                    `<button class="btn btn-sm btn-outline-primary me-2" onclick="regenerateTemporaryPassword('${emp.id}')">
                                        <i class="bi bi-arrow-clockwise"></i> New Password
                                    </button>` : ''
                                }
                                <button class="btn btn-sm btn-outline-info me-2" onclick="showEmployeeCredentials('${emp.id}')">
                                    <i class="bi bi-key"></i> Credentials
                                </button>
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

// Generate unique activation code
function generateActivationCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateTemporaryPassword() {
    // Generate a secure temporary password: 8 characters with mix of letters and numbers
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Activate employee account
function activateEmployee(id) {
    // Check permission
    if (!canManageEmployees()) {
        showPermissionDeniedAlert('activate employees');
        return;
    }
    
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        beeMarshallAlert('Employee not found', 'error');
        return;
    }
    
    // Generate temporary password (expires in 3 days)
    const temporaryPassword = generateTemporaryPassword();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3); // 3 days from now
    
    // Use tenant-specific path for data isolation
    const tenantPath = currentTenantId ? `tenants/${currentTenantId}/employees` : 'employees';
    const updates = {
        isActive: true,
        temporaryPassword: temporaryPassword,
        temporaryPasswordExpiry: expiryDate.toISOString(),
        deviceRemembered: false,
        passwordChanged: false
    };
    
    database.ref(`${tenantPath}/${id}`).update(updates)
        .then(() => {
            beeMarshallAlert(`✅ Employee "${employee.username}" has been activated!\n\nTemporary Password: ${temporaryPassword}\nExpires: ${expiryDate.toLocaleDateString()}\n\nShare this password with the employee. They should change it on first login.`, 'success');
            loadEmployees();
        })
        .catch(error => {
            console.error('Error activating employee:', error);
            beeMarshallAlert('Failed to activate employee', 'error');
        });
}

// Regenerate temporary password for employee
function regenerateTemporaryPassword(id) {
    // Check permission
    if (!canManageEmployees()) {
        showPermissionDeniedAlert('regenerate employee passwords');
        return;
    }
    
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        beeMarshallAlert('Employee not found', 'error');
        return;
    }
    
    if (!employee.isActive) {
        beeMarshallAlert('Employee must be active to regenerate password', 'error');
        return;
    }
    
    // Generate new temporary password (expires in 3 days)
    const temporaryPassword = generateTemporaryPassword();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3); // 3 days from now
    
    // Use tenant-specific path for data isolation
    const tenantPath = currentTenantId ? `tenants/${currentTenantId}/employees` : 'employees';
    const updates = {
        temporaryPassword: temporaryPassword,
        temporaryPasswordExpiry: expiryDate.toISOString(),
        deviceRemembered: false, // Reset device remembering
        passwordChanged: false // Reset password changed flag
    };
    
    database.ref(`${tenantPath}/${id}`).update(updates)
        .then(() => {
            beeMarshallAlert(`✅ New temporary password generated for "${employee.username}"!\n\nNew Temporary Password: ${temporaryPassword}\nExpires: ${expiryDate.toLocaleDateString()}\n\nShare this new password with the employee.`, 'success');
            loadEmployees();
        })
        .catch(error => {
            console.error('Error regenerating password:', error);
            beeMarshallAlert('Failed to regenerate password', 'error');
        });
}

// Deactivate employee account
function deactivateEmployee(id) {
    // Check permission
    if (!canManageEmployees()) {
        showPermissionDeniedAlert('deactivate employees');
        return;
    }
    
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        beeMarshallAlert('Employee not found', 'error');
        return;
    }
    
    if (confirm(`Deactivate "${employee.username}"? They will not be able to login until reactivated.`)) {
        // Use tenant-specific path for data isolation
        const tenantPath = currentTenantId ? `tenants/${currentTenantId}/employees` : 'employees';
        database.ref(`${tenantPath}/${id}/isActive`).set(false)
            .then(() => {
                beeMarshallAlert(`Employee "${employee.username}" has been deactivated.`, 'info');
                loadEmployees();
            })
            .catch(error => {
                console.error('Error deactivating employee:', error);
                beeMarshallAlert('Failed to deactivate employee', 'error');
            });
    }
}

// Show employee credentials
function showEmployeeCredentials(id) {
    // Check permission
    if (!canManageEmployees()) {
        showPermissionDeniedAlert('view employee credentials');
        return;
    }
    
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        beeMarshallAlert('Employee not found', 'error');
        return;
    }
    
    // Create modal to show credentials
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'employeeCredentialsModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="background: var(--glass); backdrop-filter: blur(12px) saturate(1.1); border: 1px solid rgba(255,255,255,0.2);">
                <div class="modal-header border-0">
                    <h5 class="modal-title fw-bold"><i class="bi bi-key"></i> Employee Credentials</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i> <strong>Employee Login Information</strong>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Username:</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="employeeUsername" value="${employee.username}" readonly>
                            <button class="btn btn-outline-secondary" type="button" onclick="copyToClipboard('employeeUsername')">
                                <i class="bi bi-clipboard"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Status:</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="employeeStatus" value="${employee.isActive ? 'Active - Can Login' : 'Pending - Needs Activation'}" readonly>
                            <button class="btn btn-outline-secondary" type="button" onclick="copyToClipboard('employeeStatus')">
                                <i class="bi bi-clipboard"></i>
                            </button>
                        </div>
                    </div>
                    ${employee.isActive && employee.temporaryPassword ? `
                    <div class="mb-3">
                        <label class="form-label fw-bold">Temporary Password:</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="employeeTempPassword" value="${employee.temporaryPassword}" readonly>
                            <button class="btn btn-outline-secondary" type="button" onclick="copyToClipboard('employeeTempPassword')">
                                <i class="bi bi-clipboard"></i>
                            </button>
                        </div>
                        <small class="form-text text-muted">
                            Expires: ${employee.temporaryPasswordExpiry ? new Date(employee.temporaryPasswordExpiry).toLocaleDateString() : 'Unknown'}
                            ${employee.deviceRemembered ? ' | Device Remembered' : ' | Device Not Remembered'}
                        </small>
                    </div>
                    ` : ''}
                    ${employee.activationCode ? `
                    <div class="mb-3">
                        <label class="form-label fw-bold">Activation Code:</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="employeeActivationCode" value="${employee.activationCode}" readonly>
                            <button class="btn btn-outline-secondary" type="button" onclick="copyToClipboard('employeeActivationCode')">
                                <i class="bi bi-clipboard"></i>
                            </button>
                        </div>
                        <small class="form-text text-muted">Use this code for employee self-activation if needed</small>
                    </div>
                    ` : ''}
                    <div class="alert alert-warning">
                        <i class="bi bi-exclamation-triangle"></i> <strong>Important:</strong> 
                        ${employee.isActive ? 
                            'This employee can login with their username and password.' : 
                            'This employee needs to be activated before they can login.'
                        }
                    </div>
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i> <strong>Share Login Info:</strong>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-outline-primary me-2" onclick="copyLoginInfo('${employee.id}')">
                                <i class="bi bi-clipboard"></i> Copy Login Details
                            </button>
                            <button class="btn btn-sm btn-outline-success me-2" onclick="generateLoginMessage('${employee.id}')">
                                <i class="bi bi-chat-text"></i> Generate Message
                            </button>
                            <button class="btn btn-sm btn-outline-info" onclick="printLoginCard('${employee.id}')">
                                <i class="bi bi-printer"></i> Print Card
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    ${!employee.isActive ? 
                        `<button type="button" class="btn btn-success" onclick="activateEmployee('${employee.id}'); bootstrap.Modal.getInstance(document.getElementById('employeeCredentialsModal')).hide();">
                            <i class="bi bi-check-circle"></i> Activate Now
                        </button>` : 
                        `<button type="button" class="btn btn-warning" onclick="deactivateEmployee('${employee.id}'); bootstrap.Modal.getInstance(document.getElementById('employeeCredentialsModal')).hide();">
                            <i class="bi bi-pause-circle"></i> Deactivate
                        </button>`
                    }
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

// Copy to clipboard function
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    element.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
    beeMarshallAlert('Copied to clipboard!', 'success');
}

// Copy complete login information for employee
function copyLoginInfo(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
        beeMarshallAlert('Employee not found', 'error');
        return;
    }
    
    const loginInfo = `BeeMarshall Login Information

Username: ${employee.username}
Password: [The password you set when creating this account]
Status: ${employee.isActive ? 'Active - Can Login' : 'Pending - Needs Activation'}
${employee.activationCode ? `Activation Code: ${employee.activationCode}` : ''}

Login URL: ${window.location.origin}${window.location.pathname}

Instructions:
1. Go to the login URL above
2. Enter your username and password
3. Click Login
${!employee.isActive ? '4. Contact Lars if you see "account not active" message' : ''}

Need help? Contact Lars for assistance.`;
    
    navigator.clipboard.writeText(loginInfo).then(() => {
        beeMarshallAlert('Login information copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = loginInfo;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        beeMarshallAlert('Login information copied to clipboard!', 'success');
    });
}

// Generate a formatted message for sharing
function generateLoginMessage(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
        beeMarshallAlert('Employee not found', 'error');
        return;
    }
    
    const message = `Hi ${employee.username},

Your BeeMarshall account has been created! Here are your login details:

🔐 Login Information:
• Username: ${employee.username}
• Password: [The password you set]
• Status: ${employee.isActive ? '✅ Active - Ready to use' : '⏳ Pending - Will be activated soon'}
${employee.activationCode ? `• Activation Code: ${employee.activationCode}` : ''}

🌐 Access:
• URL: ${window.location.origin}${window.location.pathname}
• Just enter your username and password to login

📱 What you can do:
• View and manage apiary sites
• Log actions and tasks
• View reports and analytics
• Collaborate with the team in real-time

${!employee.isActive ? '⚠️ Note: Your account will be activated by Lars before you can login.' : '✅ You can start using the system right away!'}

Need help? Just ask Lars!

Best regards,
Lars (BeeMarshall Admin)`;
    
    // Create modal to show the message
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'loginMessageModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content" style="background: var(--glass); backdrop-filter: blur(12px) saturate(1.1); border: 1px solid rgba(255,255,255,0.2);">
                <div class="modal-header border-0">
                    <h5 class="modal-title fw-bold"><i class="bi bi-chat-text"></i> Generated Login Message</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i> <strong>Copy this message and send it to ${employee.username}</strong>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Message to Send:</label>
                        <textarea class="form-control" id="loginMessageText" rows="15" readonly>${message}</textarea>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary" onclick="copyMessageText()">
                            <i class="bi bi-clipboard"></i> Copy Message
                        </button>
                        <button class="btn btn-outline-secondary" onclick="emailMessage()">
                            <i class="bi bi-envelope"></i> Open Email
                        </button>
                        <button class="btn btn-outline-info" onclick="smsMessage()">
                            <i class="bi bi-chat"></i> Open SMS
                        </button>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

// Print a login card for the employee
function printLoginCard(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
        beeMarshallAlert('Employee not found', 'error');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>BeeMarshall Login Card - ${employee.username}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .card { border: 2px solid #007bff; border-radius: 10px; padding: 20px; max-width: 400px; margin: 0 auto; }
                .header { text-align: center; color: #007bff; margin-bottom: 20px; }
                .info { margin: 10px 0; }
                .label { font-weight: bold; color: #333; }
                .value { color: #666; }
                .status { padding: 5px 10px; border-radius: 5px; color: white; font-weight: bold; }
                .active { background-color: #28a745; }
                .pending { background-color: #ffc107; color: #333; }
                .instructions { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 15px; }
                .url { font-family: monospace; background-color: #e9ecef; padding: 5px; border-radius: 3px; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="header">
                    <h2>🐝 BeeMarshall</h2>
                    <h3>Login Information</h3>
                </div>
                
                <div class="info">
                    <div class="label">Employee Name:</div>
                    <div class="value">${employee.username}</div>
                </div>
                
                <div class="info">
                    <div class="label">Username:</div>
                    <div class="value">${employee.username}</div>
                </div>
                
                <div class="info">
                    <div class="label">Password:</div>
                    <div class="value">[The password you set]</div>
                </div>
                
                <div class="info">
                    <div class="label">Status:</div>
                    <div class="value">
                        <span class="status ${employee.isActive ? 'active' : 'pending'}">
                            ${employee.isActive ? '✅ Active' : '⏳ Pending Activation'}
                        </span>
                    </div>
                </div>
                
                ${employee.activationCode ? `
                <div class="info">
                    <div class="label">Activation Code:</div>
                    <div class="value">${employee.activationCode}</div>
                </div>
                ` : ''}
                
                <div class="info">
                    <div class="label">Login URL:</div>
                    <div class="value url">${window.location.origin}${window.location.pathname}</div>
                </div>
                
                <div class="instructions">
                    <h4>How to Login:</h4>
                    <ol>
                        <li>Go to the URL above</li>
                        <li>Enter your username and password</li>
                        <li>Click Login</li>
                        ${!employee.isActive ? '<li>Contact Lars if you see "account not active" message</li>' : ''}
                    </ol>
                    
                    <p><strong>Need help?</strong> Contact Lars for assistance.</p>
                </div>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    
    beeMarshallAlert('Login card opened for printing!', 'success');
}

// Helper functions for message sharing
function copyMessageText() {
    const messageText = document.getElementById('loginMessageText');
    messageText.select();
    messageText.setSelectionRange(0, 99999);
    document.execCommand('copy');
    beeMarshallAlert('Message copied to clipboard!', 'success');
}

function emailMessage() {
    const messageText = document.getElementById('loginMessageText').value;
    const subject = 'BeeMarshall Login Information';
    const body = encodeURIComponent(messageText);
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.open(mailtoLink);
}

function smsMessage() {
    const messageText = document.getElementById('loginMessageText').value;
    const smsText = encodeURIComponent(messageText);
    const smsLink = `sms:?body=${smsText}`;
    window.open(smsLink);
}

// Bulk activate all pending employees
function bulkActivateEmployees() {
    // Check permission
    if (!canManageEmployees()) {
        showPermissionDeniedAlert('bulk activate employees');
        return;
    }
    
    const pendingEmployees = employees.filter(emp => !emp.isActive);
    if (pendingEmployees.length === 0) {
        beeMarshallAlert('No pending employees to activate.', 'info');
        return;
    }
    
    if (confirm(`Activate ${pendingEmployees.length} pending employee(s)?\n\nThis will enable login access for all pending employees.`)) {
        const tenantPath = currentTenantId ? `tenants/${currentTenantId}/employees` : 'employees';
        const updates = {};
        
        pendingEmployees.forEach(emp => {
            updates[`${emp.id}/isActive`] = true;
        });
        
        database.ref(tenantPath).update(updates)
            .then(() => {
                beeMarshallAlert(`✅ ${pendingEmployees.length} employee(s) activated successfully!\n\nAll employees can now login with their credentials.`, 'success');
                loadEmployees();
            })
            .catch(error => {
                console.error('Error bulk activating employees:', error);
                beeMarshallAlert('Failed to activate some employees', 'error');
            });
    }
}

// Bulk deactivate all active employees
function bulkDeactivateEmployees() {
    // Check permission
    if (!canManageEmployees()) {
        showPermissionDeniedAlert('bulk deactivate employees');
        return;
    }
    
    const activeEmployees = employees.filter(emp => emp.isActive);
    if (activeEmployees.length === 0) {
        beeMarshallAlert('No active employees to deactivate.', 'info');
        return;
    }
    
    if (confirm(`Deactivate ${activeEmployees.length} active employee(s)?\n\nThis will disable login access for all active employees.`)) {
        const tenantPath = currentTenantId ? `tenants/${currentTenantId}/employees` : 'employees';
        const updates = {};
        
        activeEmployees.forEach(emp => {
            updates[`${emp.id}/isActive`] = false;
        });
        
        database.ref(tenantPath).update(updates)
            .then(() => {
                beeMarshallAlert(`${activeEmployees.length} employee(s) deactivated successfully!`, 'info');
                loadEmployees();
            })
            .catch(error => {
                console.error('Error bulk deactivating employees:', error);
                beeMarshallAlert('Failed to deactivate some employees', 'error');
            });
    }
}

function removeEmployee(id) {
    // Check permission
    if (!canManageEmployees()) {
        showPermissionDeniedAlert('remove employees');
        return;
    }
    
    if (confirm('Remove this employee? They will no longer be able to login.')) {
        // Use tenant-specific path for data isolation
        const tenantPath = currentTenantId ? `tenants/${currentTenantId}/employees` : 'employees';
        database.ref(`${tenantPath}/${id}`).remove();
    }
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
