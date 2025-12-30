# WalkyDoggy - Technical Architecture Document

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Pattern](#architecture-pattern)
4. [Database Design](#database-design)
5. [API Design](#api-design)
6. [Authentication & Authorization](#authentication--authorization)
7. [Payment Processing](#payment-processing)
8. [Location & Mapping](#location--mapping)
9. [Mobile Strategy](#mobile-strategy)
10. [Deployment Architecture](#deployment-architecture)
11. [CI/CD Pipeline](#cicd-pipeline)
12. [Monitoring & Analytics](#monitoring--analytics)
13. [Security Considerations](#security-considerations)
14. [Scalability Strategy](#scalability-strategy)
15. [Development Roadmap](#development-roadmap)

---

## 1. System Overview

### Core Entities
- **Pet Owners**: Users who need pet care services
- **Pet Businesses**: Companies offering pet care services
- **Pet Workers**: Individuals working for businesses (can be online/offline)
- **Pets**: Animals owned by pet owners (with co-ownership support)
- **Services**: Various pet care offerings (walking, boarding, grooming, etc.)
- **Bookings**: Service reservations and scheduling
- **Payments**: Transaction records
- **Reviews**: Ratings and feedback

### Key Features
- Multi-tenant business accounts with multiple workers
- Real-time location tracking of available workers
- Booking and scheduling system
- In-app payments with Stripe
- Review and rating system
- Push notifications
- Real-time chat (optional future feature)

---

## 2. Technology Stack

### Frontend
**Web Application:**
- **Framework**: Vue.js 3 with Composition API
- **State Management**: Pinia (modern Vuex alternative)
- **UI Component Library**: 
  - Vuetify 3 or PrimeVue (comprehensive component sets)
  - TailwindCSS for custom styling
- **Maps**: Mapbox GL JS or Google Maps JavaScript API
- **Real-time**: Socket.io-client
- **HTTP Client**: Axios with interceptors
- **Form Validation**: VeeValidate or Yup
- **Date Handling**: date-fns or Day.js

**Mobile Application:**
- **Recommended**: React Native with Expo
  - Reason: JavaScript ecosystem consistency with your backend
  - Shared business logic potential
  - Large community and excellent libraries
  - Expo makes deployment easier
- **Alternative**: Flutter (if team has Dart experience)

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **API Style**: RESTful API + GraphQL (optional for mobile optimization)
- **Real-time**: Socket.io for live location and notifications
- **Validation**: Joi or Zod
- **Authentication**: Passport.js with JWT strategy
- **File Upload**: Multer + AWS S3
- **Payment Processing**: Stripe SDK
- **Email Service**: SendGrid or AWS SES
- **SMS Service**: Twilio (for notifications)
- **Cron Jobs**: node-cron or Bull (Redis-based queue)

### Database
- **Primary Database**: MongoDB 7.x
  - Excellent geospatial query support
  - Flexible schema for evolving features
  - Good performance for read-heavy operations
- **Caching Layer**: Redis
  - Session management
  - Rate limiting
  - Real-time worker locations cache
  - Job queues (Bull)
- **Search Engine**: MongoDB Atlas Search or Elasticsearch (if complex search needed)

### Infrastructure

**Development Environment:**
- **Containerization**: Docker + Docker Compose
- **Database**: MongoDB (local or MongoDB Atlas free tier)
- **Cache**: Redis (local Docker container)
- **Storage**: Local file system or MinIO (S3-compatible)
- **Email Testing**: MailHog or Mailtrap
- **Monitoring**: Local logging + Sentry (free tier)

**Production Environment:**
- **Cloud Provider**: AWS
  - **Compute**: ECS Fargate (serverless containers) or EKS (if Kubernetes needed)
  - **Database**: MongoDB Atlas (managed) or AWS DocumentDB
  - **Cache**: AWS ElastiCache for Redis
  - **Storage**: AWS S3 for images/documents
  - **CDN**: CloudFront for static assets
  - **Load Balancer**: Application Load Balancer (ALB)
  - **DNS**: Route 53
  - **Secrets**: AWS Secrets Manager
- **CI/CD**: GitHub Actions
- **Monitoring**: 
  - PostHog (product analytics)
  - AWS CloudWatch (infrastructure)
  - Sentry (error tracking)

---

## 3. Architecture Pattern

### Recommended: Modular Monolith with Microservices Ready

**Initial Phase: Modular Monolith**
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── validators/
│   │   ├── users/
│   │   ├── pets/
│   │   ├── businesses/
│   │   ├── services/
│   │   ├── bookings/
│   │   ├── payments/
│   │   ├── reviews/
│   │   ├── locations/
│   │   └── notifications/
│   ├── shared/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── config/
│   │   └── types/
│   ├── app.js
│   └── server.js
├── tests/
├── docker/
└── docs/
```

**Benefits:**
- Easier to develop and deploy initially
- Single codebase, simpler debugging
- Shared utilities and models
- Can extract to microservices later if needed

**Module Boundaries:**
Each module is self-contained with:
- Clear interface (routes/API)
- Own business logic (services)
- Own data models
- Minimal dependencies on other modules

**Future Microservices Candidates:**
- Payment Service (PCI compliance isolation)
- Notification Service (high volume, can scale independently)
- Location Service (real-time, high throughput)

---

## 4. Database Design

### MongoDB Collections Schema

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  passwordHash: String,
  userType: String, // 'pet_owner' | 'business' | 'admin'
  profile: {
    firstName: String,
    lastName: String,
    phoneNumber: String,
    avatar: String, // S3 URL
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      coordinates: {
        type: "Point",
        coordinates: [longitude, latitude] // GeoJSON format
      }
    }
  },
  businessId: ObjectId, // Reference to Business (if business user)
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date,
  status: String // 'active' | 'suspended' | 'deleted'
}

// Indexes
{ email: 1 } - unique
{ userType: 1 }
{ "profile.address.coordinates": "2dsphere" } - geospatial
```

#### 2. Businesses Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  ownerUserId: ObjectId, // Reference to Users
  businessType: String, // 'individual' | 'company'
  logo: String, // S3 URL
  coverPhoto: String,
  contactInfo: {
    email: String,
    phone: String,
    website: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      type: "Point",
      coordinates: [longitude, latitude]
    }
  },
  serviceArea: {
    type: "Polygon", // Service coverage area
    coordinates: [[[lng, lat], [lng, lat], ...]]
  },
  operatingHours: [{
    dayOfWeek: Number, // 0-6
    openTime: String, // "09:00"
    closeTime: String // "18:00"
  }],
  certifications: [String], // URLs to certificates
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    expiryDate: Date
  },
  stripeAccountId: String, // Stripe Connect account
  rating: {
    average: Number,
    count: Number
  },
  isVerified: Boolean,
  status: String, // 'active' | 'pending' | 'suspended'
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ ownerUserId: 1 }
{ "address.coordinates": "2dsphere" }
{ "serviceArea": "2dsphere" }
{ status: 1 }
```

#### 3. PetWorkers Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users
  businessId: ObjectId, // Reference to Businesses
  bio: String,
  experience: Number, // years
  specializations: [String], // ['dogs', 'cats', 'small_animals']
  certifications: [String],
  availability: [{
    dayOfWeek: Number,
    startTime: String,
    endTime: String
  }],
  currentLocation: {
    type: "Point",
    coordinates: [longitude, latitude],
    lastUpdated: Date
  },
  isOnline: Boolean,
  isAvailable: Boolean,
  rating: {
    average: Number,
    count: Number
  },
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ userId: 1 } - unique
{ businessId: 1 }
{ isOnline: 1, isAvailable: 1 }
{ "currentLocation": "2dsphere" }
```

#### 4. Pets Collection
```javascript
{
  _id: ObjectId,
  name: String,
  species: String, // 'dog' | 'cat' | 'other'
  breed: String,
  age: Number,
  weight: Number, // in kg
  photos: [String], // S3 URLs
  ownerId: ObjectId, // Primary owner (Users reference)
  coOwners: [ObjectId], // Additional owners (Users references)
  medicalInfo: {
    vaccinations: [{
      name: String,
      date: Date,
      expiryDate: Date,
      document: String // S3 URL
    }],
    allergies: [String],
    medications: [String],
    specialNeeds: String,
    vetInfo: {
      name: String,
      phone: String,
      address: String
    }
  },
  behavior: {
    temperament: String,
    goodWithKids: Boolean,
    goodWithPets: Boolean,
    energyLevel: String // 'low' | 'medium' | 'high'
  },
  microchipId: String,
  status: String, // 'active' | 'deceased' | 'rehomed'
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ ownerId: 1 }
{ coOwners: 1 }
{ status: 1 }
```

#### 5. Services Collection
```javascript
{
  _id: ObjectId,
  businessId: ObjectId,
  name: String,
  serviceType: String, // 'walking' | 'boarding' | 'daycare' | 'grooming' | 'training' | 'sitting'
  description: String,
  pricing: {
    basePrice: Number,
    currency: String, // 'USD'
    priceType: String, // 'per_hour' | 'per_day' | 'per_session' | 'fixed'
    additionalPetPrice: Number // Extra charge for additional pets
  },
  duration: Number, // in minutes (for time-based services)
  petTypes: [String], // ['dog', 'cat']
  maxPets: Number,
  requirements: [String],
  cancellationPolicy: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ businessId: 1, isActive: 1 }
{ serviceType: 1 }
```

#### 6. Bookings Collection
```javascript
{
  _id: ObjectId,
  bookingNumber: String, // unique, human-readable
  petOwnerId: ObjectId,
  businessId: ObjectId,
  workerId: ObjectId, // Assigned pet worker
  serviceId: ObjectId,
  pets: [ObjectId], // Array of pet IDs
  scheduledDate: Date,
  scheduledTime: String,
  duration: Number, // in minutes
  location: {
    type: String, // 'owner_home' | 'business_location' | 'custom'
    address: Object,
    coordinates: {
      type: "Point",
      coordinates: [longitude, latitude]
    }
  },
  pricing: {
    basePrice: Number,
    additionalCharges: [{
      description: String,
      amount: Number
    }],
    discount: Number,
    totalAmount: Number,
    currency: String
  },
  status: String, // 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes: String,
  specialInstructions: String,
  completionDetails: {
    startTime: Date,
    endTime: Date,
    workerNotes: String,
    photos: [String] // S3 URLs (proof of service)
  },
  createdAt: Date,
  updatedAt: Date,
  cancelledAt: Date,
  cancelledBy: ObjectId,
  cancellationReason: String
}

// Indexes
{ bookingNumber: 1 } - unique
{ petOwnerId: 1, status: 1 }
{ businessId: 1, status: 1 }
{ workerId: 1, scheduledDate: 1 }
{ status: 1, scheduledDate: 1 }
{ "location.coordinates": "2dsphere" }
```

#### 7. Payments Collection
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId,
  payerId: ObjectId, // Pet owner
  payeeBusinessId: ObjectId,
  amount: Number,
  currency: String,
  paymentMethod: String, // 'card' | 'wallet' | 'bank_transfer'
  stripePaymentIntentId: String,
  stripeChargeId: String,
  status: String, // 'pending' | 'succeeded' | 'failed' | 'refunded'
  refundAmount: Number,
  platformFee: Number,
  businessPayout: Number,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date,
  paidAt: Date,
  refundedAt: Date
}

// Indexes
{ bookingId: 1 }
{ payerId: 1 }
{ payeeBusinessId: 1 }
{ status: 1, createdAt: -1 }
{ stripePaymentIntentId: 1 }
```

#### 8. Reviews Collection
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId,
  reviewerId: ObjectId, // Pet owner
  revieweeType: String, // 'business' | 'worker'
  revieweeId: ObjectId,
  rating: Number, // 1-5
  title: String,
  comment: String,
  photos: [String], // S3 URLs
  response: {
    comment: String,
    respondedBy: ObjectId,
    respondedAt: Date
  },
  isVerified: Boolean, // Only if booking was completed
  status: String, // 'published' | 'flagged' | 'hidden'
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ bookingId: 1 } - unique
{ revieweeId: 1, revieweeType: 1, status: 1 }
{ reviewerId: 1 }
{ rating: 1 }
```

#### 9. Notifications Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String, // 'booking' | 'payment' | 'review' | 'system'
  title: String,
  message: String,
  data: Object, // Additional context
  isRead: Boolean,
  readAt: Date,
  createdAt: Date
}

// Indexes
{ userId: 1, isRead: 1, createdAt: -1 }
{ createdAt: 1 } - TTL index (expire after 90 days)
```

---

## 5. API Design

### RESTful API Structure

**Base URL**: `https://api.walkydoggy.com/v1`

#### Authentication Endpoints
```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh-token
POST   /auth/forgot-password
POST   /auth/reset-password
POST   /auth/verify-email
POST   /auth/resend-verification
```

#### User Endpoints
```
GET    /users/me
PUT    /users/me
PUT    /users/me/password
POST   /users/me/avatar
DELETE /users/me
```

#### Pet Owner Endpoints
```
GET    /pets
POST   /pets
GET    /pets/:id
PUT    /pets/:id
DELETE /pets/:id
POST   /pets/:id/photos
DELETE /pets/:id/photos/:photoId
POST   /pets/:id/co-owners
DELETE /pets/:id/co-owners/:userId
```

#### Business Endpoints
```
GET    /businesses
POST   /businesses
GET    /businesses/:id
PUT    /businesses/:id
DELETE /businesses/:id
GET    /businesses/:id/workers
POST   /businesses/:id/workers
GET    /businesses/:id/services
POST   /businesses/:id/services
GET    /businesses/:id/reviews
GET    /businesses/search?lat=&lng=&radius=&serviceType=
```

#### Pet Worker Endpoints
```
GET    /workers/:id
PUT    /workers/:id
PUT    /workers/:id/location
PUT    /workers/:id/availability
GET    /workers/:id/bookings
GET    /workers/:id/reviews
POST   /workers/:id/online
POST   /workers/:id/offline
```

#### Service Endpoints
```
GET    /services/:id
PUT    /services/:id
DELETE /services/:id
GET    /services/search?serviceType=&petType=&location=
```

#### Booking Endpoints
```
GET    /bookings
POST   /bookings
GET    /bookings/:id
PUT    /bookings/:id
POST   /bookings/:id/confirm
POST   /bookings/:id/cancel
POST   /bookings/:id/complete
POST   /bookings/:id/start
GET    /bookings/:id/tracking (real-time location)
```

#### Payment Endpoints
```
GET    /payments
POST   /payments/intent
POST   /payments/confirm
POST   /payments/:id/refund
GET    /payments/:id
POST   /webhooks/stripe (Stripe webhooks)
```

#### Review Endpoints
```
POST   /reviews
GET    /reviews/:id
PUT    /reviews/:id
DELETE /reviews/:id
POST   /reviews/:id/response
POST   /reviews/:id/flag
```

#### Location Endpoints
```
GET    /locations/workers?lat=&lng=&radius=&serviceType=
GET    /locations/businesses?lat=&lng=&radius=
POST   /locations/track (real-time updates)
```

#### Notification Endpoints
```
GET    /notifications
PUT    /notifications/:id/read
PUT    /notifications/read-all
DELETE /notifications/:id
```

### API Response Format
```javascript
// Success Response
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [...]
  }
}
```

---

## 6. Authentication & Authorization

### Authentication Flow

**JWT-based Authentication:**
- Access Token: Short-lived (15 minutes), stored in memory
- Refresh Token: Long-lived (7 days), stored in httpOnly cookie
- Token rotation on refresh

**Implementation:**
```javascript
// Token payload
{
  sub: userId,
  type: userType, // 'pet_owner' | 'business' | 'admin'
  businessId: businessId, // if business user
  workerId: workerId, // if worker
  iat: issuedAt,
  exp: expiration
}
```

### Authorization Levels

1. **Public**: No authentication required
2. **Authenticated**: Any logged-in user
3. **Pet Owner**: Owners with verified accounts
4. **Business**: Business account holders
5. **Worker**: Pet workers
6. **Admin**: Platform administrators

### Role-Based Access Control (RBAC)

**Middleware Structure:**
```javascript
// Example: Only pet owners can create bookings
router.post('/bookings',
  authenticate,
  authorize(['pet_owner']),
  validateBooking,
  bookingController.create
);

// Example: Business owners and workers can access business bookings
router.get('/businesses/:id/bookings',
  authenticate,
  authorize(['business', 'worker']),
  checkBusinessAccess,
  bookingController.list
);
```

### Social Authentication (Optional)
- Google OAuth
- Apple Sign-In
- Facebook Login

---

## 7. Payment Processing

### Stripe Integration

**Recommended Approach: Stripe Connect**

**Why Stripe Connect:**
- Allows platform to facilitate payments between pet owners and businesses
- Handles multi-party payments
- Automatic splits (platform fee + business payout)
- Compliance and tax handling

**Implementation:**

1. **Business Onboarding:**
   - Businesses create Stripe Connect accounts
   - Complete KYC verification
   - Link bank accounts for payouts

2. **Payment Flow:**
```
Pet Owner → Stripe → Platform → Business
            (Payment)  (Fee)    (Payout)
```

3. **Payment Intent Creation:**
```javascript
const paymentIntent = await stripe.paymentIntents.create({
  amount: totalAmount * 100, // cents
  currency: 'usd',
  application_fee_amount: platformFee * 100,
  transfer_data: {
    destination: businessStripeAccountId,
  },
  metadata: {
    bookingId: bookingId,
    petOwnerId: petOwnerId
  }
});
```

4. **Platform Fee Structure:**
   - Standard: 15% platform fee
   - Premium businesses: 10% fee
   - Payment processing fees: Passed to businesses

5. **Refund Policy:**
   - Full refund: > 24 hours before service
   - 50% refund: 12-24 hours before
   - No refund: < 12 hours before
   - Emergency exceptions handled case-by-case

6. **Security:**
   - PCI compliance through Stripe
   - Never store card details
   - Use Stripe Elements for card input
   - Webhook signature verification

---

## 8. Location & Mapping

### Mapping Service: **Mapbox** (Recommended)

**Why Mapbox over Google Maps:**
- More cost-effective at scale
- Better customization options
- Excellent mobile SDK
- Real-time capabilities
- Better styling options

**Alternative: Google Maps** (if preferred for familiarity)

### Location Features

#### 1. Worker Location Tracking
```javascript
// Real-time location updates via Socket.io
socket.emit('location:update', {
  workerId: workerId,
  coordinates: [lng, lat],
  timestamp: Date.now()
});

// Store in Redis for fast queries
redis.geoadd('workers:online', longitude, latitude, workerId);
redis.expire(`worker:location:${workerId}`, 300); // 5 min expiry
```

#### 2. Geospatial Queries
```javascript
// Find nearby workers (MongoDB)
db.petWorkers.find({
  currentLocation: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [userLng, userLat]
      },
      $maxDistance: 10000 // 10km in meters
    }
  },
  isOnline: true,
  isAvailable: true
});

// Find workers in Redis (faster for online status)
redis.georadius('workers:online', longitude, latitude, 10, 'km');
```

#### 3. Service Area Coverage
- Businesses define service areas as polygons
- Check if booking location falls within service area
```javascript
db.businesses.find({
  serviceArea: {
    $geoIntersects: {
      $geometry: {
        type: "Point",
        coordinates: [bookingLng, bookingLat]
      }
    }
  }
});
```

#### 4. Real-time Tracking During Service
- Pet owners can track workers during active bookings
- Location updates every 30 seconds
- Privacy: Only visible during active service

### Map Features

**Web (Vue.js):**
- Mapbox GL JS
- Cluster markers for multiple workers
- Info cards on marker click
- Route visualization

**Mobile (React Native):**
- @rnmapbox/maps
- Native performance
- Offline maps support

---

## 9. Mobile Strategy

### Recommended Approach: **React Native with Expo**

#### Why React Native?
1. **Code Sharing**: Share business logic with Node.js backend
2. **Single Codebase**: iOS and Android
3. **Excellent Libraries**: Mature ecosystem
4. **Fast Development**: Hot reload, OTA updates
5. **Native Performance**: Good enough for most use cases
6. **Cost-Effective**: One team can build both platforms

### Mobile Architecture

```
mobile/
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── screens/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── search/
│   │   ├── bookings/
│   │   ├── profile/
│   │   └── chat/
│   ├── components/
│   ├── services/
│   │   ├── api/
│   │   ├── location/
│   │   ├── push-notifications/
│   │   └── storage/
│   ├── store/ (Redux or Zustand)
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── App.tsx
├── app.json
├── package.json
└── eas.json (Expo Application Services)
```

### Key Mobile Libraries

**Essential:**
- `@react-navigation/native` - Navigation
- `@react-navigation/stack` - Stack navigation
- `axios` - HTTP client
- `@tanstack/react-query` - Data fetching and caching
- `zustand` or `@reduxjs/toolkit` - State management
- `react-hook-form` - Form handling
- `zod` - Validation
- `@rnmapbox/maps` - Maps
- `expo-location` - Geolocation
- `expo-image-picker` - Image selection
- `expo-notifications` - Push notifications
- `socket.io-client` - Real-time communication
- `stripe-react-native` - Payments
- `react-native-fast-image` - Image caching
- `@react-native-async-storage/async-storage` - Local storage

**Nice to Have:**
- `react-native-reanimated` - Animations
- `react-native-gesture-handler` - Gestures
- `react-native-svg` - SVG support
- `@gorhom/bottom-sheet` - Bottom sheets
- `react-native-date-picker` - Date picker

### Code Sharing Strategy

**Shared Between Web and Mobile:**
- API client configuration
- Business logic functions
- Validation schemas (Zod)
- TypeScript types/interfaces
- Utility functions

**Create Shared Package:**
```
packages/
├── shared/
│   ├── api/
│   ├── types/
│   ├── validators/
│   ├── utils/
│   └── constants/
```

**Use in Both Apps:**
```javascript
// In web (Vue.js)
import { validateBooking } from '@walkydoggy/shared/validators';

// In mobile (React Native)
import { validateBooking } from '@walkydoggy/shared/validators';
```

### Mobile-Specific Features

1. **Push Notifications**
   - Booking confirmations
   - Service reminders
   - Worker arrival notifications
   - Chat messages

2. **Offline Support**
   - Cache booking history
   - Store user profile
   - Queue actions when offline

3. **Biometric Authentication**
   - Face ID / Touch ID for quick login

4. **Background Location** (for workers)
   - Track location during active service
   - Battery-efficient updates

5. **Camera Integration**
   - Pet photos
   - Document uploads (vaccination records)
   - Service completion photos

### Progressive Web App (PWA) as Bridge

**Consider building PWA first:**
- Use Vue.js web app as base
- Add service workers for offline support
- Make responsive for mobile
- Add to home screen capability
- Test market fit before full native app

**Migration Path:**
```
Phase 1: Responsive Web App
Phase 2: PWA with offline support
Phase 3: React Native app (when proven demand)
```

---

## 10. Deployment Architecture

### Development vs Production Infrastructure

#### Development Environment (Local)

**No AWS Required for Development!**

All services run locally via Docker Compose:

| Service | Development Alternative | Access |
|---------|------------------------|--------|
| **S3** | MinIO (S3-compatible) | http://localhost:9001 |
| **SES/SendGrid** | MailHog (email testing) | http://localhost:8025 |
| **MongoDB** | Local MongoDB container | localhost:27017 |
| **Redis** | Local Redis container | localhost:6379 |
| **Secrets Manager** | .env files | Local files |
| **CloudWatch** | Console logs | Terminal |

**Development Storage Setup:**
```javascript
// Backend storage configuration
const storage = process.env.NODE_ENV === 'production' 
  ? new S3Storage() 
  : new LocalStorage();

// Local file upload (development)
class LocalStorage {
  async upload(file) {
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(process.env.UPLOAD_DIR, filename);
    await fs.promises.writeFile(filepath, file.buffer);
    return `/uploads/${filename}`;
  }
}

// S3 upload (production)
class S3Storage {
  async upload(file) {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `uploads/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };
    const result = await s3.upload(params).promise();
    return result.Location;
  }
}
```

**Email Testing with MailHog:**
```javascript
// Email service configuration
const transporter = nodemailer.createTransport(
  process.env.NODE_ENV === 'production'
    ? {
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      }
    : {
        host: 'mailhog',
        port: 1025,
        ignoreTLS: true
      }
);

// View emails at http://localhost:8025
```

**MinIO Setup (S3 Alternative):**
```javascript
// Install MinIO client
npm install minio

// Configure MinIO (development)
const Minio = require('minio');
const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin123'
});

// Create bucket
await minioClient.makeBucket('walkydoggy-uploads');
```

**Development Benefits:**
- ✅ Zero AWS costs during development
- ✅ Work offline
- ✅ Faster iteration (no network latency)
- ✅ Easy to reset/clean data
- ✅ Test emails without sending real emails
- ✅ Full control over all services

---

### Production AWS Infrastructure

#### Recommended Setup (Cost-Effective & Scalable)

```
┌─────────────────────────────────────────────────┐
│                  Route 53 (DNS)                 │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│              CloudFront (CDN)                   │
│           SSL/TLS Termination                   │
└─────────┬──────────────────────┬────────────────┘
          │                      │
          │                      │
┌─────────▼─────────┐   ┌────────▼───────────────┐
│   S3 Bucket       │   │ Application Load       │
│  (Static Assets)  │   │   Balancer (ALB)       │
│  - Web App        │   └────────┬───────────────┘
│  - Images         │            │
└───────────────────┘   ┌────────▼───────────────┐
                        │    ECS Fargate         │
                        │  ┌──────────────────┐  │
                        │  │  API Service     │  │
                        │  │  (Auto-scaling)  │  │
                        │  └──────────────────┘  │
                        │  ┌──────────────────┐  │
                        │  │ WebSocket Service│  │
                        │  └──────────────────┘  │
                        └────────┬───────────────┘
                                 │
        ┌────────────────────────┼────────────────────┐
        │                        │                    │
┌───────▼────────┐   ┌───────────▼────────┐  ┌───────▼─────────┐
│  MongoDB Atlas │   │ ElastiCache Redis  │  │   AWS S3        │
│   (Database)   │   │    (Cache/Queue)   │  │ (File Storage)  │
└────────────────┘   └────────────────────┘  └─────────────────┘
```

### Container Configuration

#### Docker Compose (Development)
```yaml
version: '3.8'

services:
  # Backend API
  api:
    build:
      context: ./packages/backend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/walkydoggy
      - REDIS_URL=redis://redis:6379
      - STORAGE_TYPE=local
      - UPLOAD_DIR=/app/uploads
      - EMAIL_SERVICE=mailhog
      - MAILHOG_HOST=mailhog
      - MAILHOG_PORT=1025
    depends_on:
      - mongo
      - redis
      - mailhog
      - minio
    volumes:
      - ./packages/backend:/app
      - /app/node_modules
      - uploads-data:/app/uploads

  # Frontend Web App
  web:
    build:
      context: ./packages/frontend
      dockerfile: Dockerfile.dev
    ports:
      - "8080:8080"
    environment:
      - VUE_APP_API_URL=http://localhost:3000/api/v1
      - VUE_APP_SOCKET_URL=http://localhost:3000
    volumes:
      - ./packages/frontend:/app
      - /app/node_modules

  # MongoDB Database
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=walkydoggy
    volumes:
      - mongo-data:/data/db
    command: mongod --quiet --logpath /dev/null

  # Redis Cache & Queue
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  # MinIO (S3-compatible storage for development)
  minio:
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin123
    volumes:
      - minio-data:/data
    command: server /data --console-address ":9001"

  # MailHog (Email testing)
  mailhog:
    image: mailhog/mailhog:latest
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI

  # MongoDB Express (Database UI - Optional)
  mongo-express:
    image: mongo-express:latest
    ports:
      - "8081:8081"
    environment:
      - ME_CONFIG_MONGODB_URL=mongodb://mongo:27017/
      - ME_CONFIG_BASICAUTH_USERNAME=admin
      - ME_CONFIG_BASICAUTH_PASSWORD=admin123
    depends_on:
      - mongo

  # Redis Commander (Redis UI - Optional)
  redis-commander:
    image: rediscommander/redis-commander:latest
    ports:
      - "8082:8081"
    environment:
      - REDIS_HOSTS=local:redis:6379
    depends_on:
      - redis

volumes:
  mongo-data:
  redis-data:
  minio-data:
  uploads-data:
```

#### Production Dockerfile (Backend)
```dockerfile
# Multi-stage build for optimization
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache tini

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

USER node

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/server.js"]
```

### ECS Task Definition (Example)
```json
{
  "family": "walkydoggy-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "{AWS_ACCOUNT_ID}.dkr.ecr.{REGION}.amazonaws.com/walkydoggy-api:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:mongodb-uri"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/walkydoggy-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Environment Management

**Environments:**
1. **Development**: Local Docker Compose
2. **Staging**: AWS ECS (smaller instances)
3. **Production**: AWS ECS (auto-scaling)

**Environment Variables Management:**
- AWS Secrets Manager for sensitive data
- AWS Systems Manager Parameter Store for configuration
- Environment-specific `.env` files for local development

### Auto-Scaling Configuration

**API Service:**
```javascript
// Scale based on CPU and memory
{
  minCapacity: 2,
  maxCapacity: 10,
  targetCPUUtilization: 70,
  targetMemoryUtilization: 80,
  scaleUpCooldown: 60, // seconds
  scaleDownCooldown: 300
}
```

**Database (MongoDB Atlas):**
- Auto-scaling storage
- Cluster tier based on load
- Read replicas for heavy read operations

---

## 11. CI/CD Pipeline

### GitHub Actions Workflow

#### Main Workflow (.github/workflows/main.yml)
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # Lint and Test
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
        env:
          NODE_ENV: test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  # Build and push Docker images
  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build, tag, and push image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: walkydoggy-api
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

  # Deploy to staging
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to ECS Staging
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: task-definition-staging.json
          service: walkydoggy-api-staging
          cluster: walkydoggy-staging
          wait-for-service-stability: true

  # Deploy to production
  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://api.walkydoggy.com
    steps:
      - name: Deploy to ECS Production
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: task-definition-production.json
          service: walkydoggy-api-production
          cluster: walkydoggy-production
          wait-for-service-stability: true
      
      - name: Run database migrations
        run: |
          # Run migrations if needed
          npm run migrate:prod
```

### Deployment Strategy

**Blue-Green Deployment:**
- Zero downtime deployments
- Quick rollback capability
- ECS supports this natively

**Database Migrations:**
- Use a migration tool like `migrate-mongo`
- Run migrations before deploying new code
- Always write backward-compatible migrations

### Branching Strategy

**Git Flow:**
```
main (production)
  ↑
develop (staging)
  ↑
feature/* (feature branches)
```

**Branch Protection:**
- Require PR reviews
- Require passing tests
- No direct pushes to main/develop

---

## 12. Monitoring & Analytics

### Application Monitoring

#### 1. PostHog (Product Analytics)
```javascript
// Initialize PostHog
import posthog from 'posthog-js';

posthog.init('YOUR_API_KEY', {
  api_host: 'https://app.posthog.com',
  autocapture: false // Manual tracking for better control
});

// Track events
posthog.capture('booking_created', {
  serviceType: 'walking',
  amount: 25.00,
  petCount: 2
});

// User identification
posthog.identify(userId, {
  email: user.email,
  userType: user.userType,
  createdAt: user.createdAt
});

// Feature flags
if (posthog.isFeatureEnabled('new-booking-flow')) {
  // Show new UI
}
```

**Key Metrics to Track:**
- User registrations (by type)
- Booking conversions
- Search to booking ratio
- Average booking value
- Retention rate
- Feature adoption

#### 2. Sentry (Error Tracking)
```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ],
});

// Error handler middleware
app.use(Sentry.Handlers.errorHandler());
```

#### 3. AWS CloudWatch
- ECS container metrics
- API Gateway metrics (if used)
- Custom metrics:
  - Active bookings
  - Payment success rate
  - API response times
  - Worker online count

**CloudWatch Alarms:**
```javascript
// Example alarms
- High error rate (> 5%)
- High response time (> 2s)
- Low disk space
- High CPU utilization (> 80%)
- Database connection pool exhausted
```

### Logging Strategy

**Structured Logging with Winston:**
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'walkydoggy-api' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
logger.info('Booking created', {
  bookingId: booking._id,
  userId: user._id,
  serviceType: service.type
});
```

**Log Aggregation:**
- CloudWatch Logs for AWS
- Consider ELK stack (Elasticsearch, Logstash, Kibana) for advanced analysis

### Performance Monitoring

**APM (Application Performance Monitoring):**
- **Option 1**: New Relic
- **Option 2**: DataDog
- **Option 3**: AWS X-Ray (native AWS integration)

**Key Metrics:**
- API endpoint response times
- Database query performance
- External API calls (Stripe, Mapbox)
- Memory usage
- Event loop lag

### Uptime Monitoring

**External Monitoring:**
- Pingdom or UptimeRobot
- Monitor from multiple geographic locations
- Alert on downtime

---

## 13. Security Considerations

### Security Checklist

#### 1. Authentication & Authorization
- [x] JWT with short expiration times
- [x] Refresh token rotation
- [x] HttpOnly, Secure, SameSite cookies
- [x] Rate limiting on auth endpoints
- [x] Account lockout after failed attempts
- [x] 2FA for business accounts (optional)

#### 2. API Security
```javascript
// Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);

// Helmet for security headers
import helmet from 'helmet';
app.use(helmet());

// CORS configuration
import cors from 'cors';
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true
}));

// XSS protection
import xss from 'xss-clean';
app.use(xss());

// NoSQL injection protection
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize());
```

#### 3. Data Protection
- Encrypt sensitive data at rest (MongoDB encryption)
- Encrypt data in transit (SSL/TLS)
- Don't log sensitive information
- GDPR compliance:
  - Data export functionality
  - Right to be forgotten (account deletion)
  - Privacy policy and terms
  - Cookie consent

#### 4. File Upload Security
```javascript
import multer from 'multer';

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Scan uploaded files for malware (AWS S3 + ClamAV or third-party)
```

#### 5. Payment Security
- PCI DSS compliance via Stripe
- Never store card details
- Use Stripe webhooks with signature verification
- Implement fraud detection rules

#### 6. Database Security
- Use connection strings from secrets manager
- Limit database user permissions
- Enable MongoDB authentication
- Use IP whitelisting
- Regular backups with encryption

#### 7. Infrastructure Security
- Private subnets for databases
- Security groups with minimal access
- VPC configuration
- AWS WAF for DDoS protection
- Regular security audits

### Vulnerability Scanning

**Automated Tools:**
```json
// package.json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix"
  }
}
```

**Dependabot:** Enable on GitHub for automatic dependency updates

---

## 14. Scalability Strategy

### Horizontal Scaling

#### 1. Stateless API Design
- No server-side sessions (use JWT)
- Store sessions in Redis if needed
- File uploads directly to S3
- Can add/remove containers seamlessly

#### 2. Database Scaling

**Read Scaling:**
- MongoDB replica sets
- Read preference: secondary for analytics
- Caching layer (Redis) for frequently accessed data

**Write Scaling:**
- Sharding when database > 500GB
- Shard key: userId for user data, businessId for business data

**Indexing Strategy:**
- Create indexes for all query patterns
- Compound indexes for common queries
- Monitor slow queries

#### 3. Caching Strategy

**Redis Cache Layers:**
```javascript
// Level 1: User sessions
redis.setex(`session:${userId}`, 3600, sessionData);

// Level 2: Frequently accessed data
redis.setex(`business:${businessId}`, 300, businessData);

// Level 3: Search results
redis.setex(`search:${queryHash}`, 600, searchResults);

// Level 4: Worker locations (geo-indexed)
redis.geoadd('workers:online', lng, lat, workerId);
```

**Cache Invalidation:**
- TTL-based expiration
- Event-based invalidation (on updates)
- Pub/Sub for cache invalidation across instances

#### 4. CDN Strategy

**CloudFront Distribution:**
- Cache static assets (images, CSS, JS)
- Cache API responses (with appropriate headers)
- Gzip compression
- Image optimization (use CloudFront with S3)

#### 5. Asynchronous Processing

**Use Bull Queue for:**
- Email notifications
- SMS notifications
- Push notifications
- Image processing
- Report generation
- Analytics aggregation

```javascript
import Queue from 'bull';

const emailQueue = new Queue('email', process.env.REDIS_URL);

// Add job
emailQueue.add('booking-confirmation', {
  to: user.email,
  bookingId: booking._id
});

// Process job
emailQueue.process('booking-confirmation', async (job) => {
  await sendEmail(job.data);
});
```

### Performance Optimization

#### 1. Database Optimization
- Use projections to limit returned fields
- Pagination for list endpoints
- Aggregation pipeline optimization
- Connection pooling

#### 2. API Optimization
- Response compression (gzip)
- GraphQL for mobile (reduce over-fetching)
- Batch endpoints where appropriate
- Lazy loading of related data

#### 3. Frontend Optimization
- Code splitting
- Lazy loading routes
- Image lazy loading
- Service worker for caching

---

## 15. Development Roadmap

### Phase 1: MVP (3-4 months)

**Month 1: Foundation**
- [ ] Project setup and infrastructure
- [ ] User authentication system
- [ ] Basic user profiles (pet owners and businesses)
- [ ] Database schema implementation
- [ ] API scaffolding

**Month 2: Core Features**
- [ ] Pet management (CRUD)
- [ ] Service listing and management
- [ ] Business profiles with workers
- [ ] Basic search functionality
- [ ] Map integration with business locations

**Month 3: Booking & Payments**
- [ ] Booking system
- [ ] Stripe integration
- [ ] Payment processing
- [ ] Email notifications
- [ ] Booking management dashboard

**Month 4: Polish & Launch**
- [ ] Review system
- [ ] Worker location tracking
- [ ] Admin panel basics
- [ ] Testing and bug fixes
- [ ] Deploy to production
- [ ] Beta launch

### Phase 2: Growth Features (3-4 months)

**Month 5-6:**
- [ ] Mobile app development (React Native)
- [ ] Advanced search filters
- [ ] Real-time chat between owners and workers
- [ ] Booking calendar and availability management
- [ ] Push notifications
- [ ] Analytics dashboard

**Month 7-8:**
- [ ] Advanced review features (photos, verification)
- [ ] Promotional system (coupons, discounts)
- [ ] Subscription plans for businesses
- [ ] Advanced worker management
- [ ] Automated reminder system
- [ ] Performance optimization

### Phase 3: Scale & Optimize (Ongoing)

- [ ] Microservices extraction (if needed)
- [ ] Advanced analytics
- [ ] Machine learning recommendations
- [ ] Multi-language support
- [ ] Additional payment methods
- [ ] Insurance integration
- [ ] Background check integration
- [ ] Loyalty program

---

## Technology Decision Matrix

| Aspect | Chosen Technology | Alternatives Considered | Rationale |
|--------|------------------|------------------------|-----------|
| **Frontend Framework** | Vue.js 3 | React, Angular | As specified by client |
| **Mobile Framework** | React Native | Flutter, Native | JavaScript consistency, code sharing |
| **Backend Framework** | Express.js | NestJS, Fastify | Simple, flexible, mature ecosystem |
| **Database** | MongoDB | PostgreSQL | Geospatial queries, flexible schema |
| **Cache** | Redis | Memcached | Advanced data structures, pub/sub |
| **Maps** | Mapbox | Google Maps | Cost-effective, customizable |
| **Payments** | Stripe Connect | PayPal, Square | Multi-party payments, best documentation |
| **Cloud Provider** | AWS | GCP, Azure | Comprehensive services, maturity |
| **Container Orchestration** | ECS Fargate | EKS, Docker Swarm | Serverless, simpler than K8s |
| **CI/CD** | GitHub Actions | GitLab CI, CircleCI | Native GitHub integration |
| **Monitoring** | PostHog + Sentry + CloudWatch | Mixpanel, Datadog | Balance of features and cost |

---

## Estimated Costs (Monthly)

### Development Phase (Local Setup)
- **Infrastructure**: $0 (all local via Docker)
- **MongoDB**: $0 (local) or $0 (Atlas M0 free tier)
- **Redis**: $0 (local)
- **Storage**: $0 (local filesystem or MinIO)
- **Email**: $0 (MailHog for testing)
- **Stripe**: $0 (test mode)
- **Mapbox**: $0 (free tier - 50k requests/month)
- **PostHog**: $0 (free tier)
- **Sentry**: $0 (free tier)
- **Total**: $0/month 🎉

**Optional for Development:**
- MongoDB Atlas M2: $9/month (if you prefer cloud over local)
- Better Mapbox tier: $0 (stick with free tier)

### Development Phase (If Using AWS)
Only if you want to test AWS services early:
- **MongoDB Atlas**: $57 (M10 cluster)
- **AWS Services**: $200-300
  - ECS Fargate: $100
  - S3: $20
  - CloudFront: $30
  - ElastiCache: $50
  - Other: $50
- **Total**: ~$300-400/month

### Production (Small Scale - 1000 active users)
- **MongoDB Atlas**: $150 (M20 cluster)
- **AWS Services**: $500-700
- **Stripe**: ~2.9% + $0.30 per transaction
- **Mapbox**: $100 (if over free tier)
- **SendGrid**: $20-50
- **Twilio**: $50
- **PostHog**: $0-100
- **Total**: ~$900-1200/month (excluding transaction fees)

### Production (Medium Scale - 10k active users)
- **MongoDB Atlas**: $500
- **AWS Services**: $2000-3000
- **Other Services**: $500
- **Total**: ~$3000-4000/month

---

## Next Steps

1. **Review this document** and provide feedback
2. **Prioritize features** for MVP
3. **Set up development environment**
4. **Create project repositories**
5. **Design detailed wireframes**
6. **Start with user authentication module**
7. **Iterative development in 2-week sprints**

---

## Questions to Discuss

1. **Budget constraints**: What's the budget for infrastructure and third-party services?
2. **Timeline**: When do you want to launch the MVP?
3. **Team size**: How many developers will work on this?
4. **Geographic scope**: Launching in specific cities/regions first?
5. **Compliance**: Any specific regulations (beyond GDPR/PCI)?
6. **Features priority**: Which features are must-haves for MVP?
7. **Branding**: Do you have design assets (logo, colors, style guide)?


