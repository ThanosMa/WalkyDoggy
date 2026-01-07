const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner user ID is required'],
      index: true,
    },
    businessType: {
      type: String,
      enum: ['individual', 'company', 'franchise'],
      default: 'individual',
    },
    logo: {
      type: String, // S3 URL
    },
    coverPhoto: {
      type: String, // S3 URL
    },
    photos: [String], // Additional S3 URLs
    contactInfo: {
      email: {
        type: String,
        required: [true, 'Contact email is required'],
        lowercase: true,
      },
      phone: {
        type: String,
        required: [true, 'Contact phone is required'],
      },
      website: String,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: 'USA',
      },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    // Service area is optional - only set if business wants to define coverage area
    serviceArea: {
      type: {
        type: String,
        enum: ['Polygon', 'Point'],
      },
      coordinates: {
        type: mongoose.Schema.Types.Mixed, // Can be [lng, lat] for Point or [[[]]] for Polygon
      },
      radiusInKm: {
        type: Number,
        default: 10,
      },
    },
    operatingHours: [
      {
        dayOfWeek: {
          type: Number, // 0-6 (Sunday-Saturday)
          required: true,
        },
        openTime: {
          type: String, // "09:00"
          required: true,
        },
        closeTime: {
          type: String, // "18:00"
          required: true,
        },
        isClosed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    certifications: [
      {
        name: String,
        issuedBy: String,
        issueDate: Date,
        expiryDate: Date,
        document: String, // S3 URL
      },
    ],
    insurance: {
      provider: String,
      policyNumber: String,
      coverageAmount: Number,
      expiryDate: Date,
      document: String, // S3 URL
    },
    businessLicense: {
      number: String,
      issueDate: Date,
      expiryDate: Date,
      document: String, // S3 URL
    },
    stripeAccountId: {
      type: String,
      index: true,
    },
    stripeAccountStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'incomplete'],
      default: 'pending',
    },
    pricing: {
      currency: {
        type: String,
        default: 'USD',
      },
      acceptsCash: {
        type: Boolean,
        default: false,
      },
      acceptsCard: {
        type: Boolean,
        default: true,
      },
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    stats: {
      totalBookings: {
        type: Number,
        default: 0,
      },
      completedBookings: {
        type: Number,
        default: 0,
      },
      cancelledBookings: {
        type: Number,
        default: 0,
      },
      responseTime: Number, // in minutes
      responseRate: Number, // percentage
    },
    settings: {
      instantBooking: {
        type: Boolean,
        default: false,
      },
      requireApproval: {
        type: Boolean,
        default: true,
      },
      advanceBookingDays: {
        type: Number,
        default: 30,
      },
      cancellationPolicy: {
        type: String,
        maxlength: 1000,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDate: Date,
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'closed'],
      default: 'pending',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial indexes
businessSchema.index({ 'address.coordinates': '2dsphere' });
// Note: serviceArea index removed - it's optional and may not always have valid geo data
// If needed, create a sparse index: businessSchema.index({ serviceArea: '2dsphere' }, { sparse: true });

// Text search index
businessSchema.index({ name: 'text', description: 'text' });

// Compound indexes
businessSchema.index({ status: 1, isVerified: 1 });
businessSchema.index({ ownerUserId: 1, status: 1 });
businessSchema.index({ 'rating.average': -1, status: 1 });

// Virtual for formatted address
businessSchema.virtual('formattedAddress').get(function () {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// Method to check if business is open
businessSchema.methods.isOpenNow = function () {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const todayHours = this.operatingHours.find(h => h.dayOfWeek === dayOfWeek);
  
  if (!todayHours || todayHours.isClosed) {
    return false;
  }

  return currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
};

// Method to get public profile
businessSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    businessType: this.businessType,
    logo: this.logo,
    coverPhoto: this.coverPhoto,
    photos: this.photos,
    contactInfo: this.contactInfo,
    address: {
      city: this.address.city,
      state: this.address.state,
      zipCode: this.address.zipCode,
      coordinates: this.address.coordinates,
    },
    operatingHours: this.operatingHours,
    rating: this.rating,
    isVerified: this.isVerified,
    featured: this.featured,
    createdAt: this.createdAt,
  };
};

// Static method to find nearby businesses
businessSchema.statics.findNearby = function (longitude, latitude, maxDistanceKm = 50) {
  return this.find({
    'address.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistanceKm * 1000, // Convert to meters
      },
    },
    status: 'active',
  });
};

// Static method to search businesses
businessSchema.statics.search = function (query, filters = {}) {
  const searchQuery = {
    status: 'active',
    ...filters,
  };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  return this.find(searchQuery).sort({ featured: -1, 'rating.average': -1 });
};

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;

