# 🚀 userMain Module Architecture & Folder Structure

Welcome to the **userMain** module! This is a completely self-contained, isolated, and highly-scalable folder structure created under `src/userMain` to host all user-centric features, layouts, custom hooks, and pages.

By containing all module code in this directory, we maintain clean separation of concerns and ensure that other parts of the application remain untouched and clean.

---

## 📁 Folder Structure Overview

```text
src/userMain/
├── README.md                      # This architecture document
├── components/                    # Module-specific reusable UI components
│   ├── index.js                   # Main exporter for components
│   ├── common/                    # Core atomic design elements (Tailwind + Brand Theme)
│   │   ├── Button.jsx             # Highly customized, accessible primary/secondary buttons
│   │   ├── Card.jsx               # Soft-shadowed card components with rounded-2xl/rounded-3xl
│   │   ├── Input.jsx              # Clean, error-support input fields with transition-all
│   │   ├── Badge.jsx              # Social trust / verified vendor badges
│   │   ├── LoadingState.jsx       # Elegant micro-animated spinner or skeleton state
│   │   └── index.js               # Exporter for common elements
│   ├── layout/                    # Layout shells specific to the user main module
│   │   ├── UserMainLayout.jsx     # Navigation-coordinated user layout wrapper
│   │   ├── Header.jsx             # Dynamic header with action items, titles, & notifications
│   │   ├── BottomNav.jsx          # Tactile mobile-optimized bottom navigation
│   │   └── index.js               # Exporter for layout elements
│   └── features/                  # Complex feature-based components (e.g. Group card, Social feed)
│       └── index.js               # Exporter for feature components
├── pages/                         # Complete page views for the user main module
│   ├── index.js                   # Main exporter for page views
│   ├── home/                      # User dashboard / landing page
│   │   └── Home.jsx
│   ├── groups/                    # Active group deal management, group views, chats
│   │   ├── GroupsList.jsx         # Live active group list
│   │   ├── GroupDetails.jsx       # Real-time joined users counter + urgency indicators
│   │   └── CreateGroup.jsx        # Optimized step-by-step group creation flow
│   ├── deals/                     # Browse group-buy deals feed
│   │   └── Deals.jsx
│   ├── chat/                      # Module-isolated real-time chat
│   │   └── GroupChat.jsx
│   ├── profile/                   # User account & settings page
│   │   └── Profile.jsx
│   ├── notifications/             # Activity alerts / social notifications
│   │   └── Notifications.jsx
│   └── categories/                # Products categories filter and exploration page
│       └── Categories.jsx
├── hooks/                         # Optimized custom React hooks for business logic separation
│   ├── index.js                   # Main exporter for custom hooks
│   ├── useAuth.js                 # Authentication, authorization, and local user status
│   ├── useGroups.js               # Joining, creating, and filtering active groups
│   ├── useDeals.js                # Fetching deals, progress thresholds, & remaining slots
│   ├── useChat.js                 # WebSocket subscriptions and message sync helpers
│   └── useLocation.js             # User location permissions and coordinate matching
├── services/                      # API integration layers isolated to user flows
│   ├── index.js                   # Main exporter for services
│   ├── api.js                     # Core API client (Axios config, headers, interceptors)
│   ├── groupService.js            # API request endpoints for group buying actions
│   ├── dealService.js             # API request endpoints for deals feed and details
│   └── userService.js             # API request endpoints for notifications, profile, etc.
├── context/                       # Isolated React Context providers for local state
│   ├── index.js                   # Main exporter for context
│   └── UserMainContext.jsx        # Local global state (e.g. current location, navigation state)
├── utils/                         # Helper utilities and formatters
│   ├── index.js                   # Main exporter for utilities
│   ├── formatters.js              # Currency, relative timestamps, and remaining percent formatters
│   └── validators.js              # Multi-step form validation schemas
└── constants/                     # Local constants, paths, and config assets
    ├── index.js                   # Main exporter for constants
    ├── paths.js                   # Sub-routing route definition strings
    └── config.js                  # Settings, thresholds, and configurations
```

---

## 🎨 Compliance with UI-RULES.md & Theme-rules.md

This folder structure and its components are specifically designed to implement our strict product guidelines:

1. **Brand Palette Integrations**:
   - **Primary**: Orange (`#F97316`) -> Managed via `bg-primary` / `text-primary`.
   - **Secondary**: Blue (`#0077B6`) -> Managed via `bg-secondary` / `text-secondary`.
   - **Success**: Green (`#22C55E`) -> Managed via `bg-success` / `text-success`.
   - **Error**: Red (`#EF4444`) -> Managed via `bg-error` / `text-error`.
   
2. **Visual Hierarchy & Premium Design**:
   - No generic tables or standard cards. Surfaces use modern shadow states (e.g., `shadow-orange-500/10`) with `rounded-2xl` or `rounded-3xl` corner aesthetics.
   - Elements will use the centralized font-sans (`'Outfit'`) configured in `index.css`.
   
3. **No Over-Engineering, High Interaction**:
   - Subtle hover indicators (`hover:bg-orange-600`) and scaling states (`active:scale-95 transition-all`) to provide visual life without performance drag.
   
4. **Group-Buying Specific Contexts**:
   - Pre-designed slots in `components/features` to clearly project group-buying metadata (e.g. joined avatars, spot counts, urgency, verified vendor indicators, and ratings badge).
