<template>
  <div class="profile-page">
    <div class="page-header">
      <h1>👤 My Profile</h1>
    </div>

    <div v-if="loading" class="loading">Loading profile...</div>

    <div v-else class="profile-container">
      <!-- Profile Info Card -->
      <div class="profile-card">
        <div class="avatar-section">
          <div class="avatar">
            <img
              :src="user.profile?.avatar || 'https://via.placeholder.com/150?text=User'"
              alt="Avatar"
            />
          </div>
          <button @click="showAvatarModal = true" class="btn btn-small btn-outline">
            Change Avatar
          </button>
        </div>

        <div class="info-section">
          <h2>{{ user.profile?.firstName }} {{ user.profile?.lastName }}</h2>
          <p class="email">{{ user.email }}</p>
          <span class="badge" :class="user.userType">{{ formatUserType(user.userType) }}</span>
          <div class="verification-status">
            <span v-if="user.isEmailVerified" class="verified">✓ Email Verified</span>
            <span v-else class="unverified">✗ Email Not Verified</span>
          </div>
        </div>
      </div>

      <!-- Edit Profile Form -->
      <form @submit.prevent="handleSubmit" class="profile-form">
        <h3>Personal Information</h3>

        <div class="form-row">
          <div class="form-group">
            <label>First Name</label>
            <input v-model="formData.profile.firstName" type="text" required />
          </div>

          <div class="form-group">
            <label>Last Name</label>
            <input v-model="formData.profile.lastName" type="text" required />
          </div>
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input v-model="formData.profile.phoneNumber" type="tel" />
        </div>

        <h3>Address</h3>

        <div class="form-group">
          <label>Street</label>
          <input v-model="formData.profile.address.street" type="text" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>City</label>
            <input v-model="formData.profile.address.city" type="text" />
          </div>

          <div class="form-group">
            <label>State</label>
            <input v-model="formData.profile.address.state" type="text" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Zip Code</label>
            <input v-model="formData.profile.address.zipCode" type="text" />
          </div>

          <div class="form-group">
            <label>Country</label>
            <input v-model="formData.profile.address.country" type="text" />
          </div>
        </div>

        <div v-if="submitError" class="error-message">{{ submitError }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>

      <!-- Change Password Section -->
      <div class="password-section">
        <h3>Security</h3>
        <router-link to="/profile/change-password" class="btn btn-outline">
          Change Password
        </router-link>
      </div>
    </div>

    <!-- Avatar Modal (simple) -->
    <div v-if="showAvatarModal" class="modal" @click="showAvatarModal = false">
      <div class="modal-content" @click.stop>
        <h3>Change Avatar</h3>
        <p class="note">Enter a URL for your avatar image</p>
        <input v-model="avatarUrl" type="url" placeholder="https://example.com/avatar.jpg" />
        <div class="modal-actions">
          <button @click="updateAvatar" class="btn btn-primary" :disabled="!avatarUrl">
            Update Avatar
          </button>
          <button @click="showAvatarModal = false" class="btn btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import userService from '@/services/userService';

export default {
  name: 'MyProfile',
  setup() {
    const user = ref({});
    const loading = ref(true);
    const submitting = ref(false);
    const submitError = ref(null);
    const successMessage = ref(null);
    const showAvatarModal = ref(false);
    const avatarUrl = ref('');

    const formData = ref({
      profile: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
      },
    });

    const fetchProfile = async () => {
      try {
        const response = await userService.getMyProfile();
        user.value = response.data;
        
        // Populate form
        formData.value.profile.firstName = user.value.profile.firstName || '';
        formData.value.profile.lastName = user.value.profile.lastName || '';
        formData.value.profile.phoneNumber = user.value.profile.phoneNumber || '';
        formData.value.profile.address = {
          street: user.value.profile.address?.street || '',
          city: user.value.profile.address?.city || '',
          state: user.value.profile.address?.state || '',
          zipCode: user.value.profile.address?.zipCode || '',
          country: user.value.profile.address?.country || '',
        };
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        loading.value = false;
      }
    };

    const handleSubmit = async () => {
      try {
        submitting.value = true;
        submitError.value = null;
        successMessage.value = null;

        const response = await userService.updateMyProfile(formData.value);
        user.value = response.data;
        successMessage.value = 'Profile updated successfully!';
        
        setTimeout(() => {
          successMessage.value = null;
        }, 3000);
      } catch (err) {
        submitError.value = err.response?.data?.message || 'Failed to update profile';
      } finally {
        submitting.value = false;
      }
    };

    const updateAvatar = async () => {
      try {
        const response = await userService.updateAvatar(avatarUrl.value);
        user.value = response.data;
        showAvatarModal.value = false;
        avatarUrl.value = '';
      } catch (err) {
        console.error('Error updating avatar:', err);
        alert('Failed to update avatar');
      }
    };

    const formatUserType = (type) => {
      if (type === 'pet_owner') return 'Pet Owner';
      if (type === 'business') return 'Business';
      return type;
    };

    onMounted(fetchProfile);

    return {
      user,
      loading,
      submitting,
      submitError,
      successMessage,
      formData,
      showAvatarModal,
      avatarUrl,
      handleSubmit,
      updateAvatar,
      formatUserType,
    };
  },
};
</script>

<style scoped>
.profile-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
}

.profile-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 2rem;
  align-items: center;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #f0f0f0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  flex: 1;
}

.info-section h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.email {
  color: #666;
  margin-bottom: 1rem;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge.pet_owner {
  background: #e3f2fd;
  color: #1976d2;
}

.badge.business {
  background: #f3e5f5;
  color: #7b1fa2;
}

.verification-status {
  margin-top: 1rem;
}

.verified {
  color: #4caf50;
  font-weight: 600;
}

.unverified {
  color: #ff9800;
}

.profile-form,
.password-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-form h3,
.password-section h3 {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 1.5rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  padding: 1rem;
  border-radius: 6px;
  color: #c33;
  margin-bottom: 1rem;
}

.success-message {
  background: #e8f5e9;
  border: 1px solid #a5d6a7;
  padding: 1rem;
  border-radius: 6px;
  color: #2e7d32;
  margin-bottom: 1rem;
}

.form-actions {
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #45a049;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-outline {
  background: white;
  color: #333;
  border: 2px solid #ddd;
}

.btn-outline:hover {
  background: #f5f5f5;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
}

.modal-content h3 {
  margin: 0 0 0.5rem 0;
}

.note {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    text-align: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

