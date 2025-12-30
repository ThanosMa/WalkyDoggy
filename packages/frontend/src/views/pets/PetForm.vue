<template>
  <div class="pet-form-page">
    <div class="page-header">
      <h1>{{ isEditing ? '✏️ Edit Pet' : '➕ Add New Pet' }}</h1>
      <router-link to="/pets" class="btn btn-outline">← Back to My Pets</router-link>
    </div>

    <!-- Loading State (Edit mode only) -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading pet details...</p>
    </div>

    <!-- Load Error (Edit mode only) -->
    <div v-else-if="loadError" class="error-message">
      <p>{{ loadError }}</p>
      <button @click="fetchPet" class="btn btn-secondary">Try Again</button>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="pet-form">
      <!-- Basic Info -->
      <div class="form-section">
        <h2>Basic Information</h2>
        
        <div class="form-group">
          <label for="name">Pet Name *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="e.g., Buddy"
            :class="{ error: errors.name }"
          />
          <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="species">Species *</label>
            <select id="species" v-model="formData.species" required>
              <option value="">Select species</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="rabbit">Rabbit</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="breed">Breed</label>
            <input
              id="breed"
              v-model="formData.breed"
              type="text"
              placeholder="e.g., Golden Retriever"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="gender">Gender</label>
            <select id="gender" v-model="formData.gender">
              <option value="unknown">Unknown</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div class="form-group">
            <label for="birthDate">Birth Date</label>
            <input
              id="birthDate"
              v-model="formData.birthDate"
              type="date"
              :max="today"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="weight">Weight (kg)</label>
            <input
              id="weight"
              v-model.number="formData.weight"
              type="number"
              step="0.1"
              placeholder="e.g., 25"
            />
          </div>

          <div class="form-group">
            <label for="size">Size</label>
            <select id="size" v-model="formData.size">
              <option value="">Select size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="color">Color</label>
          <input
            id="color"
            v-model="formData.color"
            type="text"
            placeholder="e.g., Brown and white"
          />
        </div>
      </div>

      <!-- Behavior Info -->
      <div class="form-section">
        <h2>Behavior & Temperament</h2>

        <div class="form-group">
          <label for="temperament">Temperament</label>
          <textarea
            id="temperament"
            v-model="formData.behavior.temperament"
            rows="3"
            placeholder="Describe your pet's personality..."
          ></textarea>
        </div>

        <div class="checkbox-group">
          <label>
            <input type="checkbox" v-model="formData.behavior.goodWithKids" />
            Good with kids
          </label>
          <label>
            <input type="checkbox" v-model="formData.behavior.goodWithDogs" />
            Good with dogs
          </label>
          <label>
            <input type="checkbox" v-model="formData.behavior.goodWithCats" />
            Good with cats
          </label>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="energyLevel">Energy Level</label>
            <select id="energyLevel" v-model="formData.behavior.energyLevel">
              <option value="">Select energy level</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="very-high">Very High</option>
            </select>
          </div>

          <div class="form-group">
            <label for="trainingLevel">Training Level</label>
            <select id="trainingLevel" v-model="formData.behavior.trainingLevel">
              <option value="">Select training level</option>
              <option value="none">None</option>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="form-section">
        <h2>Additional Notes</h2>
        <div class="form-group">
          <label for="notes">Notes</label>
          <textarea
            id="notes"
            v-model="formData.notes"
            rows="4"
            placeholder="Any additional information about your pet..."
            maxlength="1000"
          ></textarea>
          <span class="char-count">{{ formData.notes.length }}/1000</span>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="submitError" class="error-message">
        {{ submitError }}
      </div>

      <!-- Submit Buttons -->
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitButtonText }}
        </button>
        <router-link to="/pets" class="btn btn-outline">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import petService from '@/services/petService';

export default {
  name: 'PetForm',
  props: {
    petId: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();
    
    // State
    const loading = ref(false);
    const loadError = ref(null);
    const submitting = ref(false);
    const submitError = ref(null);
    const errors = ref({});

    // Computed
    const isEditing = computed(() => !!props.petId);
    
    const submitButtonText = computed(() => {
      if (submitting.value) {
        return isEditing.value ? 'Saving...' : 'Adding...';
      }
      return isEditing.value ? '✓ Save Changes' : '✓ Add Pet';
    });

    const today = computed(() => {
      return new Date().toISOString().split('T')[0];
    });

    // Form data with default values
    const getDefaultFormData = () => ({
      name: '',
      species: '',
      breed: '',
      gender: 'unknown',
      birthDate: '',
      weight: null,
      size: '',
      color: '',
      behavior: {
        temperament: '',
        goodWithKids: false,
        goodWithDogs: false,
        goodWithCats: false,
        energyLevel: '',
        trainingLevel: '',
      },
      notes: '',
    });

    const formData = ref(getDefaultFormData());

    // Fetch pet data (edit mode only)
    const fetchPet = async () => {
      if (!props.petId) return;

      try {
        loading.value = true;
        loadError.value = null;
        
        const response = await petService.getPetById(props.petId);
        const pet = response.data || response;

        if (!pet || !pet.name) {
          throw new Error('Invalid pet data received');
        }

        // Map pet data to form
        formData.value = {
          name: pet.name || '',
          species: pet.species || '',
          breed: pet.breed || '',
          gender: pet.gender || 'unknown',
          birthDate: pet.birthDate ? pet.birthDate.split('T')[0] : '',
          weight: pet.weight || null,
          size: pet.size || '',
          color: pet.color || '',
          behavior: {
            temperament: pet.behavior?.temperament || '',
            goodWithKids: pet.behavior?.goodWithKids || false,
            goodWithDogs: pet.behavior?.goodWithDogs || false,
            goodWithCats: pet.behavior?.goodWithCats || false,
            energyLevel: pet.behavior?.energyLevel || '',
            trainingLevel: pet.behavior?.trainingLevel || '',
          },
          notes: pet.notes || '',
        };
      } catch (err) {
        console.error('Error loading pet:', err);
        loadError.value = err.response?.data?.message || err.message || 'Failed to load pet';
        toast.error(loadError.value);
      } finally {
        loading.value = false;
      }
    };

    // Clean form data before submission
    const cleanFormData = () => {
      const cleanData = { ...formData.value };
      
      // Remove empty optional fields
      if (!cleanData.birthDate) delete cleanData.birthDate;
      if (!cleanData.weight) delete cleanData.weight;
      if (!cleanData.size) delete cleanData.size;
      if (!cleanData.color) delete cleanData.color;
      if (!cleanData.behavior.energyLevel) delete cleanData.behavior.energyLevel;
      if (!cleanData.behavior.trainingLevel) delete cleanData.behavior.trainingLevel;
      
      return cleanData;
    };

    // Submit handler
    const handleSubmit = async () => {
      try {
        submitting.value = true;
        submitError.value = null;
        errors.value = {};

        const cleanData = cleanFormData();

        if (isEditing.value) {
          // Update existing pet
          await petService.updatePet(props.petId, cleanData);
          toast.success(`${formData.value.name} has been updated! ✓`);
        } else {
          // Create new pet
          const response = await petService.createPet(cleanData);
          if (response.success) {
            toast.success(`${formData.value.name} has been added! 🐾`);
          }
        }
        
        // Redirect to pets list
        router.push('/pets');
      } catch (err) {
        console.error('Error saving pet:', err);
        const errorMessage = err.response?.data?.message || 'Failed to save pet. Please try again.';
        submitError.value = errorMessage;
        toast.error(errorMessage);
        
        // Handle validation errors
        if (err.response?.data?.errors) {
          err.response.data.errors.forEach(error => {
            errors.value[error.field] = error.message;
          });
        }
      } finally {
        submitting.value = false;
      }
    };

    // Load pet data on mount if editing
    onMounted(() => {
      if (isEditing.value) {
        fetchPet();
      }
    });

    return {
      // State
      loading,
      loadError,
      submitting,
      submitError,
      errors,
      formData,
      
      // Computed
      isEditing,
      submitButtonText,
      today,
      
      // Methods
      fetchPet,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.pet-form-page {
  max-width: 800px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pet-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h2 {
  font-size: 1.4rem;
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

input[type="text"],
input[type="number"],
input[type="date"],
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

input.error {
  border-color: #f44336;
}

.error-text {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.checkbox-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  padding: 1rem;
  color: #c33;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
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

.btn-primary:hover:not(:disabled) {
  background: #45a049;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-outline {
  background: white;
  color: #333;
  border: 2px solid #ddd;
}

.btn-outline:hover {
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>

