// BeeMarshall - Task Management Module

// Note: COMPREHENSIVE_TASKS is defined in core.js
// This module uses the global COMPREHENSIVE_TASKS variable

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

// Make renderTasksList globally accessible
window.renderTasksList = function(filterCategory = 'All') {
    // Use the comprehensive tasks list directly
    const tasksToUse = typeof tasks !== 'undefined' ? tasks : COMPREHENSIVE_TASKS;
    
    // Filter tasks by category if specified
    let filteredTasks = tasksToUse;
    if (filterCategory !== 'All') {
        filteredTasks = tasksToUse.filter(task => task.category === filterCategory);
    }
    
    // Group tasks by category
    const tasksByCategory = {};
    filteredTasks.forEach(task => {
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
};

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
    const tasksToUse = typeof tasks !== 'undefined' ? tasks : COMPREHENSIVE_TASKS;
    const task = tasksToUse.find(t => t.id === taskId);
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
    const tasksToUse = typeof tasks !== 'undefined' ? tasks : COMPREHENSIVE_TASKS;
    const task = tasksToUse.find(t => t.id === taskId);
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

// Additional task management functions
function showAddTaskForm() {
    const taskName = prompt('Enter the name of the new task:');
    if (taskName && taskName.trim()) {
        const newTask = {
            id: Date.now(),
            name: taskName.trim(),
            category: 'Custom',
            common: false,
            createdAt: new Date().toISOString(),
            createdBy: currentUser.username
        };
        
        // Use the global tasks array if available, otherwise use COMPREHENSIVE_TASKS
        const tasksToUse = typeof tasks !== 'undefined' ? tasks : COMPREHENSIVE_TASKS;
        tasksToUse.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasksToUse));
        renderTasksList();
        
        console.log('New task added:', newTask);
    }
}

function filterTasksByCategory(category) {
    renderTasksList(category);
}
