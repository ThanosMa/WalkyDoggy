<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <h1>Professional Pet Care<br/>Made Simple</h1>
        <p class="subtitle">Connect with trusted pet care professionals in your area</p>
        
        <div class="cta">
          <router-link to="/register" class="btn-primary">Get Started</router-link>
          <router-link to="/about" class="btn-secondary">Learn More</router-link>
        </div>
      </div>

      <div class="status-card" v-if="!apiStatus || loading">
        <div v-if="loading" class="loading">
          <div class="loader-small"></div>
          <span>Checking connection...</span>
        </div>
        <div v-else class="status-error">
          <span class="status-indicator error"></span>
          <span>Unable to connect to API</span>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <h3>Find Services</h3>
        <p>Discover pet care professionals near you</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <h3>Easy Booking</h3>
        <p>Book services with just a few clicks</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        </div>
        <h3>Secure Payments</h3>
        <p>Safe and convenient in-app payments</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <h3>Reviews</h3>
        <p>Read and leave reviews for services</p>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'Home',
  setup() {
    const apiStatus = ref(null);
    const loading = ref(true);

    const checkApiHealth = async () => {
      try {
        const response = await axios.get('http://localhost:3000/health');
        apiStatus.value = response.data;
      } catch (error) {
        console.error('API health check failed:', error);
        apiStatus.value = null;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      checkApiHealth();
    });

    return {
      apiStatus,
      loading,
    };
  },
};
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 124px);
}

.hero {
  text-align: center;
  padding: 4rem 2rem 3rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
  color: white;
}

.hero-content {
  max-width: 700px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 2.75rem;
  margin-bottom: 1rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.125rem;
  color: rgba(255,255,255,0.7);
  margin-bottom: 2rem;
}

.status-card {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin-top: 1.5rem;
  font-size: 0.875rem;
}

.loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255,255,255,0.7);
}

.loader-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.status-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fca5a5;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.error {
  background: #ef4444;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: #1a1a2e;
  font-weight: 600;
}

.feature-card p {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.5;
}

.cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.875rem 1.75rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
}

.btn-secondary {
  background: transparent;
  color: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.3);
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.1);
}
</style>

