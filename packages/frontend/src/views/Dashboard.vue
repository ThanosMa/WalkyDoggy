<template>
  <div class="dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1>Welcome, {{ userFullName }}</h1>
        <p v-if="user" class="user-type-badge" :class="`badge-${user.userType}`">
          {{ userTypeLabel }}
        </p>
      </div>

      <div v-if="!isEmailVerified" class="verification-banner">
        <strong>Please verify your email</strong>
        <p>We've sent a verification link to {{ user?.email }}. Check your inbox.</p>
      </div>

      <div class="dashboard-content">
        <div class="welcome-card">
          <h2>Welcome to WalkyDoggy</h2>
          <p>Your account has been created successfully.</p>
          
          <div class="account-info">
            <h3>Account Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <strong>Email:</strong>
                <span>{{ user?.email }}</span>
              </div>
              <div class="info-item">
                <strong>Account Type:</strong>
                <span>{{ userTypeLabel }}</span>
              </div>
              <div class="info-item">
                <strong>Email Verified:</strong>
                <span :class="isEmailVerified ? 'text-success' : 'text-warning'">
                  {{ isEmailVerified ? 'Verified' : 'Not Verified' }}
                </span>
              </div>
              <div class="info-item">
                <strong>Member Since:</strong>
                <span>{{ memberSince }}</span>
              </div>
            </div>
          </div>

          <div class="next-steps">
            <h3>Next Steps</h3>
            <ul v-if="isPetOwner">
              <li>Add your pets to your profile</li>
              <li>Search for pet care services near you</li>
              <li>Book your first service</li>
              <li>Leave reviews and help the community</li>
            </ul>
            <ul v-else-if="isBusiness">
              <li>Complete your business profile</li>
              <li>Add your services and pricing</li>
              <li>Add pet care workers to your team</li>
              <li>Start receiving bookings</li>
            </ul>
          </div>

          <div class="actions">
            <button @click="handleLogout" class="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const user = computed(() => authStore.user);
    const userFullName = computed(() => authStore.userFullName);
    const isPetOwner = computed(() => authStore.isPetOwner);
    const isBusiness = computed(() => authStore.isBusiness);
    const isEmailVerified = computed(() => authStore.isEmailVerified);

    const userTypeLabel = computed(() => {
      if (authStore.isPetOwner) return 'Pet Owner';
      if (authStore.isBusiness) return 'Pet Care Professional';
      if (authStore.isAdmin) return 'Administrator';
      return 'User';
    });

    const memberSince = computed(() => {
      if (!user.value?.createdAt) return 'Unknown';
      return new Date(user.value.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    });

    const handleLogout = async () => {
      await authStore.logout();
      router.push('/login');
    };

    return {
      user,
      userFullName,
      isPetOwner,
      isBusiness,
      isEmailVerified,
      userTypeLabel,
      memberSince,
      handleLogout,
    };
  },
};
</script>

<style scoped>
.dashboard {
  min-height: calc(100vh - 140px);
  padding: 2rem 0;
  background: #f9fafb;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  color: #1f2937;
}

.user-type-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-pet_owner {
  background: #dbeafe;
  color: #1e40af;
}

.badge-business {
  background: #fef3c7;
  color: #92400e;
}

.verification-banner {
  background: #fef3c7;
  border: 2px solid #fde68a;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.verification-banner strong {
  color: #92400e;
  display: block;
  margin-bottom: 0.5rem;
}

.verification-banner p {
  color: #78350f;
  margin: 0;
}

.welcome-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.welcome-card h2 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.welcome-card > p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.account-info {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
}

.account-info h3 {
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item strong {
  color: #6b7280;
  font-size: 0.875rem;
}

.info-item span {
  color: #1f2937;
  font-size: 1rem;
}

.text-success {
  color: #059669 !important;
}

.text-warning {
  color: #d97706 !important;
}

.next-steps {
  margin: 2rem 0;
}

.next-steps h3 {
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.next-steps ul {
  list-style: none;
  padding: 0;
}

.next-steps li {
  padding: 0.75rem 0;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.next-steps li:before {
  content: '✓';
  color: #3b82f6;
  font-weight: bold;
  margin-right: 0.5rem;
}

.next-steps li:last-child {
  border-bottom: none;
}

.actions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #dc2626;
  border: 2px solid #dc2626;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #dc2626;
  color: white;
}
</style>

