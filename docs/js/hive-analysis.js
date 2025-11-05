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
    let totalQuarantine = 0;
    
    window.sites.forEach(site => {
        // Exclude archived sites from calculations
        if (site.archived) return;
        
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
        // Count quarantine sites
        if (site.isQuarantine) {
            totalQuarantine++;
        }
    });
    
    // Calculate total active hives (excluding dead and empty)
    const totalActiveHives = totalStrong + totalMedium + totalWeak + totalNUC;
    
    // Update the display
    const strongEl = document.getElementById('strongCount');
    const mediumEl = document.getElementById('mediumCount');
    const weakEl = document.getElementById('weakCount');
    const nucEl = document.getElementById('nucCount');
    const deadEl = document.getElementById('deadCount');
    const emptyEl = document.getElementById('emptyCount');
    const quarantineEl = document.getElementById('quarantineCount');
    
    if (strongEl) strongEl.textContent = totalStrong;
    if (mediumEl) mediumEl.textContent = totalMedium;
    if (weakEl) weakEl.textContent = totalWeak;
    if (nucEl) nucEl.textContent = totalNUC;
    if (deadEl) deadEl.textContent = totalDead;
    if (emptyEl) emptyEl.textContent = totalEmpty;
    if (quarantineEl) quarantineEl.textContent = totalQuarantine;
    
    // Update correlation display if it exists
    const correlationEl = document.getElementById('hiveBreakdownTotal');
    if (correlationEl) {
        correlationEl.textContent = totalActiveHives;
    }
    
    // Also update equipment breakdown
    updateEquipmentBreakdown();
}

// Update equipment breakdown (hive stacks)
function updateEquipmentBreakdown() {
    if (!window.sites || window.sites.length === 0) {
        if (typeof Logger !== 'undefined') {
            Logger.log('📭 No sites data for equipment breakdown');
        }
        return;
    }
    
    let totalDoubles = 0;
    let totalTopSplits = 0;
    let totalSingles = 0;
    let totalNUCs = 0;
    let totalEmpty = 0;
    
    window.sites.forEach(site => {
        // Exclude archived sites from calculations
        if (site.archived) return;
        
        if (site.hiveStacks) {
            totalDoubles += site.hiveStacks.doubles || 0;
            totalTopSplits += site.hiveStacks.topSplits || 0;
            totalSingles += site.hiveStacks.singles || 0;
            totalNUCs += site.hiveStacks.nucs || 0;
            totalEmpty += site.hiveStacks.empty || 0;
        }
    });
    
    // Calculate total equipment (excluding empty)
    const totalEquipment = totalDoubles + totalTopSplits + totalSingles + totalNUCs;
    
    // Update the display
    const doublesEl = document.getElementById('equipmentDoublesCount');
    const topSplitsEl = document.getElementById('equipmentTopSplitsCount');
    const singlesEl = document.getElementById('equipmentSinglesCount');
    const nucsEl = document.getElementById('equipmentNUCsCount');
    const emptyEl = document.getElementById('equipmentEmptyCount');
    const totalEl = document.getElementById('equipmentTotalCount');
    
    if (doublesEl) doublesEl.textContent = totalDoubles;
    if (topSplitsEl) topSplitsEl.textContent = totalTopSplits;
    if (singlesEl) singlesEl.textContent = totalSingles;
    if (nucsEl) nucsEl.textContent = totalNUCs;
    if (emptyEl) emptyEl.textContent = totalEmpty;
    if (totalEl) totalEl.textContent = totalEquipment;
}

// Make functions globally accessible
window.updateHiveStrengthBreakdown = updateHiveStrengthBreakdown;
window.updateEquipmentBreakdown = updateEquipmentBreakdown;

