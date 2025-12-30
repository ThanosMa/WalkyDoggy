<template>
  <div class="container">
    <section class="hero">
      <h1>🐾 Welcome to WalkyDoggy</h1>
      <p class="subtitle">Professional Pet Care Services at Your Fingertips</p>
      
      <div class="status-card">
        <h2>System Status</h2>
        <div v-if="loading" class="loading">
          <p>Checking API connection...</p>
        </div>
        <div v-else-if="apiStatus" class="status-success">
          <p>✅ API Connected</p>
          <p><strong>Environment:</strong> {{ apiStatus.environment }}</p>
          <p><strong>Uptime:</strong> {{ Math.floor(apiStatus.uptime) }}s</p>
          <p><strong>Timestamp:</strong> {{ new Date(apiStatus.timestamp).toLocaleString() }}</p>
        </div>
        <div v-else class="status-error">
          <p>❌ Unable to connect to API</p>
          <p>Make sure the backend is running on port 3000</p>
        </div>
      </div>

      <div class="features">
        <div class="feature-card">
          <h3>🔍 Find Services</h3>
          <p>Discover pet care professionals near you</p>
        </div>
        <div class="feature-card">
          <h3>📅 Easy Booking</h3>
          <p>Book services with just a few clicks</p>
        </div>
        <div class="feature-card">
          <h3>💳 Secure Payments</h3>
          <p>Safe and convenient in-app payments</p>
        </div>
        <div class="feature-card">
          <h3>⭐ Reviews</h3>
          <p>Read and leave reviews for services</p>
        </div>
      </div>

      <div class="cta">
        <button class="btn-primary">Get Started</button>
        <button class="btn-secondary">Learn More</button>
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
.hero {
  text-align: center;
  padding: 2rem 0;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.subtitle {
  font-size: 1.5rem;
  color: #6b7280;
  margin-bottom: 3rem;
}

.status-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.status-card h2 {
  margin-bottom: 1rem;
  color: #1f2937;
}

.loading {
  color: #6b7280;
}

.status-success {
  text-align: left;
}

.status-success p {
  margin: 0.5rem 0;
  color: #059669;
}

.status-error {
  color: #dc2626;
}

.status-error p {
  margin: 0.5rem 0;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.feature-card p {
  color: #6b7280;
}

.cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 3rem;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.btn-secondary:hover {
  background: #eff6ff;
}
</style>

