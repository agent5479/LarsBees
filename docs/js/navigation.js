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
    console.log('🔄 Switching to Sites view...');
    hideAllViews();
    
    // Scroll to top immediately to prevent blank space gap
    window.scrollTo({ top: 0, behavior: 'instant' });
    
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
        
        // Ensure scroll position after DOM update
        window.scrollTo({ top: 0, behavior: 'instant' });
        
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
    
    // Scroll to top immediately - multiple methods for compatibility
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Small delay to ensure all views are hidden before showing new view
    setTimeout(() => {
        const view = document.getElementById('actionsView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = ''; // Restore display to override hideAllViews display:none
            
            // Scroll to the view element itself to ensure proper positioning
            view.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
        
        if (typeof updateActiveNav === 'function') {
            updateActiveNav('Actions');
        }
        
        populateActionFilters();
        renderActions();
        
        // Force scroll to view position after DOM updates
        requestAnimationFrame(() => {
            const view = document.getElementById('actionsView');
            if (view) {
                view.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        });
        
        console.log('✅ Actions view displayed');
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
    console.log('🔄 Switching to Schedule view...');
    console.log('📊 Current data state:', {
        scheduledTasks: scheduledTasks ? scheduledTasks.length : 'undefined',
        sites: sites ? sites.length : 'undefined',
        tasks: tasks ? tasks.length : 'undefined',
        individualHives: individualHives ? individualHives.length : 'undefined'
    });
    
    hideAllViews();
    
    // Scroll to top immediately to prevent blank space gap
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Small delay to ensure all views are hidden before showing new view
    setTimeout(() => {
        const view = document.getElementById('scheduledView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = ''; // Restore display to override hideAllViews display:none
            
            // Scroll to the view element itself to ensure proper positioning
            view.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
        
        // Restore scheduled child elements
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
        
        if (typeof updateActiveNav === 'function') {
            updateActiveNav('Schedule');
        }
        
        console.log('📊 About to call renderScheduledTasks()');
        renderScheduledTasks();
        
        console.log('📊 About to call renderScheduleTimeline()');
        renderScheduleTimeline();
        
        // Force scroll to view position after DOM updates
        requestAnimationFrame(() => {
            const view = document.getElementById('scheduledView');
            if (view) {
                view.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        });
        
        console.log('✅ Schedule view displayed');
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
    
    // Scroll to top immediately - multiple methods for compatibility
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    setTimeout(() => {
        const view = document.getElementById('employeesView');
        if (view) {
            view.classList.remove('hidden');
            view.style.display = ''; // Restore display to override hideAllViews display:none
            
            // Scroll to the view element itself to ensure proper positioning
            view.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
        
        // Ensure scheduled panels are fully hidden
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
        
        if (typeof updateActiveNav === 'function') {
            updateActiveNav('Team');
        }
        renderEmployees();
        
        // Force scroll to view position after DOM updates
        requestAnimationFrame(() => {
            const view = document.getElementById('employeesView');
            if (view) {
                view.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        });
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


