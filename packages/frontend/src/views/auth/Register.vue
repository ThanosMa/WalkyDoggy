<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>🐾 Join WalkyDoggy!</h1>
        <p>Create your account to get started</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="errors.length > 0" class="error-list">
          <p><strong>Please fix the following errors:</strong></p>
          <ul>
            <li v-for="(err, index) in errors" :key="index">{{ err.message }}</li>
          </ul>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              placeholder="John"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              placeholder="Doe"
              required
              :disabled="loading"
            />
          </div>
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
          <label for="phoneNumber">Phone Number (Optional)</label>
          <input
            id="phoneNumber"
            v-model="formData.phoneNumber"
            type="tel"
            placeholder="+1 (555) 123-4567"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="userType">Account Type</label>
          <select id="userType" v-model="formData.userType" :disabled="loading">
            <option value="pet_owner">Pet Owner</option>
            <option value="business">Pet Care Professional</option>
          </select>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
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
          <label for="confirmPassword">Confirm Password</label>
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
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>
          Already have an account?
          <router-link to="/login" class="link-primary">Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const formData = ref({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      userType: 'pet_owner',
    });

    const loading = ref(false);
    const error = ref(null);
    const errors = ref([]);

    const handleRegister = async () => {
      loading.value = true;
      error.value = null;
      errors.value = [];

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
        const response = await authStore.register(formData.value);
        
        // Show success message
        alert('Registration successful! Please check your email to verify your account.');
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        if (err.errors && Array.isArray(err.errors)) {
          errors.value = err.errors;
        } else {
          error.value = err.message || 'Registration failed. Please try again.';
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      formData,
      loading,
      error,
      errors,
      handleRegister,
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
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-group input:disabled,
.form-group select:disabled {
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

.error-list {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.error-list ul {
  margin: 0.5rem 0 0 1.5rem;
  padding: 0;
}

.error-list li {
  margin: 0.25rem 0;
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

