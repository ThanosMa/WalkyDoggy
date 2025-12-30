<template>
  <div class="my-pets-page">
    <div class="page-header">
      <h1>🐾 My Pets</h1>
      <router-link to="/pets/add" class="btn btn-primary">
        ➕ Add New Pet
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <p>Loading your pets...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchPets" class="btn btn-secondary">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="pets && pets.length === 0" class="empty-state">
      <div class="empty-icon">🐕</div>
      <h2>No Pets Yet</h2>
      <p>Add your first pet to get started!</p>
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
        </div>
        <div class="pet-info">
          <h3>{{ pet.name }}</h3>
          <p class="pet-breed">{{ pet.breed || pet.species }}</p>
          <div class="pet-details">
            <span v-if="pet.age">{{ pet.age }} years old</span>
            <span v-if="pet.gender">{{ pet.gender }}</span>
            <span v-if="pet.size">{{ pet.size }}</span>
          </div>
          <div class="pet-actions">
            <router-link :to="`/pets/${pet._id}`" class="btn btn-small btn-secondary">
              View Details
            </router-link>
            <router-link :to="`/pets/${pet._id}/edit`" class="btn btn-small btn-outline">
              Edit
            </router-link>
            <button 
              @click="confirmDelete(pet)" 
              class="btn btn-small btn-danger"
              :disabled="deletingPetId === pet._id"
            >
              {{ deletingPetId === pet._id ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <h3>🗑️ Delete Pet</h3>
        <p class="modal-message">
          Are you sure you want to delete <strong>{{ petToDelete?.name }}</strong>?
        </p>
        <p class="modal-warning">This action cannot be undone.</p>
        <div class="modal-actions">
          <button 
            @click="handleDelete" 
            class="btn btn-danger"
            :disabled="deletingPetId === petToDelete?._id"
          >
            {{ deletingPetId === petToDelete?._id ? 'Deleting...' : 'Yes, Delete' }}
          </button>
          <button @click="cancelDelete" class="btn btn-outline">Cancel</button>
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
        dog: 'https://via.placeholder.com/300x300?text=🐕',
        cat: 'https://via.placeholder.com/300x300?text=🐱',
        bird: 'https://via.placeholder.com/300x300?text=🐦',
        rabbit: 'https://via.placeholder.com/300x300?text=🐰',
        other: 'https://via.placeholder.com/300x300?text=🐾',
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
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
}

.error-message {
  text-align: center;
  padding: 2rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
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
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.pet-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.pet-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.pet-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.pet-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pet-info {
  padding: 1.25rem;
}

.pet-info h3 {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.pet-breed {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  text-transform: capitalize;
}

.pet-details {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.pet-details span {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  color: #555;
  text-transform: capitalize;
}

.pet-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
}

.btn-secondary {
  background: #2196F3;
  color: white;
}

.btn-secondary:hover {
  background: #1976D2;
}

.btn-outline {
  background: white;
  color: #2196F3;
  border: 2px solid #2196F3;
}

.btn-outline:hover {
  background: #2196F3;
  color: white;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  flex: 1;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #d32f2f;
}

.btn-danger:disabled {
  background: #ccc;
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
}

.modal-message {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.modal-message strong {
  color: #f44336;
}

.modal-warning {
  color: #f44336;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>

