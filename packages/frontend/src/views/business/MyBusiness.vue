<template>
  <div class="business-page">
    <div class="page-header">
      <h1>🏢 My Business</h1>
    </div>

    <div v-if="loading" class="loading">Loading business profile...</div>

    <div v-else-if="!business && !loadError" class="empty-state">
      <div class="empty-icon">🏢</div>
      <h2>No Business Profile Yet</h2>
      <p>Create your business profile to start offering services</p>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Create Business Profile
      </button>
    </div>

    <div v-else-if="loadError" class="info-message">
      {{ loadError }}
      <button v-if="loadError.includes('No business')" @click="showCreateForm = true" class="btn btn-primary">
        Create Business Profile
      </button>
    </div>

    <div v-else class="business-container">
      <!-- Business Info Card -->
      <div class="business-card">
        <div class="logo-section">
          <div class="logo">
            <img :src="business.logo || 'https://via.placeholder.com/150?text=Logo'" alt="Logo" />
          </div>
        </div>

        <div class="info-section">
          <h2>{{ business.name }}</h2>
          <p class="business-type">{{ formatBusinessType(business.businessType) }}</p>
          <div class="rating">
            ⭐ {{ business.rating?.average?.toFixed(1) || '0.0' }} 
            ({{ business.rating?.count || 0 }} reviews)
          </div>
          <div class="status-badges">
            <span class="badge" :class="business.status">{{ business.status }}</span>
            <span v-if="business.isVerified" class="badge verified">✓ Verified</span>
            <span v-if="business.featured" class="badge featured">★ Featured</span>
          </div>
        </div>
      </div>

      <!-- Business Details Form -->
      <form @submit.prevent="handleSubmit" class="business-form">
        <h3>Business Information</h3>

        <div class="form-group">
          <label>Business Name</label>
          <input v-model="formData.name" type="text" required />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea v-model="formData.description" rows="4" maxlength="2000"></textarea>
        </div>

        <div class="form-group">
          <label>Business Type</label>
          <select v-model="formData.businessType">
            <option value="individual">Individual</option>
            <option value="company">Company</option>
            <option value="franchise">Franchise</option>
          </select>
        </div>

        <h3>Contact Information</h3>

        <div class="form-row">
          <div class="form-group">
            <label>Email</label>
            <input v-model="formData.contactInfo.email" type="email" required />
          </div>

          <div class="form-group">
            <label>Phone</label>
            <input v-model="formData.contactInfo.phone" type="tel" required />
          </div>
        </div>

        <div class="form-group">
          <label>Website</label>
          <input v-model="formData.contactInfo.website" type="url" />
        </div>

        <h3>Location</h3>

        <div class="form-group">
          <label>Street Address</label>
          <input v-model="formData.address.street" type="text" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>City</label>
            <input v-model="formData.address.city" type="text" required />
          </div>

          <div class="form-group">
            <label>State</label>
            <input v-model="formData.address.state" type="text" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Zip Code</label>
            <input v-model="formData.address.zipCode" type="text" required />
          </div>

          <div class="form-group">
            <label>Country</label>
            <input v-model="formData.address.country" type="text" required />
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

      <!-- Stats Section -->
      <div class="stats-section">
        <h3>Business Stats</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ business.stats?.totalBookings || 0 }}</div>
            <div class="stat-label">Total Bookings</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ business.stats?.completedBookings || 0 }}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ business.views || 0 }}</div>
            <div class="stat-label">Profile Views</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Business Modal -->
    <div v-if="showCreateForm" class="modal" @click="showCreateForm = false">
      <div class="modal-content" @click.stop>
        <h3>Create Business Profile</h3>
        <p class="note">Fill in the basic information to create your business profile</p>
        
        <div class="form-group">
          <label>Business Name *</label>
          <input v-model="createData.name" type="text" required />
        </div>

        <div class="form-group">
          <label>Email *</label>
          <input v-model="createData.email" type="email" required />
        </div>

        <div class="form-group">
          <label>Phone *</label>
          <input v-model="createData.phone" type="tel" required />
        </div>

        <div v-if="createError" class="error-message">{{ createError }}</div>

        <div class="modal-actions">
          <button @click="handleCreate" class="btn btn-primary" :disabled="creating">
            {{ creating ? 'Creating...' : 'Create Business' }}
          </button>
          <button @click="showCreateForm = false" class="btn btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import businessService from '@/services/businessService';

export default {
  name: 'MyBusiness',
  setup() {
    const business = ref(null);
    const loading = ref(true);
    const loadError = ref(null);
    const submitting = ref(false);
    const submitError = ref(null);
    const successMessage = ref(null);
    const showCreateForm = ref(false);
    const creating = ref(false);
    const createError = ref(null);

    const formData = ref({
      name: '',
      description: '',
      businessType: 'individual',
      contactInfo: {
        email: '',
        phone: '',
        website: '',
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
      },
    });

    const createData = ref({
      name: '',
      email: '',
      phone: '',
    });

    const fetchBusiness = async () => {
      try {
        loading.value = true;
        loadError.value = null;
        const response = await businessService.getMyBusiness();
        business.value = response.data;

        // Populate form
        formData.value = {
          name: business.value.name,
          description: business.value.description || '',
          businessType: business.value.businessType || 'individual',
          contactInfo: {
            email: business.value.contactInfo?.email || '',
            phone: business.value.contactInfo?.phone || '',
            website: business.value.contactInfo?.website || '',
          },
          address: {
            street: business.value.address?.street || '',
            city: business.value.address?.city || '',
            state: business.value.address?.state || '',
            zipCode: business.value.address?.zipCode || '',
            country: business.value.address?.country || 'USA',
          },
        };
      } catch (err) {
        loadError.value = err.response?.data?.message || 'Failed to load business';
        if (err.response?.status === 404) {
          business.value = null;
        }
      } finally {
        loading.value = false;
      }
    };

    const handleSubmit = async () => {
      try {
        submitting.value = true;
        submitError.value = null;
        successMessage.value = null;

        // Ensure coordinates are set (for simplicity, using 0,0 - in production use geocoding)
        if (!formData.value.address.coordinates) {
          formData.value.address.coordinates = {
            type: 'Point',
            coordinates: [0, 0],
          };
        }

        const response = await businessService.updateBusiness(business.value._id, formData.value);
        business.value = response.data;
        successMessage.value = 'Business updated successfully!';
        
        setTimeout(() => {
          successMessage.value = null;
        }, 3000);
      } catch (err) {
        submitError.value = err.response?.data?.message || 'Failed to update business';
      } finally {
        submitting.value = false;
      }
    };

    const handleCreate = async () => {
      try {
        creating.value = true;
        createError.value = null;

        const businessData = {
          name: createData.value.name,
          contactInfo: {
            email: createData.value.email,
            phone: createData.value.phone,
          },
          address: {
            street: '123 Main St',
            city: 'City',
            state: 'State',
            zipCode: '12345',
            country: 'USA',
            coordinates: {
              type: 'Point',
              coordinates: [0, 0],
            },
          },
        };

        await businessService.createBusiness(businessData);
        showCreateForm.value = false;
        await fetchBusiness();
      } catch (err) {
        createError.value = err.response?.data?.message || 'Failed to create business';
      } finally {
        creating.value = false;
      }
    };

    const formatBusinessType = (type) => {
      return type.charAt(0).toUpperCase() + type.slice(1);
    };

    onMounted(fetchBusiness);

    return {
      business,
      loading,
      loadError,
      submitting,
      submitError,
      successMessage,
      formData,
      showCreateForm,
      creating,
      createError,
      createData,
      handleSubmit,
      handleCreate,
      formatBusinessType,
    };
  },
};
</script>

<style scoped>
.business-page {
  max-width: 1000px;
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

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.empty-state h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 2rem;
}

.info-message {
  background: #e3f2fd;
  border: 1px solid #90caf9;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.business-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.business-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 2rem;
  align-items: center;
}

.logo-section {
  flex-shrink: 0;
}

.logo {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #f0f0f0;
}

.logo img {
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

.business-type {
  color: #666;
  margin-bottom: 0.75rem;
}

.rating {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.status-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge.pending {
  background: #fff3e0;
  color: #e65100;
}

.badge.verified {
  background: #e3f2fd;
  color: #1565c0;
}

.badge.featured {
  background: #fce4ec;
  color: #c2185b;
}

.business-form,
.stats-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.business-form h3,
.stats-section h3 {
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

input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

input:focus, select:focus, textarea:focus {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  text-align: center;
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
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .business-card {
    flex-direction: column;
    text-align: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

