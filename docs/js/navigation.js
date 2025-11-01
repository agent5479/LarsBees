// BeeMarshall - Navigation Module

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
    console.log('🔄 Switching to Dashboard view...');
    hideAllViews();
    
    // Scroll to top immediately to prevent blank space gap
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Small delay to ensure all views are hidden before showing new view
    setTimeout(() => {
        const view = document.getElementById('dashboardView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = ''; // Restore display to override hideAllViews display:none
        }
        
        if (typeof updateActiveNav === 'function') {
            updateActiveNav('dashboard');
        }
        
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
        
        // Ensure scroll position after DOM update
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        console.log('✅ Dashboard view displayed');
    }, 10);
}

function showSites() {
    hideAllViews();
    window.scrollTo(0, 0);
    
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
    window.scrollTo(0, 0);
    
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
    
    // Scroll to top immediately to prevent blank space gap
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Small delay to ensure all views are hidden before showing new view
    setTimeout(() => {
        const view = document.getElementById('logActionView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = ''; // Restore display to override hideAllViews display:none
        }
        
        if (typeof populateActionForm === 'function') {
            populateActionForm();
        }
        
        // Ensure scroll position after DOM update
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, 10);
}

function showScheduledTasks() {
    hideAllViews();
    window.scrollTo(0, 0);
    
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
    }, 50);
}

function showFlagged() {
    hideAllViews();
    setTimeout(() => {
        const view = document.getElementById('flaggedView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = ''; // Restore display to override hideAllViews display:none
        }
        renderFlaggedItems();
    }, 50); // Ensure hideAllViews completes first
}

function showEmployees() {
    if (!isAdmin) {
        alert('Only Lars (admin) can access employee management!');
        return;
    }
    hideAllViews();
    window.scrollTo(0, 0);
    
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
    }, 50);
}

function showManageTasks() {
    if (!isAdmin) {
        alert('Only administrators can manage tasks.');
        return;
    }
    hideAllViews();
    setTimeout(() => {
        const view = document.getElementById('manageTasksView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = ''; // Restore display to override hideAllViews display:none
        }
        renderTasksList();
    }, 50);
}

function showSeasonalRequirements() {
    if (!isAdmin) {
        alert('Only administrators can manage seasonal requirements.');
        return;
    }
    hideAllViews();
    setTimeout(() => {
        const view = document.getElementById('seasonalRequirementsView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = ''; // Restore display to override hideAllViews display:none
        }
        populateSiteCheckboxes();
        renderSeasonalRequirements();
        renderComplianceStatus();
    }, 50);
}

function showSuggestedSchedule() {
    hideAllViews();
    setTimeout(() => {
        const view = document.getElementById('suggestedScheduleView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = ''; // Restore display to override hideAllViews display:none
        }
        renderSuggestedSchedule();
    }, 50);
}

function showReports() {
    // Open reports in new tab
    window.open('reports.html', '_blank');
}


