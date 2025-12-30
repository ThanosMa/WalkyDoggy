# WalkyDoggy - Project Structure

## Monorepo Organization

```
walkydoggy/
├── packages/
│   ├── shared/              # Shared code between web and mobile
│   │   ├── src/
│   │   │   ├── api/        # API client configuration
│   │   │   ├── types/      # TypeScript interfaces
│   │   │   ├── validators/ # Zod schemas
│   │   │   ├── utils/      # Utility functions
│   │   │   └── constants/  # Shared constants
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── backend/             # Node.js/Express API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── controllers/
│   │   │   │   │   │   └── auth.controller.js
│   │   │   │   │   ├── services/
│   │   │   │   │   │   ├── auth.service.js
│   │   │   │   │   │   ├── jwt.service.js
│   │   │   │   │   │   └── email.service.js
│   │   │   │   │   ├── models/
│   │   │   │   │   │   └── user.model.js
│   │   │   │   │   ├── routes/
│   │   │   │   │   │   └── auth.routes.js
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── auth.validator.js
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── users/
│   │   │   │   │   ├── controllers/
│   │   │   │   │   ├── services/
│   │   │   │   │   ├── models/
│   │   │   │   │   ├── routes/
│   │   │   │   │   └── validators/
│   │   │   │   │
│   │   │   │   ├── pets/
│   │   │   │   ├── businesses/
│   │   │   │   ├── workers/
│   │   │   │   ├── services/
│   │   │   │   ├── bookings/
│   │   │   │   ├── payments/
│   │   │   │   ├── reviews/
│   │   │   │   ├── locations/
│   │   │   │   └── notifications/
│   │   │   │
│   │   │   ├── shared/
│   │   │   │   ├── middleware/
│   │   │   │   │   ├── auth.middleware.js
│   │   │   │   │   ├── error.middleware.js
│   │   │   │   │   ├── validate.middleware.js
│   │   │   │   │   ├── rateLimit.middleware.js
│   │   │   │   │   └── upload.middleware.js
│   │   │   │   ├── utils/
│   │   │   │   │   ├── apiResponse.js
│   │   │   │   │   ├── asyncHandler.js
│   │   │   │   │   ├── logger.js
│   │   │   │   │   └── errors.js
│   │   │   │   ├── config/
│   │   │   │   │   ├── database.js
│   │   │   │   │   ├── redis.js
│   │   │   │   │   ├── aws.js
│   │   │   │   │   ├── stripe.js
│   │   │   │   │   └── index.js
│   │   │   │   └── constants/
│   │   │   │       ├── errorCodes.js
│   │   │   │       └── userTypes.js
│   │   │   │
│   │   │   ├── app.js
│   │   │   ├── server.js
│   │   │   └── socket.js
│   │   │
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── setup.js
│   │   │
│   │   ├── migrations/
│   │   │   └── 001_initial_setup.js
│   │   │
│   │   ├── scripts/
│   │   │   ├── seed.js
│   │   │   └── migrate.js
│   │   │
│   │   ├── .env.example
│   │   ├── .eslintrc.js
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── frontend/             # Vue.js Web App
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   └── favicon.ico
│   │   │
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   │   ├── images/
│   │   │   │   ├── styles/
│   │   │   │   │   ├── main.css
│   │   │   │   │   ├── variables.css
│   │   │   │   │   └── tailwind.css
│   │   │   │   └── icons/
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   │   ├── Button.vue
│   │   │   │   │   ├── Input.vue
│   │   │   │   │   ├── Card.vue
│   │   │   │   │   ├── Modal.vue
│   │   │   │   │   ├── Loading.vue
│   │   │   │   │   └── ErrorMessage.vue
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Header.vue
│   │   │   │   │   ├── Footer.vue
│   │   │   │   │   ├── Sidebar.vue
│   │   │   │   │   └── Navigation.vue
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginForm.vue
│   │   │   │   │   └── RegisterForm.vue
│   │   │   │   ├── pets/
│   │   │   │   │   ├── PetCard.vue
│   │   │   │   │   ├── PetForm.vue
│   │   │   │   │   └── PetList.vue
│   │   │   │   ├── bookings/
│   │   │   │   ├── map/
│   │   │   │   │   ├── WorkerMap.vue
│   │   │   │   │   ├── WorkerMarker.vue
│   │   │   │   │   └── MapControls.vue
│   │   │   │   └── search/
│   │   │   │
│   │   │   ├── views/
│   │   │   │   ├── Home.vue
│   │   │   │   ├── auth/
│   │   │   │   │   ├── Login.vue
│   │   │   │   │   └── Register.vue
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── OwnerDashboard.vue
│   │   │   │   │   ├── BusinessDashboard.vue
│   │   │   │   │   └── WorkerDashboard.vue
│   │   │   │   ├── pets/
│   │   │   │   │   ├── PetList.vue
│   │   │   │   │   ├── PetDetail.vue
│   │   │   │   │   └── PetEdit.vue
│   │   │   │   ├── search/
│   │   │   │   │   └── SearchResults.vue
│   │   │   │   ├── bookings/
│   │   │   │   │   ├── BookingList.vue
│   │   │   │   │   ├── BookingDetail.vue
│   │   │   │   │   └── CreateBooking.vue
│   │   │   │   ├── business/
│   │   │   │   │   ├── BusinessProfile.vue
│   │   │   │   │   └── BusinessSettings.vue
│   │   │   │   └── profile/
│   │   │   │       ├── UserProfile.vue
│   │   │   │       └── Settings.vue
│   │   │   │
│   │   │   ├── router/
│   │   │   │   ├── index.js
│   │   │   │   └── guards.js
│   │   │   │
│   │   │   ├── stores/
│   │   │   │   ├── auth.js
│   │   │   │   ├── user.js
│   │   │   │   ├── pets.js
│   │   │   │   ├── bookings.js
│   │   │   │   └── notifications.js
│   │   │   │
│   │   │   ├── composables/
│   │   │   │   ├── useAuth.js
│   │   │   │   ├── useApi.js
│   │   │   │   ├── useNotifications.js
│   │   │   │   └── useGeolocation.js
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── api.js
│   │   │   │   ├── socket.js
│   │   │   │   ├── storage.js
│   │   │   │   └── analytics.js
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── validators.js
│   │   │   │   ├── formatters.js
│   │   │   │   └── constants.js
│   │   │   │
│   │   │   ├── plugins/
│   │   │   │   ├── vuetify.js
│   │   │   │   └── posthog.js
│   │   │   │
│   │   │   ├── App.vue
│   │   │   └── main.js
│   │   │
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── e2e/
│   │   │
│   │   ├── .env.example
│   │   ├── .eslintrc.js
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── mobile/               # React Native App
│       ├── src/
│       │   ├── navigation/
│       │   │   ├── RootNavigator.tsx
│       │   │   ├── AuthNavigator.tsx
│       │   │   └── MainNavigator.tsx
│       │   │
│       │   ├── screens/
│       │   │   ├── auth/
│       │   │   │   ├── LoginScreen.tsx
│       │   │   │   └── RegisterScreen.tsx
│       │   │   ├── home/
│       │   │   │   └── HomeScreen.tsx
│       │   │   ├── search/
│       │   │   │   ├── SearchScreen.tsx
│       │   │   │   └── SearchResultsScreen.tsx
│       │   │   ├── bookings/
│       │   │   │   ├── BookingsListScreen.tsx
│       │   │   │   ├── BookingDetailScreen.tsx
│       │   │   │   └── CreateBookingScreen.tsx
│       │   │   ├── pets/
│       │   │   │   ├── PetsListScreen.tsx
│       │   │   │   ├── PetDetailScreen.tsx
│       │   │   │   └── AddPetScreen.tsx
│       │   │   └── profile/
│       │   │       ├── ProfileScreen.tsx
│       │   │       └── SettingsScreen.tsx
│       │   │
│       │   ├── components/
│       │   │   ├── common/
│       │   │   ├── auth/
│       │   │   ├── pets/
│       │   │   ├── bookings/
│       │   │   └── map/
│       │   │
│       │   ├── services/
│       │   │   ├── api/
│       │   │   ├── location/
│       │   │   ├── notifications/
│       │   │   └── storage/
│       │   │
│       │   ├── store/
│       │   │   ├── slices/
│       │   │   │   ├── authSlice.ts
│       │   │   │   ├── userSlice.ts
│       │   │   │   └── bookingsSlice.ts
│       │   │   └── store.ts
│       │   │
│       │   ├── hooks/
│       │   │   ├── useAuth.ts
│       │   │   ├── useLocation.ts
│       │   │   └── useNotifications.ts
│       │   │
│       │   ├── utils/
│       │   ├── types/
│       │   ├── constants/
│       │   └── App.tsx
│       │
│       ├── assets/
│       ├── ios/
│       ├── android/
│       ├── app.json
│       ├── eas.json
│       ├── package.json
│       └── README.md
│
├── infrastructure/
│   ├── terraform/           # Infrastructure as Code
│   │   ├── modules/
│   │   │   ├── vpc/
│   │   │   ├── ecs/
│   │   │   ├── rds/
│   │   │   └── s3/
│   │   ├── environments/
│   │   │   ├── dev/
│   │   │   ├── staging/
│   │   │   └── production/
│   │   └── main.tf
│   │
│   └── docker/
│       ├── api/
│       │   └── Dockerfile
│       ├── web/
│       │   └── Dockerfile
│       └── nginx/
│           ├── Dockerfile
│           └── nginx.conf
│
├── .github/
│   ├── workflows/
│   │   ├── backend-ci.yml
│   │   ├── frontend-ci.yml
│   │   ├── mobile-ci.yml
│   │   └── deploy.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│
├── docs/
│   ├── api/
│   │   └── openapi.yaml
│   ├── architecture/
│   ├── deployment/
│   └── user-guide/
│
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   └── backup.sh
│
├── .gitignore
├── .nvmrc
├── lerna.json              # For monorepo management
├── package.json
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── TECHNICAL_ARCHITECTURE.md
```

## Key Directories Explained

### `/packages/shared`
Contains code shared between web and mobile applications:
- Type definitions
- API client configuration
- Validation schemas
- Utility functions
- Constants

### `/packages/backend`
Node.js/Express API with modular architecture:
- Each feature is a self-contained module
- Consistent structure across modules
- Shared utilities and middleware
- Easy to extract to microservices later

### `/packages/frontend`
Vue.js 3 web application:
- Component-based architecture
- Composition API with Pinia stores
- Reusable composables
- Clean separation of concerns

### `/packages/mobile`
React Native mobile application:
- Screen-based navigation
- Redux Toolkit for state management
- Shared business logic with backend
- Native modules for device features

### `/infrastructure`
Infrastructure as Code and deployment configurations:
- Terraform for AWS infrastructure
- Docker configurations for containerization
- Environment-specific configurations

### `/docs`
Project documentation:
- API documentation (OpenAPI/Swagger)
- Architecture diagrams
- Deployment guides
- User guides

## Development Workflow

1. **Feature Development**:
   - Create feature branch from `develop`
   - Develop in appropriate package (`backend`, `frontend`, or `mobile`)
   - Use shared code from `/packages/shared` when applicable
   - Write tests
   - Submit PR to `develop`

2. **Testing**:
   - Unit tests run on every commit
   - Integration tests run on PR
   - E2E tests run before deployment

3. **Deployment**:
   - Merge to `develop` → Deploy to Staging
   - Merge to `main` → Deploy to Production
   - Mobile apps → Submit to app stores via EAS

## Naming Conventions

### Files
- Components: PascalCase (`UserProfile.vue`, `PetCard.tsx`)
- Services: camelCase (`authService.js`, `paymentService.js`)
- Utilities: camelCase (`formatDate.js`, `validators.js`)
- Constants: UPPER_SNAKE_CASE or camelCase file containing constants

### Code
- Variables/Functions: camelCase
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE
- Private methods: _camelCase (with underscore prefix)

### Database
- Collections: PascalCase singular (`User`, `Pet`, `Booking`)
- Fields: camelCase

### API
- Endpoints: kebab-case (`/api/pet-owners`, `/api/bookings`)
- Query params: camelCase

## Environment Variables

Each package should have `.env.example` file documenting required variables.

### Backend `.env` variables:
```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/walkydoggy
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET=walkydoggy-uploads
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
MAPBOX_ACCESS_TOKEN=pk.xxx
SENDGRID_API_KEY=SG.xxx
POSTHOG_API_KEY=phc_xxx
SENTRY_DSN=https://xxx@sentry.io/xxx
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:19006
```

### Frontend `.env` variables:
```bash
VUE_APP_API_URL=http://localhost:3000/api/v1
VUE_APP_SOCKET_URL=http://localhost:3000
VUE_APP_MAPBOX_TOKEN=pk.xxx
VUE_APP_STRIPE_PUBLIC_KEY=pk_test_xxx
VUE_APP_POSTHOG_KEY=phc_xxx
VUE_APP_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Mobile `.env` variables:
```bash
API_URL=http://localhost:3000/api/v1
MAPBOX_ACCESS_TOKEN=pk.xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
POSTHOG_API_KEY=phc_xxx
```

