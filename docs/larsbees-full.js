/**
 * BeeMarshall - Forwarding Script v0.92
 * This file forwards to the new modular JavaScript architecture
 * Created to fix 404 errors from cached references to the old monolithic file
 */

console.log('🔄 Loading BeeMarshall modular architecture...');

// Load all modular JavaScript files in the correct order
const scripts = [
    'js/tasks.js',
    'js/scheduling.js', 
    'js/clusters.js',
    'js/actions.js',
    'js/employees.js',
    'js/navigation.js',
    'js/dashboard.js',
    'js/core.js'
];

// Function to load scripts sequentially
function loadScripts(scriptArray, index = 0) {
    if (index >= scriptArray.length) {
        console.log('✅ All BeeMarshall modules loaded successfully');
        return;
    }
    
    const script = document.createElement('script');
    script.src = scriptArray[index];
    script.onload = () => {
        console.log(`✅ Loaded: ${scriptArray[index]}`);
        loadScripts(scriptArray, index + 1);
    };
    script.onerror = () => {
        console.error(`❌ Failed to load: ${scriptArray[index]}`);
        // Continue loading other scripts even if one fails
        loadScripts(scriptArray, index + 1);
    };
    
    document.head.appendChild(script);
}

// Start loading the modular scripts
loadScripts(scripts);

// Legacy compatibility - expose some functions that might be expected
window.legacyCompatibility = {
    version: '0.92',
    message: 'BeeMarshall has been modularized. All functionality is now available through the new architecture.',
    modules: scripts
};

console.log('📦 BeeMarshall v0.92 - Modular Architecture Forwarding Script');
