// BeeMarshall - Enhanced Scheduling Module

// Enhanced scheduling with timeline view and task completion
function showScheduledTasks() {
    hideAllViews();
    document.getElementById('scheduledView').classList.remove('hidden');
    renderScheduledTasks();
    renderScheduleTimeline();
}

function renderScheduledTasks() {
    const pending = scheduledTasks.filter(t => !t.completed);
    const completed = scheduledTasks.filter(t => t.completed);
    
    // Add "Schedule New Task" button at the top
    const scheduleButton = `
        <div class="mb-4">
            <button class="btn btn-primary" onclick="showScheduleTaskModal()">
                <i class="bi bi-plus-circle"></i> Schedule New Task
            </button>
            <button class="btn btn-outline-secondary ms-2" onclick="showSuggestedSchedule()">
                <i class="bi bi-lightbulb"></i> Suggested Schedule
            </button>
        </div>
    `;
    
    const pendingHtml = pending.length > 0
        ? pending.map(t => {
            const cluster = clusters.find(c => c.id === t.clusterId);
            const hive = individualHives.find(h => h.id === t.individualHiveId);
            const task = tasks.find(tk => tk.id === t.taskId);
            const displayTaskName = task ? task.name : getTaskDisplayName(null, t.taskId);
            const priorityClass = t.priority === 'urgent' ? 'danger' : t.priority === 'high' ? 'warning' : 'secondary';
            const dueDate = new Date(t.dueDate);
            const isOverdue = dueDate < new Date() && !t.completed;
            
            return `
                <div class="card mb-3 scheduled-task ${isOverdue ? 'border-danger' : ''}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <h5 class="mb-2">
                                    ${displayTaskName}
                                    <span class="badge bg-${priorityClass}">${t.priority || 'normal'}</span>
                                    ${isOverdue ? '<span class="badge bg-danger">OVERDUE</span>' : ''}
                                </h5>
                                <p class="mb-1">
                                    <i class="bi bi-geo-alt"></i> ${cluster?.name || 'Unknown'}
                                    ${hive ? ` • <i class="bi bi-hexagon"></i> ${hive.hiveName}` : ''}
                                </p>
                                <p class="mb-1">
                                    <i class="bi bi-calendar"></i> Due: ${dueDate.toLocaleDateString()}
                                    ${t.scheduledTime ? ` • <i class="bi bi-clock"></i> ${t.scheduledTime}` : ''}
                                </p>
                                ${t.notes ? `<p class="mb-2"><small><strong>Notes:</strong> ${t.notes}</small></p>` : ''}
                                <div class="d-flex gap-2">
                                    <button class="btn btn-success btn-sm" onclick="completeScheduledTask('${t.id}')">
                                        <i class="bi bi-check-circle"></i> Complete
                                    </button>
                                    <button class="btn btn-outline-primary btn-sm" onclick="editScheduledTask('${t.id}')">
                                        <i class="bi bi-pencil"></i> Edit
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm" onclick="cancelScheduledTask('${t.id}')">
                                        <i class="bi bi-x-circle"></i> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('')
        : '<p class="text-muted">No pending scheduled tasks.</p>';
    
    const completedHtml = completed.length > 0
        ? `
            <div class="mt-4">
                <h6><i class="bi bi-check-circle-fill text-success"></i> Recently Completed</h6>
                <div class="accordion" id="completedTasksAccordion">
                    ${completed.slice(0, 10).map(t => {
                        const cluster = clusters.find(c => c.id === t.clusterId);
                        const hive = individualHives.find(h => h.id === t.individualHiveId);
                        const task = tasks.find(tk => tk.id === t.taskId);
                        const displayTaskName = task ? task.name : getTaskDisplayName(null, t.taskId);
                        const completedDate = new Date(t.completedAt);
                        
                        return `
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="heading${t.id}">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${t.id}">
                                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                                        ${displayTaskName} - ${cluster?.name || 'Unknown'}
                                        <span class="badge bg-success ms-2">Completed ${completedDate.toLocaleDateString()}</span>
                                    </button>
                                </h2>
                                <div id="collapse${t.id}" class="accordion-collapse collapse" data-bs-parent="#completedTasksAccordion">
                                    <div class="accordion-body">
                                        <p><strong>Cluster:</strong> ${cluster?.name || 'Unknown'}</p>
                                        ${hive ? `<p><strong>Hive:</strong> ${hive.hiveName}</p>` : ''}
                                        <p><strong>Completed by:</strong> ${t.completedBy || 'Unknown'}</p>
                                        <p><strong>Completed on:</strong> ${completedDate.toLocaleString()}</p>
                                        ${t.notes ? `<p><strong>Notes:</strong> ${t.notes}</p>` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `
        : '';
    
    document.getElementById('scheduledTasksList').innerHTML = scheduleButton + pendingHtml + completedHtml;
}

function renderScheduleTimeline() {
    const timelineContainer = document.getElementById('scheduleTimeline');
    if (!timelineContainer) return;
    
    // Get all scheduled tasks sorted by date
    const allTasks = [...scheduledTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    if (allTasks.length === 0) {
        timelineContainer.innerHTML = '<p class="text-muted">No scheduled tasks to display on timeline.</p>';
        return;
    }
    
    // Group tasks by date
    const tasksByDate = {};
    allTasks.forEach(task => {
        const date = new Date(task.dueDate).toDateString();
        if (!tasksByDate[date]) {
            tasksByDate[date] = [];
        }
        tasksByDate[date].push(task);
    });
    
    const timelineHtml = Object.keys(tasksByDate).map(date => {
        const tasks = tasksByDate[date];
        const dateObj = new Date(date);
        const isToday = dateObj.toDateString() === new Date().toDateString();
        const isPast = dateObj < new Date() && !isToday;
        
        return `
            <div class="timeline-date ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}">
                <h6 class="timeline-date-header">
                    <i class="bi bi-calendar-date"></i> ${dateObj.toLocaleDateString()}
                    ${isToday ? '<span class="badge bg-primary">Today</span>' : ''}
                </h6>
                <div class="timeline-tasks">
                    ${tasks.map(task => {
                        const cluster = clusters.find(c => c.id === task.clusterId);
                        const hive = individualHives.find(h => h.id === task.individualHiveId);
                        const taskObj = tasks.find(tk => tk.id === task.taskId);
                        const displayTaskName = taskObj ? taskObj.name : getTaskDisplayName(null, task.taskId);
                        const priorityClass = task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'secondary';
                        const isCompleted = task.completed;
                        
                        return `
                            <div class="timeline-task ${isCompleted ? 'completed' : ''}">
                                <div class="timeline-task-content">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>${displayTaskName}</strong>
                                            <span class="badge bg-${priorityClass}">${task.priority || 'normal'}</span>
                                            ${isCompleted ? '<span class="badge bg-success">Completed</span>' : ''}
                                        </div>
                                        <div class="timeline-task-actions">
                                            ${!isCompleted ? `
                                                <button class="btn btn-success btn-sm" onclick="completeScheduledTask('${task.id}')">
                                                    <i class="bi bi-check"></i>
                                                </button>
                                            ` : ''}
                                        </div>
                                    </div>
                                    <p class="mb-1">
                                        <i class="bi bi-geo-alt"></i> ${cluster?.name || 'Unknown'}
                                        ${hive ? ` • <i class="bi bi-hexagon"></i> ${hive.hiveName}` : ''}
                                    </p>
                                    ${task.scheduledTime ? `<p class="mb-1"><i class="bi bi-clock"></i> ${task.scheduledTime}</p>` : ''}
                                    ${task.notes ? `<p class="mb-0"><small>${task.notes}</small></p>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    timelineContainer.innerHTML = `
        <div class="timeline-container">
            <h5><i class="bi bi-timeline"></i> Schedule Timeline</h5>
            ${timelineHtml}
        </div>
    `;
}

function showScheduleTaskModal() {
    const clusterSelect = document.getElementById('scheduleCluster');
    clusterSelect.innerHTML = '<option value="">Select cluster...</option>' +
        clusters.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    const taskSelect = document.getElementById('scheduleTask');
    taskSelect.innerHTML = '<option value="">Select task...</option>' +
        tasks.map(t => `<option value="${t.id}">${t.category}: ${t.name}</option>`).join('');
    
    // Set default date to today
    document.getElementById('scheduleDueDate').valueAsDate = new Date();
    
    const modal = new bootstrap.Modal(document.getElementById('scheduleTaskModal'));
    modal.show();
}

function handleScheduleTask(e) {
    e.preventDefault();
    
    const clusterId = parseInt(document.getElementById('scheduleCluster').value);
    const taskId = parseInt(document.getElementById('scheduleTask').value);
    const dueDate = document.getElementById('scheduleDueDate').value;
    const scheduledTime = document.getElementById('scheduleTime').value;
    const priority = document.getElementById('schedulePriority').value;
    const notes = document.getElementById('scheduleNotes').value;
    const individualHiveId = document.getElementById('scheduleHive')?.value || null;
    
    if (!clusterId || !taskId) {
        alert('Please select both cluster and task.');
        return;
    }
    
    const task = {
        id: Date.now().toString(),
        clusterId: clusterId,
        individualHiveId: individualHiveId,
        taskId: taskId,
        dueDate: dueDate,
        scheduledTime: scheduledTime,
        priority: priority,
        notes: notes,
        completed: false,
        createdBy: currentUser.username,
        createdAt: new Date().toISOString()
    };
    
    database.ref(`scheduledTasks/${task.id}`).set(task)
        .then(() => {
            alert('✅ Task scheduled successfully!');
            bootstrap.Modal.getInstance(document.getElementById('scheduleTaskModal')).hide();
            document.getElementById('scheduleTaskForm').reset();
            renderScheduledTasks();
            renderScheduleTimeline();
        });
}

function completeScheduledTask(id) {
    const task = scheduledTasks.find(t => t.id === id);
    if (!task) return;
    
    // Convert scheduled task to completed action
    const action = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        clusterId: task.clusterId,
        individualHiveId: task.individualHiveId,
        taskId: task.taskId,
        taskName: getTaskDisplayName(null, task.taskId),
        taskCategory: tasks.find(t => t.id === task.taskId)?.category || 'Task',
        date: new Date().toISOString().split('T')[0],
        notes: task.notes || '',
        flag: '',
        loggedBy: currentUser.username,
        createdAt: new Date().toISOString(),
        fromScheduledTask: true,
        originalScheduledTaskId: id
    };
    
    // Save the action
    database.ref(`actions/${action.id}`).set(action)
        .then(() => {
            // Mark scheduled task as completed
            return database.ref(`scheduledTasks/${id}`).update({
                completed: true,
                completedBy: currentUser.username,
                completedAt: new Date().toISOString()
            });
        })
        .then(() => {
            alert('✅ Task completed and logged as action!');
            renderScheduledTasks();
            renderScheduleTimeline();
        });
}

function editScheduledTask(id) {
    const task = scheduledTasks.find(t => t.id === id);
    if (!task) return;
    
    // Pre-fill the schedule form with existing data
    document.getElementById('scheduleCluster').value = task.clusterId;
    document.getElementById('scheduleTask').value = task.taskId;
    document.getElementById('scheduleDueDate').value = task.dueDate;
    document.getElementById('scheduleTime').value = task.scheduledTime || '';
    document.getElementById('schedulePriority').value = task.priority || 'normal';
    document.getElementById('scheduleNotes').value = task.notes || '';
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('scheduleTaskModal'));
    modal.show();
    
    // Update the form to save changes instead of creating new
    document.getElementById('scheduleTaskForm').onsubmit = function(e) {
        e.preventDefault();
        updateScheduledTask(id);
    };
}

function updateScheduledTask(id) {
    const clusterId = parseInt(document.getElementById('scheduleCluster').value);
    const taskId = parseInt(document.getElementById('scheduleTask').value);
    const dueDate = document.getElementById('scheduleDueDate').value;
    const scheduledTime = document.getElementById('scheduleTime').value;
    const priority = document.getElementById('schedulePriority').value;
    const notes = document.getElementById('scheduleNotes').value;
    
    const updates = {
        clusterId: clusterId,
        taskId: taskId,
        dueDate: dueDate,
        scheduledTime: scheduledTime,
        priority: priority,
        notes: notes,
        lastModifiedBy: currentUser.username,
        lastModifiedAt: new Date().toISOString()
    };
    
    database.ref(`scheduledTasks/${id}`).update(updates)
        .then(() => {
            alert('✅ Task updated successfully!');
            bootstrap.Modal.getInstance(document.getElementById('scheduleTaskModal')).hide();
            document.getElementById('scheduleTaskForm').reset();
            renderScheduledTasks();
            renderScheduleTimeline();
        });
}

function cancelScheduledTask(id) {
    if (confirm('Cancel this scheduled task? This cannot be undone.')) {
        database.ref(`scheduledTasks/${id}`).remove()
            .then(() => {
                alert('✅ Task cancelled.');
                renderScheduledTasks();
                renderScheduleTimeline();
            });
    }
}

// Suggested Schedule based on geographical and seasonal processes
function showSuggestedSchedule() {
    hideAllViews();
    document.getElementById('suggestedScheduleView').classList.remove('hidden');
    renderSuggestedSchedule();
}

function renderSuggestedSchedule() {
    const suggestions = generateSeasonalSuggestions();
    
    const html = suggestions.map(suggestion => `
        <div class="card mb-3 suggested-task">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h5 class="mb-2">
                            ${suggestion.taskName}
                            <span class="badge bg-info">${suggestion.season}</span>
                            <span class="badge bg-secondary">${suggestion.category}</span>
                        </h5>
                        <p class="mb-2">${suggestion.description}</p>
                        <p class="mb-1">
                            <strong>Recommended for:</strong> ${suggestion.recommendedClusters.join(', ')}
                        </p>
                        <p class="mb-1">
                            <strong>Suggested timing:</strong> ${suggestion.timing}
                        </p>
                        <p class="mb-2">
                            <strong>Priority:</strong> 
                            <span class="badge bg-${suggestion.priority === 'high' ? 'danger' : suggestion.priority === 'medium' ? 'warning' : 'secondary'}">
                                ${suggestion.priority}
                            </span>
                        </p>
                    </div>
                    <div class="suggested-task-actions">
                        <button class="btn btn-primary" onclick="scheduleFromSuggestion('${suggestion.id}')">
                            <i class="bi bi-calendar-plus"></i> Schedule
                        </button>
                        <button class="btn btn-outline-secondary" onclick="editSuggestion('${suggestion.id}')">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('suggestedTasksList').innerHTML = html || '<p class="text-muted">No seasonal suggestions available.</p>';
}

function generateSeasonalSuggestions() {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const suggestions = [];
    
    // Spring suggestions (Sep-Nov in NZ)
    if (currentMonth >= 9 || currentMonth <= 11) {
        suggestions.push({
            id: 'spring_inspection',
            taskName: 'Spring Hive Inspection',
            description: 'Comprehensive inspection after winter to assess colony health and prepare for spring buildup.',
            season: 'Spring',
            category: 'Inspection',
            priority: 'high',
            timing: 'Early spring (September)',
            recommendedClusters: clusters.map(c => c.name),
            taskId: 101 // General Hive Inspection
        });
        
        suggestions.push({
            id: 'spring_feeding',
            taskName: 'Spring Sugar Syrup Feeding',
            description: '1:1 sugar syrup to stimulate brood rearing and colony buildup.',
            season: 'Spring',
            category: 'Feeding',
            priority: 'high',
            timing: 'Early to mid-spring',
            recommendedClusters: clusters.map(c => c.name),
            taskId: 201 // Sugar Syrup 1:1
        });
    }
    
    // Summer suggestions (Dec-Feb in NZ)
    if (currentMonth >= 12 || currentMonth <= 2) {
        suggestions.push({
            id: 'summer_ventilation',
            taskName: 'Summer Ventilation Setup',
            description: 'Ensure adequate ventilation to prevent overheating during hot summer months.',
            season: 'Summer',
            category: 'Maintenance',
            priority: 'medium',
            timing: 'Mid-summer',
            recommendedClusters: clusters.map(c => c.name),
            taskId: 602 // Summer Ventilation Setup
        });
        
        suggestions.push({
            id: 'honey_harvest',
            taskName: 'Honey Harvest',
            description: 'Harvest honey when supers are full and capped.',
            season: 'Summer',
            category: 'Harvest',
            priority: 'high',
            timing: 'Late summer/early autumn',
            recommendedClusters: clusters.filter(c => c.harvestTimeline).map(c => c.name),
            taskId: 401 // Honey Harvest
        });
    }
    
    // Autumn suggestions (Mar-May in NZ)
    if (currentMonth >= 3 && currentMonth <= 5) {
        suggestions.push({
            id: 'fall_winterization',
            taskName: 'Fall Winterization',
            description: 'Prepare hives for winter with adequate food stores and protection.',
            season: 'Autumn',
            category: 'Seasonal',
            priority: 'high',
            timing: 'Late autumn',
            recommendedClusters: clusters.map(c => c.name),
            taskId: 603 // Fall Winterization
        });
        
        suggestions.push({
            id: 'varroa_treatment',
            taskName: 'Varroa Treatment',
            description: 'Treat for varroa mites before winter to ensure healthy overwintering.',
            season: 'Autumn',
            category: 'Treatment',
            priority: 'high',
            timing: 'Late autumn',
            recommendedClusters: clusters.map(c => c.name),
            taskId: 301 // Varroa Treatment - Formic Acid
        });
    }
    
    // Winter suggestions (Jun-Aug in NZ)
    if (currentMonth >= 6 && currentMonth <= 8) {
        suggestions.push({
            id: 'winter_insulation',
            taskName: 'Winter Insulation Check',
            description: 'Ensure hives are properly insulated and protected from winter weather.',
            season: 'Winter',
            category: 'Maintenance',
            priority: 'medium',
            timing: 'Mid-winter',
            recommendedClusters: clusters.map(c => c.name),
            taskId: 604 // Winter Insulation
        });
    }
    
    return suggestions;
}

function scheduleFromSuggestion(suggestionId) {
    const suggestion = generateSeasonalSuggestions().find(s => s.id === suggestionId);
    if (!suggestion) return;
    
    // Pre-fill the schedule form
    document.getElementById('scheduleTask').value = suggestion.taskId;
    document.getElementById('schedulePriority').value = suggestion.priority;
    document.getElementById('scheduleNotes').value = `Scheduled from seasonal suggestion: ${suggestion.description}`;
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('scheduleTaskModal'));
    modal.show();
}

function editSuggestion(suggestionId) {
    // For now, just show the suggestion details
    const suggestion = generateSeasonalSuggestions().find(s => s.id === suggestionId);
    if (suggestion) {
        alert(`Edit suggestion: ${suggestion.taskName}\n\nThis feature will allow customizing seasonal suggestions in future updates.`);
    }
}

// Schedule for Next Visit functionality
function showScheduleForNextVisit() {
    hideAllViews();
    document.getElementById('scheduleForNextVisitView').classList.remove('hidden');
    populateNextVisitForm();
}

function populateNextVisitForm() {
    const clusterSelect = document.getElementById('nextVisitCluster');
    clusterSelect.innerHTML = '<option value="">Choose cluster...</option>' +
        clusters.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('nextVisitDate').valueAsDate = tomorrow;
    
    // Populate tasks
    populateNextVisitTasks();
    
    // Add form submit event listener
    document.getElementById('nextVisitForm').addEventListener('submit', handleNextVisitForm);
}

function populateNextVisitTasks() {
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
                    <input class="form-check-input next-visit-task-checkbox" type="checkbox" value="${task.id}" id="nextVisitTask${task.id}">
                    <label class="form-check-label" for="nextVisitTask${task.id}">
                        ${task.name}
                        ${task.common ? '<span class="badge bg-success badge-sm">★</span>' : ''}
                    </label>
                </div>
            `).join('')}
        </div>
    `).join('');
    
    document.getElementById('nextVisitTaskCheckboxes').innerHTML = `<div class="row">${html}</div>`;
    filterNextVisitTasks('common');
}

function filterNextVisitTasks(filter) {
    document.querySelectorAll('#nextVisitTaskCheckboxes .task-checkbox-item').forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.common === 'true') ? '' : 'none';
    });
}

function handleNextVisitForm(e) {
    e.preventDefault();
    
    const clusterId = parseInt(document.getElementById('nextVisitCluster').value);
    const date = document.getElementById('nextVisitDate').value;
    const time = document.getElementById('nextVisitTime').value;
    const priority = document.getElementById('nextVisitPriority').value;
    const notes = document.getElementById('nextVisitNotes').value;
    
    if (!clusterId) {
        alert('Please select a cluster.');
        return;
    }
    
    const selectedTasks = Array.from(document.querySelectorAll('.next-visit-task-checkbox:checked'))
        .map(cb => parseInt(cb.value));
    
    if (selectedTasks.length === 0) {
        alert('Please select at least one task to schedule for next visit.');
        return;
    }
    
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Scheduling tasks for next visit...', 'syncing');
    
    const promises = selectedTasks.map(taskId => {
        const task = tasks.find(t => t.id === taskId);
        const scheduledTask = {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            clusterId: clusterId,
            taskId: taskId,
            dueDate: date,
            scheduledTime: time,
            priority: priority,
            notes: notes,
            completed: false,
            createdBy: currentUser.username,
            createdAt: new Date().toISOString(),
            type: 'next-visit'
        };
        return database.ref(`scheduledTasks/${scheduledTask.id}`).set(scheduledTask);
    });
    
    Promise.all(promises).then(() => {
        showSyncStatus(`<i class="bi bi-check"></i> ${selectedTasks.length} task(s) scheduled for next visit by ${currentUser.username}`);
        document.getElementById('nextVisitForm').reset();
        
        // Set default date to tomorrow again
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('nextVisitDate').valueAsDate = tomorrow;
        
        // Go back to scheduled tasks view
        showScheduledTasks();
    });
}
