<template>
  <div class="my-pets-page">
    <div class="page-header">
      <h1>My Pets</h1>
      <router-link to="/pets/add" class="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Pet
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="loader"></div>
      <p>Loading your pets...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchPets" class="btn btn-secondary">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="pets && pets.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      </div>
      <h2>No Pets Yet</h2>
      <p>Add your first pet to get started</p>
      <router-link to="/pets/add" class="btn btn-primary">Add Your First Pet</router-link>
    </div>

    <!-- Pets Grid -->
    <div v-else class="pets-grid">
      <div v-for="pet in pets" :key="pet._id" class="pet-card">
        <div class="pet-image">
          <img
            :src="pet.photos && pet.photos[0] ? pet.photos[0] : getDefaultImage(pet.species)"
            :alt="pet.name"
          />
          <span class="pet-species-badge">{{ pet.species }}</span>
        </div>
        <div class="pet-info">
          <h3>{{ pet.name }}</h3>
          <p class="pet-breed">{{ pet.breed || 'Unknown breed' }}</p>
          <div class="pet-details">
            <span v-if="pet.age">{{ pet.age }} yrs</span>
            <span v-if="pet.gender">{{ pet.gender }}</span>
            <span v-if="pet.size">{{ pet.size }}</span>
          </div>
          <div class="pet-actions">
            <router-link :to="`/pets/${pet._id}`" class="btn btn-small btn-secondary">
              View
            </router-link>
            <router-link :to="`/pets/${pet._id}/edit`" class="btn btn-small btn-outline">
              Edit
            </router-link>
            <button 
              @click="confirmDelete(pet)" 
              class="btn btn-small btn-danger"
              :disabled="deletingPetId === pet._id"
            >
              {{ deletingPetId === pet._id ? '...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <h3>Delete Pet</h3>
        <p class="modal-message">
          Are you sure you want to delete <strong>{{ petToDelete?.name }}</strong>?
        </p>
        <p class="modal-warning">This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn btn-outline">Cancel</button>
          <button 
            @click="handleDelete" 
            class="btn btn-danger"
            :disabled="deletingPetId === petToDelete?._id"
          >
            {{ deletingPetId === petToDelete?._id ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import petService from '@/services/petService';

export default {
  name: 'MyPets',
  setup() {
    const router = useRouter();
    const toast = useToast();
    const pets = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const showDeleteModal = ref(false);
    const petToDelete = ref(null);
    const deletingPetId = ref(null);

    const fetchPets = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await petService.getMyPets();
        
        // Debug logging
        console.log('🔍 Full API response:', response);
        console.log('🔍 Response type:', typeof response);
        console.log('🔍 Response.data:', response.data);
        console.log('🔍 Response.data type:', typeof response.data);
        console.log('🔍 Is response.data an array?', Array.isArray(response.data));
        
        // petService.getMyPets() returns response.data from axios
        // Which is: { success: true, message: "...", data: [...] }
        // So we need response.data to get the pets array
        let petsArray = [];
        
        if (Array.isArray(response)) {
          // Response is already an array
          petsArray = response;
        } else if (response && Array.isArray(response.data)) {
          // Response.data is the pets array
          petsArray = response.data;
        } else if (response && response.data && Array.isArray(response.data.data)) {
          // Response.data.data is the pets array (nested)
          petsArray = response.data.data;
        }
        
        pets.value = petsArray;
        
        console.log('🔍 Pets after assignment:', pets.value);
        console.log('🔍 Pets length:', pets.value.length);
        console.log('🔍 First pet:', pets.value[0]);
      } catch (err) {
        console.error('❌ Error fetching pets:', err);
        console.error('❌ Error response:', err.response);
        error.value = err.response?.data?.message || 'Failed to load pets';
        pets.value = []; // Ensure pets is always an array
      } finally {
        loading.value = false;
      }
    };

    const getDefaultImage = (species) => {
      const defaults = {
        dog: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Dog',
        cat: 'https://via.placeholder.com/300x300/ec4899/ffffff?text=Cat',
        bird: 'https://via.placeholder.com/300x300/14b8a6/ffffff?text=Bird',
        rabbit: 'https://via.placeholder.com/300x300/f59e0b/ffffff?text=Rabbit',
        other: 'https://via.placeholder.com/300x300/6b7280/ffffff?text=Pet',
      };
      return defaults[species] || defaults.other;
    };

    const confirmDelete = (pet) => {
      petToDelete.value = pet;
      showDeleteModal.value = true;
    };

    const cancelDelete = () => {
      showDeleteModal.value = false;
      petToDelete.value = null;
    };

    const handleDelete = async () => {
      if (!petToDelete.value) return;

      const petName = petToDelete.value.name;
      
      try {
        deletingPetId.value = petToDelete.value._id;
        await petService.deletePet(petToDelete.value._id);
        
        // Remove pet from list
        pets.value = pets.value.filter(pet => pet._id !== petToDelete.value._id);
        
        // Close modal
        showDeleteModal.value = false;
        petToDelete.value = null;
        deletingPetId.value = null;
        
        // Show success toast
        toast.success(`${petName} has been deleted`);
      } catch (err) {
        console.error('Error deleting pet:', err);
        const errorMessage = err.response?.data?.message || 'Failed to delete pet';
        error.value = errorMessage;
        deletingPetId.value = null;
        
        // Show error toast
        toast.error(errorMessage);
      }
    };

    onMounted(() => {
      fetchPets();
    });

    return {
      pets,
      loading,
      error,
      showDeleteModal,
      petToDelete,
      deletingPetId,
      fetchPets,
      getDefaultImage,
      confirmDelete,
      cancelDelete,
      handleDelete,
      loading,
      error,
      fetchPets,
      getDefaultImage,
    };
  },
};
</script>

<style scoped>
.my-pets-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  color: #1a1a2e;
  margin: 0;
  font-weight: 600;
}

.loading {
  text-align: center;
  padding: 4rem;
  color: #666;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

.empty-icon {
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.empty-state h2 {
  font-size: 1.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.empty-state p {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.pet-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.pet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.pet-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f3f4f6;
  position: relative;
}

.pet-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pet-species-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255,255,255,0.95);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  color: #374151;
}

.pet-info {
  padding: 1.25rem;
}

.pet-info h3 {
  font-size: 1.125rem;
  color: #1a1a2e;
  margin: 0 0 0.25rem 0;
  font-weight: 600;
}

.pet-breed {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  text-transform: capitalize;
}

.pet-details {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  font-size: 0.75rem;
}

.pet-details span {
  background: #f3f4f6;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  color: #4b5563;
  text-transform: capitalize;
}

.pet-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #1a1a2e;
  color: white;
}

.btn-secondary:hover {
  background: #2d2d44;
}

.btn-outline {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-small {
  padding: 0.5rem 0.875rem;
  font-size: 0.8rem;
  flex: 1;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-danger:disabled {
  background: #d1d5db;
  cursor: not-allowed;
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  animation: modalIn 0.2s ease;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-content h3 {
  margin: 0 0 1rem 0;
  color: #1a1a2e;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-message {
  font-size: 0.95rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.modal-message strong {
  color: #1a1a2e;
}

.modal-warning {
  color: #ef4444;
  font-weight: 500;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
</style>

