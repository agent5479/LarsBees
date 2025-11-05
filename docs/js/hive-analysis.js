// BeeMarshall - Interactive Hive Analysis Card
// Functions for hive analysis card on dashboard

// Update hive strength breakdown
function updateHiveStrengthBreakdown() {
    if (!window.sites || window.sites.length === 0) {
        if (typeof Logger !== 'undefined') {
            Logger.log('📭 No sites data for hive strength breakdown');
        }
        return;
    }
    
    let totalStrong = 0;
    let totalMedium = 0;
    let totalWeak = 0;
    let totalNUC = 0;
    let totalDead = 0;
    let totalEmpty = 0;
    
    window.sites.forEach(site => {
        if (site.archived) return; // Skip archived sites
        
        if (site.hiveStrength) {
            totalStrong += site.hiveStrength.strong || 0;
            totalMedium += site.hiveStrength.medium || 0;
            totalWeak += site.hiveStrength.weak || 0;
            totalNUC += site.hiveStrength.nuc || 0;
            totalDead += site.hiveStrength.dead || 0;
        }
        if (site.hiveStacks) {
            totalEmpty += site.hiveStacks.empty || 0;
        }
    });
    
    // Update the display
    const strongEl = document.getElementById('strongCount');
    const mediumEl = document.getElementById('mediumCount');
    const weakEl = document.getElementById('weakCount');
    const nucEl = document.getElementById('nucCount');
    const deadEl = document.getElementById('deadCount');
    const emptyEl = document.getElementById('emptyCount');
    
    if (strongEl) strongEl.textContent = totalStrong;
    if (mediumEl) mediumEl.textContent = totalMedium;
    if (weakEl) weakEl.textContent = totalWeak;
    if (nucEl) nucEl.textContent = totalNUC;
    if (deadEl) deadEl.textContent = totalDead;
    if (emptyEl) emptyEl.textContent = totalEmpty;
}

// Show sites by category - opens modal like in reports
function showSitesByCategory(category) {
    if (!window.sites || window.sites.length === 0) {
        if (typeof beeMarshallAlert !== 'undefined') {
            beeMarshallAlert('📊 No site data available.\n\nAdd your first apiary site to start generating reports and insights.', 'info');
        } else {
            alert('📊 No site data available.\n\nAdd your first apiary site to start generating reports and insights.');
        }
        return;
    }
    
    const affectedSites = window.sites.filter(site => {
        if (site.archived) return false;
        
        if (category === 'empty') {
            return site.hiveStacks && site.hiveStacks.empty > 0;
        } else if (site.hiveStrength) {
            return site.hiveStrength[category] > 0;
        }
        return false;
    });
    
    if (affectedSites.length === 0) {
        alert(`No sites found with ${category} hives.`);
        return;
    }
    
    // Show sites in modal with enhanced details (like reports page)
    showSiteDetailsModal(affectedSites, category);
}

// Show site details modal (like reports page)
function showSiteDetailsModal(siteList, category) {
    // Create or get modal
    let modal = document.getElementById('hiveSiteDetailsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'hiveSiteDetailsModal';
        modal.setAttribute('tabindex', '-1');
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="hiveSiteDetailsTitle">Site Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="hiveSiteDetailsContent">
                            <!-- Site details will be populated here -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    const title = document.getElementById('hiveSiteDetailsTitle');
    const content = document.getElementById('hiveSiteDetailsContent');
    
    if (!title || !content) return;
    
    title.textContent = `Sites with ${category.charAt(0).toUpperCase() + category.slice(1)} Hives (${siteList.length})`;
    
    let html = '<div class="row">';
    siteList.forEach(site => {
        const count = category === 'empty' 
            ? (site.hiveStacks?.empty || 0)
            : (site.hiveStrength?.[category] || 0);
        
        // Enhanced site details with full breakdown
        const hiveStrength = site.hiveStrength || {};
        const hiveStacks = site.hiveStacks || {};
        
        html += `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">${site.name}</h6>
                        <p class="card-text">
                            <strong>${category.charAt(0).toUpperCase() + category.slice(1)} Hives:</strong> ${count}<br>
                            <strong>Total Hives:</strong> ${site.hiveCount || 0}<br>
                            <strong>Location:</strong> ${site.latitude}, ${site.longitude}
                        </p>
                        
                        <!-- Enhanced Hive Breakdown -->
                        <div class="row mb-2">
                            <div class="col-6">
                                <small class="text-success"><strong>Strong:</strong> ${hiveStrength.strong || 0}</small><br>
                                <small class="text-warning"><strong>Medium:</strong> ${hiveStrength.medium || 0}</small><br>
                                <small class="text-danger"><strong>Weak:</strong> ${hiveStrength.weak || 0}</small>
                            </div>
                            <div class="col-6">
                                <small class="text-info"><strong>NUC:</strong> ${hiveStrength.nuc || 0}</small><br>
                                <small class="text-dark"><strong>Dead:</strong> ${hiveStrength.dead || 0}</small><br>
                                <small class="text-secondary"><strong>Empty:</strong> ${hiveStacks.empty || 0}</small>
                            </div>
                        </div>
                        
                        <!-- Stack Configuration -->
                        <div class="row mb-2">
                            <div class="col-12">
                                <small class="text-muted">
                                    <strong>Stacks:</strong> 
                                    ${hiveStacks.doubles || 0} Doubles, 
                                    ${hiveStacks.topSplits || 0} Top-Splits, 
                                    ${hiveStacks.singles || 0} Singles, 
                                    ${hiveStacks.nucs || 0} NUCs
                                </small>
                            </div>
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-primary" onclick="navigateToSpecificSite(${site.id})">
                                <i class="bi bi-arrow-right"></i> Go to Site
                            </button>
                            <button class="btn btn-sm btn-success" onclick="scheduleTaskForSpecificSite(${site.id}, '${category}')">
                                <i class="bi bi-calendar-plus"></i> Schedule Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    content.innerHTML = html;
    
    // Show modal using Bootstrap
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

// Navigate to specific site
function navigateToSpecificSite(siteId) {
    // Navigate to sites view and scroll to the site
    if (typeof showSites === 'function') {
        showSites();
        setTimeout(() => {
            if (typeof scrollToSiteCard === 'function') {
                scrollToSiteCard(siteId);
            } else if (typeof viewSiteDetails === 'function') {
                viewSiteDetails(siteId);
            }
        }, 500);
    }
    
    // Close modal
    const modal = document.getElementById('hiveSiteDetailsModal');
    if (modal && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
    }
}

// Schedule task for specific site
function scheduleTaskForSpecificSite(siteId, category) {
    // Open schedule task modal with site pre-selected
    if (typeof showScheduleTaskModal === 'function') {
        showScheduleTaskModal();
        setTimeout(() => {
            const siteSelect = document.getElementById('scheduleSite');
            if (siteSelect) {
                siteSelect.value = siteId;
            }
        }, 300);
    }
    
    // Close modal
    const modal = document.getElementById('hiveSiteDetailsModal');
    if (modal && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
    }
}

// Make functions globally accessible
window.updateHiveStrengthBreakdown = updateHiveStrengthBreakdown;
window.showSitesByCategory = showSitesByCategory;
window.showSiteDetailsModal = showSiteDetailsModal;
window.navigateToSpecificSite = navigateToSpecificSite;
window.scheduleTaskForSpecificSite = scheduleTaskForSpecificSite;

