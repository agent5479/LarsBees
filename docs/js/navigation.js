// BeeMarshall - Navigation Module

// Universal minimal scroll-to-top function
function scrollToTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

function hideAllViews() {
    // List of all view containers
    const viewIds = [
        'dashboardView', 
        'sitesView', 
        'siteFormView', 
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
        'complianceView',
        'integrityCheckView'
    ];
    
    // Hide all views with forced reflow and display:none to prevent carryover
    viewIds.forEach(id => {
        const view = document.getElementById(id);
        if (view) {
            view.classList.add('hidden');
            view.style.display = 'none'; // Double-hide to prevent carryover
            // Force browser reflow to ensure the hidden class is applied
            void view.offsetHeight;
        }
    });
    
    // Also hide any lingering scheduled/timeline panels that might be orphaned
    // Always hide these explicitly, regardless of parent state
    ['scheduledTasksList', 'scheduleTimeline'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            // Also add hidden class for extra safety
            el.classList.add('hidden');
        }
    });
    
    console.log('🔄 All views hidden');
}

function showDashboard() {
    hideAllViews();
    scrollToTop();
    setTimeout(() => {
        const view = document.getElementById('dashboardView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = '';
        }
        if (typeof updateActiveNav === 'function') {
            updateActiveNav('dashboard');
        }
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
    }, 10);
}

function showSites() {
    hideAllViews();
    scrollToTop();
    setTimeout(() => {
        const view = document.getElementById('sitesView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = '';
        }
        updateActiveNav('Sites');
        renderSites();
        renderSiteTypeFilter();
    }, 10);
}

function showActions() {
    hideAllViews();
    scrollToTop();
    setTimeout(() => {
        const view = document.getElementById('actionsView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = '';
        }
        updateActiveNav('Actions');
        populateActionFilters();
        renderActions();
    }, 10);
}

function showLogActionForm() {
    hideAllViews();
    scrollToTop();
    setTimeout(() => {
        const view = document.getElementById('logActionView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = '';
        }
        if (typeof populateActionForm === 'function') {
            populateActionForm();
        }
    }, 10);
}

function showScheduledTasks() {
    hideAllViews();
    scrollToTop();
    setTimeout(() => {
        const view = document.getElementById('scheduledView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = '';
        }
        const tasksList = document.getElementById('scheduledTasksList');
        const timeline = document.getElementById('scheduleTimeline');
        if (tasksList) {
            tasksList.style.display = '';
            tasksList.classList.remove('hidden');
        }
        if (timeline) {
            timeline.style.display = '';
            timeline.classList.remove('hidden');
        }
        updateActiveNav('Schedule');
        renderScheduledTasks();
        renderScheduleTimeline();
    }, 10);
}

function showFlagged() {
    hideAllViews();
    scrollToTop();
    setTimeout(() => {
        const view = document.getElementById('flaggedView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = '';
        }
        renderFlaggedItems();
    }, 10);
}

function showEmployees() {
    if (!isAdmin) {
        alert('Only Lars (admin) can access employee management!');
        return;
    }
    hideAllViews();
    scrollToTop();
    setTimeout(() => {
        const view = document.getElementById('employeesView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = '';
        }
        const tasksList = document.getElementById('scheduledTasksList');
        const timeline = document.getElementById('scheduleTimeline');
        if (tasksList) {
            tasksList.style.display = 'none';
            tasksList.classList.add('hidden');
        }
        if (timeline) {
            timeline.style.display = 'none';
            timeline.classList.add('hidden');
        }
        updateActiveNav('Team');
        renderEmployees();
    }, 10);
}

function showManageTasks() {
    if (!isAdmin) {
        alert('Only administrators can manage tasks.');
        return;
    }
    hideAllViews();
    scrollToTop();
    setTimeout(() => {
        const view = document.getElementById('manageTasksView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = '';
        }
        renderTasksList();
    }, 10);
}

function showSeasonalRequirements() {
    if (!isAdmin) {
        alert('Only administrators can manage seasonal requirements.');
        return;
    }
    hideAllViews();
    scrollToTop();
    setTimeout(() => {
        const view = document.getElementById('seasonalRequirementsView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = '';
        }
        populateSiteCheckboxes();
        renderSeasonalRequirements();
        renderComplianceStatus();
    }, 10);
}

function showSuggestedSchedule() {
    hideAllViews();
    scrollToTop();
    setTimeout(() => {
        const view = document.getElementById('suggestedScheduleView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = '';
        }
        renderSuggestedSchedule();
    }, 10);
}

function showReports() {
    // Open reports in new tab
    window.open('reports.html', '_blank');
}


