// BeeMarshall - Actions Management Module

function showLogActionForm() {
    hideAllViews();
    document.getElementById('logActionView').classList.remove('hidden');
    populateActionForm();
}

function populateActionForm() {
    const siteSelect = document.getElementById('actionSite');
    siteSelect.innerHTML = '<option value="">Select site...</option>' +
        sites.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    
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
    filterTaskCheckboxes('all');
}

function filterTaskCheckboxes(filter) {
    document.querySelectorAll('.task-checkbox-item').forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.common === 'true') ? '' : 'none';
    });
}

function loadSiteHives() {
    const siteId = parseInt(document.getElementById('actionSite').value);
    const hives = individualHives.filter(h => h.siteId === siteId);
    
    if (hives.length > 0) {
        const select = document.getElementById('actionHive');
        select.innerHTML = '<option value="">All hives in site</option>' +
            hives.map(h => `<option value="${h.id}">${h.hiveName} (${h.status})</option>`).join('');
        document.getElementById('individualHiveSelect').classList.remove('hidden');
    } else {
        document.getElementById('individualHiveSelect').classList.add('hidden');
    }
}

function handleLogAction(e) {
    e.preventDefault();
    
    const siteId = parseInt(document.getElementById('actionSite').value);
    const date = document.getElementById('actionDate').value;
    const notes = document.getElementById('actionNotes').value;
    const flag = document.getElementById('actionFlag').value;
    const individualHiveId = document.getElementById('actionHive')?.value || null;
    
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
    
    // Show sync status
    if (window.syncStatusManager) {
        window.syncStatusManager.updateSyncStatus('syncing', 'Logging actions...');
    }
    
    const actions = selectedTasks.map(taskId => {
        const task = tasks.find(t => t.id === taskId);
        return {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            siteId,
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
    });
    
    // Use tenant-specific path for data isolation
    const tenantPath = currentTenantId ? `tenants/${currentTenantId}/actions` : 'actions';
    
    if (navigator.onLine && window.database) {
        const promises = actions.map(action => 
            database.ref(`${tenantPath}/${action.id}`).set(action)
        );
        
        Promise.all(promises).then(() => {
            if (window.syncStatusManager) {
                window.syncStatusManager.updateSyncStatus('synced');
            }
            document.getElementById('actionForm').reset();
            document.getElementById('actionDate').valueAsDate = new Date();
            showActions();
        }).catch(error => {
            console.error('Error logging actions:', error);
            // Add to pending changes
            actions.forEach(action => {
                if (window.syncStatusManager) {
                    window.syncStatusManager.addPendingChange({
                        type: 'action_log',
                        path: `${tenantPath}/${action.id}`,
                        data: action,
                        method: 'set'
                    });
                }
            });
            beeMarshallAlert('⚠️ Actions saved locally. Will sync when connection is restored.', 'warning');
            document.getElementById('actionForm').reset();
            document.getElementById('actionDate').valueAsDate = new Date();
            showActions();
        });
    } else {
        // Offline - add to pending changes
        actions.forEach(action => {
            if (window.syncStatusManager) {
                window.syncStatusManager.addPendingChange({
                    type: 'action_log',
                    path: `${tenantPath}/${action.id}`,
                    data: action,
                    method: 'set'
                });
            }
        });
        beeMarshallAlert('⚠️ Actions saved locally. Will sync when connection is restored.', 'warning');
        document.getElementById('actionForm').reset();
        document.getElementById('actionDate').valueAsDate = new Date();
        showActions();
    }
}

function populateActionFilters() {
    const siteFilter = document.getElementById('filterSite');
    siteFilter.innerHTML = '<option value="">All Sites</option>' +
        (Array.isArray(window.sites) ? window.sites : []).map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    
    const categories = [...new Set((Array.isArray(window.tasks) ? window.tasks : []).map(t => t.category).filter(Boolean))].sort();
    document.getElementById('filterCategory').innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    
    // Get employee names from both actions and current employees list
    const actionEmployeeNames = [...new Set((Array.isArray(window.actions) ? window.actions : []).map(a => a.loggedBy))].filter(Boolean);
    const currentEmployeeNames = Array.isArray(window.employees) ? window.employees.map(emp => emp.username) : [];
    
    // Combine and deduplicate employee names
    const allEmployeeNames = [...new Set([...actionEmployeeNames, ...currentEmployeeNames])].sort();
    
    document.getElementById('filterEmployee').innerHTML = '<option value="">All Employees</option>' +
        allEmployeeNames.map(name => `<option value="${name}">${name}</option>`).join('');

    // Default filters to "All"
    document.getElementById('filterSite').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterEmployee').value = '';
}

function renderActions() {
    console.log('🔍 renderActions called');
    console.log('🔍 window.actions:', window.actions);
    console.log('🔍 window.actions length:', window.actions ? window.actions.length : 'undefined');
    
    const siteFilter = document.getElementById('filterSite')?.value;
    const categoryFilter = document.getElementById('filterCategory')?.value;
    const employeeFilter = document.getElementById('filterEmployee')?.value;
    
    // Get action type filter checkboxes
    const hideDeletes = document.getElementById('hideDeletes')?.checked || false;
    const hideMoves = document.getElementById('hideMoves')?.checked || false;
    const hideStackUpdates = document.getElementById('hideStackUpdates')?.checked || false;
    const hideStrengthUpdates = document.getElementById('hideStrengthUpdates')?.checked || false;
    
    const actionsArray = Array.isArray(window.actions) ? window.actions : [];
    let filtered = [...actionsArray];
    console.log('🔍 filtered actions before filtering:', filtered.length);
    if (siteFilter) filtered = filtered.filter(a => a.siteId == siteFilter);
    if (categoryFilter) filtered = filtered.filter(a => {
        const cat = a.taskCategory || a.category || '';
        return cat === categoryFilter;
    });
    if (employeeFilter) filtered = filtered.filter(a => {
        const by = (a.loggedBy || '').toString().trim().toLowerCase();
        return by === employeeFilter.toString().trim().toLowerCase();
    });
    
    // Apply action type filters with robust keyword matching
    const getName = (a) => (a.taskName || a.task || a.name || '').toString().toLowerCase();
    const deleteKeywords = ['delete', 'deleted', 'remove', 'removed', 'archive', 'archived'];
    const moveKeywords = ['move', 'moved', 'relocation', 'relocate', 'transfer'];
    const strengthKeywords = ['strong', 'medium', 'weak', 'nuc', 'dead', 'hive state', 'strength'];

    if (hideDeletes) {
        filtered = filtered.filter(a => {
            const name = getName(a);
            return !deleteKeywords.some(k => name.includes(k));
        });
    }
    if (hideMoves) {
        filtered = filtered.filter(a => {
            const name = getName(a);
            return !moveKeywords.some(k => name.includes(k));
        });
    }
    if (hideStackUpdates) {
        filtered = filtered.filter(a => {
            const name = getName(a);
            return !name.includes('inventory');
        });
    }
    if (hideStrengthUpdates) {
        filtered = filtered.filter(a => {
            const name = getName(a);
            return !strengthKeywords.some(k => name.includes(k));
        });
    }
    
    const sitesArray = Array.isArray(window.sites) ? window.sites : [];
    const hivesArray = Array.isArray(window.individualHives) ? window.individualHives : [];

    const html = filtered.length > 0
        ? filtered.slice().reverse().map(a => {
            const site = sitesArray.find(s => s.id === a.siteId);
            const hive = hivesArray.find(h => h.id === a.individualHiveId);
            const flagIcon = a.flag === 'urgent' ? '🚨' : a.flag === 'warning' ? '⚠️' : a.flag === 'info' ? 'ℹ️' : '';
            const deleteBtn = canDeleteAction() ? `
                <button class="btn btn-sm btn-outline-danger" onclick="deleteAction('${a.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            ` : '';
            
            const displayTaskName = window.getTaskDisplayName(a.taskName || a.task || a.name || '', a.taskId);
            const isDeletedTask = displayTaskName.startsWith('[Deleted:');
            
            return `
                <div class="action-item ${a.flag ? 'flag-' + a.flag : ''}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="mb-1">
                                ${flagIcon} <span class="badge bg-secondary">${a.taskCategory || a.category || 'Task'}</span>
                                <strong class="${isDeletedTask ? 'text-muted' : ''}">${displayTaskName}</strong>
                            </div>
                            <div class="text-muted small">
                                <i class="bi bi-geo-alt"></i> ${site?.name || 'Unknown'}
                                ${hive ? ` • <i class=\"bi bi-hexagon\"></i> ${hive.hiveName || hive.hiveNumber || ''}` : ''}
                                <br>
                                <i class="bi bi-calendar"></i> ${a.date || ''} • 
                                <i class="bi bi-person"></i> ${a.loggedBy || 'Unknown'}
                            </div>
                            ${a.notes ? `<p class="mb-0 mt-2"><small><strong>Notes:</strong> ${a.notes}</small></p>` : ''}
                        </div>
                        ${deleteBtn}
                    </div>
                </div>
            `;
        }).join('')
        : (actionsArray.length > 0
            ? '<div class="text-center text-muted my-5"><i class="bi bi-funnel"></i> No actions match current filters. Try clearing filters.</div>'
            : '<p class="text-center text-muted my-5">No actions found.</p>');
    
    console.log('🔍 Final HTML length:', html.length);
    console.log('🔍 actionsList element:', document.getElementById('actionsList'));
    document.getElementById('actionsList').innerHTML = html;
    console.log('🔍 Actions list updated');
}

function deleteAction(id) {
    // Check permission
    if (!canDeleteAction()) {
        showPermissionDeniedAlert('delete actions');
        return;
    }
    
    if (confirm('Delete this action? This cannot be undone!')) {
        // Use tenant-specific path for data isolation
        const tenantPath = currentTenantId ? `tenants/${currentTenantId}/actions` : 'actions';
        database.ref(`${tenantPath}/${id}`).remove();
    }
}

function showFlagged() {
    hideAllViews();
    document.getElementById('flaggedView').classList.remove('hidden');
    renderFlaggedItems();
}

function renderFlaggedItems() {
    console.log('🔍 Rendering flagged items...');
    console.log('📊 Total actions:', window.actions ? window.actions.length : 0);
    console.log('📊 Actions data:', window.actions);
    
    const flagged = window.actions.filter(a => a.flag && a.flag !== '');
    console.log('🚩 Flagged actions found:', flagged.length);
    console.log('🚩 Flagged actions:', flagged);
    
    // Get overdue tasks
    const overdueTasks = (window.scheduledTasks && Array.isArray(window.scheduledTasks)) ? 
        window.scheduledTasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return !task.completed && taskDate < new Date();
        }) : [];
    console.log('🚩 Overdue tasks found:', overdueTasks.length);
    console.log('🚩 Overdue tasks:', overdueTasks);
    
    // Create HTML for flagged actions
    const flaggedHtml = flagged.reverse().length > 0
        ? flagged.map(a => {
            const site = window.sites.find(s => s.id === a.siteId);
            const flagClass = a.flag === 'urgent' ? 'danger' : a.flag === 'warning' ? 'warning' : 'info';
            const flagIcon = a.flag === 'urgent' ? '🚨' : a.flag === 'warning' ? '⚠️' : 'ℹ️';
            
            return `
                <div class="card mb-3 border-${flagClass} flagged-item-card" style="cursor: pointer;" onclick="navigateToSite('${a.siteId}')">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div class="flex-grow-1">
                                <h5>${flagIcon} ${window.getTaskDisplayName(a.taskName, a.taskId)}</h5>
                                <p class="mb-1"><i class="bi bi-geo-alt"></i> ${site?.name || 'Unknown'}</p>
                                <p class="mb-1"><small><i class="bi bi-calendar"></i> ${a.date} • <i class="bi bi-person"></i> ${a.loggedBy}</small></p>
                                <span class="badge bg-${flagClass}">${a.flag.toUpperCase()}</span>
                                ${a.notes ? `<p class="mt-2">${a.notes}</p>` : ''}
                                <small class="text-muted"><i class="bi bi-hand-index"></i> Click to view site details</small>
                            </div>
                            <div class="ms-3">
                                ${isAdmin ? `<button class="btn btn-sm btn-outline-secondary" onclick="event.stopPropagation(); unflagAction('${a.id}')"><i class="bi bi-flag"></i> Unflag</button>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('')
        : '';
    
    // Create HTML for overdue tasks
    const overdueHtml = overdueTasks.length > 0
        ? overdueTasks.map(task => {
            const site = window.sites.find(s => s.id === task.siteId);
            const taskName = window.getTaskDisplayName(null, task.taskId);
            
            return `
                <div class="card mb-3 border-danger flagged-item-card" style="cursor: pointer;" onclick="navigateToSite('${task.siteId}')">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div class="flex-grow-1">
                                <h5>🚨 OVERDUE: ${taskName}</h5>
                                <p class="mb-1"><i class="bi bi-geo-alt"></i> ${site?.name || 'Unknown'}</p>
                                <p class="mb-1"><small><i class="bi bi-calendar"></i> Due: ${new Date(task.dueDate).toLocaleDateString()}</small></p>
                                <span class="badge bg-danger">OVERDUE</span>
                                ${task.notes ? `<p class="mt-2">${task.notes}</p>` : ''}
                                <small class="text-muted"><i class="bi bi-hand-index"></i> Click to view site details</small>
                            </div>
                            <div class="ms-3">
                                ${isAdmin ? `
                                    <button class="btn btn-sm btn-outline-primary me-2" onclick="event.stopPropagation(); rescheduleTask('${task.id}')"><i class="bi bi-calendar-plus"></i> Reschedule</button>
                                    <button class="btn btn-sm btn-outline-success" onclick="event.stopPropagation(); completeTask('${task.id}')"><i class="bi bi-check"></i> Mark Complete</button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('')
        : '';
    
    // Combine flagged actions and overdue tasks
    const combinedHtml = flaggedHtml + overdueHtml;
    
    const finalHtml = combinedHtml.length > 0
        ? combinedHtml
        : '<p class="text-center text-muted my-5">No flagged items or overdue tasks. Flag important events for team visibility!</p>';
    
    document.getElementById('flaggedItemsList2').innerHTML = finalHtml;
}

function navigateToSite(siteId) {
    // Navigate to sites view and highlight the specific site
    showSites();
    
    // Scroll to the site card and highlight it
    setTimeout(() => {
        const siteElement = document.querySelector(`[data-site-id="${siteId}"]`);
        if (siteElement) {
            siteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            siteElement.classList.add('highlighted');
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                siteElement.classList.remove('highlighted');
            }, 3000);
        }
    }, 100);
}

function rescheduleTask(taskId) {
    console.log('📅 Rescheduling task:', taskId);
    
    // Navigate to scheduling view and open reschedule modal
    showScheduling();
    
    // Store task ID for rescheduling
    setTimeout(() => {
        const task = window.scheduledTasks.find(t => t.id === taskId);
        if (task) {
            // Open the reschedule modal or form
            beeMarshallAlert(`Reschedule task: ${window.getTaskDisplayName(null, task.taskId)}\n\nDue: ${new Date(task.dueDate).toLocaleDateString()}\n\nUse the scheduling section to reschedule this task.`, 'info');
        }
    }, 500);
}

function completeTask(taskId) {
    console.log('✅ Completing task:', taskId);
    
    const task = window.scheduledTasks.find(t => t.id === taskId);
    if (!task) {
        beeMarshallAlert('Task not found', 'error');
        return;
    }
    
    // Confirm completion
    if (confirm(`Mark task as complete?\n\nTask: ${window.getTaskDisplayName(null, task.taskId)}\nSite: ${window.sites.find(s => s.id === task.siteId)?.name || 'Unknown'}\nDue: ${new Date(task.dueDate).toLocaleDateString()}`)) {
        // Use tenant-specific path for data isolation
        const tenantPath = currentTenantId ? `tenants/${currentTenantId}/scheduledTasks` : 'scheduledTasks';
        
        const updates = {
            completed: true,
            completedAt: new Date().toISOString(),
            completedBy: currentUser ? currentUser.username : 'Unknown'
        };
        
        database.ref(`${tenantPath}/${taskId}`).update(updates)
            .then(() => {
                console.log('✅ Task completed successfully');
                beeMarshallAlert(`Task completed successfully!\n\nTask: ${window.getTaskDisplayName(null, task.taskId)}\nCompleted by: ${currentUser ? currentUser.username : 'Unknown'}`, 'success');
                // Refresh the flagged items list
                renderFlaggedItems();
            })
            .catch(error => {
                console.error('❌ Error completing task:', error);
                beeMarshallAlert('Error completing task. Please try again.', 'error');
            });
    }
}

function unflagAction(id) {
    console.log('🚩 Unflagging action:', id);
    
    // Use tenant-specific path for data isolation
    const tenantPath = currentTenantId ? `tenants/${currentTenantId}/actions` : 'actions';
    
    database.ref(`${tenantPath}/${id}/flag`).set('')
        .then(() => {
            console.log('✅ Action unflagged successfully');
            beeMarshallAlert('Action unflagged successfully', 'success');
            // Refresh the flagged items list
            renderFlaggedItems();
        })
        .catch(error => {
            console.error('❌ Error unflagging action:', error);
            beeMarshallAlert('Error unflagging action. Please try again.', 'error');
        });
}
