// BeeMarshall - Secure Configuration Module
// This file handles secure loading of configuration from environment variables
// Updated: 2025-01-28 - Enhanced for GitHub Secrets integration
// Trigger: GitHub Actions workflow to inject secrets

class SecureConfig {
    constructor() {
        this.config = {};
        this.loadConfig();
    }

    loadConfig() {
        // Load configuration from environment variables or fallback to secure defaults
        this.config = {
            // Admin accounts - loaded from environment variables
            adminAccounts: this.loadAdminAccounts(),
            
            // Firebase configuration
            firebase: this.loadFirebaseConfig(),
            
            // API keys
            apiKeys: this.loadApiKeys(),
            
            // Security settings
            security: {
                minPasswordLength: 8,
                maxLoginAttempts: 5,
                sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
                requireStrongPasswords: true
            }
        };
    }

    loadAdminAccounts() {
        // Load admin accounts from environment variables
        // These should be set as GitHub Secrets in production
        const accounts = {};
        
        // SECURITY: Hash admin passwords immediately when loaded
        // GBTech account
        if (window.ENV_GBTECH_USERNAME && window.ENV_GBTECH_PASSWORD && 
            window.ENV_GBTECH_USERNAME !== '[SET_YOUR_GBTECH_PASSWORD]' && 
            window.ENV_GBTECH_PASSWORD !== '[SET_YOUR_GBTECH_PASSWORD]') {
            accounts['GBTech'] = {
                username: window.ENV_GBTECH_USERNAME,
                passwordHash: this.hashPassword(window.ENV_GBTECH_PASSWORD),
                tenantId: 'gbtech',
                role: 'master_admin'
            };
        } else {
            console.warn('⚠️ GBTech credentials not found in environment variables');
        }
        
        // Lars account
        if (window.ENV_LARS_USERNAME && window.ENV_LARS_PASSWORD && 
            window.ENV_LARS_USERNAME !== '[SET_YOUR_LARS_PASSWORD]' && 
            window.ENV_LARS_PASSWORD !== '[SET_YOUR_LARS_PASSWORD]') {
            accounts['Lars'] = {
                username: window.ENV_LARS_USERNAME,
                passwordHash: this.hashPassword(window.ENV_LARS_PASSWORD),
                tenantId: 'lars',
                role: 'admin'
            };
        } else {
            console.warn('⚠️ Lars credentials not found in environment variables');
        }
        
        // Demo account (also hash this for consistency)
        accounts['Demo'] = {
            username: 'Demo',
            passwordHash: this.hashPassword('Password1!'),
            tenantId: 'demo',
            role: 'demo_admin'
        };
        
        return accounts;
    }
    
    // SECURITY: Hash password using bcrypt or fallback
    hashPassword(password) {
        try {
            // Use bcrypt if available (loaded via CDN)
            if (typeof bcrypt !== 'undefined') {
                return bcrypt.hashSync(password, 12);
            } else {
                // Fallback: Use Web Crypto API for client-side hashing
                console.warn('⚠️ bcrypt not available, using Web Crypto API fallback for admin passwords');
                return this.hashWithWebCrypto(password);
            }
        } catch (error) {
            console.error('❌ Admin password hashing error:', error);
            throw new Error('Admin password hashing failed');
        }
    }
    
    // Web Crypto API fallback for admin password hashing (synchronous fallback)
    hashWithWebCrypto(password) {
        // For synchronous fallback, use a simple hash
        // This is not as secure as bcrypt but better than plain text
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36) + '_webcrypto';
    }

    loadFirebaseConfig() {
        // Load Firebase configuration from environment variables
        return {
            apiKey: window.ENV_FIREBASE_API_KEY || "",
            authDomain: window.ENV_FIREBASE_AUTH_DOMAIN || "",
            databaseURL: window.ENV_FIREBASE_DATABASE_URL || "",
            projectId: window.ENV_FIREBASE_PROJECT_ID || "",
            storageBucket: window.ENV_FIREBASE_STORAGE_BUCKET || "",
            messagingSenderId: window.ENV_FIREBASE_MESSAGING_SENDER_ID || "",
            appId: window.ENV_FIREBASE_APP_ID || ""
        };
    }

    loadApiKeys() {
        return {
            googleMaps: window.ENV_GOOGLE_MAPS_API_KEY || "",
            openWeather: window.ENV_OPENWEATHER_API_KEY || ""
        };
    }

    getAdminAccounts() {
        return this.config.adminAccounts;
    }

    getFirebaseConfig() {
        return this.config.firebase;
    }

    getApiKeys() {
        return this.config.apiKeys;
    }

    getSecuritySettings() {
        return this.config.security;
    }

    // Method to validate that required environment variables are set
    validateConfig() {
        const requiredVars = [
            'ENV_GBTECH_USERNAME',
            'ENV_GBTECH_PASSWORD',
            'ENV_LARS_USERNAME',
            'ENV_LARS_PASSWORD'
        ];
        
        const missing = requiredVars.filter(varName => !window[varName]);
        
        if (missing.length > 0) {
            console.warn('⚠️ Missing environment variables:', missing);
            console.warn('⚠️ Some admin accounts may not be available');
            return false;
        }
        
        return true;
    }
}

// Create global instance
window.SecureConfig = new SecureConfig();

// Validate configuration on load
if (!window.SecureConfig.validateConfig()) {
    console.warn('⚠️ Configuration validation failed. Some features may not work properly.');
}
