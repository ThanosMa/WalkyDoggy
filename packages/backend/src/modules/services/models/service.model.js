const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: [true, 'Service category is required'],
      enum: [
        'walking', 'dog_walking',
        'sitting', 'pet_sitting',
        'grooming',
        'training',
        'veterinary',
        'transportation', 'transport',
        'boarding',
        'daycare',
        'other',
      ],
      index: true,
    },
    description: {
      type: String,
      maxlength: 2000,
      default: '',
    },
    pricing: {
      basePrice: {
        type: Number,
        required: [true, 'Base price is required'],
        min: 0,
      },
      currency: {
        type: String,
        default: 'EUR',
      },
      // Support both priceType and pricingType for flexibility
      pricingType: {
        type: String,
        enum: ['fixed', 'hourly', 'daily', 'per_visit', 'per_pet', 'custom'],
        default: 'fixed',
      },
      priceType: {
        type: String,
        enum: ['fixed', 'hourly', 'daily', 'per_visit', 'per_pet', 'custom'],
      },
      // For hourly/custom pricing
      additionalRates: [
        {
          duration: Number, // in minutes
          price: Number,
          description: String,
        },
      ],
    },
    // Duration in minutes - can be a number or an object
    duration: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: 30,
    },
    petTypes: [
      {
        type: String,
        enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
      },
    ],
    petSizes: [
      {
        type: String,
        enum: ['small', 'medium', 'large', 'extra-large'],
      },
    ],
    images: [String], // URLs to service images
    requirements: {
      minAge: Number, // months
      maxAge: Number, // months
      vaccinations: [String],
      specialNeeds: String,
    },
    availability: {
      daysOfWeek: [
        {
          type: Number, // 0-6 (Sunday-Saturday)
          min: 0,
          max: 6,
        },
      ],
      startTime: String, // "09:00"
      endTime: String, // "18:00"
      advanceBookingDays: {
        type: Number,
        default: 7,
      },
    },
    capacity: {
      maxPetsPerSession: {
        type: Number,
        default: 1,
      },
      maxSessionsPerDay: {
        type: Number,
        default: 10,
      },
    },
    addOns: [
      {
        name: String,
        description: String,
        price: Number,
      },
    ],
    cancellationPolicy: {
      type: String,
      maxlength: 1000,
    },
    tags: [String],
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
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
    },
    // Pet requirements from simplified form
    petRequirements: {
      petTypes: [String],
      minWeight: Number,
      maxWeight: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
serviceSchema.index({ businessId: 1, isActive: 1 });
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ 'pricing.basePrice': 1 });
serviceSchema.index({ 'rating.average': -1 });
serviceSchema.index({ name: 'text', description: 'text' });

// Virtual for formatted price
serviceSchema.virtual('formattedPrice').get(function () {
  const symbol = this.pricing.currency === 'USD' ? '$' : '€';
  return `${symbol}${this.pricing.basePrice.toFixed(2)}`;
});

// Method to check if service is available on a specific day
serviceSchema.methods.isAvailableOn = function (dayOfWeek) {
  if (!this.availability.daysOfWeek || this.availability.daysOfWeek.length === 0) {
    return true; // Available all days if not specified
  }
  return this.availability.daysOfWeek.includes(dayOfWeek);
};

// Method to get public JSON
serviceSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    category: this.category,
    description: this.description,
    pricing: this.pricing,
    duration: this.duration,
    petTypes: this.petTypes,
    petSizes: this.petSizes,
    images: this.images,
    availability: this.availability,
    rating: this.rating,
    tags: this.tags,
    isActive: this.isActive,
    featured: this.featured,
  };
};

// Static method to find by business and category
serviceSchema.statics.findByBusinessAndCategory = function (businessId, category) {
  return this.find({ businessId, category, isActive: true });
};

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;

