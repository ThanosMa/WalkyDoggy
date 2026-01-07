<template>
  <div class="business-page">
    <div v-if="loading" class="loading-screen">
      <div class="loader"></div>
      <p>Loading your business...</p>
    </div>

    <!-- Show create button when no business exists -->
    <div v-else-if="!business" class="welcome-screen">
      <div class="welcome-content">
        <div class="welcome-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <h1>Start Your Pet Care Journey</h1>
        <p>Create your business profile and start connecting with pet owners in your area</p>
        <button @click="showCreateForm = true" class="btn-create-business">
          Create Business Profile
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
        <p v-if="loadError && !loadError.toLowerCase().includes('no business')" class="error-note">
          {{ loadError }}
        </p>
      </div>
      <div class="welcome-features">
        <div class="feature">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>Appear on map</span>
        </div>
        <div class="feature">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>Accept bookings</span>
        </div>
        <div class="feature">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <span>Get paid easily</span>
        </div>
      </div>
    </div>

    <div v-else class="dashboard">
      <!-- Compact Business Header -->
      <header class="business-header">
        <div class="header-left">
          <div class="business-avatar">
            <img :src="business.logo || 'https://via.placeholder.com/60?text=🏢'" alt="Logo" />
          </div>
          <div class="business-title">
            <h1>{{ business.name }}</h1>
            <div class="header-meta">
              <span class="badge-type">{{ formatBusinessType(business.businessType) }}</span>
              <span class="badge-status" :class="business.status">{{ business.status }}</span>
              <span v-if="business.isVerified" class="badge-verified">✓ Verified</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="quick-stats">
            <div class="quick-stat">
              <span class="stat-number">{{ services.length }}</span>
              <span class="stat-label">Services</span>
            </div>
            <div class="quick-stat">
              <span class="stat-number">{{ workers.length }}</span>
              <span class="stat-label">Workers</span>
            </div>
            <div class="quick-stat">
              <span class="stat-number">{{ business.rating?.average?.toFixed(1) || '0.0' }}</span>
              <span class="stat-label">Rating</span>
            </div>
          </div>
          <button @click="showBusinessDetails = !showBusinessDetails" class="btn-toggle-details">
            {{ showBusinessDetails ? '▲ Hide Details' : '▼ Edit Business' }}
          </button>
        </div>
      </header>

      <!-- Main Content Grid -->
      <div class="main-grid">
        <!-- Services Section - Primary -->
        <section class="card services-card">
          <div class="card-header">
            <div class="card-title">
              <span class="card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </span>
              <h2>Services</h2>
            </div>
            <button @click="showServiceForm = true; editingService = null" class="btn-add">
              <span>+</span> Add Service
            </button>
          </div>

          <div v-if="loadingServices" class="card-loading">
            <div class="mini-loader"></div>
          </div>
          
          <div v-else-if="services.length === 0" class="card-empty">
            <div class="empty-illustration">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p>No services yet</p>
            <span>Add your first service to start accepting bookings</span>
          </div>

          <div v-else class="services-list">
            <div v-for="service in services" :key="service._id" class="service-item">
              <div class="service-icon" :class="'cat-' + service.category">{{ getCategoryIcon(service.category) }}</div>
              <div class="service-content">
                <div class="service-top">
                  <h4>{{ service.name }}</h4>
                  <span class="service-price-tag">{{ formatPrice(service.pricing) }}</span>
                </div>
                <p class="service-desc">{{ service.description || 'No description' }}</p>
                <div class="service-meta">
                  <span class="meta-item">{{ service.duration }} min</span>
                  <span class="meta-item status-dot" :class="service.status || 'active'">{{ service.status || 'active' }}</span>
                </div>
              </div>
              <div class="service-actions">
                <button @click="editService(service)" class="action-btn edit" title="Edit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button @click="confirmDeleteService(service)" class="action-btn delete" title="Delete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Workers Section - Primary -->
        <section class="card workers-card">
          <div class="card-header">
            <div class="card-title">
              <span class="card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </span>
              <h2>{{ business.businessType === 'individual' ? 'My Profile' : 'Team' }}</h2>
            </div>
            <button 
              v-if="business.businessType !== 'individual' || workers.length === 0" 
              @click="showWorkerForm = true; editingWorker = null" 
              class="btn-add"
            >
              <span>+</span> {{ business.businessType === 'individual' ? 'Create Profile' : 'Add Worker' }}
            </button>
          </div>

          <div v-if="loadingWorkers" class="card-loading">
            <div class="mini-loader"></div>
          </div>

          <div v-else-if="workers.length === 0" class="card-empty">
            <div class="empty-illustration">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <p v-if="business.businessType === 'individual'">Create your profile</p>
            <p v-else>No workers yet</p>
            <span>{{ business.businessType === 'individual' ? 'Set up your availability and appear on the map' : 'Add team members to your business' }}</span>
          </div>

          <div v-else class="workers-list">
            <div v-for="worker in workers" :key="worker._id" class="worker-item">
              <div class="worker-avatar-container">
                <img :src="worker.userId?.profile?.avatar || 'https://via.placeholder.com/50?text=👤'" alt="Worker" class="worker-img" />
                <span class="online-indicator" :class="{ online: worker.isOnline }"></span>
              </div>
              <div class="worker-content">
                <h4>{{ worker.profile?.firstName || worker.userId?.profile?.firstName || 'Worker' }} {{ worker.profile?.lastName || worker.userId?.profile?.lastName || '' }}</h4>
                <p class="worker-specs">{{ worker.specializations?.join(' • ') || 'No specializations' }}</p>
                <div class="worker-meta">
                  <span>{{ worker.rating?.average?.toFixed(1) || '0.0' }} rating</span>
                  <span>{{ worker.services?.length || 0 }} services</span>
                </div>
              </div>
              <div class="worker-controls">
                <button 
                  @click="toggleWorkerOnline(worker)" 
                  class="online-toggle"
                  :class="{ active: worker.isOnline }"
                >
                  <span class="status-dot-inline" :class="{ online: worker.isOnline }"></span>
                  {{ worker.isOnline ? 'Online' : 'Offline' }}
                </button>
                <div class="worker-actions">
                  <button @click="editWorker(worker)" class="action-btn edit" title="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button v-if="business.businessType !== 'individual'" @click="confirmDeleteWorker(worker)" class="action-btn delete" title="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Collapsible Business Details -->
      <section v-if="showBusinessDetails" class="business-details-section">
        <div class="details-grid">
          <!-- Business Info Form -->
          <div class="details-card">
            <h3>Business Information</h3>
            <form @submit.prevent="handleSubmit" class="compact-form">
              <div class="form-grid">
                <div class="form-group">
                  <label>Business Name</label>
                  <input v-model="formData.name" type="text" required />
                </div>
                <div class="form-group">
                  <label>Type</label>
                  <select v-model="formData.businessType">
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                    <option value="franchise">Franchise</option>
                  </select>
                </div>
              </div>
              <div class="form-group full-width">
                <label>Description</label>
                <textarea v-model="formData.description" rows="2" maxlength="2000" placeholder="Describe your business..."></textarea>
              </div>
              <h4>Contact</h4>
              <div class="form-grid three-col">
                <div class="form-group">
                  <label>Email</label>
                  <input v-model="formData.contactInfo.email" type="email" required />
                </div>
                <div class="form-group">
                  <label>Phone</label>
                  <input v-model="formData.contactInfo.phone" type="tel" required />
                </div>
                <div class="form-group">
                  <label>Website</label>
                  <input v-model="formData.contactInfo.website" type="url" placeholder="https://" />
                </div>
              </div>
              <h4>Location</h4>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Street</label>
                  <input v-model="formData.address.street" type="text" required />
                </div>
                <div class="form-group">
                  <label>City</label>
                  <input v-model="formData.address.city" type="text" required />
                </div>
                <div class="form-group">
                  <label>State</label>
                  <input v-model="formData.address.state" type="text" required />
                </div>
                <div class="form-group">
                  <label>Zip Code</label>
                  <input v-model="formData.address.zipCode" type="text" required />
                </div>
                <div class="form-group">
                  <label>Country</label>
                  <input v-model="formData.address.country" type="text" required />
                </div>
              </div>
              <div v-if="submitError" class="form-error">{{ submitError }}</div>
              <div v-if="successMessage" class="form-success">{{ successMessage }}</div>
              <div class="form-actions">
                <button type="submit" class="btn-save" :disabled="submitting">
                  {{ submitting ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Stats Card -->
          <div class="details-card stats-card">
            <h3>Statistics</h3>
            <div class="stats-list">
              <div class="stat-row">
                <span class="stat-name">Total Bookings</span>
                <span class="stat-value">{{ business.stats?.totalBookings || 0 }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-name">Completed</span>
                <span class="stat-value">{{ business.stats?.completedBookings || 0 }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-name">Profile Views</span>
                <span class="stat-value">{{ business.views || 0 }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-name">Average Rating</span>
                <span class="stat-value">{{ business.rating?.average?.toFixed(1) || '0.0' }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-name">Reviews</span>
                <span class="stat-value">{{ business.rating?.count || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Create Business Modal -->
    <div v-if="showCreateForm" class="modal" @click="showCreateForm = false">
      <div class="modal-content large-modal" @click.stop>
        <h3>Create Business Profile</h3>
        <p class="note">Fill in the required information to create your business profile</p>
        
        <form @submit.prevent="handleCreate">
          <div class="form-group">
            <label>Business Name *</label>
            <input v-model="createData.name" type="text" required placeholder="e.g., Happy Paws Pet Care" />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="createData.description" rows="3" placeholder="Brief description of your business..." maxlength="2000"></textarea>
          </div>

          <div class="form-group">
            <label>Business Type</label>
            <select v-model="createData.businessType">
              <option value="individual">Individual</option>
              <option value="company">Company</option>
              <option value="franchise">Franchise</option>
            </select>
          </div>

          <h4>Contact Information</h4>

          <div class="form-group">
            <label>Email *</label>
            <input v-model="createData.contactInfo.email" type="email" required placeholder="business@example.com" />
          </div>

          <div class="form-group">
            <label>Phone *</label>
            <input v-model="createData.contactInfo.phone" type="tel" required placeholder="+1 (555) 123-4567" />
          </div>

          <div class="form-group">
            <label>Website</label>
            <input v-model="createData.contactInfo.website" type="url" placeholder="https://www.example.com" />
          </div>

          <h4>Address</h4>

          <div class="form-group">
            <label>Street Address *</label>
            <input v-model="createData.address.street" type="text" required placeholder="123 Main Street" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>City *</label>
              <input v-model="createData.address.city" type="text" required placeholder="New York" />
            </div>

            <div class="form-group">
              <label>State *</label>
              <input v-model="createData.address.state" type="text" required placeholder="NY" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Zip Code *</label>
              <input v-model="createData.address.zipCode" type="text" required placeholder="10001" />
            </div>

            <div class="form-group">
              <label>Country</label>
              <input v-model="createData.address.country" type="text" placeholder="USA" />
            </div>
          </div>

          <p class="note-small">📍 Note: Location coordinates will be set to default. You can update them later with your exact location.</p>

          <div v-if="createError" class="error-message">{{ createError }}</div>

          <div class="modal-actions">
            <button type="submit" class="btn btn-primary" :disabled="creating">
              {{ creating ? 'Creating...' : 'Create Business' }}
            </button>
            <button type="button" @click="showCreateForm = false" class="btn btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Service Form Modal -->
    <div v-if="showServiceForm" class="modal" @click="showServiceForm = false">
      <div class="modal-content large-modal" @click.stop>
        <h3>{{ editingService ? 'Edit Service' : 'Add New Service' }}</h3>
        
        <form @submit.prevent="handleServiceSubmit">
          <div class="form-group">
            <label>Service Name *</label>
            <input v-model="serviceForm.name" type="text" required placeholder="e.g., Dog Walking" />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="serviceForm.description" rows="3" placeholder="Describe your service..." maxlength="1000"></textarea>
          </div>

          <div class="form-group">
            <label>Category *</label>
            <select v-model="serviceForm.category" required>
              <option value="">Select category</option>
              <option value="walking">Dog Walking</option>
              <option value="sitting">Pet Sitting</option>
              <option value="boarding">Pet Boarding</option>
              <option value="grooming">Grooming</option>
              <option value="training">Training</option>
              <option value="daycare">Daycare</option>
              <option value="veterinary">Veterinary</option>
              <option value="transport">Pet Transport</option>
              <option value="other">Other</option>
            </select>
          </div>

          <h4>Pricing</h4>
          <div class="form-row">
            <div class="form-group">
              <label>Base Price *</label>
              <input v-model.number="serviceForm.pricing.basePrice" type="number" min="0" step="0.01" required placeholder="25.00" />
            </div>
            <div class="form-group">
              <label>Price Type</label>
              <select v-model="serviceForm.pricing.priceType">
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Per Hour</option>
                <option value="daily">Per Day</option>
                <option value="per_pet">Per Pet</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Duration (minutes) *</label>
            <input v-model.number="serviceForm.duration" type="number" min="15" step="15" required placeholder="30" />
          </div>

          <h4>Pet Requirements (Optional)</h4>
          <div class="form-row">
            <div class="form-group">
              <label>Pet Types</label>
              <div class="checkbox-group">
                <label><input type="checkbox" value="dog" v-model="serviceForm.petRequirements.petTypes" /> Dogs</label>
                <label><input type="checkbox" value="cat" v-model="serviceForm.petRequirements.petTypes" /> Cats</label>
                <label><input type="checkbox" value="bird" v-model="serviceForm.petRequirements.petTypes" /> Birds</label>
                <label><input type="checkbox" value="other" v-model="serviceForm.petRequirements.petTypes" /> Other</label>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Min Weight (kg)</label>
              <input v-model.number="serviceForm.petRequirements.minWeight" type="number" min="0" placeholder="0" />
            </div>
            <div class="form-group">
              <label>Max Weight (kg)</label>
              <input v-model.number="serviceForm.petRequirements.maxWeight" type="number" min="0" placeholder="50" />
            </div>
          </div>

          <div class="form-group">
            <label>Max Pets per Session</label>
            <input v-model.number="serviceForm.capacity.maxPetsPerSession" type="number" min="1" placeholder="3" />
          </div>

          <div v-if="serviceFormError" class="error-message">{{ serviceFormError }}</div>

          <div class="modal-actions">
            <button type="submit" class="btn btn-primary" :disabled="savingService">
              {{ savingService ? 'Saving...' : (editingService ? 'Update Service' : 'Create Service') }}
            </button>
            <button type="button" @click="showServiceForm = false" class="btn btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Worker Form Modal -->
    <div v-if="showWorkerForm" class="modal" @click="showWorkerForm = false">
      <div class="modal-content large-modal" @click.stop>
        <h3>{{ editingWorker ? 'Edit Worker' : (business?.businessType === 'individual' ? 'Create My Worker Profile' : 'Add New Worker') }}</h3>
        
        <form @submit.prevent="handleWorkerSubmit">
          <div v-if="business?.businessType !== 'individual'" class="form-group">
            <label>Worker Email *</label>
            <input v-model="workerForm.userEmail" type="email" required placeholder="worker@example.com" />
            <small class="help-text">The worker must have an account on WalkyDoggy</small>
          </div>

          <div class="form-group">
            <label>Specializations</label>
            <div class="checkbox-group">
              <label><input type="checkbox" value="walking" v-model="workerForm.specializations" /> Dog Walking</label>
              <label><input type="checkbox" value="sitting" v-model="workerForm.specializations" /> Pet Sitting</label>
              <label><input type="checkbox" value="grooming" v-model="workerForm.specializations" /> Grooming</label>
              <label><input type="checkbox" value="training" v-model="workerForm.specializations" /> Training</label>
              <label><input type="checkbox" value="boarding" v-model="workerForm.specializations" /> Boarding</label>
              <label><input type="checkbox" value="daycare" v-model="workerForm.specializations" /> Daycare</label>
            </div>
          </div>

          <div class="form-group">
            <label>Bio</label>
            <textarea v-model="workerForm.bio" rows="3" placeholder="Tell pet owners about yourself..." maxlength="500"></textarea>
          </div>

          <div class="form-group">
            <label>Hourly Rate (€)</label>
            <input v-model.number="workerForm.hourlyRate" type="number" min="0" step="0.5" placeholder="15" />
          </div>

          <div v-if="services.length > 0" class="form-group">
            <label>Assigned Services</label>
            <div class="checkbox-group">
              <label v-for="service in services" :key="service._id">
                <input type="checkbox" :value="service._id" v-model="workerForm.assignedServices" />
                {{ service.name }}
              </label>
            </div>
          </div>

          <div v-if="workerFormError" class="error-message">{{ workerFormError }}</div>

          <div class="modal-actions">
            <button type="submit" class="btn btn-primary" :disabled="savingWorker">
              {{ savingWorker ? 'Saving...' : (editingWorker ? 'Update' : 'Create') }}
            </button>
            <button type="button" @click="showWorkerForm = false" class="btn btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal" @click="showDeleteConfirm = false">
      <div class="modal-content" @click.stop>
        <h3>⚠️ Confirm Delete</h3>
        <p>Are you sure you want to delete <strong>{{ deleteTarget?.name || 'this item' }}</strong>?</p>
        <p class="warning-text">This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="confirmDelete" class="btn btn-danger" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Yes, Delete' }}
          </button>
          <button @click="showDeleteConfirm = false" class="btn btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import businessService from '@/services/businessService';
import serviceService from '@/services/serviceService';
import workerService from '@/services/workerService';

export default {
  name: 'MyBusiness',
  setup() {
    const toast = useToast();
    
    // Business state
    const business = ref(null);
    const loading = ref(true);
    const loadError = ref(null);
    const submitting = ref(false);
    const submitError = ref(null);
    const successMessage = ref(null);
    const showCreateForm = ref(false);
    const creating = ref(false);
    const createError = ref(null);

    // Services state
    const services = ref([]);
    const loadingServices = ref(false);
    const showServiceForm = ref(false);
    const editingService = ref(null);
    const savingService = ref(false);
    const serviceFormError = ref(null);

    // Workers state
    const workers = ref([]);
    const loadingWorkers = ref(false);
    const showWorkerForm = ref(false);
    const editingWorker = ref(null);
    const savingWorker = ref(false);
    const workerFormError = ref(null);

    // Delete confirmation
    const showDeleteConfirm = ref(false);
    const deleteTarget = ref(null);
    const deleteType = ref(null); // 'service' or 'worker'
    const deleting = ref(false);

    // UI state
    const showBusinessDetails = ref(false);

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

    // Service form
    const getEmptyServiceForm = () => ({
      name: '',
      description: '',
      category: '',
      pricing: {
        basePrice: 0,
        priceType: 'fixed',
        currency: 'EUR',
      },
      duration: 30,
      petRequirements: {
        petTypes: [],
        minWeight: null,
        maxWeight: null,
      },
      capacity: {
        maxPetsPerSession: 1,
      },
    });
    const serviceForm = ref(getEmptyServiceForm());

    // Worker form
    const getEmptyWorkerForm = () => ({
      userEmail: '',
      specializations: [],
      bio: '',
      hourlyRate: null,
      assignedServices: [],
    });
    const workerForm = ref(getEmptyWorkerForm());

    // Fetch business
    const fetchBusiness = async () => {
      try {
        loading.value = true;
        loadError.value = null;
        const response = await businessService.getMyBusiness();
        
        const businessData = response.data || response;
        console.log('📦 Business loaded:', businessData.name);
        business.value = businessData;

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

        // Load services and workers after business is loaded
        await Promise.all([fetchServices(), fetchWorkers()]);
      } catch (err) {
        loadError.value = err.response?.data?.message || 'Failed to load business';
        if (err.response?.status === 404) {
          business.value = null;
        }
      } finally {
        loading.value = false;
      }
    };

    // Fetch services
    const fetchServices = async () => {
      if (!business.value?._id) return;
      try {
        loadingServices.value = true;
        const response = await serviceService.getBusinessServices(business.value._id);
        services.value = response.data || response || [];
      } catch (err) {
        console.error('Error loading services:', err);
        services.value = [];
      } finally {
        loadingServices.value = false;
      }
    };

    // Fetch workers
    const fetchWorkers = async () => {
      if (!business.value?._id) return;
      try {
        loadingWorkers.value = true;
        const response = await workerService.getBusinessWorkers(business.value._id);
        workers.value = response.data || response || [];
      } catch (err) {
        console.error('Error loading workers:', err);
        workers.value = [];
      } finally {
        loadingWorkers.value = false;
      }
    };

    // Handle business submit
    const handleSubmit = async () => {
      try {
        submitting.value = true;
        submitError.value = null;
        successMessage.value = null;

        if (!formData.value.address.coordinates) {
          formData.value.address.coordinates = {
            type: 'Point',
            coordinates: [0, 0],
          };
        }

        const response = await businessService.updateBusiness(business.value._id, formData.value);
        business.value = response.data || response;
        successMessage.value = 'Business updated successfully!';
        toast.success('Business profile updated successfully! ✓');
        
        setTimeout(() => {
          successMessage.value = null;
        }, 3000);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to update business';
        submitError.value = errorMessage;
        toast.error(errorMessage);
      } finally {
        submitting.value = false;
      }
    };

    // Handle business create
    const handleCreate = async () => {
      try {
        creating.value = true;
        createError.value = null;

        const businessData = {
          name: createData.value.name,
          description: createData.value.description || undefined,
          businessType: createData.value.businessType,
          contactInfo: {
            email: createData.value.contactInfo.email,
            phone: createData.value.contactInfo.phone,
            website: createData.value.contactInfo.website || undefined,
          },
          address: {
            street: createData.value.address.street,
            city: createData.value.address.city,
            state: createData.value.address.state,
            zipCode: createData.value.address.zipCode,
            country: createData.value.address.country || 'USA',
            coordinates: {
              type: 'Point',
              coordinates: [0, 0],
            },
          },
        };

        Object.keys(businessData).forEach(key => {
          if (businessData[key] === undefined) {
            delete businessData[key];
          }
        });

        if (businessData.contactInfo.website === undefined) {
          delete businessData.contactInfo.website;
        }

        await businessService.createBusiness(businessData);
        toast.success('Business profile created successfully! 🎉');
        showCreateForm.value = false;
        await fetchBusiness();
      } catch (err) {
        console.error('Error creating business:', err);
        const errorMessage = err.response?.data?.message || 'Failed to create business';
        createError.value = errorMessage;
        toast.error(errorMessage);
        if (err.response?.data?.errors) {
          const errorMessages = err.response.data.errors.map(e => `${e.field}: ${e.message}`).join(', ');
          createError.value = errorMessages;
        }
      } finally {
        creating.value = false;
      }
    };

    // Service methods
    const editService = (service) => {
      editingService.value = service;
      serviceForm.value = {
        name: service.name,
        description: service.description || '',
        category: service.category,
        pricing: {
          basePrice: service.pricing?.basePrice || 0,
          priceType: service.pricing?.priceType || 'fixed',
          currency: service.pricing?.currency || 'EUR',
        },
        duration: service.duration || 30,
        petRequirements: {
          petTypes: service.petRequirements?.petTypes || [],
          minWeight: service.petRequirements?.minWeight || null,
          maxWeight: service.petRequirements?.maxWeight || null,
        },
        capacity: {
          maxPetsPerSession: service.capacity?.maxPetsPerSession || 1,
        },
      };
      showServiceForm.value = true;
    };

    const handleServiceSubmit = async () => {
      try {
        savingService.value = true;
        serviceFormError.value = null;

        const serviceData = {
          ...serviceForm.value,
          businessId: business.value._id,
        };

        // Ensure petTypes is an array
        if (!Array.isArray(serviceData.petRequirements.petTypes)) {
          serviceData.petRequirements.petTypes = [];
        }
        
        // Clean up empty values
        if (!serviceData.petRequirements.minWeight) delete serviceData.petRequirements.minWeight;
        if (!serviceData.petRequirements.maxWeight) delete serviceData.petRequirements.maxWeight;
        if (serviceData.petRequirements.petTypes.length === 0) delete serviceData.petRequirements.petTypes;
        
        // Remove empty petRequirements object
        if (Object.keys(serviceData.petRequirements).length === 0) {
          delete serviceData.petRequirements;
        }

        if (editingService.value) {
          await serviceService.updateService(business.value._id, editingService.value._id, serviceData);
          toast.success('Service updated successfully! ✓');
        } else {
          await serviceService.createService(business.value._id, serviceData);
          toast.success('Service created successfully! 🎉');
        }

        showServiceForm.value = false;
        serviceForm.value = getEmptyServiceForm();
        editingService.value = null;
        await fetchServices();
      } catch (err) {
        console.error('Error saving service:', err);
        serviceFormError.value = err.response?.data?.message || 'Failed to save service';
        toast.error(serviceFormError.value);
      } finally {
        savingService.value = false;
      }
    };

    const confirmDeleteService = (service) => {
      deleteTarget.value = service;
      deleteType.value = 'service';
      showDeleteConfirm.value = true;
    };

    // Worker methods
    const editWorker = (worker) => {
      editingWorker.value = worker;
      workerForm.value = {
        userEmail: worker.userId?.email || '',
        specializations: worker.specializations || [],
        bio: worker.bio || '',
        hourlyRate: worker.hourlyRate || null,
        assignedServices: worker.assignedServices?.map(s => s._id || s) || [],
      };
      showWorkerForm.value = true;
    };

    const handleWorkerSubmit = async () => {
      try {
        savingWorker.value = true;
        workerFormError.value = null;

        const workerData = {
          specializations: workerForm.value.specializations,
          bio: workerForm.value.bio,
          hourlyRate: workerForm.value.hourlyRate,
          assignedServices: workerForm.value.assignedServices,
        };

        if (editingWorker.value) {
          await workerService.updateWorker(business.value._id, editingWorker.value._id, workerData);
          toast.success('Worker updated successfully! ✓');
        } else {
          // For individual business, create worker for self
          // For company, need to specify user email
          if (business.value.businessType === 'individual') {
            workerData.businessId = business.value._id;
          } else {
            workerData.userEmail = workerForm.value.userEmail;
            workerData.businessId = business.value._id;
          }
          await workerService.createWorker(business.value._id, workerData);
          toast.success('Worker created successfully! 🎉');
        }

        showWorkerForm.value = false;
        workerForm.value = getEmptyWorkerForm();
        editingWorker.value = null;
        await fetchWorkers();
      } catch (err) {
        console.error('Error saving worker:', err);
        workerFormError.value = err.response?.data?.message || 'Failed to save worker';
        toast.error(workerFormError.value);
      } finally {
        savingWorker.value = false;
      }
    };

    const confirmDeleteWorker = (worker) => {
      deleteTarget.value = { ...worker, name: `${worker.userId?.profile?.firstName || 'Worker'}` };
      deleteType.value = 'worker';
      showDeleteConfirm.value = true;
    };

    const toggleWorkerOnline = async (worker) => {
      try {
        await workerService.setWorkerOnlineStatus(business.value._id, worker._id, !worker.isOnline);
        toast.success(worker.isOnline ? 'You are now offline' : 'You are now online! 🟢');
        await fetchWorkers();
      } catch (err) {
        console.error('Error toggling online status:', err);
        toast.error('Failed to update status');
      }
    };

    // Delete confirmation
    const confirmDelete = async () => {
      try {
        deleting.value = true;
        
        if (deleteType.value === 'service') {
          await serviceService.deleteService(business.value._id, deleteTarget.value._id);
          toast.success('Service deleted successfully');
          await fetchServices();
        } else if (deleteType.value === 'worker') {
          await workerService.deleteWorker(business.value._id, deleteTarget.value._id);
          toast.success('Worker removed successfully');
          await fetchWorkers();
        }

        showDeleteConfirm.value = false;
        deleteTarget.value = null;
        deleteType.value = null;
      } catch (err) {
        console.error('Error deleting:', err);
        toast.error('Failed to delete');
      } finally {
        deleting.value = false;
      }
    };

    // Formatters
    const formatBusinessType = (type) => {
      return type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
    };

    const formatCategory = (category) => {
      const categories = {
        walking: '🐕 Walking',
        sitting: '🏠 Sitting',
        boarding: '🏨 Boarding',
        grooming: '🛁 Grooming',
        training: '🎓 Training',
        daycare: '☀️ Daycare',
        veterinary: '⚕️ Veterinary',
        transport: '🚗 Transport',
        other: '📦 Other',
      };
      return categories[category] || category;
    };

    const formatPrice = (pricing) => {
      if (!pricing) return '€0';
      const price = pricing.basePrice || 0;
      const types = {
        fixed: '',
        hourly: '/hr',
        daily: '/day',
        per_pet: '/pet',
      };
      return `€${price}${types[pricing.priceType] || ''}`;
    };

    const getCategoryIcon = (category) => {
      // Returns single letter abbreviation for minimal icons
      const icons = {
        walking: 'W',
        dog_walking: 'W',
        sitting: 'S',
        pet_sitting: 'S',
        boarding: 'B',
        grooming: 'G',
        training: 'T',
        daycare: 'D',
        veterinary: 'V',
        transport: 'R',
        transportation: 'R',
        other: 'O',
      };
      return icons[category] || 'P';
    };

    // Watch for service form close to reset
    watch(showServiceForm, (newVal) => {
      if (!newVal) {
        serviceForm.value = getEmptyServiceForm();
        editingService.value = null;
        serviceFormError.value = null;
      }
    });

    watch(showWorkerForm, (newVal) => {
      if (!newVal) {
        workerForm.value = getEmptyWorkerForm();
        editingWorker.value = null;
        workerFormError.value = null;
      }
    });

    onMounted(fetchBusiness);

    return {
      // Business
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
      fetchBusiness,
      formatBusinessType,

      // Services
      services,
      loadingServices,
      showServiceForm,
      editingService,
      savingService,
      serviceFormError,
      serviceForm,
      editService,
      handleServiceSubmit,
      confirmDeleteService,
      formatCategory,
      formatPrice,

      // Workers
      workers,
      loadingWorkers,
      showWorkerForm,
      editingWorker,
      savingWorker,
      workerFormError,
      workerForm,
      editWorker,
      handleWorkerSubmit,
      confirmDeleteWorker,
      toggleWorkerOnline,

      // Delete
      showDeleteConfirm,
      deleteTarget,
      deleting,
      confirmDelete,

      // UI
      showBusinessDetails,
      getCategoryIcon,
    };
  },
};
</script>

<style scoped>
/* ==================== MODERN BUSINESS DASHBOARD ==================== */
.business-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

/* Loading Screen */
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: white;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Welcome Screen */
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 2rem;
}

.welcome-content {
  background: rgba(255,255,255,0.95);
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  max-width: 500px;
}

.welcome-icon {
  margin-bottom: 1.5rem;
  color: #6366f1;
}

.welcome-icon svg {
  width: 64px;
  height: 64px;
}

.welcome-content h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.welcome-content p {
  color: #666;
  margin-bottom: 2rem;
}

.btn-create-business {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-create-business:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.welcome-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.9rem;
}

.feature-icon {
  font-size: 1.2rem;
}

.error-note {
  color: #ff6b6b;
  margin-top: 1rem;
  font-size: 0.9rem;
}

/* Dashboard Layout */
.dashboard {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Business Header */
.business-header {
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.business-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  object-fit: cover;
}

.business-title h1 {
  font-size: 1.4rem;
  margin: 0;
  color: #333;
}

.header-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
}

.badge-type {
  background: #e3f2fd;
  color: #1565c0;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-status {
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-status.active { background: #d4edda; color: #155724; }
.badge-status.pending { background: #fff3cd; color: #856404; }

.badge-verified {
  background: #667eea;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.quick-stats {
  display: flex;
  gap: 1.5rem;
}

.quick-stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 0.7rem;
  color: #888;
  text-transform: uppercase;
}

.btn-toggle-details {
  background: #f0f0f0;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  color: #666;
  transition: background 0.2s;
}

.btn-toggle-details:hover {
  background: #e0e0e0;
}

/* Main Grid */
.main-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Cards */
.card {
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-icon {
  display: flex;
  align-items: center;
  color: #6366f1;
}

.card-title h2 {
  font-size: 1.2rem;
  margin: 0;
  color: #333;
}

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: transform 0.2s;
}

.btn-add:hover {
  transform: scale(1.05);
}

.card-loading {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.mini-loader {
  width: 30px;
  height: 30px;
  border: 3px solid #f0f0f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.card-empty {
  text-align: center;
  padding: 2rem;
  color: #888;
}

.empty-illustration {
  margin-bottom: 0.75rem;
  color: #9ca3af;
}

.empty-illustration svg {
  opacity: 0.5;
}

.card-empty p {
  font-weight: 600;
  color: #555;
  margin: 0;
}

.card-empty span {
  font-size: 0.85rem;
}

/* Services List */
.services-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.service-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.service-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  color: white;
  background: #6366f1;
  flex-shrink: 0;
}

.service-icon.cat-walking, .service-icon.cat-dog_walking { background: #10b981; }
.service-icon.cat-sitting, .service-icon.cat-pet_sitting { background: #6366f1; }
.service-icon.cat-boarding { background: #8b5cf6; }
.service-icon.cat-grooming { background: #ec4899; }
.service-icon.cat-training { background: #f59e0b; }
.service-icon.cat-daycare { background: #14b8a6; }
.service-icon.cat-veterinary { background: #ef4444; }
.service-icon.cat-transport, .service-icon.cat-transportation { background: #3b82f6; }
.service-icon.cat-other { background: #6b7280; }

.service-content {
  flex: 1;
  min-width: 0;
}

.service-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-content h4 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.service-price-tag {
  background: #d4edda;
  color: #155724;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
}

.service-desc {
  font-size: 0.8rem;
  color: #888;
  margin: 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.service-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #888;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.status-dot::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
}

.status-dot.active::before { background: #28a745; }
.status-dot.inactive::before { background: #dc3545; }
.status-dot.draft::before { background: #ffc107; }

.service-actions, .worker-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn.edit {
  background: #e3f2fd;
}

.action-btn.delete {
  background: #ffebee;
}

/* Workers List */
.workers-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.worker-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  flex-wrap: wrap;
}

.worker-avatar-container {
  position: relative;
}

.worker-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ccc;
  border: 2px solid white;
}

.online-indicator.online {
  background: #28a745;
}

.worker-content {
  flex: 1;
  min-width: 150px;
}

.worker-content h4 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.worker-specs {
  font-size: 0.8rem;
  color: #888;
  margin: 0.25rem 0;
}

.worker-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #888;
}

.worker-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.online-toggle {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  background: #f0f0f0;
  color: #666;
  transition: all 0.2s;
}

.online-toggle.active {
  background: #d4edda;
  color: #155724;
}

.status-dot-inline {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
  margin-right: 6px;
}

.status-dot-inline.online {
  background: #10b981;
}

/* Business Details Section */
.business-details-section {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.details-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.details-card {
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.details-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  color: #333;
}

.details-card h4 {
  font-size: 0.9rem;
  color: #667eea;
  margin: 1.5rem 0 0.75rem 0;
}

.compact-form .form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.compact-form .form-grid.three-col {
  grid-template-columns: repeat(3, 1fr);
}

.compact-form .full-width {
  grid-column: 1 / -1;
}

.compact-form .form-group {
  margin-bottom: 0;
}

.compact-form label {
  display: block;
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}

.compact-form input,
.compact-form select,
.compact-form textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.compact-form input:focus,
.compact-form select:focus,
.compact-form textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-error {
  background: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-top: 1rem;
}

.form-success {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-top: 1rem;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Stats Card */
.stats-card .stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-icon {
  font-size: 1.25rem;
}

.stat-name {
  flex: 1;
  color: #666;
  font-size: 0.9rem;
}

.stat-value {
  font-weight: 700;
  color: #333;
  font-size: 1.1rem;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
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
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-content.large-modal {
  max-width: 700px;
}

.modal-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #333;
}

.modal-content h4 {
  margin: 1.5rem 0 1rem 0;
  font-size: 1rem;
  color: #667eea;
}

.note {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

/* Form elements in modal */
.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #667eea;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: normal;
  cursor: pointer;
  font-size: 0.85rem;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
}

.help-text {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.25rem;
}

.warning-text {
  color: #dc3545;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
}

.btn-outline:hover {
  background: #f5f5f5;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

/* Responsive */
@media (max-width: 900px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .business-header {
    flex-direction: column;
    text-align: center;
  }
  
  .header-right {
    flex-direction: column;
  }
  
  .form-row,
  .compact-form .form-grid,
  .compact-form .form-grid.three-col {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 500px) {
  .main-grid {
    grid-template-columns: 1fr;
    min-width: 0;
  }
  
  .welcome-features {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>

