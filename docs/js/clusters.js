// BeeMarshall - Cluster Management Module with Custom Grouping

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

// Navigation
function showClusters() {
    hideAllViews();
    document.getElementById('clustersView').classList.remove('hidden');
    if (typeof updateActiveNav === 'function') {
        updateActiveNav('Clusters');
    }
    renderClusters();
    renderClusterTypeFilter();
}

function renderClusters() {
    const html = clusters.length > 0
        ? clusters.map(c => {
            const deleteBtn = canDeleteCluster() ? `
                <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); deleteCluster(${c.id})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            ` : '';
            
            const clusterType = c.clusterType || 'production';
            const typeInfo = CLUSTER_TYPES[clusterType] || CLUSTER_TYPES['custom'];
            
            return `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card cluster-card h-100" data-cluster-type="${clusterType}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title">
                                    <i class="bi ${typeInfo.icon}" style="color: ${typeInfo.color}"></i> 
                                    ${c.name}
                                </h5>
                                <span class="badge" style="background-color: ${typeInfo.color}; color: white;">
                                    ${typeInfo.name}
                                </span>
                            </div>
                            <p class="card-text text-muted">${c.description || 'No description'}</p>
                            <ul class="list-unstyled small">
                                <li><strong>Hives:</strong> ${c.hiveCount}</li>
                                <li><strong>GPS:</strong> ${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}</li>
                                ${c.harvestTimeline ? `<li><strong>Harvest:</strong> ${c.harvestTimeline}</li>` : ''}
                                ${c.sugarRequirements ? `<li><strong>Sugar:</strong> ${c.sugarRequirements}</li>` : ''}
                                ${c.landownerName ? `<li><strong>Landowner:</strong> ${c.landownerName}</li>` : ''}
                                ${c.siteType ? `<li><strong>Site Type:</strong> ${c.siteType}</li>` : ''}
                            </ul>
                            ${c.lastModifiedBy ? `<small class="text-muted"><i class="bi bi-person"></i> ${c.lastModifiedBy}</small>` : ''}
                        </div>
                        <div class="card-footer bg-light">
                            <button class="btn btn-primary" onclick="editCluster(${c.id})">
                                <i class="bi bi-pencil"></i> Update
                            </button>
                            <button class="btn btn-sm btn-outline-info" onclick="viewClusterDetails(${c.id})">
                                <i class="bi bi-eye"></i> View
                            </button>
                            ${deleteBtn}
                        </div>
                    </div>
                </div>
            `;
        }).join('')
        : '<div class="col-12"><p class="text-center text-muted my-5">No clusters yet. Add your first cluster!</p></div>';
    
    document.getElementById('clustersList').innerHTML = html;
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
    document.getElementById('clusterFormTitle').textContent = 'Add New Hive Cluster';
    document.getElementById('clusterForm').reset();
    document.getElementById('clusterId').value = '';
    document.getElementById('anomalySection')?.classList.add('hidden');
    document.getElementById('mapPickerContainer').classList.add('hidden');
    
    // Populate cluster type dropdown
    populateClusterTypeDropdown();
    
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
    
    // Validate coordinates
    const lat = parseFloat(document.getElementById('clusterLat').value);
    const lng = parseFloat(document.getElementById('clusterLng').value);
    
    if (isNaN(lat) || isNaN(lng)) {
        alert('Please enter valid GPS coordinates.');
        return;
    }
    
    if (lat < -90 || lat > 90) {
        alert('Latitude must be between -90 and 90 degrees.');
        return;
    }
    
    if (lng < -180 || lng > 180) {
        alert('Longitude must be between -180 and 180 degrees.');
        return;
    }
    
    const id = document.getElementById('clusterId').value;
    const cluster = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('clusterName').value,
        description: document.getElementById('clusterDescription').value,
        latitude: parseFloat(document.getElementById('clusterLat').value) || 0,
        longitude: parseFloat(document.getElementById('clusterLng').value) || 0,
        hiveCount: parseInt(document.getElementById('clusterHiveCount').value),
        // Hive strength breakdown
        hiveStrength: {
            strong: parseInt(document.getElementById('hiveStrong').value) || 0,
            medium: parseInt(document.getElementById('hiveMedium').value) || 0,
            weak: parseInt(document.getElementById('hiveWeak').value) || 0,
            nuc: parseInt(document.getElementById('hiveNUC').value) || 0,
            dead: parseInt(document.getElementById('hiveDead').value) || 0
        },
        // Hive stack configuration - get from visual grid data if available, otherwise from cluster data
        hiveStacks: visualHiveData ? {
            doubles: visualHiveData.doubles || 0,
            topSplits: visualHiveData.topSplits || 0,
            singles: visualHiveData.singles || 0,
            nucs: visualHiveData.nucs || 0,
            empty: visualHiveData.empty || 0
        } : (clusters.find(c => c.id === parseInt(id))?.hiveStacks || {
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
        lastModifiedBy: currentUser.username,
        lastModifiedAt: new Date().toISOString(),
        createdAt: id ? (clusters.find(c => c.id === parseInt(id))?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };
    
    // Preserve harvest records if they exist
    if (id) {
        const existingCluster = clusters.find(c => c.id === parseInt(id));
        if (existingCluster && existingCluster.harvestRecords) {
            cluster.harvestRecords = existingCluster.harvestRecords;
        }
    }
    
    showSyncStatus('<i class="bi bi-arrow-repeat"></i> Saving...', 'syncing');
    
    // Use tenant-specific path for data isolation
    const tenantPath = currentTenantId ? `tenants/${currentTenantId}/clusters` : 'clusters';
    database.ref(`${tenantPath}/${cluster.id}`).set(cluster)
        .then(() => {
            showSyncStatus('<i class="bi bi-check"></i> Saved by ' + currentUser.username);
            showClusters();
        });
}

function editCluster(id) {
    const cluster = clusters.find(c => c.id === id);
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
        document.getElementById('hiveStrong').value = cluster.hiveStrength.strong || 0;
        document.getElementById('hiveMedium').value = cluster.hiveStrength.medium || 0;
        document.getElementById('hiveWeak').value = cluster.hiveStrength.weak || 0;
        document.getElementById('hiveNUC').value = cluster.hiveStrength.nuc || 0;
        document.getElementById('hiveDead').value = cluster.hiveStrength.dead || 0;
    }
    
    // Populate stack configuration - these elements are no longer in the HTML
    // The visual hive grid now replaces these inputs
    // Stack configuration data is now stored in visualHiveData and rendered via the grid
    
    // Update the breakdown summaries
    updateHiveStrengthTotals();
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
        const existingCluster = clusters.find(c => c.id === parseInt(clusterId));
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
        const clusterIndex = clusters.findIndex(c => c.id === parseInt(clusterId));
        if (clusterIndex !== -1) {
            clusters[clusterIndex].harvestRecords = harvestRecords;
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
    
    const existingCluster = clusters.find(c => c.id === parseInt(clusterId));
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
    
    const clusterIndex = clusters.findIndex(c => c.id === parseInt(clusterId));
    if (clusterIndex === -1) {
        beeMarshallAlert('Cluster not found', 'error');
        return;
    }
    
    if (!clusters[clusterIndex].harvestRecords) {
        clusters[clusterIndex].harvestRecords = [];
    }
    
    clusters[clusterIndex].harvestRecords.splice(index, 1);
    
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
    
    renderHarvestRecords(clusters[clusterIndex].harvestRecords);
    
    beeMarshallAlert('Harvest record removed', 'info');
}

function viewClusterDetails(id) {
    const cluster = clusters.find(c => c.id === id);
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

function deleteCluster(id) {
    // Check permission
    if (!canDeleteCluster()) {
        showPermissionDeniedAlert('delete clusters');
        return;
    }
    
    if (confirm('Delete this cluster? This cannot be undone!')) {
        // Use tenant-specific path for data isolation
        const tenantPath = currentTenantId ? `tenants/${currentTenantId}/clusters` : 'clusters';
        database.ref(`${tenantPath}/${id}`).remove();
    }
}

/**
 * Open cluster location in maps application
 * Detects platform and opens appropriate app (Google Maps or Apple Maps)
 */
function openInMaps(clusterId) {
    const cluster = clusters.find(c => c.id === clusterId);
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
    if (map && clusters && clusters.length > 0) {
        renderClusters();
    } else if (map) {
        console.log('📍 Map exists but no clusters to render');
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
    
    // Only render clusters if we have data
    if (!clusters || clusters.length === 0) {
        console.log('📍 No clusters to render yet');
        return;
    }
    
    console.log(`📍 Rendering ${clusters.length} clusters on map`);
    
    // Add marker for each cluster with type-specific colors
    clusters.forEach(cluster => {
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
    if (clusters.length > 1 && markers.length > 0) {
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
    
    const cluster = clusters.find(c => c.id === parseInt(clusterId));
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
        const cluster = clusters.find(c => c.id === parseInt(clusterId));
        if (cluster) {
            // Update cluster data
            if (!cluster.hiveStacks) cluster.hiveStacks = {};
            cluster.hiveStacks[type] = newValue;
            cluster.hiveCount = visualHiveData.doubles + visualHiveData.topSplits + visualHiveData.singles + visualHiveData.nucs;
            
            // Save to Firebase
            const tenantPath = currentTenantId ? `tenants/${currentTenantId}/clusters` : 'clusters';
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
    
    const cluster = clusters.find(c => c.id === parseInt(clusterId));
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
    const clusterRef = database.ref(`clusters/${cluster.id}`);
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
