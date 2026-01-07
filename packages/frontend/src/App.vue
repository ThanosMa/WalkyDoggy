<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <router-link to="/" class="logo">
          <span class="logo-icon">W</span>
          <span class="logo-text">WalkyDoggy</span>
        </router-link>
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
          
          <template v-if="isAuthenticated">
            <router-link to="/dashboard">Dashboard</router-link>
            <router-link to="/pets">Pets</router-link>
            <router-link to="/profile">Profile</router-link>
            <router-link to="/business">Business</router-link>
            <button @click="handleLogout" class="btn-logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-login">Log in</router-link>
            <router-link to="/register" class="btn-register">Get Started</router-link>
          </template>
        </nav>
      </div>
    </header>

    <main class="main">
      <router-view />
    </main>

    <footer class="footer">
      <div class="container">
        <p>© 2024 WalkyDoggy. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from './stores/auth';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const toast = useToast();
    const authStore = useAuthStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);

    onMounted(() => {
      // Initialize auth state from localStorage
      authStore.initializeAuth();
    });

    const handleLogout = async () => {
      await authStore.logout();
      toast.info('You have been logged out successfully');
      router.push('/');
    };

    return {
      isAuthenticated,
      handleLogout,
    };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.5;
  color: #1a1a2e;
  background: #f8fafc;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.header {
  background: #1a1a2e;
  color: white;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo {
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}

.logo-text {
  font-size: 1.125rem;
  letter-spacing: -0.025em;
}

.header nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.header nav a {
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  padding: 0.5rem 0.875rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.header nav a:hover {
  color: white;
  background: rgba(255,255,255,0.08);
}

.header nav a.router-link-active {
  color: white;
  background: rgba(255,255,255,0.12);
}

.btn-login {
  color: rgba(255,255,255,0.9) !important;
  border: 1px solid rgba(255,255,255,0.2) !important;
}

.btn-login:hover {
  border-color: rgba(255,255,255,0.4) !important;
}

.btn-register {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  color: white !important;
  font-weight: 600;
  border: none !important;
}

.btn-register:hover {
  opacity: 0.9;
}

.btn-logout {
  background: transparent;
  color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 0.5rem 0.875rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-logout:hover {
  color: white;
  border-color: rgba(255,255,255,0.4);
}

.btn-logout svg {
  opacity: 0.7;
}

.main {
  min-height: calc(100vh - 64px - 60px);
}

.footer {
  background: #1a1a2e;
  color: rgba(255,255,255,0.5);
  text-align: center;
  padding: 1.25rem 0;
  font-size: 0.875rem;
}

/* Global form styles */
input, select, textarea {
  font-family: 'Inter', sans-serif;
}

button {
  font-family: 'Inter', sans-serif;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    height: auto;
    padding: 1rem;
    gap: 1rem;
  }
  
  .header nav {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
