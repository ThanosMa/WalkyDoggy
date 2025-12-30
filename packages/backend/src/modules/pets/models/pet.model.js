const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
    },
    species: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
      required: [true, 'Species is required'],
    },
    breed: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    birthDate: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unknown'],
      default: 'unknown',
    },
    weight: {
      type: Number, // in kg
      min: 0,
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large', 'extra-large'],
    },
    color: {
      type: String,
      trim: true,
    },
    photos: [
      {
        type: String, // S3 URLs
      },
    ],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      index: true,
    },
    coOwners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    medicalInfo: {
      vaccinations: [
        {
          name: {
            type: String,
            required: true,
          },
          date: {
            type: Date,
            required: true,
          },
          expiryDate: Date,
          document: String, // S3 URL
        },
      ],
      allergies: [String],
      medications: [
        {
          name: String,
          dosage: String,
          frequency: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      conditions: [String],
      specialNeeds: String,
      vetInfo: {
        name: String,
        phone: String,
        email: String,
        address: String,
      },
    },
    behavior: {
      temperament: String,
      goodWithKids: {
        type: Boolean,
        default: false,
      },
      goodWithDogs: {
        type: Boolean,
        default: false,
      },
      goodWithCats: {
        type: Boolean,
        default: false,
      },
      energyLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'very-high'],
      },
      trainingLevel: {
        type: String,
        enum: ['none', 'basic', 'intermediate', 'advanced'],
      },
      specialBehaviors: [String],
    },
    microchipId: {
      type: String,
      trim: true,
    },
    registrationNumber: {
      type: String,
      trim: true,
    },
    insurance: {
      provider: String,
      policyNumber: String,
      expiryDate: Date,
    },
    status: {
      type: String,
      enum: ['active', 'deceased', 'rehomed', 'lost'],
      default: 'active',
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
petSchema.index({ ownerId: 1, status: 1 });
petSchema.index({ coOwners: 1 });
petSchema.index({ name: 'text', breed: 'text' });

// Virtual for age calculation from birthDate
petSchema.virtual('calculatedAge').get(function () {
  if (!this.birthDate) return this.age;
  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Method to check if user has access to this pet
petSchema.methods.hasAccess = function (userId) {
  // Handle both populated and unpopulated ownerId
  const ownerIdStr = this.ownerId._id 
    ? this.ownerId._id.toString() 
    : this.ownerId.toString();
  
  const userIdStr = userId.toString();
  
  // Check if owner
  if (ownerIdStr === userIdStr) {
    return true;
  }
  
  // Check if co-owner (handle populated case)
  return this.coOwners.some(coOwner => {
    const coOwnerIdStr = coOwner._id 
      ? coOwner._id.toString() 
      : coOwner.toString();
    return coOwnerIdStr === userIdStr;
  });
};

// Method to get public info (without sensitive medical data)
petSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    species: this.species,
    breed: this.breed,
    age: this.calculatedAge || this.age,
    gender: this.gender,
    size: this.size,
    color: this.color,
    photos: this.photos,
    behavior: {
      temperament: this.behavior.temperament,
      goodWithKids: this.behavior.goodWithKids,
      goodWithDogs: this.behavior.goodWithDogs,
      goodWithCats: this.behavior.goodWithCats,
      energyLevel: this.behavior.energyLevel,
    },
  };
};

// Static method to find pets by owner
petSchema.statics.findByOwner = function (userId, includeCoOwned = false) {
  const query = { ownerId: userId, status: 'active' };
  
  if (includeCoOwned) {
    return this.find({
      $or: [{ ownerId: userId }, { coOwners: userId }],
      status: 'active',
    });
  }
  
  return this.find(query);
};

// Pre-save middleware to calculate age from birthDate
petSchema.pre('save', function (next) {
  if (this.birthDate && !this.age) {
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    this.age = today.getFullYear() - birthDate.getFullYear();
  }
  next();
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;

