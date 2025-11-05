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
    
    let totalWeak = 0;
    let totalNUC = 0;
    let totalDead = 0;
    let totalEmpty = 0;
    let totalQuarantine = 0;
    
    window.sites.forEach(site => {
        // Exclude archived sites from calculations
        if (site.archived) return;
        
        if (site.hiveStrength) {
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
    
    // Update the display
    const weakEl = document.getElementById('weakCount');
    const nucEl = document.getElementById('nucCount');
    const deadEl = document.getElementById('deadCount');
    const emptyEl = document.getElementById('emptyCount');
    const quarantineEl = document.getElementById('quarantineCount');
    
    if (weakEl) weakEl.textContent = totalWeak;
    if (nucEl) nucEl.textContent = totalNUC;
    if (deadEl) deadEl.textContent = totalDead;
    if (emptyEl) emptyEl.textContent = totalEmpty;
    if (quarantineEl) quarantineEl.textContent = totalQuarantine;
}

// Make function globally accessible
window.updateHiveStrengthBreakdown = updateHiveStrengthBreakdown;

