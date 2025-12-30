<template>
  <div class="auth-container">
    <div class="auth-card">
      <div v-if="loading" class="loading-message">
        <div class="spinner"></div>
        <h2>Verifying Your Email...</h2>
        <p>Please wait while we confirm your email address</p>
      </div>

      <div v-else-if="success" class="success-message">
        <div class="success-icon">✅</div>
        <h2>Email Verified!</h2>
        <p>Your email has been successfully verified. Welcome to WalkyDoggy!</p>
        <router-link to="/dashboard" class="btn-primary">
          Go to Dashboard
        </router-link>
      </div>

      <div v-else class="error-message-container">
        <div class="error-icon">❌</div>
        <h2>Verification Failed</h2>
        <p>{{ error || 'The verification link is invalid or has expired.' }}</p>
        <div class="action-buttons">
          <router-link to="/login" class="btn-secondary">
            Go to Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'VerifyEmail',
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();

    const loading = ref(true);
    const success = ref(false);
    const error = ref(null);

    onMounted(async () => {
      const token = route.query.token;

      if (!token) {
        error.value = 'No verification token provided';
        loading.value = false;
        return;
      }

      try {
        await authStore.verifyEmail(token);
        success.value = true;
      } catch (err) {
        error.value = err.message || 'Verification failed';
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      success,
      error,
    };
  },
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.auth-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.loading-message,
.success-message,
.error-message-container {
  padding: 2rem 0;
}

.spinner {
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-icon,
.error-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
}

h2 {
  color: #1f2937;
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  color: #6b7280;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.btn-secondary:hover {
  background: #eff6ff;
  transform: translateY(-2px);
}
</style>

