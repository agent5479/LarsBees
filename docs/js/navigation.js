// BeeMarshall - Navigation Module

function hideAllViews() {
    ['dashboardView', 'clustersView', 'clusterFormView', 'actionsView', 'logActionView', 'scheduledView', 'scheduleForNextVisitView', 'flaggedView', 'employeesView', 'manageTasksView', 'seasonalRequirementsView', 'suggestedScheduleView', 'reportsView'].forEach(id => {
        document.getElementById(id)?.classList.add('hidden');
    });
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
    hideAllViews();
    document.getElementById('reportsView').classList.remove('hidden');
    updateReportsPreview();
}

// Report Functions
function showHivePerformanceReport() {
    alert('Hive Performance Report\n\nThis feature will show:\n• Colony strength trends\n• Honey production metrics\n• Brood pattern analysis\n• Growth rate comparisons\n\nComing soon in future updates!');
}

function showHealthMortalityReport() {
    alert('Health & Mortality Report\n\nThis feature will show:\n• Disease outbreak tracking\n• Mortality rate analysis\n• Treatment effectiveness\n• Health trend monitoring\n\nComing soon in future updates!');
}

function showOperationsReport() {
    alert('Operations Report\n\nThis feature will show:\n• Task completion rates\n• Time tracking analysis\n• Resource utilization\n• Efficiency metrics\n\nComing soon in future updates!');
}

function generateQuickReport(type) {
    const reportTypes = {
        'monthly': 'Monthly Summary Report',
        'seasonal': 'Seasonal Analysis Report',
        'cluster': 'Cluster Performance Report',
        'health': 'Health Dashboard Report'
    };
    
    alert(`${reportTypes[type]}\n\nGenerating report...\n\nThis feature will provide comprehensive analytics and insights based on your apiary data.\n\nComing soon in future updates!`);
}

function exportReportData() {
    alert('Export Report Data\n\nThis feature will allow you to:\n• Export data to CSV/Excel\n• Generate PDF reports\n• Share data with stakeholders\n• Schedule automated reports\n\nComing soon in future updates!');
}

function generateCustomReport() {
    alert('Custom Report Builder\n\nThis feature will allow you to:\n• Create custom report templates\n• Select specific metrics\n• Set date ranges\n• Choose visualization types\n\nComing soon in future updates!');
}

function updateReportsPreview() {
    // Update the reports preview with recent activity
    const recentReports = document.getElementById('recentReports');
    if (recentReports) {
        recentReports.innerHTML = `
            <div class="recent-report-item mb-3">
                <div class="d-flex align-items-center">
                    <div class="report-icon me-3">
                        <i class="bi bi-file-earmark-text text-primary"></i>
                    </div>
                    <div>
                        <h6 class="mb-1">Monthly Summary</h6>
                        <small class="text-muted">Generated 2 days ago</small>
                    </div>
                </div>
            </div>
            <div class="recent-report-item">
                <div class="d-flex align-items-center">
                    <div class="report-icon me-3">
                        <i class="bi bi-graph-up text-success"></i>
                    </div>
                    <div>
                        <h6 class="mb-1">Cluster Performance</h6>
                        <small class="text-muted">Generated 1 week ago</small>
                    </div>
                </div>
            </div>
        `;
    }
}
