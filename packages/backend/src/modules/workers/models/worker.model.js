const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      sparse: true, // Optional - worker might not have a user account yet
    },
    profile: {
      firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        index: true,
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
      },
      avatar: String,
      bio: {
        type: String,
        maxlength: 1000,
      },
      dateOfBirth: Date,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    specializations: [
      {
        type: String,
        enum: [
          'dog_walking',
          'pet_sitting',
          'grooming',
          'training',
          'veterinary',
          'transportation',
          'boarding',
          'daycare',
          'behavioral_training',
          'emergency_care',
          'senior_pet_care',
          'puppy_care',
        ],
      },
    ],
    certifications: [
      {
        name: {
          type: String,
          required: true,
        },
        issuedBy: String,
        issueDate: Date,
        expiryDate: Date,
        document: String, // S3 URL
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    experience: {
      years: {
        type: Number,
        min: 0,
        default: 0,
      },
      description: String,
      previousEmployers: [
        {
          name: String,
          role: String,
          startDate: Date,
          endDate: Date,
        },
      ],
    },
    availability: {
      schedule: [
        {
          dayOfWeek: {
            type: Number, // 0-6
            required: true,
          },
          startTime: String, // "09:00"
          endTime: String, // "18:00"
          isAvailable: {
            type: Boolean,
            default: true,
          },
        },
      ],
      timeOff: [
        {
          startDate: Date,
          endDate: Date,
          reason: String,
        },
      ],
    },
    // Real-time location and status
    status: {
      isOnline: {
        type: Boolean,
        default: false,
        index: true,
      },
      currentStatus: {
        type: String,
        enum: ['available', 'busy', 'on_break', 'offline'],
        default: 'offline',
      },
      lastSeenAt: Date,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere',
      },
      lastUpdated: Date,
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
      totalJobs: {
        type: Number,
        default: 0,
      },
      completedJobs: {
        type: Number,
        default: 0,
      },
      cancelledJobs: {
        type: Number,
        default: 0,
      },
      responseTime: Number, // in minutes
      responseRate: Number, // percentage
      repeatClients: {
        type: Number,
        default: 0,
      },
    },
    documents: {
      backgroundCheck: {
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected', 'expired'],
          default: 'pending',
        },
        completedDate: Date,
        expiryDate: Date,
        document: String,
      },
      drivingLicense: {
        number: String,
        expiryDate: Date,
        document: String,
      },
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    paymentInfo: {
      hourlyRate: Number,
      paymentMethod: {
        type: String,
        enum: ['direct_deposit', 'check', 'cash', 'paypal'],
      },
      bankAccount: String, // Encrypted
    },
    settings: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
      maxJobsPerDay: {
        type: Number,
        default: 5,
      },
      travelRadius: {
        type: Number, // in km
        default: 10,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    hireDate: Date,
    terminationDate: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
workerSchema.index({ businessId: 1, isActive: 1 });
workerSchema.index({ 'status.isOnline': 1, isActive: 1 });
workerSchema.index({ location: '2dsphere' });
workerSchema.index({ specializations: 1 });
workerSchema.index({ 'rating.average': -1 });

// Virtual for full name
workerSchema.virtual('fullName').get(function () {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Method to update location
workerSchema.methods.updateLocation = function (longitude, latitude) {
  this.location = {
    type: 'Point',
    coordinates: [longitude, latitude],
    lastUpdated: new Date(),
  };
};

// Method to set online status
workerSchema.methods.setOnlineStatus = function (isOnline) {
  this.status.isOnline = isOnline;
  this.status.currentStatus = isOnline ? 'available' : 'offline';
  this.status.lastSeenAt = new Date();
};

// Method to check if worker is available
workerSchema.methods.isAvailableNow = function () {
  if (!this.isActive || !this.status.isOnline) {
    return false;
  }
  
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // Check if worker is on time off
  const isOnTimeOff = this.availability.timeOff.some(timeOff => {
    return now >= timeOff.startDate && now <= timeOff.endDate;
  });

  if (isOnTimeOff) {
    return false;
  }

  // Check schedule
  const todaySchedule = this.availability.schedule.find(s => s.dayOfWeek === dayOfWeek);
  
  if (!todaySchedule || !todaySchedule.isAvailable) {
    return false;
  }

  return currentTime >= todaySchedule.startTime && currentTime <= todaySchedule.endTime;
};

// Method to get public JSON
workerSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    profile: {
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      avatar: this.profile.avatar,
      bio: this.profile.bio,
    },
    specializations: this.specializations,
    certifications: this.certifications.map(cert => ({
      name: cert.name,
      issuedBy: cert.issuedBy,
      verified: cert.verified,
    })),
    experience: {
      years: this.experience.years,
      description: this.experience.description,
    },
    status: {
      isOnline: this.status.isOnline,
      currentStatus: this.status.currentStatus,
    },
    location: this.location, // For showing on map
    rating: this.rating,
    stats: {
      totalJobs: this.stats.totalJobs,
      completedJobs: this.stats.completedJobs,
    },
    isVerified: this.isVerified,
  };
};

// Static method to find nearby online workers
workerSchema.statics.findNearbyOnline = function (longitude, latitude, maxDistanceKm = 10) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistanceKm * 1000,
      },
    },
    'status.isOnline': true,
    isActive: true,
  });
};

const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;

