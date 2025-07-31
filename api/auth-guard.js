// AUTH GUARD SYSTEM - FREEMIUM MODEL
// File: api/auth-guard.js

class AuthGuard {
    constructor() {
        this.currentUser = null;
        this.authInitialized = false;
        this.redirectPath = null;
        
        console.log('🔐 AuthGuard initialized - Freemium Model');
        this.initializeAuth();
    }

    async initializeAuth() {
        try {
            // Try Firebase first
            if (window.firebase) {
                await this.initFirebaseAuth();
            } else {
                // Fallback to localStorage session
                await this.initLocalAuth();
            }
        } catch (error) {
            console.error('❌ Auth initialization error:', error);
            await this.initLocalAuth();
        } finally {
            this.authInitialized = true;
        }
    }

    async initFirebaseAuth() {
        try {
            const { auth, onAuthStateChanged } = await import('./firebase-config.js');
            
            return new Promise((resolve) => {
                onAuthStateChanged(auth, (user) => {
                    this.currentUser = user;
                    console.log('🔥 Firebase Auth State:', user ? `Logged in as ${user.email}` : 'Not logged in');
                    resolve();
                });
            });
        } catch (error) {
            console.warn('⚠️ Firebase Auth failed, using localStorage fallback');
            throw error;
        }
    }

    async initLocalAuth() {
        // Check localStorage and sessionStorage for user session
        const localSession = localStorage.getItem('userSession');
        const sessionSession = sessionStorage.getItem('userSession');
        
        if (localSession) {
            try {
                const sessionData = JSON.parse(localSession);
                this.currentUser = {
                    uid: sessionData.uid,
                    email: sessionData.email,
                    displayName: sessionData.displayName
                };
                console.log('💾 Local Auth State: Logged in as', this.currentUser.email);
            } catch (error) {
                console.error('❌ Invalid local session data');
                localStorage.removeItem('userSession');
            }
        } else if (sessionSession) {
            try {
                const sessionData = JSON.parse(sessionSession);
                this.currentUser = {
                    uid: sessionData.uid,
                    email: sessionData.email,
                    displayName: sessionData.displayName
                };
                console.log('🔄 Session Auth State: Logged in as', this.currentUser.email);
            } catch (error) {
                console.error('❌ Invalid session data');
                sessionStorage.removeItem('userSession');
            }
        } else {
            this.currentUser = null;
            console.log('🚫 No active session found');
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
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
            '/pages/forgot-password.html'
        ];

        // Protected paths (require login)
        const protectedPaths = [
            '/pages/user-dashboard.html',
            '/pages/chat-andrea.html',
            '/modules/week-2.html',
            '/modules/week-3.html', 
            '/modules/week-4.html',
            '/modules/week-5.html',
            '/modules/week-6.html',
            '/modules/week-7.html',
            '/modules/module-hub.html' // Hub requires login to see full progress
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
            'forgot-password.html'
        ];

        const normalizedPath = pagePath.toLowerCase();
        return freePaths.some(path => normalizedPath.includes(path));
    }

    // Protect current page
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

        console.log('🔍 Page Protection Check:', {
            path: currentPath,
            requiresAuth: requiresAuth,
            isAuthenticated: this.isAuthenticated(),
            user: this.currentUser?.email || 'Not logged in'
        });

        if (requiresAuth && !this.isAuthenticated()) {
            this.redirectToLogin(currentPath);
            return false;
        }

        return true;
    }

    // Redirect to login with return path
    redirectToLogin(returnPath = null) {
        const redirectPath = returnPath || window.location.pathname + window.location.search;
        
        // Store redirect path
        sessionStorage.setItem('redirectAfterLogin', redirectPath);
        
        // Show premium upgrade message
        this.showUpgradeModal();
        
        console.log('🔐 Redirecting to login, return path:', redirectPath);
    }

    // Show upgrade modal for freemium
    showUpgradeModal() {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🎯</div>
                    <h2 style="color: #2c3e50; margin-bottom: 15px; font-size: 1.8rem;">Sblocca il Percorso Completo!</h2>
                    <p style="color: #7f8c8d; margin-bottom: 25px; line-height: 1.6;">
                        Hai completato il primo assaggio gratuito!<br>
                        <strong>Registrati ora</strong> per accedere a tutte le 7 settimane di coaching personalizzato con Andrea.
                    </p>
                    
                    <div style="background: linear-gradient(45deg, #f39c12, #e67e22); color: white; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="margin-bottom: 10px;">🎁 Cosa ottieni GRATIS:</h3>
                        <ul style="text-align: left; list-style: none; padding: 0;">
                            <li style="padding: 3px 0;">✅ Accesso completo alle 6 settimane rimanenti</li>
                            <li style="padding: 3px 0;">✅ Dashboard personale con progressi</li>
                            <li style="padding: 3px 0;">✅ Chat 24/7 con Andrea coach</li>
                            <li style="padding: 3px 0;">✅ Materiali e risorse esclusive</li>
                        </ul>
                    </div>
                    
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        <a href="../pages/register.html" style="background: linear-gradient(45deg, #27ae60, #2ecc71); color: white; padding: 15px 25px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block; transition: transform 0.3s ease;">
                            🚀 Registrati Gratis
                        </a>
                        <a href="../pages/login.html" style="background: transparent; color: #3498db; border: 2px solid #3498db; padding: 13px 25px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block; transition: all 0.3s ease;">
                            Accedi
                        </a>
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <a href="../index.html" style="color: #95a5a6; text-decoration: none; font-size: 0.9rem;">← Torna alla Homepage</a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add click handlers for buttons
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                // Click outside modal - go to homepage
                window.location.href = '../index.html';
            }
        });

        // Auto-redirect to register after 10 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                window.location.href = '../pages/register.html';
            }
        }, 10000);
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
    }

    addWeek1CTA() {
        // Wait for page to load
        setTimeout(() => {
            const completionSection = document.querySelector('.completion-section');
            if (completionSection && !document.querySelector('.freemium-cta')) {
                const ctaHTML = `
                    <div class="freemium-cta" style="background: linear-gradient(135deg, #ff6b35, #f39c12); color: white; padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center;">
                        <h3 style="color: white; margin-bottom: 15px; font-size: 1.5rem;">🎉 Hai completato la prima settimana!</h3>
                        <p style="margin-bottom: 20px; font-size: 1.1rem; opacity: 0.95;">
                            Questo è solo l'inizio! Sblocca le altre <strong>6 settimane</strong> di coaching personalizzato con Andrea.
                        </p>
                        <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin: 15px 0;">
                            <strong>Week 2-7 include:</strong><br>
                            Consapevolezza • Obiettivi SMART • Piano Azione • Abitudini • Potenzialità • Consolidamento
                        </div>
                        <a href="../pages/register.html" style="background: white; color: #ff6b35; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block; margin: 10px; transition: transform 0.3s ease; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                            🚀 Sblocca Tutto Gratis
                        </a>
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

    // Logout function
    async logout() {
        try {
            // Try Firebase logout first
            if (window.firebase) {
                const { auth, signOut } = await import('./firebase-config.js');
                await signOut(auth);
            }
        } catch (error) {
            console.warn('⚠️ Firebase logout failed, clearing local session');
        }

        // Clear local sessions
        localStorage.removeItem('userSession');
        sessionStorage.removeItem('userSession');
        sessionStorage.removeItem('redirectAfterLogin');
        
        this.currentUser = null;
        
        console.log('👋 User logged out');
        
        // Redirect to homepage
        window.location.href = '../index.html';
    }

    // Get user display name
    getDisplayName() {
        if (!this.currentUser) return null;
        return this.currentUser.displayName || this.currentUser.email?.split('@')[0] || 'Utente';
    }

    // Check if user has premium access
    hasPremiumAccess() {
        return this.isAuthenticated();
    }

    // Show login prompt for premium features
    promptLogin(feature = 'questa funzione') {
        const shouldPrompt = confirm(`Per accedere a ${feature} devi essere registrato.\n\nVuoi registrarti ora gratuitamente?`);
        
        if (shouldPrompt) {
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = '../pages/register.html';
        }
    }
}

// Initialize AuthGuard globally
window.AuthGuard = new AuthGuard();

// Auto-protect pages that require authentication
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔐 Auto-protecting page...');
    
    const canAccess = await window.AuthGuard.protectPage();
    
    if (canAccess) {
        // Add freemium CTAs to free pages
        window.AuthGuard.addFreemiumCTA();
        
        console.log('✅ Page access granted');
    } else {
        console.log('🚫 Page access denied - redirecting to auth');
    }
});

// Export for ES6 modules
export default AuthGuard;