<template>
  <div class="pet-details-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading pet details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <router-link to="/pets" class="btn btn-secondary">Back to My Pets</router-link>
    </div>

    <!-- Pet Details -->
    <div v-else-if="pet" class="pet-content">
      <div class="pet-header">
        <router-link to="/pets" class="back-link">← Back to My Pets</router-link>
        <div class="header-actions">
          <router-link :to="`/pets/${pet._id}/edit`" class="btn btn-primary">
            ✏️ Edit Pet
          </router-link>
        </div>
      </div>

      <div class="pet-main">
        <!-- Pet Image -->
        <div class="pet-image-section">
          <img
            :src="pet.photos && pet.photos[0] ? pet.photos[0] : getDefaultImage(pet.species)"
            :alt="pet.name"
            class="pet-main-image"
          />
          <div v-if="pet.photos && pet.photos.length > 1" class="pet-gallery">
            <img
              v-for="(photo, index) in pet.photos.slice(1, 5)"
              :key="index"
              :src="photo"
              :alt="`${pet.name} photo ${index + 2}`"
              class="gallery-image"
            />
          </div>
        </div>

        <!-- Pet Info -->
        <div class="pet-info-section">
          <h1 class="pet-name">{{ pet.name }}</h1>
          <p class="pet-species-breed">
            {{ pet.breed || 'Unknown breed' }} • {{ capitalizeFirst(pet.species) }}
          </p>

          <!-- Quick Stats -->
          <div class="quick-stats">
            <div v-if="pet.age" class="stat">
              <span class="stat-label">Age</span>
              <span class="stat-value">{{ pet.age }} years</span>
            </div>
            <div v-if="pet.gender" class="stat">
              <span class="stat-label">Gender</span>
              <span class="stat-value">{{ capitalizeFirst(pet.gender) }}</span>
            </div>
            <div v-if="pet.weight" class="stat">
              <span class="stat-label">Weight</span>
              <span class="stat-value">{{ pet.weight }} kg</span>
            </div>
            <div v-if="pet.size" class="stat">
              <span class="stat-label">Size</span>
              <span class="stat-value">{{ capitalizeFirst(pet.size) }}</span>
            </div>
            <div v-if="pet.color" class="stat">
              <span class="stat-label">Color</span>
              <span class="stat-value">{{ pet.color }}</span>
            </div>
            <div v-if="pet.birthDate" class="stat">
              <span class="stat-label">Birthday</span>
              <span class="stat-value">{{ formatDate(pet.birthDate) }}</span>
            </div>
          </div>

          <!-- Behavior Section -->
          <div v-if="hasBehaviorInfo" class="info-section">
            <h3>🐾 Behavior & Personality</h3>
            <div class="info-grid">
              <div v-if="pet.behavior?.temperament" class="info-item">
                <span class="info-label">Temperament</span>
                <span class="info-value">{{ capitalizeFirst(pet.behavior.temperament) }}</span>
              </div>
              <div v-if="pet.behavior?.energyLevel" class="info-item">
                <span class="info-label">Energy Level</span>
                <span class="info-value">{{ capitalizeFirst(pet.behavior.energyLevel) }}</span>
              </div>
              <div v-if="pet.behavior?.trainingLevel" class="info-item">
                <span class="info-label">Training Level</span>
                <span class="info-value">{{ capitalizeFirst(pet.behavior.trainingLevel) }}</span>
              </div>
              <div v-if="pet.behavior?.isGoodWithKids !== undefined" class="info-item">
                <span class="info-label">Good with Kids</span>
                <span class="info-value">{{ pet.behavior.isGoodWithKids ? '✅ Yes' : '❌ No' }}</span>
              </div>
              <div v-if="pet.behavior?.isGoodWithOtherPets !== undefined" class="info-item">
                <span class="info-label">Good with Other Pets</span>
                <span class="info-value">{{ pet.behavior.isGoodWithOtherPets ? '✅ Yes' : '❌ No' }}</span>
              </div>
            </div>
            <div v-if="pet.behavior?.specialNeeds" class="special-needs">
              <span class="info-label">Special Needs</span>
              <p>{{ pet.behavior.specialNeeds }}</p>
            </div>
          </div>

          <!-- Medical Info Section -->
          <div v-if="hasMedicalInfo" class="info-section">
            <h3>🏥 Medical Information</h3>
            <div class="info-grid">
              <div v-if="pet.medicalInfo?.isSpayedNeutered !== undefined" class="info-item">
                <span class="info-label">Spayed/Neutered</span>
                <span class="info-value">{{ pet.medicalInfo.isSpayedNeutered ? '✅ Yes' : '❌ No' }}</span>
              </div>
              <div v-if="pet.medicalInfo?.isMicrochipped !== undefined" class="info-item">
                <span class="info-label">Microchipped</span>
                <span class="info-value">{{ pet.medicalInfo.isMicrochipped ? '✅ Yes' : '❌ No' }}</span>
              </div>
              <div v-if="pet.medicalInfo?.microchipNumber" class="info-item">
                <span class="info-label">Microchip #</span>
                <span class="info-value">{{ pet.medicalInfo.microchipNumber }}</span>
              </div>
            </div>

            <!-- Allergies -->
            <div v-if="pet.medicalInfo?.allergies?.length" class="tag-list">
              <span class="info-label">Allergies</span>
              <div class="tags">
                <span v-for="allergy in pet.medicalInfo.allergies" :key="allergy" class="tag tag-warning">
                  {{ allergy }}
                </span>
              </div>
            </div>

            <!-- Medical Conditions -->
            <div v-if="pet.medicalInfo?.medicalConditions?.length" class="tag-list">
              <span class="info-label">Medical Conditions</span>
              <div class="tags">
                <span v-for="condition in pet.medicalInfo.medicalConditions" :key="condition" class="tag tag-danger">
                  {{ condition }}
                </span>
              </div>
            </div>

            <!-- Medications -->
            <div v-if="pet.medicalInfo?.medications?.length" class="tag-list">
              <span class="info-label">Medications</span>
              <div class="tags">
                <span v-for="med in pet.medicalInfo.medications" :key="med" class="tag tag-info">
                  {{ med }}
                </span>
              </div>
            </div>

            <!-- Vaccinations -->
            <div v-if="pet.medicalInfo?.vaccinations?.length" class="vaccinations">
              <span class="info-label">Vaccinations</span>
              <table class="vaccination-table">
                <thead>
                  <tr>
                    <th>Vaccine</th>
                    <th>Date Given</th>
                    <th>Next Due</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="vax in pet.medicalInfo.vaccinations" :key="vax.name">
                    <td>{{ vax.name }}</td>
                    <td>{{ formatDate(vax.dateGiven) }}</td>
                    <td>{{ vax.nextDue ? formatDate(vax.nextDue) : 'N/A' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Notes Section -->
          <div v-if="pet.notes" class="info-section">
            <h3>📝 Notes</h3>
            <p class="notes-text">{{ pet.notes }}</p>
          </div>

          <!-- Meta Info -->
          <div class="meta-info">
            <p>Added on {{ formatDate(pet.createdAt) }}</p>
            <p v-if="pet.updatedAt !== pet.createdAt">
              Last updated {{ formatDate(pet.updatedAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import petService from '@/services/petService';

export default {
  name: 'PetDetails',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const pet = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const hasBehaviorInfo = computed(() => {
      if (!pet.value?.behavior) return false;
      const b = pet.value.behavior;
      return b.temperament || b.energyLevel || b.trainingLevel || 
             b.isGoodWithKids !== undefined || b.isGoodWithOtherPets !== undefined ||
             b.specialNeeds;
    });

    const hasMedicalInfo = computed(() => {
      if (!pet.value?.medicalInfo) return false;
      const m = pet.value.medicalInfo;
      return m.isSpayedNeutered !== undefined || m.isMicrochipped !== undefined ||
             m.microchipNumber || m.allergies?.length || m.medicalConditions?.length ||
             m.medications?.length || m.vaccinations?.length;
    });

    const fetchPet = async () => {
      try {
        loading.value = true;
        error.value = null;
        const petId = route.params.id;
        const response = await petService.getPetById(petId);
        
        // Handle response structure
        if (response && response.data) {
          pet.value = response.data;
        } else {
          pet.value = response;
        }
      } catch (err) {
        console.error('Error fetching pet:', err);
        error.value = err.response?.data?.message || 'Failed to load pet details';
      } finally {
        loading.value = false;
      }
    };

    const getDefaultImage = (species) => {
      const defaults = {
        dog: 'https://via.placeholder.com/400x400?text=🐕',
        cat: 'https://via.placeholder.com/400x400?text=🐱',
        bird: 'https://via.placeholder.com/400x400?text=🐦',
        rabbit: 'https://via.placeholder.com/400x400?text=🐰',
        other: 'https://via.placeholder.com/400x400?text=🐾',
      };
      return defaults[species] || defaults.other;
    };

    const capitalizeFirst = (str) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return 'N/A';
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    onMounted(() => {
      fetchPet();
    });

    return {
      pet,
      loading,
      error,
      hasBehaviorInfo,
      hasMedicalInfo,
      getDefaultImage,
      capitalizeFirst,
      formatDate,
    };
  },
};
</script>

<style scoped>
.pet-details-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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

.error-message {
  text-align: center;
  padding: 3rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 12px;
  color: #c33;
}

.pet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-link {
  color: #666;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: #4CAF50;
}

.pet-main {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .pet-main {
    grid-template-columns: 1fr;
  }
}

.pet-image-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pet-main-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pet-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.gallery-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.gallery-image:hover {
  transform: scale(1.05);
}

.pet-info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pet-name {
  font-size: 2.5rem;
  color: #333;
  margin: 0;
}

.pet-species-breed {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 500px) {
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.info-section {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.25rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 500px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  color: #333;
}

.special-needs {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.special-needs p {
  margin: 0.5rem 0 0 0;
  color: #333;
}

.tag-list {
  margin-top: 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.tag-warning {
  background: #fff3cd;
  color: #856404;
}

.tag-danger {
  background: #f8d7da;
  color: #721c24;
}

.tag-info {
  background: #d1ecf1;
  color: #0c5460;
}

.vaccinations {
  margin-top: 1rem;
}

.vaccination-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}

.vaccination-table th,
.vaccination-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.vaccination-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.vaccination-table td {
  color: #555;
}

.notes-text {
  color: #555;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.meta-info {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  font-size: 0.85rem;
  color: #888;
}

.meta-info p {
  margin: 0.25rem 0;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
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

.btn-primary:hover {
  background: #45a049;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}
</style>

