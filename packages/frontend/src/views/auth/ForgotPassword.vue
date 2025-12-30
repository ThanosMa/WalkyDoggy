<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>🔐 Forgot Password?</h1>
        <p>Enter your email and we'll send you a reset link</p>
      </div>

      <form v-if="!success" @submit.prevent="handleForgotPassword" class="auth-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="john@example.com"
            required
            :disabled="loading"
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <div v-else class="success-message">
        <div class="success-icon">✉️</div>
        <h3>Check Your Email</h3>
        <p>
          If an account exists with that email, we've sent you a password reset link.
          Please check your inbox and follow the instructions.
        </p>
        <p class="email-hint">
          📧 Don't forget to check your spam folder!
        </p>
      </div>

      <div class="auth-footer">
        <p>
          Remember your password?
          <router-link to="/login" class="link-primary">Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'ForgotPassword',
  setup() {
    const authStore = useAuthStore();

    const email = ref('');
    const loading = ref(false);
    const error = ref(null);
    const success = ref(false);

    const handleForgotPassword = async () => {
      loading.value = true;
      error.value = null;

      try {
        await authStore.forgotPassword(email.value);
        success.value = true;
      } catch (err) {
        error.value = err.message || 'Failed to send reset link. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      loading,
      error,
      success,
      handleForgotPassword,
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

.auth-header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #6b7280;
  font-size: 1rem;
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

.error-message {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.success-message {
  text-align: center;
  padding: 2rem 0;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-message h3 {
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.success-message p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.email-hint {
  background-color: #fef3c7;
  border: 1px solid #fde68a;
  color: #92400e;
  padding: 0.75rem;
  border-radius: 8px;
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
</style>

