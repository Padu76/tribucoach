// AUTH GUARD SYSTEM - FREEMIUM MODEL - UNIFIED SESSION INTEGRATION
// File: api/auth-guard.js
// 🔗 Integrato con unified-session-manager.js

class AuthGuard {
    constructor() {
        this.currentUser = null;
        this.authInitialized = false;
        this.redirectPath = null;
        this.sessionManager = null;
        this.authListeners = [];
        
        console.log('🛡️ AuthGuard initialized - Freemium Model with Unified Session');
        this.initializeAuth();
    }

    async initializeAuth() {
        try {
            // Wait for unified session manager to be ready
            await this.waitForSessionManager();
            
            // Initialize with unified session
            await this.initUnifiedAuth();
            
        } catch (error) {
            console.error('❌ Auth initialization error:', error);
            await this.initFallbackAuth();
        } finally {
            this.authInitialized = true;
            this.notifyAuthListeners();
        }
    }

    async waitForSessionManager() {
        return new Promise((resolve) => {
            const checkSessionManager = () => {
                if (window.sessionManager && window.isUserAuthenticated) {
                    this.sessionManager = window.sessionManager;
                    console.log('🔗 Session Manager connected to AuthGuard');
                    resolve();
                } else {
                    setTimeout(checkSessionManager, 100);
                }
            };
            checkSessionManager();
        });
    }

    async initUnifiedAuth() {
        try {
            // Use unified session manager as primary auth source
            const isAuth = window.isUserAuthenticated();
            const user = window.getCurrentUser();
            
            if (isAuth && user) {
                this.currentUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    emailVerified: user.emailVerified || true,
                    metadata: user.metadata
                };
                
                console.log('🔐 Unified Auth State: Logged in as', this.currentUser.email);
                
                // Listen for session changes
                this.setupSessionListener();
            } else {
                this.currentUser = null;
                console.log('🚫 No active unified session found');
            }
            
        } catch (error) {
            console.error('❌ Unified auth initialization failed:', error);
            throw error;
        }
    }

    setupSessionListener() {
        if (!this.sessionManager) return;
        
        // Listen for auth state changes from session manager
        this.sessionManager.onAuthStateChanged((user) => {
            const wasAuthenticated = !!this.currentUser;
            
            if (user) {
                this.currentUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    emailVerified: user.emailVerified || true,
                    metadata: user.metadata
                };
                console.log('🔄 Auth state updated: Logged in as', this.currentUser.email);
            } else {
                this.currentUser = null;
                console.log('🔄 Auth state updated: Logged out');
            }
            
            // Notify listeners of auth change
            this.notifyAuthListeners();
            
            // Handle page protection on auth state change
            if (wasAuthenticated && !user) {
                // User logged out - check if current page needs protection
                setTimeout(() => this.protectPage(), 100);
            }
        });
    }

    async initFallbackAuth() {
        // Fallback to old localStorage system if unified session fails
        console.warn('⚠️ Falling back to legacy auth system');
        
        const localSession = localStorage.getItem('userSession') || localStorage.getItem('tribucoach_session');
        const sessionSession = sessionStorage.getItem('userSession');
        
        if (localSession) {
            try {
                const sessionData = JSON.parse(localSession);
                this.currentUser = {
                    uid: sessionData.uid || sessionData.userId,
                    email: sessionData.email,
                    displayName: sessionData.displayName || sessionData.name
                };
                console.log('💾 Fallback Auth State: Logged in as', this.currentUser.email);
            } catch (error) {
                console.error('❌ Invalid fallback session data');
                localStorage.removeItem('userSession');
                localStorage.removeItem('tribucoach_session');
            }
        } else if (sessionSession) {
            try {
                const sessionData = JSON.parse(sessionSession);
                this.currentUser = {
                    uid: sessionData.uid || sessionData.userId,
                    email: sessionData.email,
                    displayName: sessionData.displayName || sessionData.name
                };
                console.log('📄 Fallback Session Auth: Logged in as', this.currentUser.email);
            } catch (error) {
                console.error('❌ Invalid fallback session data');
                sessionStorage.removeItem('userSession');
            }
        } else {
            this.currentUser = null;
            console.log('🚫 No fallback session found');
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        // Use unified session manager if available
        if (this.sessionManager && window.isUserAuthenticated) {
            return window.isUserAuthenticated();
        }
        
        // Fallback to local check
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        // Use unified session manager if available
        if (this.sessionManager && window.getCurrentUser) {
            return window.getCurrentUser();
        }
        
        // Fallback to local user
        return this.currentUser;
    }

    // Check if page requires authentication
    requiresAuth(pagePath = window.location.pathname) {
        const freePaths = [
            '/',
            '/index.html',
            '/pages/lifestyle-quiz.html', 
            '/modules/week-1.html',
            '/pages/login.html',
            '/pages/register.html',
            '/pages/forgot-password.html',
            '/pages/chi-sono.html'
        ];

        // Protected paths (require login)
        const protectedPaths = [
            '/pages/user-dashboard.html',
            '/pages/dashboard.html',
            '/pages/chat-andrea.html',
            '/modules/week-2.html',
            '/modules/week-3.html', 
            '/modules/week-4.html',
            '/modules/week-5.html',
            '/modules/week-6.html',
            '/modules/week-7.html',
            '/modules/module-hub.html',
            '/pages/admin/',
            '/pages/lifestyle-coaching.html'
        ];

        // Normalize path
        const normalizedPath = pagePath.toLowerCase();
        
        // Check if path requires auth
        return protectedPaths.some(path => 
            normalizedPath.includes(path.toLowerCase()) || 
            normalizedPath.endsWith(path.toLowerCase().split('/').pop())
        );
    }

    // Check if current page is free
    isFreePage(pagePath = window.location.pathname) {
        const freePaths = [
            'index.html',
            'lifestyle-quiz.html',
            'week-1.html',
            'login.html', 
            'register.html',
            'forgot-password.html',
            'chi-sono.html'
        ];

        const normalizedPath = pagePath.toLowerCase();
        return freePaths.some(path => normalizedPath.includes(path));
    }

    // Enhanced page protection with unified session
    async protectPage() {
        if (!this.authInitialized) {
            // Wait for auth to initialize
            await new Promise(resolve => {
                const checkAuth = () => {
                    if (this.authInitialized) {
                        resolve();
                    } else {
                        setTimeout(checkAuth, 100);
                    }
                };
                checkAuth();
            });
        }

        const currentPath = window.location.pathname;
        const requiresAuth = this.requiresAuth(currentPath);
        const isAuth = this.isAuthenticated();
        const user = this.getCurrentUser();

        console.log('🛡️ Page Protection Check:', {
            path: currentPath,
            requiresAuth: requiresAuth,
            isAuthenticated: isAuth,
            user: user?.email || 'Not logged in',
            sessionManager: !!this.sessionManager
        });

        if (requiresAuth && !isAuth) {
            this.redirectToLogin(currentPath);
            return false;
        }

        // If authenticated, extend session
        if (isAuth && this.sessionManager) {
            this.sessionManager.extendSession();
        }

        return true;
    }

    // Enhanced redirect with unified session support
    redirectToLogin(returnPath = null) {
        const redirectPath = returnPath || window.location.pathname + window.location.search;
        
        // Store redirect path in both systems for compatibility
        sessionStorage.setItem('redirectAfterLogin', redirectPath);
        if (this.sessionManager) {
            this.sessionManager.updateUserData({ 
                pendingRedirect: redirectPath,
                redirectTimestamp: Date.now()
            });
        }
        
        // Show premium upgrade message
        this.showUpgradeModal();
        
        console.log('🔄 Redirecting to login, return path:', redirectPath);
    }

    // Enhanced upgrade modal with session awareness
    showUpgradeModal() {
        // Check if modal already exists
        if (document.querySelector('.auth-guard-modal')) {
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'auth-guard-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: modalSlideIn 0.3s ease-out;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🎯</div>
                    <h2 style="color: #2c3e50; margin-bottom: 15px; font-size: 1.8rem;">Sblocca il Percorso Completo!</h2>
                    <p style="color: #7f8c8d; margin-bottom: 25px; line-height: 1.6;">
                        Hai completato il primo assaggio gratuito!<br>
                        <strong>Registrati ora</strong> per accedere a tutte le 7 settimane di coaching personalizzato con Andrea.
                    </p>
                    
                    <div style="background: linear-gradient(45deg, #f39c12, #e67e22); color: white; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="margin-bottom: 10px; color: white;">🎁 Cosa ottieni GRATIS:</h3>
                        <ul style="text-align: left; list-style: none; padding: 0; margin: 0;">
                            <li style="padding: 3px 0;">✅ Accesso completo alle 6 settimane rimanenti</li>
                            <li style="padding: 3px 0;">✅ Dashboard personale con progressi</li>
                            <li style="padding: 3px 0;">✅ Chat 24/7 con Andrea coach</li>
                            <li style="padding: 3px 0;">✅ Materiali e risorse esclusive</li>
                            <li style="padding: 3px 0;">✅ Salvataggio automatico progressi</li>
                        </ul>
                    </div>
                    
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 25px;">
                        <a href="${this.getRegisterUrl()}" style="background: linear-gradient(45deg, #27ae60, #2ecc71); color: white; padding: 15px 25px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block; transition: transform 0.3s ease; box-shadow: 0 3px 15px rgba(39,174,96,0.3);" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            🚀 Registrati Gratis
                        </a>
                        <a href="${this.getLoginUrl()}" style="background: transparent; color: #3498db; border: 2px solid #3498db; padding: 13px 25px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block; transition: all 0.3s ease;" onmouseover="this.style.background='#3498db'; this.style.color='white'" onmouseout="this.style.background='transparent'; this.style.color='#3498db'">
                            🔐 Accedi
                        </a>
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <a href="${this.getHomeUrl()}" style="color: #95a5a6; text-decoration: none; font-size: 0.9rem;">← Torna alla Homepage</a>
                    </div>
                    
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ecf0f1;">
                        <span style="font-size: 0.8rem; color: #bdc3c7;">
                            💾 La tua sessione è protetta dal sistema unificato TribuCoach
                        </span>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes modalSlideIn {
                    from { 
                        opacity: 0; 
                        transform: translateY(-50px) scale(0.9); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                    }
                }
            </style>
        `;

        document.body.appendChild(modal);

        // Add click handlers
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                // Click outside modal - go to homepage
                window.location.href = this.getHomeUrl();
            }
        });

        // Auto-redirect to register after 12 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                window.location.href = this.getRegisterUrl();
            }
        }, 12000);

        // Add escape key handler
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                window.location.href = this.getHomeUrl();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    // Smart URL generation based on current location
    getRegisterUrl() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/pages/') || currentPath.includes('/modules/')) {
            return '../pages/register.html';
        }
        return './pages/register.html';
    }

    getLoginUrl() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/pages/') || currentPath.includes('/modules/')) {
            return '../pages/login.html';
        }
        return './pages/login.html';
    }

    getHomeUrl() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/pages/') || currentPath.includes('/modules/')) {
            return '../index.html';
        }
        return './index.html';
    }

    // Add freemium CTA to free pages
    addFreemiumCTA() {
        if (this.isAuthenticated()) {
            return; // Don't show CTA to logged users
        }

        const currentPath = window.location.pathname.toLowerCase();
        
        // Add CTA to end of Week-1
        if (currentPath.includes('week-1.html')) {
            this.addWeek1CTA();
        }
        
        // Add CTA to quiz completion
        if (currentPath.includes('lifestyle-quiz.html')) {
            this.addQuizCTA();
        }

        // Add session-aware CTAs
        this.addSessionAwareCTAs();
    }

    addSessionAwareCTAs() {
        // Add session info to existing CTAs
        const existingCTAs = document.querySelectorAll('.freemium-cta');
        existingCTAs.forEach(cta => {
            if (!cta.querySelector('.session-info')) {
                const sessionInfo = document.createElement('div');
                sessionInfo.className = 'session-info';
                sessionInfo.style.cssText = 'font-size: 0.8rem; opacity: 0.8; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3);';
                sessionInfo.innerHTML = `💾 Sistema di sessione unificato - I tuoi progressi saranno salvati automaticamente`;
                cta.appendChild(sessionInfo);
            }
        });
    }

    addWeek1CTA() {
        // Wait for page to load
        setTimeout(() => {
            const completionSection = document.querySelector('.completion-section');
            if (completionSection && !document.querySelector('.freemium-cta')) {
                const ctaHTML = `
                    <div class="freemium-cta" style="background: linear-gradient(135deg, #ff6b35, #f39c12); color: white; padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; box-shadow: 0 10px 30px rgba(255,107,53,0.3);">
                        <h3 style="color: white; margin-bottom: 15px; font-size: 1.5rem;">🎉 Hai completato la prima settimana!</h3>
                        <p style="margin-bottom: 20px; font-size: 1.1rem; opacity: 0.95;">
                            Questo è solo l'inizio! Sblocca le altre <strong>6 settimane</strong> di coaching personalizzato con Andrea.
                        </p>
                        <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin: 15px 0;">
                            <strong>Week 2-7 include:</strong><br>
                            Consapevolezza • Obiettivi SMART • Piano Azione • Abitudini • Potenzialità • Consolidamento
                        </div>
                        <a href="${this.getRegisterUrl()}" style="background: white; color: #ff6b35; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block; margin: 10px; transition: transform 0.3s ease; box-shadow: 0 5px 15px rgba(0,0,0,0.2);" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            🚀 Sblocca Tutto Gratis
                        </a>
                        <div style="font-size: 0.8rem; opacity: 0.8; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.3);">
                            💾 Sistema di sessione unificato - I tuoi progressi saranno salvati automaticamente
                        </div>
                    </div>
                `;
                
                completionSection.insertAdjacentHTML('beforeend', ctaHTML);
            }
        }, 2000);
    }

    addQuizCTA() {
        // This will be handled by the quiz completion flow
        console.log('📋 Quiz CTA will be added at completion');
    }

    // Enhanced logout with unified session support
    async logout() {
        try {
            // Use unified session manager logout if available
            if (this.sessionManager && window.logoutUser) {
                await window.logoutUser();
                console.log('🔄 Unified session logout completed');
            } else {
                // Fallback to manual logout
                await this.manualLogout();
            }
        } catch (error) {
            console.error('❌ Logout error:', error);
            await this.manualLogout();
        }

        this.currentUser = null;
        this.notifyAuthListeners();
        
        console.log('👋 User logged out');
        
        // Redirect to homepage
        window.location.href = this.getHomeUrl();
    }

    async manualLogout() {
        // Try Firebase logout first
        try {
            if (window.firebase) {
                const { auth, signOut } = await import('./firebase-config.js');
                await signOut(auth);
            }
        } catch (error) {
            console.warn('⚠️ Firebase logout failed, clearing local session');
        }

        // Clear all possible sessions
        localStorage.removeItem('userSession');
        localStorage.removeItem('tribucoach_session');
        localStorage.removeItem('tribucoach_user');
        localStorage.removeItem('tribucoach_auth');
        sessionStorage.removeItem('userSession');
        sessionStorage.removeItem('redirectAfterLogin');
    }

    // Auth state change listeners
    onAuthStateChanged(callback) {
        this.authListeners.push(callback);
        
        // Call immediately with current state
        setTimeout(() => callback(this.getCurrentUser()), 50);
        
        // Return unsubscribe function
        return () => {
            const index = this.authListeners.indexOf(callback);
            if (index > -1) {
                this.authListeners.splice(index, 1);
            }
        };
    }

    notifyAuthListeners() {
        const user = this.getCurrentUser();
        this.authListeners.forEach(callback => {
            try {
                callback(user);
            } catch (error) {
                console.error('❌ Error in auth listener:', error);
            }
        });
    }

    // Get user display name
    getDisplayName() {
        const user = this.getCurrentUser();
        if (!user) return null;
        return user.displayName || user.email?.split('@')[0] || 'Utente';
    }

    // Check if user has premium access (in freemium model, registration = premium)
    hasPremiumAccess() {
        return this.isAuthenticated();
    }

    // Get user role
    getUserRole() {
        const user = this.getCurrentUser();
        if (!user) return 'guest';
        
        // Check for admin role
        if (user.email && user.email.includes('admin@')) {
            return 'admin';
        }
        
        return 'user';
    }

    // Check admin access
    isAdmin() {
        return this.getUserRole() === 'admin';
    }

    // Show login prompt for premium features
    promptLogin(feature = 'questa funzione') {
        const shouldPrompt = confirm(`Per accedere a ${feature} devi essere registrato.\n\nVuoi registrarti ora gratuitamente?`);
        
        if (shouldPrompt) {
            const redirectPath = window.location.href;
            sessionStorage.setItem('redirectAfterLogin', redirectPath);
            
            if (this.sessionManager) {
                this.sessionManager.updateUserData({ 
                    pendingRedirect: redirectPath,
                    promptedFeature: feature
                });
            }
            
            window.location.href = this.getRegisterUrl();
        }
    }

    // Get session info
    getSessionInfo() {
        if (this.sessionManager && this.sessionManager.sessionInfo) {
            return this.sessionManager.sessionInfo;
        }
        
        return {
            isValid: this.isAuthenticated(),
            loginTime: null,
            lastActivity: Date.now(),
            loginMethod: 'legacy'
        };
    }

    // Check if session is valid and not expired
    isSessionValid() {
        const sessionInfo = this.getSessionInfo();
        
        if (!sessionInfo.isValid) return false;
        
        // Check for session expiry (30 days)
        if (sessionInfo.loginTime) {
            const sessionAge = Date.now() - sessionInfo.loginTime;
            const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
            return sessionAge < maxAge;
        }
        
        return true;
    }
}

// Initialize AuthGuard globally
window.AuthGuard = new AuthGuard();

// Auto-protect pages that require authentication
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🛡️ Auto-protecting page with unified session...');
    
    const canAccess = await window.AuthGuard.protectPage();
    
    if (canAccess) {
        // Add freemium CTAs to free pages
        window.AuthGuard.addFreemiumCTA();
        
        console.log('✅ Page access granted');
    } else {
        console.log('🚫 Page access denied - redirecting to auth');
    }
});

// Auto-cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Save any pending data if authenticated
    if (window.AuthGuard && window.AuthGuard.isAuthenticated() && window.AuthGuard.sessionManager) {
        window.AuthGuard.sessionManager.extendSession();
    }
});

// Export for ES6 modules
export default AuthGuard;