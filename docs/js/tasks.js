// BeeMarshall - Task Management Module

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

// Task Management Functions
function showTasks() {
    if (!isAdmin) {
        alert('Only administrators can manage tasks.');
        return;
    }
    hideAllViews();
    document.getElementById('tasksView').classList.remove('hidden');
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
