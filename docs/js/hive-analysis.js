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
}

// Make function globally accessible
window.updateHiveStrengthBreakdown = updateHiveStrengthBreakdown;

