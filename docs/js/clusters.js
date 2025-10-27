// BeeMarshall - Cluster Management Module with Custom Grouping

// Global variable to track whether to show archived sites
let showArchivedSites = false;

// Cluster types and their associated colors
const CLUSTER_TYPES = {
    'production': { name: 'Production', color: '#28a745', icon: 'bi-hexagon-fill' },
    'nucleus': { name: 'Nucleus', color: '#17a2b8', icon: 'bi-circle-fill' },
    'queen-rearing': { name: 'Queen Rearing', color: '#ffc107', icon: 'bi-star-fill' },
    'research': { name: 'Research', color: '#6f42c1', icon: 'bi-flask' },
    'education': { name: 'Education', color: '#fd7e14', icon: 'bi-book' },
    'quarantine': { name: 'Quarantine', color: '#dc3545', icon: 'bi-shield-exclamation' },
    'backup': { name: 'Backup', color: '#6c757d', icon: 'bi-archive' },
    'custom': { name: 'Custom', color: '#20c997', icon: 'bi-gear' }
};

function renderClusters() {
    // Filter sites based on archive status
    const visibleClusters = sites.filter(c => {
        if (showArchivedSites) {
            return c.archived === true;
        } else {
            return !c.archived; // Show non-archived by default
        }
    });
    
    const html = visibleClusters.length > 0
        ? visibleClusters.map(c => {
            // Archive button for admins only (shown on active sites)
            const archiveBtn = (isAdmin && !c.archived) ? `
                <button class="btn btn-sm btn-outline-warning" onclick="event.stopPropagation(); archiveCluster(${c.id})">
                    <i class="bi bi-archive"></i> Archive
                </button>
            ` : '';
            
            // Delete button only for admins on archived sites
            const deleteBtn = (isAdmin && c.archived) ? `
                <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); deleteCluster(${c.id})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            ` : '';
            
            // Unarchive button for admins on archived sites
            const unarchiveBtn = (isAdmin && c.archived) ? `
                <button class="btn btn-sm btn-outline-success" onclick="event.stopPropagation(); unarchiveCluster(${c.id})">
                    <i class="bi bi-arrow-counterclockwise"></i> Unarchive
                </button>
            ` : '';
            
            const clusterType = c.clusterType || 'production';
            const typeInfo = CLUSTER_TYPES[clusterType] || CLUSTER_TYPES['custom'];
            
            // Add archived indicator
            const archivedBadge = c.archived ? `<span class="badge bg-secondary ms-2">Archived</span>` : '';
            
            // Get landowner info
            const landownerInfo = c.landownerName ? `${c.landownerName}${c.landownerPhone ? ' • ' + c.landownerPhone : ''}` : 'Not specified';
            
            // Get hive strength breakdown for inline editing
            const hiveStrong = c.hiveStrength?.strong || 0;
            const hiveMedium = c.hiveStrength?.medium || 0;
            const hiveWeak = c.hiveStrength?.weak || 0;
            const hiveNUC = c.hiveStrength?.nuc || 0;
            const hiveDead = c.hiveStrength?.dead || 0;
            
            // Get hive stacks for clickable cards
            const hiveDoubles = c.hiveStacks?.doubles || 0;
            const hiveTopSplits = c.hiveStacks?.topSplits || 0;
            const hiveSingles = c.hiveStacks?.singles || 0;
            const hiveNUCs = c.hiveStacks?.nucs || 0;
            const hiveEmpty = c.hiveStacks?.empty || 0;
            
            // Get honey potentials
            const honeyPotentials = c.honeyPotentials || [];
            const honeyPotentialsList = honeyPotentials.length > 0 
                ? honeyPotentials.map(p => `<span class="badge bg-warning me-1">${p}</span>`).join('')
                : '<span class="text-muted">None specified</span>';
            
            // Determine site type label
            const siteTypeLabel = c.siteType || 'Not specified';
            
            return `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card cluster-card h-100" data-cluster-type="${clusterType}" ${c.archived ? 'style="opacity: 0.7;"' : ''}>
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title">
                                    <i class="bi ${typeInfo.icon}" style="color: ${typeInfo.color}"></i> 
                                    ${c.name}
                                    ${archivedBadge}
                                </h5>
                                <span class="badge" style="background-color: ${typeInfo.color}; color: white;">
                                    ${typeInfo.name}
                                </span>
                            </div>
                            
                            <!-- Landowner & Phone -->
                            <div class="mb-2">
                                <i class="bi bi-person-fill text-muted me-1"></i>
                                <strong>Landowner:</strong> ${landownerInfo}
                            </div>
                            
                            <!-- Site Type -->
                            <div class="mb-2">
                                <i class="bi bi-calendar-event text-muted me-1"></i>
                                <strong>Site Type:</strong> ${siteTypeLabel}
                            </div>
                            
                            <!-- Total Hive Count -->
                            <div class="mb-2">
                                <i class="bi bi-hexagon text-muted me-1"></i>
                                <strong>Total Hives:</strong> <span class="badge bg-primary">${c.hiveCount || 0}</span>
                            </div>
                            
                            <!-- Hive Count Summary (Editable inline) -->
                            <div class="mb-3">
                                <strong><i class="bi bi-hexagon-fill"></i> Hive Strength:</strong>
                                <div class="d-flex flex-wrap gap-2 mt-2">
                                    <div class="badge bg-success d-flex align-items-center px-3 py-2 hive-strength-badge" onclick="quickEditHiveStrength(${c.id}, 'Strong', ${hiveStrong})" style="cursor: pointer; font-size: 0.9rem; min-width: 80px; justify-content: center;">
                                        <i class="bi bi-hexagon-fill me-1"></i>
                                        <span>Strong: <strong id="hiveStrong_${c.id}">${hiveStrong}</strong></span>
                                    </div>
                                    <div class="badge bg-warning text-dark d-flex align-items-center px-3 py-2 hive-strength-badge" onclick="quickEditHiveStrength(${c.id}, 'Medium', ${hiveMedium})" style="cursor: pointer; font-size: 0.9rem; min-width: 80px; justify-content: center;">
                                        <i class="bi bi-hexagon me-1"></i>
                                        <span>Med: <strong id="hiveMedium_${c.id}">${hiveMedium}</strong></span>
                                    </div>
                                    <div class="badge bg-danger d-flex align-items-center px-3 py-2 hive-strength-badge" onclick="quickEditHiveStrength(${c.id}, 'Weak', ${hiveWeak})" style="cursor: pointer; font-size: 0.9rem; min-width: 80px; justify-content: center;">
                                        <i class="bi bi-hexagon me-1"></i>
                                        <span>Weak: <strong id="hiveWeak_${c.id}">${hiveWeak}</strong></span>
                                    </div>
                                    <div class="badge bg-info d-flex align-items-center px-3 py-2 hive-strength-badge" onclick="quickEditHiveStrength(${c.id}, 'NUC', ${hiveNUC})" style="cursor: pointer; font-size: 0.9rem; min-width: 80px; justify-content: center;">
                                        <i class="bi bi-hexagon-half me-1"></i>
                                        <span>NUC: <strong id="hiveNUC_${c.id}">${hiveNUC}</strong></span>
                                    </div>
                                    <div class="badge bg-secondary d-flex align-items-center px-3 py-2 hive-strength-badge" onclick="quickEditHiveStrength(${c.id}, 'Dead', ${hiveDead})" style="cursor: pointer; font-size: 0.9rem; min-width: 80px; justify-content: center;">
                                        <i class="bi bi-hexagon me-1"></i>
                                        <span>Dead: <strong id="hiveDead_${c.id}">${hiveDead}</strong></span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Hive Boxes (Clickable mini cards) -->
                            <div class="mb-3">
                                <strong><i class="bi bi-boxes"></i> Hive Boxes:</strong>
                                <div class="d-flex flex-wrap gap-2 mt-2">
                                    <div class="card bg-primary text-white hive-box-card" onclick="quickEditHiveBox(${c.id}, 'doubles', ${hiveDoubles})" style="cursor: pointer; min-width: 100px; max-width: 120px;">
                                        <div class="card-body p-2 text-center">
                                            <i class="bi bi-stack" style="font-size: 1.2rem;"></i>
                                            <div class="fw-bold mt-1" style="font-size: 0.8rem;">Doubles</div>
                                            <div class="h5 mb-0" id="boxDoubles_${c.id}">${hiveDoubles}</div>
                                        </div>
                                    </div>
                                    <div class="card bg-success text-white hive-box-card" onclick="quickEditHiveBox(${c.id}, 'topSplits', ${hiveTopSplits})" style="cursor: pointer; min-width: 100px; max-width: 120px;">
                                        <div class="card-body p-2 text-center">
                                            <i class="bi bi-layers-half" style="font-size: 1.2rem;"></i>
                                            <div class="fw-bold mt-1" style="font-size: 0.8rem;">Top-Splits</div>
                                            <div class="h5 mb-0" id="boxTopSplits_${c.id}">${hiveTopSplits}</div>
                                        </div>
                                    </div>
                                    <div class="card bg-warning text-dark hive-box-card" onclick="quickEditHiveBox(${c.id}, 'singles', ${hiveSingles})" style="cursor: pointer; min-width: 100px; max-width: 120px;">
                                        <div class="card-body p-2 text-center">
                                            <i class="bi bi-square" style="font-size: 1.2rem;"></i>
                                            <div class="fw-bold mt-1" style="font-size: 0.8rem;">Singles</div>
                                            <div class="h5 mb-0" id="boxSingles_${c.id}">${hiveSingles}</div>
                                        </div>
                                    </div>
                                    <div class="card bg-info text-white hive-box-card" onclick="quickEditHiveBox(${c.id}, 'nucs', ${hiveNUCs})" style="cursor: pointer; min-width: 100px; max-width: 120px;">
                                        <div class="card-body p-2 text-center">
                                            <i class="bi bi-circle" style="font-size: 1.2rem;"></i>
                                            <div class="fw-bold mt-1" style="font-size: 0.8rem;">NUCs</div>
                                            <div class="h5 mb-0" id="boxNucs_${c.id}">${hiveNUCs}</div>
                                        </div>
                                    </div>
                                    <div class="card bg-secondary text-white hive-box-card" onclick="quickEditHiveBox(${c.id}, 'empty', ${hiveEmpty})" style="cursor: pointer; min-width: 100px; max-width: 120px;">
                                        <div class="card-body p-2 text-center">
                                            <i class="bi bi-square" style="font-size: 1.2rem;"></i>
                                            <div class="fw-bold mt-1" style="font-size: 0.8rem;">Empty</div>
                                            <div class="h5 mb-0" id="boxEmpty_${c.id}">${hiveEmpty}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Honey Potentials -->
                            <div class="mb-3">
                                <strong><i class="bi bi-flower1"></i> Honey Potentials:</strong>
                                <div class="mt-1">
                                    ${honeyPotentialsList}
                                </div>
                            </div>
                            
                            ${c.lastModifiedBy ? `<small class="text-muted"><i class="bi bi-person"></i> ${c.lastModifiedBy}</small>` : ''}
                        </div>
                        <div class="card-footer bg-light">
                            ${isAdmin ? `<button class="btn btn-primary" onclick="editCluster(${c.id})"><i class="bi bi-pencil"></i> Update</button>` : ''}
                            <button class="btn btn-sm btn-outline-info" onclick="viewClusterDetails(${c.id})">
                                <i class="bi bi-eye"></i> View
                            </button>
                            ${archiveBtn}
                            ${unarchiveBtn}
                            ${deleteBtn}
                        </div>
                    </div>
                </div>
            `;
        }).join('')
        : '<div class="col-12"><p class="text-center text-muted my-5">' + (showArchivedSites ? 'No archived sites.' : 'No sites found.') + '</p></div>';
    
    document.getElementById('sitesList').innerHTML = html;
    
    // Update the show archived button text
    updateArchivedButtonText();
}

function renderClusterTypeFilter() {
    const filterContainer = document.getElementById('clusterTypeFilter');
    if (!filterContainer) return;
    
    const filterHtml = `
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center">
                <label class="form-label mb-0"><strong>Filter:</strong></label>
                <button class="btn btn-sm btn-outline-secondary" type="button" onclick="toggleClusterFilter()" id="filterToggleBtn">
                    <i class="bi bi-chevron-down" id="filterToggleIcon"></i> Types
                </button>
            </div>
            <div class="collapse" id="clusterFilterOptions">
                <div class="mt-2">
                    <div class="btn-group-vertical w-100" role="group">
                        <input type="radio" class="btn-check" name="clusterTypeFilter" id="filterAll" value="all" checked>
                        <label class="btn btn-outline-secondary btn-sm" for="filterAll">All Types</label>
                        
                        <input type="radio" class="btn-check" name="clusterTypeFilter" id="filterProduction" value="production">
                        <label class="btn btn-outline-secondary btn-sm" for="filterProduction" style="border-color: #28a745; color: #28a745;">
                            <i class="bi bi-hexagon-fill"></i> Production
                        </label>
                        
                        <input type="radio" class="btn-check" name="clusterTypeFilter" id="filterNucleus" value="nucleus">
                        <label class="btn btn-outline-secondary btn-sm" for="filterNucleus" style="border-color: #17a2b8; color: #17a2b8;">
                            <i class="bi bi-circle-fill"></i> NUC
                        </label>
                        
                        <input type="radio" class="btn-check" name="clusterTypeFilter" id="filterQueenRearing" value="queen-rearing">
                        <label class="btn btn-outline-secondary btn-sm" for="filterQueenRearing" style="border-color: #ffc107; color: #ffc107;">
                            <i class="bi bi-star-fill"></i> Queen Rearing
                        </label>
                        
                        <input type="radio" class="btn-check" name="clusterTypeFilter" id="filterResearch" value="research">
                        <label class="btn btn-outline-secondary btn-sm" for="filterResearch" style="border-color: #6f42c1; color: #6f42c1;">
                            <i class="bi bi-flask"></i> Research
                        </label>
                        
                        <input type="radio" class="btn-check" name="clusterTypeFilter" id="filterEducation" value="education">
                        <label class="btn btn-outline-secondary btn-sm" for="filterEducation" style="border-color: #fd7e14; color: #fd7e14;">
                            <i class="bi bi-book"></i> Education
                        </label>
                        
                        <input type="radio" class="btn-check" name="clusterTypeFilter" id="filterQuarantine" value="quarantine">
                        <label class="btn btn-outline-secondary btn-sm" for="filterQuarantine" style="border-color: #dc3545; color: #dc3545;">
                            <i class="bi bi-shield-exclamation"></i> Quarantine
                        </label>
                        
                        <input type="radio" class="btn-check" name="clusterTypeFilter" id="filterBackup" value="backup">
                        <label class="btn btn-outline-secondary btn-sm" for="filterBackup" style="border-color: #6c757d; color: #6c757d;">
                            <i class="bi bi-archive"></i> Backup
                        </label>
                        
                        <input type="radio" class="btn-check" name="clusterTypeFilter" id="filterCustom" value="custom">
                        <label class="btn btn-outline-secondary btn-sm" for="filterCustom" style="border-color: #20c997; color: #20c997;">
                            <i class="bi bi-gear"></i> Custom
                        </label>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    filterContainer.innerHTML = filterHtml;
    
    // Add event listeners for filtering
    document.querySelectorAll('input[name="clusterTypeFilter"]').forEach(radio => {
        radio.addEventListener('change', function() {
            filterClustersByType(this.value);
        });
    });
}

function filterClustersByType(type) {
    const clusterCards = document.querySelectorAll('.cluster-card');
    
    clusterCards.forEach(card => {
        if (type === 'all' || card.dataset.clusterType === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update the radio button selection
    const radioButton = document.querySelector(`input[name="clusterTypeFilter"][value="${type}"]`);
    if (radioButton) {
        radioButton.checked = true;
    }
}

function toggleClusterFilter() {
    const filterOptions = document.getElementById('clusterFilterOptions');
    const toggleIcon = document.getElementById('filterToggleIcon');
    const toggleBtn = document.getElementById('filterToggleBtn');
    
    if (filterOptions && toggleIcon && toggleBtn) {
        if (filterOptions.classList.contains('show')) {
            // Collapse
            filterOptions.classList.remove('show');
            toggleIcon.className = 'bi bi-chevron-down';
            toggleBtn.innerHTML = '<i class="bi bi-chevron-down"></i> Types';
        } else {
            // Expand
            filterOptions.classList.add('show');
            toggleIcon.className = 'bi bi-chevron-up';
            toggleBtn.innerHTML = '<i class="bi bi-chevron-up"></i> Types';
        }
    }
}

function showAddClusterForm() {
    hideAllViews();
    document.getElementById('clusterFormView').classList.remove('hidden');
    document.getElementById('clusterFormTitle').textContent = 'Add New Site';
    document.getElementById('clusterForm').reset();
    document.getElementById('clusterId').value = '';
    document.getElementById('anomalySection')?.classList.add('hidden');
    document.getElementById('mapPickerContainer').classList.add('hidden');
    
    // Populate cluster type dropdown
    populateClusterTypeDropdown();
    
    // Render honey potentials checkboxes (empty for new site)
    renderHoneyPotentials([]);
    
    // Add event listener for site type changes
    const siteTypeSelect = document.getElementById('siteType');
    const hiveCountField = document.getElementById('clusterHiveCount');
    const formText = document.querySelector('#clusterHiveCount + .form-text');
    
    if (siteTypeSelect && hiveCountField && formText) {
        siteTypeSelect.addEventListener('change', function() {
            const isZeroHiveAllowed = this.value === 'summer-only' || this.value === 'winter-only';
            
            if (isZeroHiveAllowed) {
                hiveCountField.min = '0';
                formText.textContent = 'Total number of hives in this site (0 allowed for seasonal-only sites)';
            } else {
                hiveCountField.min = '1';
                formText.textContent = 'Total number of hives in this site';
            }
        });
    }
    
    // Setup GPS button
    setTimeout(() => {
        const btn = document.getElementById('useLocationBtn');
        if (btn) {
            btn.onclick = getCurrentLocation;
        }
    }, 100);
}

function validateCoordinates() {
    const lat = parseFloat(document.getElementById('clusterLat').value);
    const lng = parseFloat(document.getElementById('clusterLng').value);
    
    const latField = document.getElementById('clusterLat');
    const lngField = document.getElementById('clusterLng');
    
    // Reset validation classes
    latField.classList.remove('is-valid', 'is-invalid');
    lngField.classList.remove('is-valid', 'is-invalid');
    
    // Validate latitude
    if (!isNaN(lat) && lat >= -90 && lat <= 90) {
        latField.classList.add('is-valid');
    } else if (latField.value.trim() !== '') {
        latField.classList.add('is-invalid');
    }
    
    // Validate longitude
    if (!isNaN(lng) && lng >= -180 && lng <= 180) {
        lngField.classList.add('is-valid');
    } else if (lngField.value.trim() !== '') {
        lngField.classList.add('is-invalid');
    }
}

function populateClusterTypeDropdown() {
    const typeSelect = document.getElementById('clusterType');
    if (!typeSelect) return;
    
    const options = Object.entries(CLUSTER_TYPES).map(([key, type]) => 
        `<option value="${key}" style="color: ${type.color}">
            <i class="bi ${type.icon}"></i> ${type.name}
        </option>`
    ).join('');
    
                typeSelect.innerHTML = `<option value="production">Select site type...</option>${options}`;
}

function handleSaveCluster(e) {
    e.preventDefault();
    
    // Validate required fields and focus on first invalid field
    const nameField = document.getElementById('clusterName');
    const nameValue = nameField.value.trim();
    if (!nameValue) {
        beeMarshallAlert('⚠️ Site name is required', 'warning');
        nameField.focus();
        nameField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    const hiveCountField = document.getElementById('clusterHiveCount');
    const hiveCount = parseInt(hiveCountField.value);
    const siteType = document.getElementById('siteType').value;
    
    // Allow 0 hives only for Summer Only and Winter Only sites
    const isZeroHiveAllowed = siteType === 'summer-only' || siteType === 'winter-only';
    
    if (isNaN(hiveCount) || hiveCount < 0 || (!isZeroHiveAllowed && hiveCount <= 0)) {
        const message = isZeroHiveAllowed 
            ? '⚠️ Please enter a valid hive count (0 or greater)'
            : '⚠️ Please enter a valid hive count (must be greater than 0)';
        beeMarshallAlert(message, 'warning');
        hiveCountField.focus();
        hiveCountField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    // Validate coordinates
    const latField = document.getElementById('clusterLat');
    const lngField = document.getElementById('clusterLng');
    const lat = parseFloat(latField.value);
    const lng = parseFloat(lngField.value);
    
    if (isNaN(lat) || isNaN(lng)) {
        beeMarshallAlert('⚠️ Please enter valid GPS coordinates', 'warning');
        latField.focus();
        latField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    if (lat < -90 || lat > 90) {
        beeMarshallAlert('⚠️ Latitude must be between -90 and 90 degrees', 'warning');
        latField.focus();
        latField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    if (lng < -180 || lng > 180) {
        beeMarshallAlert('⚠️ Longitude must be between -180 and 180 degrees', 'warning');
        lngField.focus();
        lngField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    const id = document.getElementById('clusterId').value;
    
    // Get hive strength from display elements (not input fields)
    const strongElement = document.getElementById('hiveStateStrong');
    const mediumElement = document.getElementById('hiveStateMedium');
    const weakElement = document.getElementById('hiveStateWeak');
    const nucElement = document.getElementById('hiveStateNUC');
    const deadElement = document.getElementById('hiveStateDead');
    
    const cluster = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('clusterName').value,
        description: document.getElementById('clusterDescription').value,
        latitude: parseFloat(document.getElementById('clusterLat').value) || 0,
        longitude: parseFloat(document.getElementById('clusterLng').value) || 0,
        hiveCount: parseInt(document.getElementById('clusterHiveCount').value),
        // Hive strength breakdown from display elements
        hiveStrength: {
            strong: strongElement ? parseInt(strongElement.textContent) || 0 : 0,
            medium: mediumElement ? parseInt(mediumElement.textContent) || 0 : 0,
            weak: weakElement ? parseInt(weakElement.textContent) || 0 : 0,
            nuc: nucElement ? parseInt(nucElement.textContent) || 0 : 0,
            dead: deadElement ? parseInt(deadElement.textContent) || 0 : 0
        },
        // Hive stack configuration - get from visual grid data if available, otherwise from cluster data
        hiveStacks: visualHiveData ? {
            doubles: visualHiveData.doubles || 0,
            topSplits: visualHiveData.topSplits || 0,
            singles: visualHiveData.singles || 0,
            nucs: visualHiveData.nucs || 0,
            empty: visualHiveData.empty || 0
        } : (sites.find(c => c.id === parseInt(id))?.hiveStacks || {
            doubles: 0,
            topSplits: 0,
            singles: 0,
            nucs: 0,
            empty: 0
        }),
        harvestTimeline: document.getElementById('clusterHarvest').value,
        sugarRequirements: document.getElementById('clusterSugar').value,
        notes: document.getElementById('clusterNotes').value,
        clusterType: document.getElementById('clusterType').value || 'production',
        landownerName: document.getElementById('landownerName').value,
        landownerPhone: document.getElementById('landownerPhone').value,
        landownerEmail: document.getElementById('landownerEmail').value,
        landownerAddress: document.getElementById('landownerAddress').value,
        siteType: document.getElementById('siteType').value,
        accessType: document.getElementById('accessType').value,
        contactBeforeVisit: document.getElementById('contactBeforeVisit').checked,
        isQuarantine: document.getElementById('isQuarantine').checked,
        // Get selected honey potentials from checkboxes
        honeyPotentials: getSelectedHoneyPotentials(),
        lastModifiedBy: currentUser.username,
        lastModifiedAt: new Date().toISOString(),
        createdAt: id ? (sites.find(c => c.id === parseInt(id))?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };
    
    // Preserve harvest records if they exist
    if (id) {
        const existingCluster = sites.find(c => c.id === parseInt(id));
        if (existingCluster && existingCluster.harvestRecords) {
            cluster.harvestRecords = existingCluster.harvestRecords;
        }
    }
    
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Saving...', 'syncing');
    
    // Use tenant-specific path for data isolation
    const tenantPath = currentTenantId ? `tenants/${currentTenantId}/sites` : 'sites';
    database.ref(`${tenantPath}/${cluster.id}`).set(cluster)
        .then(() => {
            beeMarshallAlert(`✅ Site "${cluster.name}" has been saved successfully!`, 'success');
            showSyncStatus('<i class="bi bi-check"></i> Saved by ' + currentUser.username);
            // Close the form and return to sites view
            setTimeout(() => {
                showClusters();
            }, 500);
        })
        .catch(error => {
            console.error('Error saving cluster:', error);
            beeMarshallAlert('❌ Error saving site. Please try again.', 'error');
            showSyncStatus('Error saving');
        });
}

function editCluster(id) {
    const cluster = sites.find(c => c.id === id);
    if (!cluster) return;
    
    hideAllViews();
    document.getElementById('clusterFormView').classList.remove('hidden');
    document.getElementById('clusterFormTitle').textContent = 'Edit: ' + cluster.name;
    document.getElementById('clusterId').value = cluster.id;
    document.getElementById('clusterName').value = cluster.name;
    document.getElementById('clusterDescription').value = cluster.description || '';
    // Ensure coordinates are properly formatted as numbers
    const lat = parseFloat(cluster.latitude);
    const lng = parseFloat(cluster.longitude);
    
    console.log('Editing cluster coordinates:', { 
        original: { lat: cluster.latitude, lng: cluster.longitude },
        parsed: { lat, lng }
    });
    
    document.getElementById('clusterLat').value = isNaN(lat) ? '' : lat.toFixed(6);
    document.getElementById('clusterLng').value = isNaN(lng) ? '' : lng.toFixed(6);
    document.getElementById('clusterHiveCount').value = cluster.hiveCount;
    
    // Handle harvest timeline date - ensure it's a valid date string for date input
    const harvestDateInput = document.getElementById('clusterHarvest');
    if (harvestDateInput && cluster.harvestTimeline) {
        // Try to parse the date - if it's not in the correct format, leave it empty
        const parsedDate = new Date(cluster.harvestTimeline);
        if (!isNaN(parsedDate.getTime())) {
            // Valid date - format as YYYY-MM-DD for date input
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const day = String(parsedDate.getDate()).padStart(2, '0');
            harvestDateInput.value = `${year}-${month}-${day}`;
        } else {
            harvestDateInput.value = '';
        }
    } else if (harvestDateInput) {
        harvestDateInput.value = '';
    }
    
    document.getElementById('clusterSugar').value = cluster.sugarRequirements || '';
    document.getElementById('clusterNotes').value = cluster.notes || '';
    document.getElementById('clusterType').value = cluster.clusterType || 'production';
    document.getElementById('landownerName').value = cluster.landownerName || '';
    document.getElementById('landownerPhone').value = cluster.landownerPhone || '';
    document.getElementById('landownerEmail').value = cluster.landownerEmail || '';
    document.getElementById('landownerAddress').value = cluster.landownerAddress || '';
    document.getElementById('siteType').value = cluster.siteType || '';
    document.getElementById('accessType').value = cluster.accessType || '';
    document.getElementById('contactBeforeVisit').checked = cluster.contactBeforeVisit || false;
    document.getElementById('isQuarantine').checked = cluster.isQuarantine || false;
    
    // Populate hive strength breakdown
    if (cluster.hiveStrength) {
        // Update the Hive State display elements (not input fields)
        const strongElement = document.getElementById('hiveStateStrong');
        const mediumElement = document.getElementById('hiveStateMedium');
        const weakElement = document.getElementById('hiveStateWeak');
        const nucElement = document.getElementById('hiveStateNUC');
        const deadElement = document.getElementById('hiveStateDead');
        
        if (strongElement) strongElement.textContent = cluster.hiveStrength.strong || 0;
        if (mediumElement) mediumElement.textContent = cluster.hiveStrength.medium || 0;
        if (weakElement) weakElement.textContent = cluster.hiveStrength.weak || 0;
        if (nucElement) nucElement.textContent = cluster.hiveStrength.nuc || 0;
        if (deadElement) deadElement.textContent = cluster.hiveStrength.dead || 0;
        
        // Show the Hive State card if there are any hives
        const hiveStateCard = document.getElementById('hiveStateCard');
        if (hiveStateCard) {
            const totalHives = (cluster.hiveStrength.strong || 0) + (cluster.hiveStrength.medium || 0) + 
                              (cluster.hiveStrength.weak || 0) + (cluster.hiveStrength.nuc || 0) + 
                              (cluster.hiveStrength.dead || 0);
            if (totalHives > 0) {
                hiveStateCard.style.display = 'block';
            }
        }
    }
    
    // Populate stack configuration - these elements are no longer in the HTML
    // The visual hive grid now replaces these inputs
    // Stack configuration data is now stored in visualHiveData and rendered via the grid
    
    // Update the visual hive grid with existing data
    if (typeof initializeVisualHiveGrid === 'function') {
        initializeVisualHiveGrid(cluster);
    }
    // updateStackTotals(); // Removed - no longer needed with visual hive grid
    
    document.getElementById('anomalySection')?.classList.remove('hidden');
    document.getElementById('mapPickerContainer').classList.add('hidden');
    
    // Populate cluster type dropdown
    populateClusterTypeDropdown();
    
    // Add event listeners for coordinate validation
    document.getElementById('clusterLat').addEventListener('blur', validateCoordinates);
    document.getElementById('clusterLng').addEventListener('blur', validateCoordinates);
    
    // Setup GPS button
    setTimeout(() => {
        const btn = document.getElementById('useLocationBtn');
        if (btn) {
            btn.onclick = getCurrentLocation;
        }
    }, 100);
    
    // Render harvest records if they exist
    if (cluster.harvestRecords && cluster.harvestRecords.length > 0) {
        renderHarvestRecords(cluster.harvestRecords);
    }
    
    // Initialize and render visual hive grid - auto-populate on page load
    visualHiveData = null; // Reset visual data
    renderVisualHiveGrid(); // Render immediately on page load
    
    // Render honey potentials checkboxes
    renderHoneyPotentials(cluster.honeyPotentials || []);
    
    // Add event listener for site type changes
    const siteTypeSelect = document.getElementById('siteType');
    const hiveCountField = document.getElementById('clusterHiveCount');
    const formText = document.querySelector('#clusterHiveCount + .form-text');
    
    if (siteTypeSelect && hiveCountField && formText) {
        siteTypeSelect.addEventListener('change', function() {
            const isZeroHiveAllowed = this.value === 'summer-only' || this.value === 'winter-only';
            
            if (isZeroHiveAllowed) {
                hiveCountField.min = '0';
                formText.textContent = 'Total number of hives in this site (0 allowed for seasonal-only sites)';
            } else {
                hiveCountField.min = '1';
                formText.textContent = 'Total number of hives in this site';
            }
        });
    }
}

/**
 * Render honey potentials checkboxes in the form
 */
function renderHoneyPotentials(selectedPotentials = []) {
    const container = document.getElementById('honeyPotentialsContainer');
    if (!container) return;
    
    if (!HONEY_TYPES || HONEY_TYPES.length === 0) {
        container.innerHTML = '<p class="text-muted small">No honey types available. Add honey types in Task Management.</p>';
        return;
    }
    
    container.innerHTML = HONEY_TYPES.map(type => {
        const isChecked = selectedPotentials.includes(type);
        return `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${type}" id="honey_${type}" ${isChecked ? 'checked' : ''}>
                <label class="form-check-label" for="honey_${type}">
                    ${type}
                </label>
            </div>
        `;
    }).join('');
}

/**
 * Get selected honey potentials from checkboxes
 */
function getSelectedHoneyPotentials() {
    const container = document.getElementById('honeyPotentialsContainer');
    if (!container) return [];
    
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Global variable to track which record is being edited
let editingHarvestRecordIndex = null;

/**
 * Add or update a harvest record to the current cluster form
 */
function addHarvestRecord() {
    const date = document.getElementById('harvestDate').value;
    const quantity = document.getElementById('harvestQuantity').value;
    const notes = document.getElementById('harvestNotes').value;
    
    if (!date || !quantity) {
        beeMarshallAlert('Please enter a date and quantity', 'warning');
        return;
    }
    
    // Get existing records from the current cluster being edited
    const clusterId = document.getElementById('clusterId').value;
    let harvestRecords = [];
    
    if (clusterId) {
        const existingCluster = sites.find(c => c.id === parseInt(clusterId));
        if (existingCluster && existingCluster.harvestRecords) {
            harvestRecords = [...existingCluster.harvestRecords];
        }
    }
    
    if (editingHarvestRecordIndex !== null && editingHarvestRecordIndex >= 0) {
        // Update existing record - preserve original metadata and add modification info
        const existingRecord = harvestRecords[editingHarvestRecordIndex];
        harvestRecords[editingHarvestRecordIndex] = {
            ...existingRecord,
            date: date,
            quantity: parseFloat(quantity),
            notes: notes || '',
            modifiedBy: currentUser.username,
            modifiedAt: new Date().toISOString()
        };
        beeMarshallAlert('✅ Harvest record updated', 'success');
    } else {
        // Add new record
        const recordToSave = {
            date: date,
            quantity: parseFloat(quantity),
            notes: notes || '',
            addedBy: currentUser.username,
            addedAt: new Date().toISOString()
        };
        harvestRecords.push(recordToSave);
        beeMarshallAlert('✅ Harvest record added', 'success');
    }
    
    // Sort by date (newest first)
    harvestRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Update the cluster in the array temporarily (will be saved when form is submitted)
    if (clusterId) {
        const clusterIndex = sites.findIndex(c => c.id === parseInt(clusterId));
        if (clusterIndex !== -1) {
            sites[clusterIndex].harvestRecords = harvestRecords;
        }
    }
    
    // Render the updated records
    renderHarvestRecords(harvestRecords);
    
    // Clear the input fields and reset edit state
    document.getElementById('harvestDate').value = '';
    document.getElementById('harvestQuantity').value = '';
    document.getElementById('harvestNotes').value = '';
    editingHarvestRecordIndex = null;
    
    // Reset button text
    const addBtn = document.querySelector('button[onclick="addHarvestRecord()"]');
    if (addBtn) {
        addBtn.innerHTML = '<i class="bi bi-plus"></i> Add Harvest Record';
    }
}

/**
 * Edit an existing harvest record
 */
function editHarvestRecord(index) {
    const clusterId = document.getElementById('clusterId').value;
    if (!clusterId) {
        beeMarshallAlert('No cluster selected', 'error');
        return;
    }
    
    const existingCluster = sites.find(c => c.id === parseInt(clusterId));
    if (!existingCluster || !existingCluster.harvestRecords || !existingCluster.harvestRecords[index]) {
        beeMarshallAlert('Record not found', 'error');
        return;
    }
    
    const record = existingCluster.harvestRecords[index];
    
    // Populate the input fields with the record data
    document.getElementById('harvestDate').value = record.date;
    document.getElementById('harvestQuantity').value = record.quantity;
    document.getElementById('harvestNotes').value = record.notes || '';
    
    // Set the index being edited
    editingHarvestRecordIndex = index;
    
    // Update button text
    const addBtn = document.querySelector('button[onclick="addHarvestRecord()"]');
    if (addBtn) {
        addBtn.innerHTML = '<i class="bi bi-check"></i> Update Record';
    }
    
    // Scroll to the input fields
    document.getElementById('harvestDate').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    document.getElementById('harvestDate').focus();
}

/**
 * Render harvest records in the container
 */
function renderHarvestRecords(records) {
    const container = document.getElementById('harvestRecordsContainer');
    if (!container) return;
    
    if (!records || records.length === 0) {
        container.innerHTML = '<p class="text-muted small">No harvest records yet. Add your first harvest below.</p>';
        return;
    }
    
    // Determine if any record has been modified
    const hasModifiedRecords = records.some(r => r.modifiedBy);
    const modifiedColumnHtml = hasModifiedRecords ? '<th>Modified By</th>' : '';
    
    const recordsHtml = `
        <div class="table-responsive">
            <table class="table table-sm table-hover">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Quantity (kg)</th>
                        <th>Notes</th>
                        <th>Added By</th>
                        ${modifiedColumnHtml}
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${records.map((record, index) => {
                        const rowClass = record.modifiedBy ? 'class="table-warning"' : '';
                        const modifiedCellHtml = hasModifiedRecords 
                            ? `<td><small class="text-muted">${record.modifiedBy ? `<span class="text-warning"><i class="bi bi-pencil"></i> ${record.modifiedBy}</span>` : '-'}</small></td>`
                            : '';
                        
                        return `
                        <tr ${rowClass}>
                            <td>${new Date(record.date).toLocaleDateString()}</td>
                            <td><strong>${record.quantity.toFixed(1)}</strong></td>
                            <td>${record.notes || '-'}</td>
                            <td><small class="text-muted">${record.addedBy}</small></td>
                            ${modifiedCellHtml}
                            <td>
                                <button class="btn btn-sm btn-outline-primary" onclick="editHarvestRecord(${index})" title="Edit this record">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="removeHarvestRecord(${index})" title="Delete this record">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    }).join('')}
                </tbody>
                <tfoot>
                    <tr class="table-info">
                        <th>Total</th>
                        <th><strong>${records.reduce((sum, r) => sum + r.quantity, 0).toFixed(1)} kg</strong></th>
                        <th colspan="${hasModifiedRecords ? '4' : '3'}"></th>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    container.innerHTML = recordsHtml;
}

/**
 * Remove a harvest record by index
 */
function removeHarvestRecord(index) {
    if (!confirm('Are you sure you want to remove this harvest record?')) {
        return;
    }
    
    const clusterId = document.getElementById('clusterId').value;
    if (!clusterId) {
        beeMarshallAlert('No cluster selected', 'error');
        return;
    }
    
    const clusterIndex = sites.findIndex(c => c.id === parseInt(clusterId));
    if (clusterIndex === -1) {
        beeMarshallAlert('Cluster not found', 'error');
        return;
    }
    
    if (!sites[clusterIndex].harvestRecords) {
        sites[clusterIndex].harvestRecords = [];
    }
    
    sites[clusterIndex].harvestRecords.splice(index, 1);
    
    // Reset edit state if the deleted record was being edited
    if (editingHarvestRecordIndex === index) {
        editingHarvestRecordIndex = null;
        document.getElementById('harvestDate').value = '';
        document.getElementById('harvestQuantity').value = '';
        document.getElementById('harvestNotes').value = '';
        
        // Reset button text
        const addBtn = document.querySelector('button[onclick="addHarvestRecord()"]');
        if (addBtn) {
            addBtn.innerHTML = '<i class="bi bi-plus"></i> Add Harvest Record';
        }
    }
    
    renderHarvestRecords(sites[clusterIndex].harvestRecords);
    
    beeMarshallAlert('Harvest record removed', 'info');
}

function viewClusterDetails(id) {
    const cluster = sites.find(c => c.id === id);
    if (!cluster) return;
    
    const typeInfo = CLUSTER_TYPES[cluster.clusterType] || CLUSTER_TYPES['custom'];
    
    const detailsHtml = `
        <div class="modal fade" id="clusterDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi ${typeInfo.icon}" style="color: ${typeInfo.color}"></i>
                            ${cluster.name}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Basic Information</h6>
                                <p><strong>Type:</strong> <span class="badge" style="background-color: ${typeInfo.color}; color: white;">${typeInfo.name}</span></p>
                                <p><strong>Description:</strong> ${cluster.description || 'No description'}</p>
                                <p><strong>Hive Count:</strong> ${cluster.hiveCount}</p>
                                <p><strong>GPS Coordinates:</strong> ${cluster.latitude.toFixed(6)}, ${cluster.longitude.toFixed(6)}</p>
                                
                                <div class="mt-2">
                                    <button class="btn btn-sm btn-outline-primary" onclick="openInMaps(${cluster.id})">
                                        <i class="bi bi-geo-alt-fill"></i> View on Maps
                                    </button>
                                </div>
                                
                                <h6 class="mt-3">Landowner Information</h6>
                                ${cluster.landownerName ? `<p><strong>Name:</strong> ${cluster.landownerName}</p>` : ''}
                                ${cluster.landownerPhone ? `<p><strong>Phone:</strong> ${cluster.landownerPhone}</p>` : ''}
                                ${cluster.landownerEmail ? `<p><strong>Email:</strong> ${cluster.landownerEmail}</p>` : ''}
                                ${cluster.landownerAddress ? `<p><strong>Address:</strong> ${cluster.landownerAddress}</p>` : ''}
                            </div>
                            <div class="col-md-6">
                                <h6>Site Details</h6>
                                <p><strong>Site Type:</strong> ${cluster.siteType || 'Not specified'}</p>
                                <p><strong>Access Type:</strong> ${cluster.accessType || 'Not specified'}</p>
                                <p><strong>Contact Before Visit:</strong> ${cluster.contactBeforeVisit ? 'Yes' : 'No'}</p>
                                <p><strong>Quarantine Status:</strong> ${cluster.isQuarantine ? 'Yes' : 'No'}</p>
                                
                                <h6 class="mt-3">Timeline & Requirements</h6>
                                ${cluster.harvestTimeline ? `<p><strong>Harvest Timeline:</strong> ${cluster.harvestTimeline}</p>` : ''}
                                ${cluster.sugarRequirements ? `<p><strong>Sugar Requirements:</strong> ${cluster.sugarRequirements}</p>` : ''}
                                
                                ${cluster.notes ? `
                                    <h6 class="mt-3">Notes</h6>
                                    <p>${cluster.notes}</p>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="editCluster(${cluster.id}); bootstrap.Modal.getInstance(document.getElementById('clusterDetailsModal')).hide();">
                            <i class="bi bi-pencil"></i> Edit Cluster
                        </button>
                        <button type="button" class="btn btn-success" onclick="scheduleTaskForCluster(${cluster.id}); bootstrap.Modal.getInstance(document.getElementById('clusterDetailsModal')).hide();">
                            <i class="bi bi-calendar-plus"></i> Schedule Task
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('clusterDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', detailsHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('clusterDetailsModal'));
    modal.show();
}

function scheduleTaskForCluster(clusterId) {
    // Pre-fill the schedule form with the selected cluster
    document.getElementById('scheduleCluster').value = clusterId;
    
    // Show the schedule modal
    const modal = new bootstrap.Modal(document.getElementById('scheduleTaskModal'));
    modal.show();
}

function archiveCluster(id) {
    const cluster = sites.find(c => c.id === id);
    if (!cluster) {
        beeMarshallAlert('Site not found', 'error');
        return;
    }
    
    if (confirm(`Archive "${cluster.name}"? This will:\n\n• Stop the site from appearing in hive/site counts\n• Keep historical harvest data\n• Make the site accessible only from "Show Archived Sites"\n\nYou can unarchive it later if needed.`)) {
        const tenantPath = currentTenantId ? `tenants/${currentTenantId}/sites` : 'sites';
        database.ref(`${tenantPath}/${id}`).update({
            archived: true,
            archivedDate: new Date().toISOString(),
            archivedBy: currentUser.username,
            lastModified: new Date().toISOString(),
            lastModifiedBy: currentUser.username
        }).then(() => {
            beeMarshallAlert(`✅ "${cluster.name}" has been archived`, 'success');
            
            // Log as action
            const actionText = `Archived site: ${cluster.name}`;
            const action = {
                id: Date.now(),
                clusterId: id,
                task: 'Archive Site',
                date: new Date().toISOString(),
                employee: currentUser.username,
                notes: actionText
            };
            
            const actionPath = currentTenantId ? `tenants/${currentTenantId}/actions` : 'actions';
            database.ref(`${actionPath}/${action.id}`).set(action).then(() => {
                // Refresh the sites list to update the UI
                renderClusters();
            });
        }).catch(error => {
            console.error('Error archiving cluster:', error);
            beeMarshallAlert('❌ Error archiving site. Please try again.', 'error');
        });
    }
}

function unarchiveCluster(id) {
    if (!isAdmin) {
        beeMarshallAlert('Only administrators can unarchive sites', 'error');
        return;
    }
    
    const cluster = sites.find(c => c.id === id);
    if (!cluster) {
        beeMarshallAlert('Site not found', 'error');
        return;
    }
    
    if (confirm(`Unarchive "${cluster.name}"? This will restore it to active status and include it in hive/site counts.`)) {
        const tenantPath = currentTenantId ? `tenants/${currentTenantId}/sites` : 'sites';
        database.ref(`${tenantPath}/${id}`).update({
            archived: false,
            unarchivedDate: new Date().toISOString(),
            unarchivedBy: currentUser.username,
            lastModified: new Date().toISOString(),
            lastModifiedBy: currentUser.username
        }).then(() => {
            beeMarshallAlert(`✅ "${cluster.name}" has been unarchived`, 'success');
            
            // Log as action
            const actionText = `Unarchived site: ${cluster.name}`;
            const action = {
                id: Date.now(),
                clusterId: id,
                task: 'Unarchive Site',
                date: new Date().toISOString(),
                employee: currentUser.username,
                notes: actionText
            };
            
            const actionPath = currentTenantId ? `tenants/${currentTenantId}/actions` : 'actions';
            database.ref(`${actionPath}/${action.id}`).set(action).then(() => {
                // Refresh the sites list to update the UI
                renderClusters();
            });
        }).catch(error => {
            console.error('Error unarchiving cluster:', error);
            beeMarshallAlert('❌ Error unarchiving site. Please try again.', 'error');
        });
    }
}

function deleteCluster(id) {
    // Only admins can delete, and only from archived state
    if (!isAdmin) {
        beeMarshallAlert('Only administrators can delete sites', 'error');
        return;
    }
    
    const cluster = sites.find(c => c.id === id);
    if (!cluster) {
        beeMarshallAlert('Site not found', 'error');
        return;
    }
    
    if (!cluster.archived) {
        beeMarshallAlert('⚠️ Sites must be archived before they can be permanently deleted.\n\nPlease archive the site first, then use the "Show Archived Sites" button to delete it.', 'warning');
        return;
    }
    
    const confirmMessage = `⚠️ PERMANENT DELETION\n\nSite: ${cluster.name}\n\n⚠️ WARNING: This will permanently delete:\n• The site and all its data\n• Historical harvest records for this site\n• All associated actions and history\n\n⚠️ This action CANNOT be undone!\n\nAre you absolutely sure you want to permanently delete this site?`;
    
    if (confirm(confirmMessage)) {
        // Double confirmation
        if (confirm('This is your last chance. Permanently delete this site? This action CANNOT be undone.')) {
            const tenantPath = currentTenantId ? `tenants/${currentTenantId}/sites` : 'sites';
            database.ref(`${tenantPath}/${id}`).remove().then(() => {
                beeMarshallAlert(`🗑️ Site "${cluster.name}" has been permanently deleted`, 'success');
                // Refresh the sites list to update the UI
                renderClusters();
            }).catch(error => {
                console.error('Error deleting cluster:', error);
                beeMarshallAlert('❌ Error deleting site. Please try again.', 'error');
            });
        }
    }
}

/**
 * Open cluster location in maps application
 * Detects platform and opens appropriate app (Google Maps or Apple Maps)
 */
function openInMaps(clusterId) {
    const cluster = sites.find(c => c.id === clusterId);
    if (!cluster) {
        beeMarshallAlert('Cluster not found', 'error');
        return;
    }
    
    const lat = cluster.latitude;
    const lon = cluster.longitude;
    const name = encodeURIComponent(cluster.name);
    
    // Detect platform
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);
    
    let mapUrl;
    
    if (isIOS) {
        // Apple Maps URL scheme
        mapUrl = `maps://maps.apple.com/?ll=${lat},${lon}&q=${lat},${lon}&label=${name}`;
        
        // Try to open Apple Maps, fall back to web URL if it fails
        window.location.href = mapUrl;
        
        // Fallback to web-based Apple Maps
        setTimeout(() => {
            window.open(`https://maps.apple.com/?ll=${lat},${lon}&q=${lat},${lon}&label=${name}`, '_blank');
        }, 100);
    } else if (isAndroid) {
        // Google Maps URL scheme
        mapUrl = `google.navigation:q=${lat},${lon}&label=${name}`;
        
        // Try to open Google Maps app, fall back to web URL if it fails
        window.location.href = mapUrl;
        
        // Fallback to web-based Google Maps
        setTimeout(() => {
            window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}&query_place_id=${name}`, '_blank');
        }, 100);
    } else {
        // Desktop/other platforms - open Google Maps in new tab
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}&query_place_id=${name}`;
        window.open(googleMapsUrl, '_blank');
    }
    
    Logger.log(`🗺️ Opening ${cluster.name} in maps (${isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'})`);
}

// Update map with new cluster data
function updateMapWithClusters() {
    console.log('🔄 Updating map with cluster data...');
    if (map && sites && sites.length > 0) {
        renderClusters();
    } else if (map) {
        console.log('📍 Map exists but no sites to render');
    } else {
        console.log('🗺️ Map not initialized yet');
    }
}

// Activate map when user clicks the placeholder
function activateMap() {
    console.log('🗺️ User clicked to activate map...');
    
    // Hide placeholder
    const placeholder = document.getElementById('mapPlaceholder');
    const mapElement = document.getElementById('map');
    
    if (placeholder && mapElement) {
        placeholder.style.display = 'none';
        mapElement.style.display = 'block';
        
        // Initialize map
        initMap();
        
        console.log('✅ Map activated and initialized');
    } else {
        console.error('❌ Map elements not found');
    }
}

// Enhanced map with cluster type colors
function initMap() {
    console.log('🗺️ Initializing map...');
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.log('❌ Map element not found');
        return;
    }
    
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.log('⏳ Leaflet not yet loaded, will retry...');
        setTimeout(initMap, 500);
        return;
    }
    
    // Always use Collingwood, NZ as default center
    const center = [-40.6764, 172.6856]; // Collingwood, NZ
    console.log('📍 Map center set to Collingwood, NZ');
    
    // Use global map if it exists, otherwise skip
    if (!window.beeMarshallMap) {
        console.log('🗺️ Global map not initialized, skipping cluster rendering');
        return;
    }
    
    // Use the global map
    map = window.beeMarshallMap;
    
    // Clear existing markers
    if (map._layers) {
        Object.values(map._layers).forEach(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    }
    markers = [];
    
    // Only render sites if we have data
    if (!sites || sites.length === 0) {
        console.log('📍 No sites to render yet');
        return;
    }
    
    console.log(`📍 Rendering ${sites.length} sites on map`);
    
    // Add marker for each site with type-specific colors
    sites.forEach(cluster => {
        try {
            const typeInfo = CLUSTER_TYPES[cluster.clusterType] || CLUSTER_TYPES['custom'];
            
            // Create custom icon with cluster type color
            const customIcon = L.divIcon({
                className: 'custom-cluster-marker',
                html: `<div style="
                    background-color: ${typeInfo.color};
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 10px;
                "><i class="bi ${typeInfo.icon}"></i></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            
            // Get pending tasks for this cluster
            const clusterTasks = scheduledTasks.filter(task => 
                task.clusterId === cluster.id && !task.completed
            ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            
            const marker = L.marker([cluster.latitude, cluster.longitude], { icon: customIcon })
                .bindPopup(`
                    <div style="padding:10px; min-width:250px;">
                        <h6>
                            <a href="#" onclick="viewClusterDetails(${cluster.id}); return false;" style="color: ${typeInfo.color}; text-decoration: none; font-weight: bold; cursor: pointer;">
                                <i class="bi ${typeInfo.icon}"></i> ${cluster.name}
                            </a>
                        </h6>
                        <p class="mb-1"><small>${cluster.description || 'No description'}</small></p>
                        <p class="mb-1"><strong>Type:</strong> <span style="color: ${typeInfo.color};">${typeInfo.name}</span></p>
                        <p class="mb-1"><strong>Hives:</strong> ${cluster.hiveCount}</p>
                        ${cluster.harvestTimeline ? `<p class="mb-1"><strong>Harvest:</strong> ${cluster.harvestTimeline}</p>` : ''}
                        ${cluster.sugarRequirements ? `<p class="mb-1"><strong>Sugar:</strong> ${cluster.sugarRequirements}</p>` : ''}
                        ${cluster.landownerName ? `<p class="mb-1"><strong>Landowner:</strong> ${cluster.landownerName}</p>` : ''}
                        
                        ${clusterTasks.length > 0 ? `
                            <div class="mt-3">
                                <h6 class="mb-2"><i class="bi bi-list-check"></i> Pending Tasks (${clusterTasks.length})</h6>
                                <div class="pending-tasks-list" style="max-height: 150px; overflow-y: auto;">
                                    ${clusterTasks.slice(0, 5).map(task => {
                                        const taskName = getTaskDisplayName(null, task.taskId);
                                        const dueDate = new Date(task.dueDate);
                                        const isOverdue = dueDate < new Date();
                                        const priorityClass = task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'secondary';
                                        
                                        return `
                                            <div class="pending-task-item mb-2 p-2" style="border-left: 3px solid var(--${priorityClass}); background: rgba(0,0,0,0.05); border-radius: 3px;">
                                                <div class="d-flex justify-content-between align-items-start">
                                                    <div class="flex-grow-1">
                                                        <strong style="font-size: 0.85rem;">${taskName}</strong>
                                                        <br><small class="text-muted">Due: ${dueDate.toLocaleDateString()}</small>
                                                        ${isOverdue ? '<br><span class="badge bg-danger" style="font-size: 0.7rem;">OVERDUE</span>' : ''}
                                                        ${task.priority !== 'normal' ? `<br><span class="badge bg-${priorityClass}" style="font-size: 0.7rem;">${task.priority.toUpperCase()}</span>` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                    ${clusterTasks.length > 5 ? `<small class="text-muted">... and ${clusterTasks.length - 5} more tasks</small>` : ''}
                                </div>
                            </div>
                        ` : `
                            <div class="mt-3">
                                <p class="text-muted mb-0"><i class="bi bi-check-circle"></i> No pending tasks</p>
                            </div>
                        `}
                        
                        <div class="mt-3 d-grid gap-1">
                            <button class="btn btn-sm btn-primary" onclick="viewClusterDetails(${cluster.id}); return false;">
                                <i class="bi bi-eye"></i> View Details
                            </button>
                            <button class="btn btn-sm btn-outline-primary" onclick="openInMaps(${cluster.id}); return false;">
                                <i class="bi bi-geo-alt-fill"></i> View on Maps
                            </button>
                            <button class="btn btn-sm btn-success" onclick="scheduleTaskForCluster(${cluster.id}); return false;">
                                <i class="bi bi-calendar-plus"></i> Schedule Task
                            </button>
                            <button class="btn btn-sm btn-outline-warning" onclick="editCluster(${cluster.id}); return false;">
                                <i class="bi bi-pencil"></i> Edit Cluster
                            </button>
                            ${clusterTasks.length > 0 ? `
                                <button class="btn btn-sm btn-outline-info" onclick="showScheduledTasks(); return false;">
                                    <i class="bi bi-list-check"></i> View All Tasks
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `, {
                    maxWidth: 300,
                    className: 'cluster-popup'
                })
                .on('popupopen', function() {
                    // Ensure popup events work correctly
                    const popup = this.getPopup();
                    const popupElement = popup.getElement();
                    if (popupElement) {
                        popupElement.style.zIndex = '1000';
                    }
                })
                .addTo(map);
            
            markers.push(marker);
        } catch (error) {
            console.error('Error adding marker for cluster:', cluster.name, error);
        }
    });
    
    // Fit bounds to show all markers
    if (sites.length > 1 && markers.length > 0) {
        try {
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1));
        } catch (error) {
            console.error('Error fitting bounds:', error);
        }
    }
}

// GPS Location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('GPS not supported by your browser');
        return;
    }
    
    showSyncStatus('<i class="bi bi-crosshair"></i> Getting GPS...', 'syncing');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            
            document.getElementById('clusterLat').value = lat;
            document.getElementById('clusterLng').value = lng;
            
            // Trigger validation to show success state
            validateCoordinates();
            
            showSyncStatus('<i class="bi bi-check"></i> Location captured!', 'success');
        },
        (error) => {
            showSyncStatus('<i class="bi bi-x"></i> GPS error', 'error');
            beeMarshallAlert('Could not get location: ' + error.message, 'error');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

// Map Picker with OpenStreetMap
function showMapPicker() {
    const container = document.getElementById('mapPickerContainer');
    
    if (typeof L === 'undefined') {
        alert('OpenStreetMap is still loading. Please wait a moment and try again.');
        return;
    }
    
    container.classList.toggle('hidden');
    
    if (!container.classList.contains('hidden')) {
        setTimeout(() => {
            const lat = parseFloat(document.getElementById('clusterLat').value) || -40.6764; // Collingwood, NZ
            const lng = parseFloat(document.getElementById('clusterLng').value) || 172.6856;
            
            // Clear existing map if any
            if (mapPicker) {
                mapPicker.remove();
            }
            
            mapPicker = L.map('mapPicker').setView([lat, lng], 13);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(mapPicker);
            
            let pickerMarker = L.marker([lat, lng], { draggable: true })
                .addTo(mapPicker);
            
            // Click map to move marker
            mapPicker.on('click', (e) => {
                pickerMarker.setLatLng(e.latlng);
                document.getElementById('clusterLat').value = e.latlng.lat.toFixed(6);
                document.getElementById('clusterLng').value = e.latlng.lng.toFixed(6);
                // Trigger validation to show success state
                validateCoordinates();
            });
            
            // Drag marker
            pickerMarker.on('dragend', (e) => {
                const latlng = e.target.getLatLng();
                document.getElementById('clusterLat').value = latlng.lat.toFixed(6);
                document.getElementById('clusterLng').value = latlng.lng.toFixed(6);
                // Trigger validation to show success state
                validateCoordinates();
            });
        }, 200);
    }
}

// Visual Hive Box Grid for Site Reporting
let visualHiveData = null; // Track changes in visual grid

function renderVisualHiveGrid() {
    const container = document.getElementById('visualHiveGrid');
    if (!container) return;
    
    const clusterId = document.getElementById('clusterId')?.value;
    if (!clusterId) {
        container.innerHTML = '<p class="text-muted">Please select a site first to render the grid.</p>';
        return;
    }
    
    const cluster = sites.find(c => c.id === parseInt(clusterId));
    if (!cluster) {
        container.innerHTML = '<p class="text-muted">Site not found.</p>';
        return;
    }
    
    // Initialize visual hive data if not exists
    if (!visualHiveData) {
        visualHiveData = {
            doubles: cluster.hiveStacks?.doubles || 0,
            topSplits: cluster.hiveStacks?.topSplits || 0,
            singles: cluster.hiveStacks?.singles || 0,
            nucs: cluster.hiveStacks?.nucs || 0,
            empty: cluster.hiveStacks?.empty || 0
        };
    }
    
    const totalHives = visualHiveData.doubles + visualHiveData.topSplits + visualHiveData.singles + visualHiveData.nucs;
    
    let html = `
        <style>
            .hive-box {
                cursor: pointer;
                transition: all 0.3s ease;
                border: 3px solid;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                position: relative;
                overflow: hidden;
            }
            .hive-box::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
                pointer-events: none;
            }
            .hive-box:hover {
                transform: translateY(-5px) scale(1.05);
                box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            }
            .hive-box:active {
                transform: translateY(-2px) scale(1.02);
            }
            .hive-box i {
                font-size: 2.5rem;
                margin-bottom: 0.5rem;
                display: block;
            }
            .hive-count-display {
                font-size: 3rem;
                font-weight: 700;
                line-height: 1;
                margin: 0.5rem 0;
            }
            .hive-label-text {
                font-size: 0.9rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
        </style>
        
        <div class="row g-3 mb-4">
            <div class="col-6 col-md-4 col-lg-2-4">
                <div class="hive-box" style="border-color: #0d6efd; background: linear-gradient(135deg, #cfe2ff 0%, #b6d4fe 100%);" onclick="toggleHiveBox('doubles')" title="Click to update Double Stacks">
                    <div class="card-body text-center p-4">
                        <i class="bi bi-stack text-primary"></i>
                        <div id="doublesCount" class="hive-count-display text-primary">${visualHiveData.doubles}</div>
                        <div class="hive-label-text text-primary">Double Stacks</div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-4 col-lg-2-4">
                <div class="hive-box" style="border-color: #198754; background: linear-gradient(135deg, #d1e7dd 0%, #badbcc 100%);" onclick="toggleHiveBox('topSplits')" title="Click to update Top-Splits">
                    <div class="card-body text-center p-4">
                        <i class="bi bi-layers-half text-success"></i>
                        <div id="topSplitsCount" class="hive-count-display text-success">${visualHiveData.topSplits}</div>
                        <div class="hive-label-text text-success">Top-Splits</div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-4 col-lg-2-4">
                <div class="hive-box" style="border-color: #ffc107; background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);" onclick="toggleHiveBox('singles')" title="Click to update Single Stacks">
                    <div class="card-body text-center p-4">
                        <i class="bi bi-square text-warning"></i>
                        <div id="singlesCount" class="hive-count-display text-warning">${visualHiveData.singles}</div>
                        <div class="hive-label-text text-warning">Single Stacks</div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-4 col-lg-2-4">
                <div class="hive-box" style="border-color: #0dcaf0; background: linear-gradient(135deg, #cff4fc 0%, #b6effb 100%);" onclick="toggleHiveBox('nucs')" title="Click to update NUC Stacks">
                    <div class="card-body text-center p-4">
                        <i class="bi bi-circle text-info"></i>
                        <div id="nucsCount" class="hive-count-display text-info">${visualHiveData.nucs}</div>
                        <div class="hive-label-text text-info">NUC Stacks</div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-4 col-lg-2-4">
                <div class="hive-box" style="border-color: #6c757d; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);" onclick="toggleHiveBox('empty')" title="Click to update Empty Platforms">
                    <div class="card-body text-center p-4">
                        <i class="bi bi-square text-secondary"></i>
                        <div id="emptyCount" class="hive-count-display text-secondary">${visualHiveData.empty}</div>
                        <div class="hive-label-text text-secondary">Empty Platforms</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12">
                <div class="alert alert-success d-flex align-items-center justify-content-between">
                    <div>
                        <i class="bi bi-hexagon-fill me-2"></i>
                        <strong>Total Active Hives:</strong> <span id="totalActiveHives" class="badge bg-success ms-2" style="font-size: 1.2rem;">${totalHives}</span>
                    </div>
                    <small class="text-muted">Click any box above to update counts</small>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function toggleHiveBox(type) {
    if (!visualHiveData) return;
    
    // Show modal to increment or decrement
    const modalHtml = `
        <div class="modal fade" id="hiveBoxModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update ${type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="input-group mb-3">
                            <button class="btn btn-outline-danger" onclick="adjustHiveCount('${type}', -1)">
                                <i class="bi bi-dash"></i>
                            </button>
                            <input type="number" class="form-control text-center" id="hiveCountInput" value="${visualHiveData[type]}" min="0">
                            <button class="btn btn-outline-success" onclick="adjustHiveCount('${type}', 1)">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                        <div class="d-grid">
                            <button class="btn btn-primary" onclick="updateHiveCount('${type}')">
                                Update Count
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('hiveBoxModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('hiveBoxModal'));
    modal.show();
    
    // Clean up on close
    document.getElementById('hiveBoxModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

function adjustHiveCount(type, delta) {
    const input = document.getElementById('hiveCountInput');
    const newValue = Math.max(0, parseInt(input.value) + delta);
    input.value = newValue;
}

function updateHiveCount(type) {
    const input = document.getElementById('hiveCountInput');
    const newValue = parseInt(input.value) || 0;
    const oldValue = visualHiveData[type];
    
    // Update visual data
    visualHiveData[type] = newValue;
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('hiveBoxModal'));
    if (modal) modal.hide();
    
    // Re-render grid
    renderVisualHiveGrid();
    
    // Form inputs no longer exist - visual grid replaces them
    // updateStackTotals(); // Removed - no longer needed with visual hive grid
    
    // Auto-save to Firebase and log as action
    const clusterId = document.getElementById('clusterId')?.value;
    if (clusterId && oldValue !== newValue) {
        const cluster = sites.find(c => c.id === parseInt(clusterId));
        if (cluster) {
            // Update cluster data
            if (!cluster.hiveStacks) cluster.hiveStacks = {};
            cluster.hiveStacks[type] = newValue;
            cluster.hiveCount = visualHiveData.doubles + visualHiveData.topSplits + visualHiveData.singles + visualHiveData.nucs;
            
            // Save to Firebase
            const tenantPath = currentTenantId ? `tenants/${currentTenantId}/sites` : 'sites';
            database.ref(`${tenantPath}/${cluster.id}`).update({
                hiveStacks: cluster.hiveStacks,
                hiveCount: cluster.hiveCount,
                lastModified: new Date().toISOString(),
                lastModifiedBy: currentUser.username
            }).then(() => {
                // Log as action
                const typeLabel = type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const actionText = `Hive inventory updated at ${cluster.name}: ${typeLabel} changed from ${oldValue} to ${newValue}`;
                logSiteVisitAction(cluster.id, actionText);
                
                console.log('✅ Hive inventory auto-saved:', typeLabel, oldValue, '→', newValue);
            }).catch(error => {
                console.error('Error auto-saving hive changes:', error);
            });
        }
    }
}

function saveVisualHiveChanges() {
    const clusterId = document.getElementById('clusterId')?.value;
    if (!clusterId) {
        beeMarshallAlert('No site selected', 'warning');
        return;
    }
    
    const cluster = sites.find(c => c.id === parseInt(clusterId));
    if (!cluster) {
        beeMarshallAlert('Site not found', 'error');
        return;
    }
    
    // Detect changes
    const oldValues = {
        doubles: cluster.hiveStacks?.doubles || 0,
        topSplits: cluster.hiveStacks?.topSplits || 0,
        singles: cluster.hiveStacks?.singles || 0,
        nucs: cluster.hiveStacks?.nucs || 0,
        empty: cluster.hiveStacks?.empty || 0
    };
    
    const changes = [];
    if (oldValues.doubles !== visualHiveData.doubles) {
        changes.push(`Doubles: ${oldValues.doubles} → ${visualHiveData.doubles}`);
    }
    if (oldValues.topSplits !== visualHiveData.topSplits) {
        changes.push(`Top-Splits: ${oldValues.topSplits} → ${visualHiveData.topSplits}`);
    }
    if (oldValues.singles !== visualHiveData.singles) {
        changes.push(`Singles: ${oldValues.singles} → ${visualHiveData.singles}`);
    }
    if (oldValues.nucs !== visualHiveData.nucs) {
        changes.push(`NUCs: ${oldValues.nucs} → ${visualHiveData.nucs}`);
    }
    if (oldValues.empty !== visualHiveData.empty) {
        changes.push(`Empty: ${oldValues.empty} → ${visualHiveData.empty}`);
    }
    
    if (changes.length === 0) {
        beeMarshallAlert('No changes detected', 'info');
        return;
    }
    
    // Update cluster data
    cluster.hiveStacks = {
        doubles: visualHiveData.doubles,
        topSplits: visualHiveData.topSplits,
        singles: visualHiveData.singles,
        nucs: visualHiveData.nucs,
        empty: visualHiveData.empty
    };
    
    cluster.hiveCount = visualHiveData.doubles + visualHiveData.topSplits + visualHiveData.singles + visualHiveData.nucs;
    
    // Save to Firebase
    const clusterRef = database.ref(`sites/${cluster.id}`);
    clusterRef.update({
        hiveStacks: cluster.hiveStacks,
        hiveCount: cluster.hiveCount,
        lastModified: new Date().toISOString(),
        lastModifiedBy: currentUser.username
    }).then(() => {
        // Log as action
        const actionText = `Site visit and inventory update at ${cluster.name}. Changes: ${changes.join('; ')}`;
        logSiteVisitAction(cluster.id, actionText);
        
        beeMarshallAlert('✅ Site inventory updated and logged as action!', 'success');
    }).catch(error => {
        console.error('Error saving visual hive changes:', error);
        beeMarshallAlert('❌ Error saving changes', 'error');
    });
}

function logSiteVisitAction(clusterId, notes) {
    const newAction = {
        id: Date.now(),
        clusterId: parseInt(clusterId),
        task: 'Site Visit & Inventory',
        notes: notes,
        completedBy: currentUser.username,
        completedAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
    };
    
    actions.push(newAction);
    
    // Save to Firebase with tenant isolation
    const tenantPath = currentTenantId ? `tenants/${currentTenantId}/actions` : 'actions';
    database.ref(`${tenantPath}/${newAction.id}`).set(newAction);
}

// Edit hive state count (clickable numbers in Hive State card)
function editHiveStateCount(state) {
    const clusterId = document.getElementById('clusterId')?.value;
    if (!clusterId) {
        beeMarshallAlert('No site selected', 'warning');
        return;
    }
    
    // Get the cluster
    const cluster = sites.find(c => c.id === parseInt(clusterId));
    if (!cluster) {
        beeMarshallAlert('Site not found', 'error');
        return;
    }
    
    // Calculate current total from Hive Box totals (exclude Dead)
    const currentHiveBoxTotal = (visualHiveData ? 
        (visualHiveData.doubles + visualHiveData.topSplits + visualHiveData.singles + visualHiveData.nucs) :
        (cluster.hiveStacks?.doubles || 0) + (cluster.hiveStacks?.topSplits || 0) + 
        (cluster.hiveStacks?.singles || 0) + (cluster.hiveStacks?.nucs || 0)
    );
    
    // Get current hive state values
    const currentStrong = parseInt(document.getElementById('hiveStateStrong')?.textContent) || 0;
    const currentMedium = parseInt(document.getElementById('hiveStateMedium')?.textContent) || 0;
    const currentWeak = parseInt(document.getElementById('hiveStateWeak')?.textContent) || 0;
    const currentNUC = parseInt(document.getElementById('hiveStateNUC')?.textContent) || 0;
    
    // Calculate current state total (excluding Dead)
    const currentStateTotal = currentStrong + currentMedium + currentWeak + currentNUC;
    
    // Show total information
    const totalInfo = `Current Hive Box Total: ${currentHiveBoxTotal}\nCurrent State Total (Excluding Dead): ${currentStateTotal}`;
    
    // Get current value for this state
    const idMap = {
        'Strong': 'hiveStateStrong',
        'Medium': 'hiveStateMedium',
        'Weak': 'hiveStateWeak',
        'NUC': 'hiveStateNUC',
        'Dead': 'hiveStateDead'
    };
    
    const elementId = idMap[state];
    const currentElement = document.getElementById(elementId);
    const currentValue = parseInt(currentElement.textContent) || 0;
    
    // Prompt for new value
    const newValueStr = prompt(`${totalInfo}\n\nEnter new count for ${state} hives:`, currentValue);
    if (newValueStr === null) return; // User cancelled
    
    const newValue = parseInt(newValueStr) || 0;
    
    // If not updating Dead, validate that state total matches hive box total
    if (state !== 'Dead') {
        const otherStateTotal = (state === 'Strong' ? 0 : currentStrong) +
                               (state === 'Medium' ? 0 : currentMedium) +
                               (state === 'Weak' ? 0 : currentWeak) +
                               (state === 'NUC' ? 0 : currentNUC);
        
        const newStateTotal = otherStateTotal + newValue;
        
        if (newStateTotal !== currentHiveBoxTotal) {
            beeMarshallAlert(`⚠️ Warning: State total (${newStateTotal}) does not match Hive Box total (${currentHiveBoxTotal})\n\nPlease adjust other state counts or update the Hive Box totals first.`, 'warning');
            return;
        }
    }
    
    // Update the visual element
    currentElement.textContent = newValue;
    
    // Update hive strength data
    if (!cluster.hiveStrength) cluster.hiveStrength = {};
    cluster.hiveStrength[state.toLowerCase()] = newValue;
    
    // Save to Firebase
    const tenantPath = currentTenantId ? `tenants/${currentTenantId}/sites` : 'sites';
    database.ref(`${tenantPath}/${cluster.id}`).update({
        hiveStrength: cluster.hiveStrength,
        lastModified: new Date().toISOString(),
        lastModifiedBy: currentUser.username
    }).then(() => {
        // Log as action (save to Firebase, not just push to array)
        const actionText = `Updated ${state} hives at ${cluster.name}: ${currentValue} → ${newValue}`;
        const newAction = {
            id: Date.now(),
            clusterId: parseInt(clusterId),
            task: 'Hive State Update',
            notes: actionText,
            completedBy: currentUser.username,
            completedAt: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0]
        };
        
        actions.push(newAction);
        
        const actionPath = currentTenantId ? `tenants/${currentTenantId}/actions` : 'actions';
        return database.ref(`${actionPath}/${newAction.id}`).set(newAction);
    }).then(() => {
        console.log(`✅ ${state} hive count updated: ${currentValue} → ${newValue}`);
        beeMarshallAlert(`✅ ${state} hive count updated: ${currentValue} → ${newValue}`, 'success');
        
        // Trigger recalculation of totals
        if (typeof updateHiveStrengthTotals === 'function') {
            updateHiveStrengthTotals();
        }
    }).catch(error => {
        console.error('Error updating hive state:', error);
        beeMarshallAlert(`❌ Error updating ${state} hive count: ${error.message}`, 'error');
    });
}

/**
 * Toggle between showing active and archived sites
 */
function toggleArchivedSites() {
    showArchivedSites = !showArchivedSites;
    renderClusters();
}

/**
 * Update the archived button text based on current state
 */
function updateArchivedButtonText() {
    const button = document.getElementById('toggleArchivedButton');
    if (!button) return;
    
    const archivedCount = sites.filter(c => c.archived === true).length;
    const activeCount = sites.filter(c => !c.archived).length;
    
    if (showArchivedSites) {
        button.innerHTML = '<i class="bi bi-arrow-left"></i> Show Active Sites';
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-outline-primary');
    } else {
        button.innerHTML = `<i class="bi bi-archive"></i> Show Archived Sites${archivedCount > 0 ? ` (${archivedCount})` : ''}`;
        button.classList.remove('btn-outline-primary');
        button.classList.add('btn-outline-secondary');
    }
}

/**
 * Quick edit hive strength from summary card
 * Opens a prompt for entering new count and updates Firebase
 */
function quickEditHiveStrength(clusterId, state, currentValue) {
    const cluster = sites.find(c => c.id === clusterId);
    if (!cluster) {
        beeMarshallAlert('Site not found', 'error');
        return;
    }
    
    // Prompt for new value
    const newValueStr = prompt(`Update ${state} hives for ${cluster.name}:\n\nCurrent: ${currentValue}\n\nEnter new count:`, currentValue);
    if (newValueStr === null) return; // User cancelled
    
    const newValue = parseInt(newValueStr) || 0;
    
    if (newValue < 0) {
        beeMarshallAlert('Count cannot be negative', 'warning');
        return;
    }
    
    // Update cluster data
    if (!cluster.hiveStrength) cluster.hiveStrength = {};
    cluster.hiveStrength[state.toLowerCase()] = newValue;
    
    // Save to Firebase
    const tenantPath = currentTenantId ? `tenants/${currentTenantId}/sites` : 'sites';
    database.ref(`${tenantPath}/${clusterId}`).update({
        hiveStrength: cluster.hiveStrength,
        lastModified: new Date().toISOString(),
        lastModifiedBy: currentUser.username
    }).then(() => {
        // Update the display immediately
        const elementId = state === 'NUC' ? `hiveNUC_${clusterId}` : `hive${state}_${clusterId}`;
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = newValue;
        }
        
        // Log as action
        const actionText = `Updated ${state} hives at ${cluster.name}: ${currentValue} → ${newValue}`;
        const newAction = {
            id: Date.now(),
            clusterId: clusterId,
            task: 'Hive State Update',
            notes: actionText,
            completedBy: currentUser.username,
            completedAt: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0]
        };
        
        actions.push(newAction);
        
        const actionPath = currentTenantId ? `tenants/${currentTenantId}/actions` : 'actions';
        return database.ref(`${actionPath}/${newAction.id}`).set(newAction);
    }).then(() => {
        beeMarshallAlert(`✅ ${state} hive count updated: ${currentValue} → ${newValue}`, 'success');
    }).catch(error => {
        console.error('Error updating hive strength:', error);
        beeMarshallAlert(`❌ Error updating ${state} hive count: ${error.message}`, 'error');
    });
}

/**
 * Quick edit hive box count from summary card
 * Opens a prompt for entering new count and updates Firebase
 */
function quickEditHiveBox(clusterId, boxType, currentValue) {
    const cluster = sites.find(c => c.id === clusterId);
    if (!cluster) {
        beeMarshallAlert('Site not found', 'error');
        return;
    }
    
    // Format the box type for display
    const boxTypeLabel = boxType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    
    // Prompt for new value
    const newValueStr = prompt(`Update ${boxTypeLabel} for ${cluster.name}:\n\nCurrent: ${currentValue}\n\nEnter new count:`, currentValue);
    if (newValueStr === null) return; // User cancelled
    
    const newValue = parseInt(newValueStr) || 0;
    
    if (newValue < 0) {
        beeMarshallAlert('Count cannot be negative', 'warning');
        return;
    }
    
    // Update cluster data
    if (!cluster.hiveStacks) cluster.hiveStacks = {};
    cluster.hiveStacks[boxType] = newValue;
    
    // Recalculate total hive count (excluding empty)
    cluster.hiveCount = (cluster.hiveStacks.doubles || 0) + 
                       (cluster.hiveStacks.topSplits || 0) + 
                       (cluster.hiveStacks.singles || 0) + 
                       (cluster.hiveStacks.nucs || 0);
    
    // Save to Firebase
    const tenantPath = currentTenantId ? `tenants/${currentTenantId}/sites` : 'sites';
    database.ref(`${tenantPath}/${clusterId}`).update({
        hiveStacks: cluster.hiveStacks,
        hiveCount: cluster.hiveCount,
        lastModified: new Date().toISOString(),
        lastModifiedBy: currentUser.username
    }).then(() => {
        // Update the display immediately
        const elementId = `box${boxType.charAt(0).toUpperCase() + boxType.slice(1)}_${clusterId}`;
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = newValue;
        }
        
        // Log as action
        const actionText = `Updated ${boxTypeLabel} at ${cluster.name}: ${currentValue} → ${newValue}`;
        const newAction = {
            id: Date.now(),
            clusterId: clusterId,
            task: 'Hive Box Update',
            notes: actionText,
            completedBy: currentUser.username,
            completedAt: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0]
        };
        
        actions.push(newAction);
        
        const actionPath = currentTenantId ? `tenants/${currentTenantId}/actions` : 'actions';
        return database.ref(`${actionPath}/${newAction.id}`).set(newAction);
    }).then(() => {
        beeMarshallAlert(`✅ ${boxTypeLabel} count updated: ${currentValue} → ${newValue}`, 'success');
        
        // Update dashboard statistics if we're on the dashboard
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
    }).catch(error => {
        console.error('Error updating hive box:', error);
        beeMarshallAlert(`❌ Error updating ${boxTypeLabel} count: ${error.message}`, 'error');
    });
}
