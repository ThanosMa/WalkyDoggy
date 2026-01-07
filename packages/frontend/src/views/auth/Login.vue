<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo">W</div>
        <h1>Welcome back</h1>
        <p>Sign in to your WalkyDoggy account</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="john@example.com"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="••••••••"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-actions">
          <router-link to="/forgot-password" class="link-secondary">
            Forgot password?
          </router-link>
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>
          Don't have an account?
          <router-link to="/register" class="link-primary">Sign up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const toast = useToast();
    const authStore = useAuthStore();

    const formData = ref({
      email: '',
      password: '',
    });

    const loading = ref(false);
    const error = ref(null);

    const handleLogin = async () => {
      loading.value = true;
      error.value = null;

      try {
        await authStore.login(formData.value);
        toast.success('Login successful');
        
        // Redirect to dashboard or home
        router.push('/dashboard');
      } catch (err) {
        const errorMessage = err.message || 'Login failed. Please check your credentials.';
        error.value = errorMessage;
        toast.error(errorMessage);
      } finally {
        loading.value = false;
      }
    };

    return {
      formData,
      loading,
      error,
      handleLogin,
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
  max-width: 450px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  margin: 0 auto 1.5rem;
}

.auth-header h1 {
  font-size: 1.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.auth-header p {
  color: #6b7280;
  font-size: 0.95rem;
}

.auth-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-group input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.error-message {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.auth-footer p {
  color: #6b7280;
}

.link-primary {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.link-primary:hover {
  text-decoration: underline;
}

.link-secondary {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
}

.link-secondary:hover {
  color: #3b82f6;
}
</style>

