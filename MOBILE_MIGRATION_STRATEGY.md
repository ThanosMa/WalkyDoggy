# WalkyDoggy - Mobile Migration Strategy

## Overview

This document outlines the strategy for transitioning from a web-only application to include mobile apps (iOS and Android).

## Migration Phases

### Phase 0: Preparation (Before Mobile Development)

**Goals**: Optimize web app for mobile responsiveness and prepare backend

**Tasks**:
1. **Make Web App Fully Responsive**
   - Test on mobile browsers
   - Optimize touch interactions
   - Implement mobile-first CSS

2. **API Optimization**
   - Add pagination to all list endpoints
   - Implement field filtering (sparse fieldsets)
   - Add API versioning
   - Optimize response sizes
   - Consider GraphQL for mobile (optional)

3. **Backend Enhancements**
   - Implement refresh token rotation
   - Add device registration for push notifications
   - Create mobile-specific endpoints if needed
   - Optimize image delivery (multiple sizes)

4. **PWA Implementation (Quick Win)**
   - Add service worker for offline support
   - Create web app manifest
   - Implement "Add to Home Screen"
   - Cache static assets
   - Test offline functionality

**Timeline**: 2-3 weeks

**Benefits**:
- Immediate mobile web experience
- Test mobile UX patterns
- Gather user feedback
- No app store approval needed

---

### Phase 1: Mobile MVP (React Native)

**Goals**: Launch basic mobile app with core features

**Core Features for Mobile MVP**:
1. **Authentication**
   - Login/Register
   - Biometric authentication (Face ID/Touch ID)
   - Password reset

2. **Pet Owner Features**
   - View/manage pets
   - Search for services (with map)
   - Create bookings
   - View booking history
   - Make payments
   - Leave reviews

3. **Pet Worker Features**
   - View assigned bookings
   - Update location (background tracking during service)
   - Update booking status
   - View profile and reviews

4. **Notifications**
   - Push notifications for bookings
   - In-app notifications

5. **Profile Management**
   - View/edit profile
   - Settings

**Not Included in MVP**:
- Advanced admin features
- Complex business management
- Chat functionality
- Multi-language support
- Advanced analytics

**Timeline**: 8-12 weeks

---

### Phase 2: Feature Parity

**Goals**: Match web app functionality

**Additional Features**:
1. Business owner dashboard
2. Advanced booking management
3. Revenue analytics
4. Worker management
5. Service management
6. Calendar integration
7. Advanced filters and search

**Timeline**: 6-8 weeks

---

### Phase 3: Mobile-Specific Features

**Goals**: Leverage mobile-specific capabilities

**Features**:
1. **Camera Integration**
   - Pet photo capture
   - Document scanning
   - Service completion photos

2. **Advanced Location**
   - Background location tracking
   - Geofencing for service areas
   - Real-time worker tracking

3. **Native Integrations**
   - Calendar sync
   - Contacts integration
   - Phone call integration
   - SMS sharing

4. **Offline Mode**
   - View cached bookings
   - Offline profile editing
   - Queue actions for sync

5. **AR Features (Future)**
   - Virtual pet try-on
   - Venue visualization

**Timeline**: 4-6 weeks

---

## Technology Stack for Mobile

### React Native with Expo (Recommended)

**Pros**:
- JavaScript/TypeScript (same as backend)
- Single codebase for iOS and Android
- Hot reload for fast development
- Expo provides managed workflow
- OTA (Over-The-Air) updates
- Large ecosystem of libraries
- Can eject to bare workflow if needed

**Cons**:
- Slightly larger app size than native
- Some limitations with native modules
- Performance not quite native (but close enough)

### Project Setup

```bash
# Install Expo CLI
npm install -g expo-cli

# Create new project
cd packages
expo init mobile --template expo-template-blank-typescript

# Or with React Native CLI (if not using Expo)
npx react-native init mobile --template react-native-template-typescript
```

### Key Libraries

**Essential**:
```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/stack": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "@tanstack/react-query": "^5.x",
  "axios": "^1.x",
  "zustand": "^4.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "@rnmapbox/maps": "^10.x",
  "expo-location": "~16.x",
  "expo-notifications": "~0.27.x",
  "expo-image-picker": "~14.x",
  "expo-local-authentication": "~13.x",
  "socket.io-client": "^4.x",
  "@stripe/stripe-react-native": "^0.35.x",
  "react-native-fast-image": "^8.x",
  "@react-native-async-storage/async-storage": "^1.x"
}
```

**Nice to Have**:
```json
{
  "react-native-reanimated": "~3.x",
  "react-native-gesture-handler": "~2.x",
  "react-native-svg": "^14.x",
  "@gorhom/bottom-sheet": "^4.x",
  "react-native-date-picker": "^4.x",
  "lottie-react-native": "^6.x"
}
```

---

## Code Sharing Strategy

### Shared Package Architecture

```
packages/shared/
├── src/
│   ├── api/
│   │   ├── client.ts          # Axios config
│   │   ├── endpoints.ts       # API endpoint constants
│   │   └── interceptors.ts    # Request/response interceptors
│   │
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── pet.types.ts
│   │   ├── booking.types.ts
│   │   ├── payment.types.ts
│   │   └── api.types.ts
│   │
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── pet.validator.ts
│   │   ├── booking.validator.ts
│   │   └── schemas/
│   │
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── string.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── validation.utils.ts
│   │   └── format.utils.ts
│   │
│   ├── constants/
│   │   ├── api.constants.ts
│   │   ├── user.constants.ts
│   │   ├── booking.constants.ts
│   │   └── error.constants.ts
│   │
│   └── hooks/                  # Platform-agnostic logic
│       ├── useAuth.ts
│       ├── useBookings.ts
│       └── usePets.ts
│
├── package.json
└── tsconfig.json
```

### What to Share

**✅ Share Between Web and Mobile**:
- TypeScript interfaces and types
- API client configuration
- Validation schemas (Zod)
- Business logic functions
- Formatting utilities
- Constants and enums
- Error handling logic
- Date/time utilities

**❌ Don't Share**:
- UI components (platform-specific)
- Navigation logic
- Storage implementations
- Platform-specific APIs
- Styling

### Example: Shared API Client

```typescript
// packages/shared/src/api/client.ts
import axios from 'axios';

export const createApiClient = (baseURL: string, storage: Storage) => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(async (config) => {
    const token = await storage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Handle token refresh
      if (error.response?.status === 401) {
        // Refresh token logic
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Usage in web
import { createApiClient } from '@walkydoggy/shared/api';
const client = createApiClient(
  process.env.VUE_APP_API_URL,
  localStorage // Web storage
);

// Usage in mobile
import { createApiClient } from '@walkydoggy/shared/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
const client = createApiClient(
  process.env.API_URL,
  AsyncStorage // Mobile storage
);
```

---

## API Considerations for Mobile

### 1. Optimize Payload Size

**Field Selection**:
```typescript
// Allow clients to specify fields
GET /api/v1/bookings?fields=id,status,scheduledDate,pricing.totalAmount

// Backend implementation
const selectFields = (fields?: string) => {
  if (!fields) return {};
  return fields.split(',').reduce((acc, field) => {
    acc[field] = 1;
    return acc;
  }, {});
};

const bookings = await Booking.find(query).select(selectFields(req.query.fields));
```

**Pagination**:
```typescript
// Always paginate lists
GET /api/v1/bookings?page=1&limit=20

// Response
{
  data: [...],
  meta: {
    page: 1,
    limit: 20,
    total: 150,
    pages: 8
  }
}
```

### 2. Mobile-Specific Endpoints

```typescript
// Optimized mobile endpoints
GET /api/v1/mobile/dashboard
// Returns all data needed for dashboard in single request

GET /api/v1/mobile/booking/:id/details
// Returns booking with related data (pet, business, worker)

POST /api/v1/mobile/devices
// Register device for push notifications
```

### 3. Image Optimization

```typescript
// Request images in different sizes
GET /api/v1/pets/:id?imageSize=thumbnail // 150x150
GET /api/v1/pets/:id?imageSize=medium     // 400x400
GET /api/v1/pets/:id?imageSize=large      // 1200x1200

// Backend: Use Sharp or AWS Lambda for resizing
```

### 4. GraphQL Option (Optional)

Consider GraphQL for mobile to reduce over-fetching:

```graphql
query GetBookingDetails($id: ID!) {
  booking(id: $id) {
    id
    status
    scheduledDate
    pet {
      id
      name
      photo
    }
    worker {
      id
      name
      avatar
      rating
    }
    pricing {
      totalAmount
    }
  }
}
```

---

## Push Notifications

### Backend Setup

```javascript
// packages/backend/src/modules/notifications/push.service.js
import { Expo } from 'expo-server-sdk';

class PushNotificationService {
  constructor() {
    this.expo = new Expo();
  }

  async sendNotification(userId, notification) {
    // Get user's device tokens
    const devices = await Device.find({ userId, isActive: true });
    
    const messages = devices.map(device => ({
      to: device.pushToken,
      sound: 'default',
      title: notification.title,
      body: notification.message,
      data: notification.data,
    }));

    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Push notification error:', error);
      }
    }

    return tickets;
  }
}
```

### Mobile Setup (Expo)

```typescript
// packages/mobile/src/services/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      throw new Error('Permission not granted for push notifications');
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
```

---

## Deep Linking

### Configuration

**app.json (Expo)**:
```json
{
  "expo": {
    "scheme": "walkydoggy",
    "ios": {
      "associatedDomains": ["applinks:walkydoggy.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "https",
              "host": "walkydoggy.com"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### Handle Deep Links

```typescript
// packages/mobile/src/navigation/RootNavigator.tsx
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix, 'https://walkydoggy.com'],
  config: {
    screens: {
      Home: '',
      BookingDetail: 'bookings/:id',
      PetDetail: 'pets/:id',
      BusinessProfile: 'businesses/:id',
    },
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer linking={linking}>
      {/* Your navigation */}
    </NavigationContainer>
  );
}
```

---

## App Store Deployment

### iOS (App Store)

**Requirements**:
- Apple Developer Account ($99/year)
- Mac with Xcode
- App icons and screenshots
- Privacy policy
- Terms of service

**Process**:
1. Configure app in App Store Connect
2. Build app with EAS Build or Xcode
3. Submit for review
4. Review typically takes 1-3 days

**Using EAS (Expo Application Services)**:
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android (Google Play)

**Requirements**:
- Google Play Developer Account ($25 one-time)
- App icons and screenshots
- Privacy policy
- Content rating

**Process**:
1. Create app in Google Play Console
2. Build signed APK/AAB
3. Upload to internal testing
4. Promote to production
5. Review typically takes a few hours

**Using EAS**:
```bash
# Build for Android
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

---

## Testing Strategy

### Mobile-Specific Tests

1. **Unit Tests** (Jest + React Native Testing Library)
   ```typescript
   import { render, fireEvent } from '@testing-library/react-native';
   import PetCard from './PetCard';

   test('renders pet card correctly', () => {
     const { getByText } = render(<PetCard pet={mockPet} />);
     expect(getByText('Max')).toBeTruthy();
   });
   ```

2. **Integration Tests**
   - Test navigation flows
   - Test API integration
   - Test state management

3. **E2E Tests** (Detox)
   ```javascript
   describe('Booking Flow', () => {
     it('should complete a booking', async () => {
       await element(by.id('search-button')).tap();
       await element(by.id('service-card-1')).tap();
       await element(by.id('book-now-button')).tap();
       await expect(element(by.text('Booking Confirmed'))).toBeVisible();
     });
   });
   ```

4. **Device Testing**
   - Test on various screen sizes
   - Test on iOS and Android
   - Test offline scenarios
   - Test background location
   - Test push notifications

---

## Performance Optimization

### Mobile-Specific Optimizations

1. **Image Optimization**
   ```typescript
   import FastImage from 'react-native-fast-image';

   <FastImage
     source={{ uri: pet.photo, priority: FastImage.priority.normal }}
     style={styles.image}
     resizeMode={FastImage.resizeMode.cover}
   />
   ```

2. **List Optimization**
   ```typescript
   import { FlashList } from '@shopify/flash-list';

   <FlashList
     data={bookings}
     renderItem={renderBooking}
     estimatedItemSize={100}
   />
   ```

3. **Bundle Size Optimization**
   - Enable Hermes engine
   - Use ProGuard/R8 (Android)
   - Remove unused dependencies
   - Lazy load screens

4. **Network Optimization**
   - Cache API responses
   - Implement offline mode
   - Optimize image sizes
   - Use HTTP/2

---

## Migration Timeline Summary

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| **Phase 0: Preparation** | 2-3 weeks | PWA, Responsive web, API optimization |
| **Phase 1: Mobile MVP** | 8-12 weeks | iOS + Android apps with core features |
| **Phase 2: Feature Parity** | 6-8 weeks | All web features in mobile |
| **Phase 3: Mobile Features** | 4-6 weeks | Mobile-specific enhancements |
| **Total** | ~5-7 months | Complete mobile ecosystem |

---

## Cost Estimates

### Development Costs
- React Native developer: 5-7 months
- UI/UX designer: 1-2 months (mobile-specific designs)
- QA testing: Ongoing
- Total: ~6-9 person-months

### Ongoing Costs
- Apple Developer Account: $99/year
- Google Play Developer Account: $25 (one-time)
- EAS Build & Submit (Expo): $29-99/month
- CodePush (if not using Expo): $0-40/month
- Increased API/Infrastructure costs: ~20-30% more

---

## Success Metrics

Track these metrics post-launch:
- App store ratings and reviews
- Download and installation rates
- Daily active users (DAU)
- Session length
- Booking conversion rate (vs web)
- Crash-free rate (target: >99.5%)
- App load time (target: <3 seconds)
- API response time
- Push notification open rate

---

## Risks and Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| App store rejection | High | Follow guidelines strictly, test thoroughly |
| Performance issues | Medium | Performance testing early, optimize critical paths |
| Platform fragmentation | Medium | Test on multiple devices, use React Native best practices |
| Backend not ready | High | Optimize API in Phase 0 |
| Feature creep | Medium | Stick to MVP scope, plan features post-launch |
| Budget overrun | High | Regular sprint reviews, adjust scope if needed |

---

## Next Steps

1. ✅ Review this migration strategy
2. ⬜ Implement PWA (Phase 0)
3. ⬜ Set up shared package structure
4. ⬜ Create mobile app project skeleton
5. ⬜ Design mobile-specific UI/UX
6. ⬜ Develop authentication flow
7. ⬜ Implement core features iteratively
8. ⬜ Set up CI/CD for mobile
9. ⬜ Beta testing (TestFlight & Google Play Internal Testing)
10. ⬜ App store submission


