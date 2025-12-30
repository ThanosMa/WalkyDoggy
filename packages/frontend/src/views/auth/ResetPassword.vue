<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>🔑 Reset Password</h1>
        <p>Enter your new password</p>
      </div>

      <form v-if="!success" @submit.prevent="handleResetPassword" class="auth-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-group">
          <label for="password">New Password</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="••••••••"
            required
            minlength="6"
            :disabled="loading"
          />
          <small>At least 6 characters</small>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            :disabled="loading"
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>

      <div v-else class="success-message">
        <div class="success-icon">✅</div>
        <h3>Password Reset Successful!</h3>
        <p>Your password has been reset successfully. You can now login with your new password.</p>
        <router-link to="/login" class="btn-primary">
          Go to Login
        </router-link>
      </div>

      <div v-if="!success" class="auth-footer">
        <p>
          Remember your password?
          <router-link to="/login" class="link-primary">Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'ResetPassword',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();

    const formData = ref({
      password: '',
      confirmPassword: '',
    });

    const token = ref('');
    const loading = ref(false);
    const error = ref(null);
    const success = ref(false);

    onMounted(() => {
      // Get token from URL query parameter
      token.value = route.query.token || '';
      
      if (!token.value) {
        error.value = 'Invalid or missing reset token. Please request a new password reset link.';
      }
    });

    const handleResetPassword = async () => {
      loading.value = true;
      error.value = null;

      // Client-side validation
      if (formData.value.password !== formData.value.confirmPassword) {
        error.value = 'Passwords do not match';
        loading.value = false;
        return;
      }

      if (formData.value.password.length < 6) {
        error.value = 'Password must be at least 6 characters long';
        loading.value = false;
        return;
      }

      try {
        await authStore.resetPassword(
          token.value,
          formData.value.password,
          formData.value.confirmPassword
        );
        
        success.value = true;
      } catch (err) {
        error.value = err.message || 'Password reset failed. The link may have expired.';
      } finally {
        loading.value = false;
      }
    };

    return {
      formData,
      loading,
      error,
      success,
      handleResetPassword,
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

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
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
  margin-bottom: 2rem;
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
  text-decoration: none;
  display: inline-block;
  text-align: center;
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

