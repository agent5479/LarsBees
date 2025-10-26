// BeeMarshall - Navigation Module

function hideAllViews() {
    // List of all view containers
    const viewIds = [
        'dashboardView', 
        'clustersView', 
        'clusterFormView', 
        'actionsView', 
        'logActionView', 
        'scheduledView', 
        'calendarView',
        'scheduleForNextVisitView', 
        'flaggedView', 
        'employeesView', 
        'manageTasksView',
        'tasksView',
        'seasonalRequirementsView', 
        'suggestedScheduleView',
        'complianceView'
    ];
    
    // Hide all views with forced reflow
    viewIds.forEach(id => {
        const view = document.getElementById(id);
        if (view) {
            view.classList.add('hidden');
            // Force browser reflow to ensure the hidden class is applied
            void view.offsetHeight;
        }
    });
    
    console.log('🔄 All views hidden');
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
    renderClusterTypeFilter();
}

function showActions() {
    hideAllViews();
    document.getElementById('actionsView').classList.remove('hidden');
    populateActionFilters();
    renderActions();
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
    renderScheduleTimeline();
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

function showManageTasks() {
    if (!isAdmin) {
        alert('Only administrators can manage tasks.');
        return;
    }
    hideAllViews();
    document.getElementById('manageTasksView').classList.remove('hidden');
    renderTasksList();
}

function showSeasonalRequirements() {
    if (!isAdmin) {
        alert('Only administrators can manage seasonal requirements.');
        return;
    }
    hideAllViews();
    document.getElementById('seasonalRequirementsView').classList.remove('hidden');
    populateClusterCheckboxes();
    renderSeasonalRequirements();
    renderComplianceStatus();
}

function showSuggestedSchedule() {
    hideAllViews();
    document.getElementById('suggestedScheduleView').classList.remove('hidden');
    renderSuggestedSchedule();
}

function showReports() {
    // Open reports in new tab
    window.open('reports.html', '_blank');
}


