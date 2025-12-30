<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <router-link to="/" class="logo">
          <h1>🐾 WalkyDoggy</h1>
        </router-link>
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
          
          <template v-if="isAuthenticated">
            <router-link to="/dashboard">Dashboard</router-link>
            <button @click="handleLogout" class="btn-logout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-login">Login</router-link>
            <router-link to="/register" class="btn-register">Sign Up</router-link>
          </template>
        </nav>
      </div>
    </header>

    <main class="main">
      <router-view />
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 WalkyDoggy. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);

    onMounted(() => {
      // Initialize auth state from localStorage
      authStore.initializeAuth();
    });

    const handleLogout = async () => {
      await authStore.logout();
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  background: #3b82f6;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: white;
}

.logo h1 {
  font-size: 1.5rem;
  margin: 0;
}

.header nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.header nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.header nav a:hover,
.header nav a.router-link-active {
  background: rgba(255,255,255,0.1);
}

.btn-login {
  background: rgba(255,255,255,0.1) !important;
  border: 1px solid white;
}

.btn-register {
  background: white !important;
  color: #3b82f6 !important;
  font-weight: 600;
}

.btn-logout {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: rgba(255,255,255,0.2);
}

.main {
  min-height: calc(100vh - 140px);
}

.footer {
  background: #1f2937;
  color: white;
  text-align: center;
  padding: 1.5rem 0;
  margin-top: 2rem;
}
</style>
