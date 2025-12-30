# WalkyDoggy - Database Schema Relationships

## Entity Relationship Diagram (Text Format)

```
┌─────────────────────┐
│       Users         │
│─────────────────────│
│ _id (PK)            │
│ email               │
│ passwordHash        │
│ userType            │◄─────────┐
│ profile             │          │
│ businessId (FK)     │──┐       │
│ isEmailVerified     │  │       │
│ status              │  │       │
│ createdAt           │  │       │
└─────────────────────┘  │       │
         │               │       │
         │               │       │
         │ 1             │       │
         │               │       │
         │ *             │       │
         │               │       │
┌────────▼────────────┐  │       │
│       Pets          │  │       │
│─────────────────────│  │       │
│ _id (PK)            │  │       │
│ name                │  │       │
│ species             │  │       │
│ breed               │  │       │
│ ownerId (FK)        │──┘       │
│ coOwners (FK[])     │──────────┘
│ medicalInfo         │
│ status              │
└─────────────────────┘
         │
         │ *
         │
         │ * (referenced in bookings)
         │
┌────────▼────────────┐       ┌─────────────────────┐
│     Bookings        │       │     Businesses      │
│─────────────────────│       │─────────────────────│
│ _id (PK)            │       │ _id (PK)            │
│ bookingNumber       │       │ name                │
│ petOwnerId (FK)     │───┐   │ ownerUserId (FK)    │───┐
│ businessId (FK)     │───┼───┤ businessType        │   │
│ workerId (FK)       │───┼───│ address             │   │
│ serviceId (FK)      │───┼───│ serviceArea         │   │
│ pets (FK[])         │───┘   │ stripeAccountId     │   │
│ scheduledDate       │       │ rating              │   │
│ location            │       │ isVerified          │   │
│ pricing             │       │ status              │   │
│ status              │       └─────────────────────┘   │
│ completionDetails   │                │                │
└─────────────────────┘                │ 1              │
         │                             │                │
         │ 1                           │ *              │ 1
         │                             │                │
         │                    ┌────────▼──────────┐     │
         │ 1                  │   PetWorkers      │     │
         │                    │───────────────────│     │
         │                    │ _id (PK)          │     │
         │                    │ userId (FK)       │─────┘
         │                    │ businessId (FK)   │─────┘
         ├────────────────────┤ bio               │
         │                    │ experience        │
         │                    │ currentLocation   │
         │                    │ isOnline          │
         │                    │ isAvailable       │
         │                    │ rating            │
         │                    └───────────────────┘
         │                             │
         │                             │ * (receives reviews)
         │ 1                           │
         │                             │
┌────────▼────────────┐       ┌────────▼────────────┐
│     Payments        │       │      Reviews        │
│─────────────────────│       │─────────────────────│
│ _id (PK)            │       │ _id (PK)            │
│ bookingId (FK)      │       │ bookingId (FK)      │
│ payerId (FK)        │       │ reviewerId (FK)     │
│ payeeBusinessId(FK) │       │ revieweeType        │
│ amount              │       │ revieweeId (FK)     │
│ stripePaymentId     │       │ rating              │
│ status              │       │ comment             │
│ platformFee         │       │ response            │
│ paidAt              │       │ isVerified          │
└─────────────────────┘       └─────────────────────┘

         ┌──────────────────────────────┐
         │                              │
         │ 1                            │ *
         │                              │
┌────────▼────────────┐       ┌─────────▼───────────┐
│     Services        │       │   Notifications     │
│─────────────────────│       │─────────────────────│
│ _id (PK)            │       │ _id (PK)            │
│ businessId (FK)     │───┐   │ userId (FK)         │
│ name                │   │   │ type                │
│ serviceType         │   │   │ title               │
│ description         │   │   │ message             │
│ pricing             │   │   │ isRead              │
│ duration            │   │   │ createdAt           │
│ petTypes            │   │   └─────────────────────┘
│ isActive            │   │
└─────────────────────┘   │
                          │
                          │ *
                          │
                          └──► (referenced in bookings)
```

## Relationships Explained

### One-to-Many Relationships

1. **Users → Pets**
   - One user (pet owner) can have many pets
   - `Pets.ownerId` references `Users._id`

2. **Users → Pets (Co-ownership)**
   - One pet can have multiple co-owners
   - `Pets.coOwners[]` array references `Users._id`

3. **Businesses → Services**
   - One business can offer many services
   - `Services.businessId` references `Businesses._id`

4. **Businesses → PetWorkers**
   - One business can have many workers
   - `PetWorkers.businessId` references `Businesses._id`

5. **Users → PetWorkers**
   - One user account per worker
   - `PetWorkers.userId` references `Users._id`

6. **Users → Bookings (as pet owner)**
   - One pet owner can make many bookings
   - `Bookings.petOwnerId` references `Users._id`

7. **Businesses → Bookings**
   - One business can have many bookings
   - `Bookings.businessId` references `Businesses._id`

8. **PetWorkers → Bookings**
   - One worker can be assigned to many bookings
   - `Bookings.workerId` references `PetWorkers._id`

9. **Services → Bookings**
   - One service can be booked many times
   - `Bookings.serviceId` references `Services._id`

10. **Bookings → Payments**
    - One booking has one payment (1:1, but stored separately)
    - `Payments.bookingId` references `Bookings._id`

11. **Bookings → Reviews**
    - One booking can have one review (1:1, but stored separately)
    - `Reviews.bookingId` references `Bookings._id`

12. **Users → Notifications**
    - One user can have many notifications
    - `Notifications.userId` references `Users._id`

### Many-to-Many Relationships

1. **Pets ↔ Bookings**
   - One booking can include multiple pets
   - One pet can have multiple bookings
   - `Bookings.pets[]` array references `Pets._id`

### Polymorphic Relationships

1. **Reviews (Business or Worker)**
   - A review can be for either a business or a worker
   - `Reviews.revieweeType` indicates the type ('business' or 'worker')
   - `Reviews.revieweeId` references either `Businesses._id` or `PetWorkers._id`

## Indexes

### Critical Indexes for Performance

**Users Collection:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ userType: 1 });
db.users.createIndex({ businessId: 1 });
db.users.createIndex({ "profile.address.coordinates": "2dsphere" });
```

**Businesses Collection:**
```javascript
db.businesses.createIndex({ ownerUserId: 1 });
db.businesses.createIndex({ status: 1 });
db.businesses.createIndex({ "address.coordinates": "2dsphere" });
db.businesses.createIndex({ "serviceArea": "2dsphere" });
db.businesses.createIndex({ "rating.average": -1 });
```

**PetWorkers Collection:**
```javascript
db.petWorkers.createIndex({ userId: 1 }, { unique: true });
db.petWorkers.createIndex({ businessId: 1 });
db.petWorkers.createIndex({ isOnline: 1, isAvailable: 1 });
db.petWorkers.createIndex({ "currentLocation": "2dsphere" });
db.petWorkers.createIndex({ "rating.average": -1 });
```

**Pets Collection:**
```javascript
db.pets.createIndex({ ownerId: 1 });
db.pets.createIndex({ coOwners: 1 });
db.pets.createIndex({ status: 1 });
```

**Services Collection:**
```javascript
db.services.createIndex({ businessId: 1, isActive: 1 });
db.services.createIndex({ serviceType: 1, isActive: 1 });
```

**Bookings Collection:**
```javascript
db.bookings.createIndex({ bookingNumber: 1 }, { unique: true });
db.bookings.createIndex({ petOwnerId: 1, status: 1 });
db.bookings.createIndex({ businessId: 1, scheduledDate: 1 });
db.bookings.createIndex({ workerId: 1, scheduledDate: 1 });
db.bookings.createIndex({ status: 1, scheduledDate: 1 });
db.bookings.createIndex({ "location.coordinates": "2dsphere" });
```

**Payments Collection:**
```javascript
db.payments.createIndex({ bookingId: 1 });
db.payments.createIndex({ payerId: 1 });
db.payments.createIndex({ payeeBusinessId: 1 });
db.payments.createIndex({ status: 1, createdAt: -1 });
db.payments.createIndex({ stripePaymentIntentId: 1 });
```

**Reviews Collection:**
```javascript
db.reviews.createIndex({ bookingId: 1 }, { unique: true });
db.reviews.createIndex({ revieweeId: 1, revieweeType: 1, status: 1 });
db.reviews.createIndex({ reviewerId: 1 });
db.reviews.createIndex({ rating: -1 });
```

**Notifications Collection:**
```javascript
db.notifications.createIndex({ userId: 1, isRead: 1, createdAt: -1 });
db.notifications.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL
```

## Geospatial Queries Examples

### Find nearby workers
```javascript
db.petWorkers.find({
  currentLocation: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77] // [longitude, latitude]
      },
      $maxDistance: 5000 // 5km in meters
    }
  },
  isOnline: true,
  isAvailable: true
});
```

### Find businesses in service area
```javascript
db.businesses.find({
  serviceArea: {
    $geoIntersects: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      }
    }
  },
  status: 'active'
});
```

### Find bookings near location
```javascript
db.bookings.find({
  "location.coordinates": {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      $maxDistance: 10000
    }
  },
  status: 'confirmed',
  scheduledDate: {
    $gte: new Date()
  }
});
```

## Data Integrity Rules

1. **Referential Integrity** (enforced at application level):
   - Before deleting a user, check for active bookings
   - Before deleting a business, reassign or cancel active bookings
   - Before deleting a pet, check for active bookings

2. **Business Rules**:
   - A pet must have exactly one owner (ownerId)
   - A pet can have 0 or more co-owners
   - A booking must reference existing pets, business, service, and worker
   - A payment must reference an existing booking
   - A review can only be created after booking completion

3. **Status Transitions**:
   - Booking: pending → confirmed → in_progress → completed
   - Payment: pending → succeeded (or failed)
   - User: active ↔ suspended, active → deleted

## Aggregation Pipeline Examples

### Calculate business average rating
```javascript
db.reviews.aggregate([
  {
    $match: {
      revieweeType: 'business',
      revieweeId: businessId,
      status: 'published'
    }
  },
  {
    $group: {
      _id: '$revieweeId',
      averageRating: { $avg: '$rating' },
      count: { $sum: 1 }
    }
  }
]);
```

### Get booking statistics for a business
```javascript
db.bookings.aggregate([
  {
    $match: {
      businessId: businessId,
      createdAt: { $gte: startDate, $lte: endDate }
    }
  },
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 },
      totalRevenue: { $sum: '$pricing.totalAmount' }
    }
  }
]);
```

### Find top-rated workers
```javascript
db.petWorkers.aggregate([
  {
    $match: {
      isAvailable: true,
      'rating.count': { $gte: 5 } // At least 5 reviews
    }
  },
  {
    $sort: { 'rating.average': -1 }
  },
  {
    $limit: 10
  },
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'userInfo'
    }
  }
]);
```

