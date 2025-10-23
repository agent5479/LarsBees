// BeeMarshall - Dashboard Module with Calendar Widget

function showDashboard() {
    hideAllViews();
    document.getElementById('dashboardView').classList.remove('hidden');
    updateDashboard();
}

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
    updateCalendarWidget();
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

function updateCalendarWidget() {
    const calendarContainer = document.getElementById('calendarWidget');
    if (!calendarContainer) return;
    
    // Get upcoming scheduled tasks for the next 7 days
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingTasks = scheduledTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return !task.completed && taskDate >= today && taskDate <= nextWeek;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    if (upcomingTasks.length === 0) {
        calendarContainer.innerHTML = `
            <div class="calendar-widget">
                <h6><i class="bi bi-calendar-week"></i> Upcoming Tasks (Next 7 Days)</h6>
                <p class="text-muted">No tasks scheduled for the next 7 days.</p>
            </div>
        `;
        return;
    }
    
    // Group tasks by date
    const tasksByDate = {};
    upcomingTasks.forEach(task => {
        const date = new Date(task.dueDate).toDateString();
        if (!tasksByDate[date]) {
            tasksByDate[date] = [];
        }
        tasksByDate[date].push(task);
    });
    
    const calendarHtml = Object.keys(tasksByDate).map(date => {
        const tasks = tasksByDate[date];
        const dateObj = new Date(date);
        const isToday = dateObj.toDateString() === today.toDateString();
        const isTomorrow = dateObj.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
        
        return `
            <div class="calendar-date ${isToday ? 'today' : ''} ${isTomorrow ? 'tomorrow' : ''}">
                <div class="calendar-date-header">
                    <strong>${dateObj.toLocaleDateString()}</strong>
                    ${isToday ? '<span class="badge bg-primary">Today</span>' : ''}
                    ${isTomorrow ? '<span class="badge bg-info">Tomorrow</span>' : ''}
                </div>
                <div class="calendar-tasks">
                    ${tasks.map(task => {
                        const cluster = clusters.find(c => c.id === task.clusterId);
                        const taskObj = tasks.find(tk => tk.id === task.taskId);
                        const displayTaskName = taskObj ? taskObj.name : getTaskDisplayName(null, task.taskId);
                        const priorityClass = task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'secondary';
                        
                        return `
                            <div class="calendar-task">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>${displayTaskName}</strong>
                                        <span class="badge bg-${priorityClass}">${task.priority || 'normal'}</span>
                                        <br><small><i class="bi bi-geo-alt"></i> ${cluster?.name || 'Unknown'}</small>
                                        ${task.scheduledTime ? `<br><small><i class="bi bi-clock"></i> ${task.scheduledTime}</small>` : ''}
                                    </div>
                                    <button class="btn btn-sm btn-success" onclick="completeScheduledTask('${task.id}')">
                                        <i class="bi bi-check"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    calendarContainer.innerHTML = `
        <div class="calendar-widget">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6><i class="bi bi-calendar-week"></i> Upcoming Tasks (Next 7 Days)</h6>
                <button class="btn btn-sm btn-outline-primary" onclick="showScheduledTasks()">
                    <i class="bi bi-calendar3"></i> View All
                </button>
            </div>
            <div class="calendar-content">
                ${calendarHtml}
            </div>
        </div>
    `;
}

// Make dashboard cards clickable
function makeDashboardCardsClickable() {
    // Total Clusters card
    const clustersCard = document.getElementById('statClusters').closest('.card');
    if (clustersCard) {
        clustersCard.style.cursor = 'pointer';
        clustersCard.addEventListener('click', () => showClusters());
    }
    
    // Total Hives card
    const hivesCard = document.getElementById('statHives').closest('.card');
    if (hivesCard) {
        hivesCard.style.cursor = 'pointer';
        hivesCard.addEventListener('click', () => showClusters());
    }
    
    // Total Actions card
    const actionsCard = document.getElementById('statActions').closest('.card');
    if (actionsCard) {
        actionsCard.style.cursor = 'pointer';
        actionsCard.addEventListener('click', () => showActions());
    }
    
    // Flagged Issues card
    const flaggedCard = document.getElementById('statFlagged').closest('.card');
    if (flaggedCard) {
        flaggedCard.style.cursor = 'pointer';
        flaggedCard.addEventListener('click', () => showFlagged());
    }
}

// Make recent actions clickable
function makeRecentActionsClickable() {
    const actionItems = document.querySelectorAll('.action-item');
    actionItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const actionText = this.querySelector('strong').textContent;
            const clusterName = actionText.split(' - ')[1];
            const cluster = clusters.find(c => c.name === clusterName);
            if (cluster) {
                viewClusterDetails(cluster.id);
            }
        });
    });
}

// Sync status functions
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

function handleOnline() {
    isOnline = true;
    showSyncStatus('<i class="bi bi-wifi"></i> Back online', 'success');
    processSyncQueue();
}

function handleOffline() {
    isOnline = false;
    showSyncStatus('<i class="bi bi-wifi-off"></i> Offline mode', 'warning');
}

function loadSyncQueue() {
    const saved = localStorage.getItem('syncQueue');
    if (saved) {
        syncQueue = JSON.parse(saved);
    }
}

function saveSyncQueue() {
    localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
}

function addToSyncQueue(operation) {
    syncQueue.push(operation);
    saveSyncQueue();
}

function processSyncQueue() {
    if (syncInProgress || syncQueue.length === 0) return;
    
    syncInProgress = true;
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Syncing...', 'syncing');
    
    const operation = syncQueue.shift();
    saveSyncQueue();
    
    // Process the operation
    database.ref(operation.path).set(operation.data)
        .then(() => {
            showSyncStatus('<i class="bi bi-check"></i> Synced', 'success');
            syncInProgress = false;
            if (syncQueue.length > 0) {
                setTimeout(processSyncQueue, 1000);
            }
        })
        .catch(error => {
            console.error('Sync error:', error);
            showSyncStatus('<i class="bi bi-x"></i> Sync failed', 'error');
            syncInProgress = false;
        });
}

function updateSyncStatus() {
    const status = isOnline ? 'Online' : 'Offline';
    const icon = isOnline ? 'bi-wifi' : 'bi-wifi-off';
    const color = isOnline ? 'text-success' : 'text-warning';
    
    const syncStatus = document.getElementById('syncStatus');
    if (syncStatus) {
        syncStatus.innerHTML = `<i class="bi ${icon} ${color}"></i> ${status}`;
    }
}
