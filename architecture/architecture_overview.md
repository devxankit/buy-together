# Buy Together — System Architecture & Technical Overview

Welcome to the **Buy Together** architecture guide. This document details the end-to-end design, data flows, communication protocols, and directory structures of the Buy Together platform.

Buy Together is a social e-commerce platform that pools consumer demand to unlock discounted bulk pricing. The system supports three primary user roles:
- **End Users (Buyers):** Join and create buy-together groups to pool demand for products/deals.
- **Vendors (Sellers):** Propose deals and manage listing offers.
- **Admins (Platform Operators):** Manage categories, banners, users, vendors, support tickets, and review fraud detection metrics.

---

## 1. High-Level System Architecture

The following diagram illustrates the relationship between the client apps, API backend, databases, and third-party integrations:

```mermaid
graph TD
    %% Styling
    classDef client fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef server fill:#efebe9,stroke:#3e2723,stroke-width:2px;
    classDef db fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px;
    classDef ext fill:#fff3e0,stroke:#e65100,stroke-width:2px;

    %% Nodes
    subgraph Client ["Client Layer (Frontend)"]
        Browser["React SPA (Vite)<br/>(Redux, SWR, Axios)"]:::client
        ServiceWorker["Service Worker<br/>(firebase-messaging-sw.js)"]:::client
        MobileApp["Mobile Wrapper (Flutter)<br/>(FCM Mobile SDK)"]:::client
    end

    subgraph Server ["Application Layer (Backend)"]
        Express["Express.js Web Framework<br/>(JWT, Joi, Route Middlewares)"]:::server
        SocketIO["Socket.IO Server<br/>(Realtime Chat /chat)"]:::server
    end

    subgraph Databases ["Data Store Layer"]
        MongoDB[("MongoDB Database<br/>(Mongoose ORM)")]:::db
        L1Cache["L1 Memory Cache<br/>(In-Process RAM)"]:::db
        RedisL2Cache[("L2 Redis Cache<br/>(ioredis)")]:::db
        FirebaseRTDB[("Firebase RTDB<br/>(Chat Messages)")]:::db
    end

    subgraph External ["External Services"]
        FCM["Firebase Cloud Messaging<br/>(Push Notifications V1 API)"]:::ext
        Cloudinary["Cloudinary CDN<br/>(Asset/Image Hosting)"]:::ext
        SMSGateway["SMS India Hub Gateway<br/>(OTP verification via DLT)"]:::ext
    end

    %% Connections
    Browser -- "HTTPS Requests (JWT)" --> Express
    MobileApp -- "HTTPS Requests (JWT)" --> Express
    Browser -- "WebSocket (auth.token)" --> SocketIO
    MobileApp -- "WebSocket (auth.token)" --> SocketIO
    ServiceWorker -- "Pulls Push Messages" --> FCM
    MobileApp -- "Pulls Push Messages" --> FCM

    Express -- "Read/Write" --> MongoDB
    Express -- "Read/Write" --> FirebaseRTDB
    Express -- "L1 Read/Write" --> L1Cache
    L1Cache -- "L2 Read/Write" --> RedisL2Cache
    RedisL2Cache -. "Pub/Sub Coherency" .-> L1Cache

    Express -- "Triggers Push API" --> FCM
    Express -- "Uploads Banner/Ticket Assets" --> Cloudinary
    Express -- "Sends OTP SMS" --> SMSGateway
```

---

## 2. Core Operational Workflows

Below are the sequence and state diagrams explaining how key actions propagate through the system.

### A. Authentication & Onboarding Flow
Authentication is based on Phone numbers and One-Time Passwords (OTPs) to guarantee user identity.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client App (Web / Mobile)
    participant Express as Express Backend
    participant MongoDB as MongoDB (User / Otp)
    participant SMS as SMS India Hub Gateway

    Client->>Express: POST /api/auth/send-otp (phone, purpose)
    Note over Express: Check resend cooldown.<br/>Generate cryptographically secure OTP.<br/>Hash & save in MongoDB.
    Express->>SMS: Dispatch SMS request (if SMS_INDIA_ENABLED=true)
    SMS-->>Express: HTTP 200 Confirmation
    Express-->>Client: HTTP 200 OK (returns devOtp in dev mode)
    
    Client->>Express: POST /api/auth/verify-otp (phone, code)
    Note over Express: Compare submitted code against hashed OTP.<br/>Mark OTP as consumed.
    Express->>MongoDB: Find or Create User with Phone
    MongoDB-->>Express: User Document
    Note over Express: Generate signed JWT containing role & userId
    Express-->>Client: HTTP 200 OK (token, user details)
```

### B. Real-Time Chat System
Chat messages bypass MongoDB for high-write performance and are written to Firebase Realtime Database (RTDB), then broadcasted to online room members via Socket.IO.

```mermaid
sequenceDiagram
    autonumber
    actor MemberA as Group Member A
    participant Express as Express Backend
    participant Firebase as Firebase RTDB
    participant Sockets as Socket.IO Hub
    actor MemberB as Group Member B

    Note over MemberA, MemberB: Connected to namespace '/chat' with JWT Auth
    MemberA->>Express: POST /api/chat/messages { groupId, content, replyTo? }
    Note over Express: Authenticate User JWT<br/>Validate request schema
    Express->>Firebase: Write message to "/messages/{groupId}/{messageId}"
    Firebase-->>Express: Save Confirmation
    Express->>Sockets: Emit 'new_message' event to Room (groupId)
    Sockets->>MemberB: Forward WebSocket event 'new_message'
    Express-->>MemberA: HTTP 201 Response (returns saved message payload)
```

### C. Demand-Group Lifecycle
Joint-buying groups progress through various stages as demand is pooled and verified.

```mermaid
stateDiagram-v2
    [*] --> Active : User or Admin creates group
    Active --> Closing : Headcount reaches 80% OR closesAt deadline is near
    Closing --> Completed : Target headcount (spotsTotal) met
    Completed --> Locked : Admin locks group for order fulfillment
    
    Active --> Flagged : Fraud engine or Admin flags suspicious activity
    Closing --> Flagged : Flagged for review
    Flagged --> Active : Admin clears flag
    
    Flagged --> [*] : Terminated / Suspended
    Locked --> [*] : Fulfilled & Archiving
```

### D. Push Notification Pipeline
Push notifications are broadcasted to Web (Service Worker) and Mobile (Flutter wrapper) pools.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin Console
    participant Express as Express Backend
    participant MongoDB as MongoDB (Users / PushCampaign)
    participant Firebase as Firebase Admin SDK (FCM)
    actor Users as End Users (Web / Mobile)

    Admin->>Express: POST /api/admin/push/all { title, body, image, link }
    Express->>MongoDB: Query active FCM tokens (web and mobile pools)
    MongoDB-->>Express: Token list
    Express->>MongoDB: Create PushCampaign log (status: pending)
    
    loop Send Chunks
        Express->>Firebase: admin.messaging().sendEachForMulticast(tokens)
        Firebase-->>Express: Send details (success/failure counts)
        Note over Express: Automatically prune expired / invalid tokens
    end

    Express->>MongoDB: Update PushCampaign log (delivered count, status: completed)
    Firebase->>Users: Deliver Remote Push Notification
    Express-->>Admin: HTTP 200 OK (summary statistics)
```

### E. Fraud & Risk Analytics
The fraud engine runs queries against the MongoDB database and calculates risk scores (0–100) based on signals like group duplication, signup velocity, and unverified membership ratios.

```mermaid
graph LR
    DB[(MongoDB)] --> Engine[Fraud Detection Service]
    Engine --> Detector1[Duplicate Group Detector]
    Engine --> Detector2[Signup Velocity Burst Detector]
    Engine --> Detector3[Unverified Phone Members Ratio]
    
    Detector1 --> RiskMap[Risk Score Calculator]
    Detector2 --> RiskMap
    Detector3 --> RiskMap
    
    RiskMap --> Flag[Risk Severity Classification]
    Flag --> Low[Low: <45]
    Flag --> Medium[Medium: 45-74]
    Flag --> High[High: >=75]
    
    High --> UI[Surfaced in Admin Fraud Console]
```

---

## 3. Databases and Caching Strategy

The system balances persistent database constraints with high-performance execution through a tiered caching design:

### MongoDB (Primary Database)
- Manages relational domain documents: users, groups, deals, categories, banners, support tickets, and vendor metadata.
- Managed via **Mongoose ORM** schemas located in [backend/src/models](file:///c:/Users/AnkitAhirwar/OneDrive/Desktop/Buy%20Together/backend/src/models).

### Hybrid L1 + L2 Cache System
To reduce database load on frequently-read data (e.g. settings, content pages, banners, active categories):
1. **L1 Cache (In-Memory RAM):** Map-based cache per-node instance. Fast sub-millisecond lookups.
2. **L2 Cache (Redis - Optional):** Shared across processes, surviving server restarts. Enabled via `REDIS_URL`.
3. **Cross-Process Coherency:** When a node writes or invalidates a key via `del(key)`, it publishes an invalidation signal to Redis. All clustered Node instances listening to the Pub/Sub channel automatically invalidate their local L1 Cache, avoiding stale data conditions.

### Socket.IO Redis Adapter
To support horizontal scaling (such as multi-process PM2 clusters or multiple server instances), the backend configures `@socket.io/redis-adapter` (when Redis is enabled). Socket connections can land on separate processes, yet broadcasts (like chat updates) seamlessly bridge across workers.

---

## 4. Key Directory Structures

Here is an overview of how components are distributed within the repository:

### Backend Structure (`/backend`)
```
backend/
├── src/
│   ├── app.js               # Express application initialization & middleware stack
│   ├── server.js            # Node HTTP server wrapper, DB setup, Socket.IO bootstrapping
│   ├── config/              # Environment config schemas (Joi) and Redis/Mongo setups
│   ├── controllers/         # HTTP request handlers (routes delegators)
│   ├── integrations/        # External services wrappers (SMS India Hub, Cloudinary)
│   ├── jobs/                # Cron tasks (scheduled cleanup/group checks)
│   ├── middlewares/         # Route verification (JWT auth, Role check, Error handlers)
│   ├── models/              # Mongoose DB schemas (MongoDB definitions)
│   ├── routes/              # Express API endpoint router mapping
│   ├── services/            # Core business logic handlers (Auth, Push, Chat, Fraud)
│   ├── sockets/             # Real-time WebSocket handlers (/chat namespace)
│   ├── utils/               # Common utilities (cache management, logger, custom API error)
│   └── validations/         # Request body validation schemas (Joi)
└── tests/                   # Integration and unit tests
```

### Frontend Structure (`/frontend`)
```
frontend/
├── public/                  # Static assets and Web Push Service Worker (firebase-messaging-sw.js)
├── src/
│   ├── App.jsx              # Application router wrapper & background notification listeners
│   ├── main.jsx             # React entry point
│   ├── components/          # Reusable shared UI elements (buttons, inputs, cards)
│   ├── config/              # Public client configurations (Firebase credentials)
│   ├── constants/           # Frontend constants, roles, and status lists
│   ├── design/              # Visual templates, color schemes, and design primitives
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Multi-role sub-applications
│   │   ├── admin/           # Super-Admin console (Full-screen panels)
│   │   ├── auth/            # Client login, OTP verification, and signup screens
│   │   ├── userMain/        # Core Consumer App (Home, deals, profile, chat layouts)
│   │   └── vendor/          # Vendor-specific dashboards and offer creation
│   ├── redux/               # Global client-state management (Auth, Wishlist, Chat slices)
│   ├── routes/              # React-Router definitions (AllowedRoles client shields)
│   ├── services/            # Axios API wrappers, socket instance getters, and FCM hooks
│   └── utils/               # Frontend formatting & coordinate distance sorting helpers
└── vite.config.js           # Vite development and bundling configuration
```

---

## 5. Security & Validation Checklist

- **Secure HTTP Headers:** Enabled via `helmet` in the Express pipeline.
- **Request Compression:** Enabled via `compression` middleware to optimize JSON payloads.
- **API Request Validation:** Every input schema is validated on entry by **Joi** middlewares before executing controllers.
- **CORS Configuration:** Explicit configurations are used with `maxAge` preflight caching.
- **Authentication Shields:** Protected API routes and websocket handshakes require a valid bearer JWT. Allowed Roles (`user`, `vendor`, `admin`) are strictly enforced.
