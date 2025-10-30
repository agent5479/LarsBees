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
    ['scheduledTasksList', 'scheduleTimeline'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.closest('.hidden') === null) {
            el.style.display = 'none';
        }
    });
    
    console.log('🔄 All views hidden');
}

function showDashboard() {
    console.log('🔄 Switching to Dashboard view...');
    hideAllViews();
    
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
        
        console.log('✅ Dashboard view displayed');
    }, 10);
}

function showSites() {
    console.log('🔄 Switching to Sites view...');
    hideAllViews();
    
    // Small delay to ensure all views are hidden before showing new view
    setTimeout(() => {
        const view = document.getElementById('sitesView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = ''; // Restore display to override hideAllViews display:none
        }
        
        if (typeof updateActiveNav === 'function') {
            updateActiveNav('Sites');
        }
        
        renderSites();
        renderSiteTypeFilter();
        
        console.log('✅ Sites view displayed');
    }, 10);
}

function showActions() {
    console.log('🔄 Switching to Actions view...');
    console.log('🔍 Data state when switching to Actions:', {
        actions: window.actions ? window.actions.length : 'undefined',
        sites: window.sites ? window.sites.length : 'undefined',
        tasks: window.tasks ? window.tasks.length : 'undefined'
    });
    hideAllViews();
    
    // Small delay to ensure all views are hidden before showing new view
    setTimeout(() => {
        const view = document.getElementById('actionsView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = ''; // Restore display to override hideAllViews display:none
        }
        
        if (typeof updateActiveNav === 'function') {
            updateActiveNav('Actions');
        }
        
        populateActionFilters();
        renderActions();
        
        console.log('✅ Actions view displayed');
    }, 10);
}

function showLogActionForm() {
    hideAllViews();
    
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
    }, 10);
}

function showScheduledTasks() {
    console.log('🔄 Switching to Schedule view...');
    console.log('📊 Current data state:', {
        scheduledTasks: scheduledTasks ? scheduledTasks.length : 'undefined',
        sites: sites ? sites.length : 'undefined',
        tasks: tasks ? tasks.length : 'undefined',
        individualHives: individualHives ? individualHives.length : 'undefined'
    });
    
    hideAllViews();
    
    // Small delay to ensure all views are hidden before showing new view
    setTimeout(() => {
        const view = document.getElementById('scheduledView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = ''; // Restore display to override hideAllViews display:none
        }
        
        if (typeof updateActiveNav === 'function') {
            updateActiveNav('Schedule');
        }
        
        console.log('📊 About to call renderScheduledTasks()');
        renderScheduledTasks();
        
        console.log('📊 About to call renderScheduleTimeline()');
        renderScheduleTimeline();
        
        console.log('✅ Schedule view displayed');
    }, 10);
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
    setTimeout(() => {
        const view = document.getElementById('employeesView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = ''; // Restore display to override hideAllViews display:none
        }
        if (typeof updateActiveNav === 'function') {
            updateActiveNav('Team');
        }
        renderEmployees();
    }, 50); // Ensure hideAllViews completes first
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


