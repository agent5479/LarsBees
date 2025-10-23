// BeeMarshall - Dashboard Module with Calendar Widget

function showDashboard() {
    hideAllViews();
    document.getElementById('dashboardView').classList.remove('hidden');
    updateDashboard();
}

function updateDashboard() {
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
    
    // Show flagged alert if any urgent actions or overdue tasks
    const urgentFlagged = actions.filter(a => a.flag === 'urgent');
    const overdueTasks = scheduledTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return !task.completed && taskDate < new Date();
    });
    
    if (urgentFlagged.length > 0 || overdueTasks.length > 0) {
        let flaggedHtml = '';
        
        // Add urgent actions
        if (urgentFlagged.length > 0) {
            flaggedHtml += urgentFlagged.slice(0, 3).map(a => {
                const cluster = clusters.find(c => c.id === a.clusterId);
                return `<div class="mb-2"><strong>${cluster?.name || 'Unknown'}:</strong> ${a.taskName} - ${a.notes}</div>`;
            }).join('');
        }
        
        // Add overdue tasks
        if (overdueTasks.length > 0) {
            flaggedHtml += overdueTasks.slice(0, 3).map(task => {
                const cluster = clusters.find(c => c.id === task.clusterId);
                const taskName = getTaskDisplayName(null, task.taskId);
                return `
                    <div class="mb-2">
                        <strong>OVERDUE: ${taskName}</strong> - ${cluster?.name || 'Unknown'}
                        <br><small>Due: ${new Date(task.dueDate).toLocaleDateString()}</small>
                        <br><button class="btn btn-sm btn-outline-warning mt-1" onclick="rescheduleOverdueTask('${task.id}')">
                            <i class="bi bi-calendar-plus"></i> Reschedule
                        </button>
                    </div>
                `;
            }).join('');
        }
        
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
    
    // Get all future scheduled tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const futureTasks = scheduledTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return !task.completed && taskDate >= today;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    if (futureTasks.length === 0) {
        calendarContainer.innerHTML = `
            <div class="calendar-widget">
                <h6><i class="bi bi-calendar-week"></i> Upcoming Tasks</h6>
                <p class="text-muted">No tasks scheduled for the future.</p>
                <button class="btn btn-sm btn-primary mt-2" onclick="showScheduleTaskModal()">
                    <i class="bi bi-plus"></i> Schedule Task
                </button>
            </div>
        `;
        return;
    }
    
    // Group tasks by date
    const tasksByDate = {};
    futureTasks.forEach(task => {
        const date = new Date(task.dueDate).toDateString();
        if (!tasksByDate[date]) {
            tasksByDate[date] = [];
        }
        tasksByDate[date].push(task);
    });
    
    // Get next 14 days or all future tasks, whichever is smaller
    const datesToShow = Object.keys(tasksByDate).slice(0, 14);
    
    const calendarHtml = datesToShow.map(date => {
        const tasks = tasksByDate[date];
        const dateObj = new Date(date);
        const isToday = dateObj.toDateString() === today.toDateString();
        const isTomorrow = dateObj.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
        const isThisWeek = dateObj <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return `
            <div class="calendar-date ${isToday ? 'today' : ''} ${isTomorrow ? 'tomorrow' : ''} ${isThisWeek ? 'this-week' : ''}">
                <div class="calendar-date-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <strong>${dateObj.toLocaleDateString()}</strong>
                        <div class="date-badges">
                            ${isToday ? '<span class="badge bg-primary">Today</span>' : ''}
                            ${isTomorrow ? '<span class="badge bg-info">Tomorrow</span>' : ''}
                            ${!isToday && !isTomorrow && isThisWeek ? '<span class="badge bg-secondary">This Week</span>' : ''}
                        </div>
                    </div>
                    <small class="text-muted">${tasks.length} task${tasks.length !== 1 ? 's' : ''}</small>
                </div>
                <div class="calendar-tasks">
                    ${tasks.map(task => {
                        const cluster = clusters.find(c => c.id === task.clusterId);
                        const taskObj = tasks.find(tk => tk.id === task.taskId);
                        const displayTaskName = taskObj ? taskObj.name : getTaskDisplayName(null, task.taskId);
                        const priorityClass = task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'secondary';
                        const isOverdue = new Date(task.dueDate) < today;
                        
                        return `
                            <div class="calendar-task ${isOverdue ? 'overdue' : ''}" onclick="viewScheduledTask('${task.id}')">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div class="flex-grow-1">
                                        <div class="task-header">
                                            <strong class="task-name">${displayTaskName}</strong>
                                            <span class="badge bg-${priorityClass}">${task.priority || 'normal'}</span>
                                            ${isOverdue ? '<span class="badge bg-danger">Overdue</span>' : ''}
                                        </div>
                                        <div class="task-details">
                                            <small><i class="bi bi-geo-alt"></i> ${cluster?.name || 'Unknown'}</small>
                                            ${task.scheduledTime ? `<br><small><i class="bi bi-clock"></i> ${task.scheduledTime}</small>` : ''}
                                            ${task.type === 'next-visit' ? '<br><small><i class="bi bi-calendar-plus"></i> Next Visit</small>' : ''}
                                        </div>
                                    </div>
                                    <div class="task-actions">
                                        <button class="btn btn-sm btn-success" onclick="event.stopPropagation(); completeScheduledTask('${task.id}')" title="Complete Task">
                                            <i class="bi bi-check"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    // Add summary information
    const totalTasks = futureTasks.length;
    const overdueTasks = futureTasks.filter(task => new Date(task.dueDate) < today).length;
    const thisWeekTasks = futureTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    }).length;
    
    calendarContainer.innerHTML = `
        <div class="calendar-widget">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6><i class="bi bi-calendar-week"></i> Upcoming Tasks</h6>
                <button class="btn btn-sm btn-outline-primary" onclick="showScheduledTasks()">
                    <i class="bi bi-calendar3"></i> View All
                </button>
            </div>
            
            <div class="calendar-summary mb-3">
                <div class="row text-center">
                    <div class="col-4">
                        <div class="summary-item">
                            <strong class="text-primary">${totalTasks}</strong>
                            <br><small>Total</small>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="summary-item">
                            <strong class="text-info">${thisWeekTasks}</strong>
                            <br><small>This Week</small>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="summary-item">
                            <strong class="text-danger">${overdueTasks}</strong>
                            <br><small>Overdue</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="calendar-content">
                ${calendarHtml}
            </div>
            
            ${futureTasks.length > 14 ? `
                <div class="text-center mt-3">
                    <small class="text-muted">Showing next 14 days. <a href="#" onclick="showScheduledTasks()">View all ${futureTasks.length} tasks</a></small>
                </div>
            ` : ''}
        </div>
    `;
}

function viewScheduledTask(taskId) {
    // Find the task and show its details
    const task = scheduledTasks.find(t => t.id === taskId);
    if (task) {
        // You can implement a modal or redirect to the scheduled tasks view
        showScheduledTasks();
    }
}

function updateQuickStats() {
    const today = new Date();
    const thisWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Calculate this week's tasks
    const thisWeekTasks = scheduledTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return !task.completed && taskDate >= today && taskDate <= thisWeek;
    }).length;
    
    // Calculate completed tasks
    const completedTasks = scheduledTasks.filter(task => task.completed).length;
    
    // Calculate pending tasks
    const pendingTasks = scheduledTasks.filter(task => !task.completed).length;
    
    // Calculate overdue tasks
    const overdueTasks = scheduledTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return !task.completed && taskDate < today;
    }).length;
    
    // Update quick stats
    const statThisWeek = document.getElementById('statThisWeek');
    const statCompleted = document.getElementById('statCompleted');
    const statPending = document.getElementById('statPending');
    const statOverdue = document.getElementById('statOverdue');
    
    if (statThisWeek) animateNumber(statThisWeek, thisWeekTasks);
    if (statCompleted) animateNumber(statCompleted, completedTasks);
    if (statPending) animateNumber(statPending, pendingTasks);
    if (statOverdue) animateNumber(statOverdue, overdueTasks);
}

// Check for overdue tasks and automatically flag them as urgent
function checkAndFlagOverdueTasks() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let hasUpdates = false;
    
    scheduledTasks.forEach(task => {
        if (!task.completed) {
            const taskDate = new Date(task.dueDate);
            taskDate.setHours(0, 0, 0, 0);
            
            // If task is overdue and not already urgent, mark as urgent
            if (taskDate < today && task.priority !== 'urgent') {
                task.priority = 'urgent';
                task.overdue = true;
                task.overdueDate = new Date().toISOString();
                hasUpdates = true;
                
                console.log(`Task "${task.taskId}" is overdue and marked as urgent`);
            }
        }
    });
    
    // Save updates to Firebase if any changes were made
    if (hasUpdates) {
        saveScheduledTasks();
    }
}

// Enhanced dashboard cards interactivity
function makeDashboardCardsClickable() {
    // Enhanced click handlers with visual feedback
    const cards = document.querySelectorAll('.dashboard-stat-card');
    
    cards.forEach(card => {
        // Add click animation
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'translateY(-8px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Navigate to appropriate section
            const target = this.dataset.target;
            switch(target) {
                case 'clusters':
                    setTimeout(() => showClusters(), 200);
                    break;
                case 'actions':
                    setTimeout(() => showActions(), 200);
                    break;
                case 'flagged':
                    setTimeout(() => showFlagged(), 200);
                    break;
                default:
                    setTimeout(() => showClusters(), 200);
            }
        });
        
        // Add keyboard accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make cards focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Navigate to ${card.dataset.target} section`);
        
        // Add tooltip functionality
        card.addEventListener('mouseenter', function() {
            const target = this.dataset.target;
            let tooltipText = '';
            switch(target) {
                case 'clusters':
                    tooltipText = `View and manage all ${clusters.length} hive clusters`;
                    break;
                case 'actions':
                    tooltipText = `View and manage all ${actions.length} logged actions`;
                    break;
                case 'flagged':
                    tooltipText = `View ${flaggedCount} flagged issues requiring attention`;
                    break;
                default:
                    tooltipText = 'Click to navigate to this section';
            }
            this.setAttribute('title', tooltipText);
        });
    });
}

// Add number animation effect
function animateNumber(element, targetValue, duration = 1000) {
    const startValue = parseInt(element.textContent) || 0;
    const increment = (targetValue - startValue) / (duration / 16);
    let currentValue = startValue;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if ((increment > 0 && currentValue >= targetValue) || 
            (increment < 0 && currentValue <= targetValue)) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue);
    }, 16);
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
