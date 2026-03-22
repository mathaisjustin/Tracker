/**
 * BACKEND FOLDER STRUCTURE - VISUAL GUIDE
 * 
 * Each module is organized with:
 * - controller/ : Handle HTTP requests
 * - service/   : Business logic
 * - routes/    : Endpoint definitions
 * 
 * This makes it easy to find where each API endpoint is implemented
 */
/*
src/
│
├── server.ts ............................ Main Express server configuration
├── API_STRUCTURE.ts ..................... This file - API documentation
│
├── db/
│   ├── client.ts ........................ Database client setup
│   └── supabase.ts ...................... Supabase client initialization
│
├── middleware/
│   └── auth.ts .......................... Authentication middleware
│
├── routes/
│   └── index.ts ......................... Main router that combines all modules
│
├── habits/
│   │
│   ├── controller/
│   │   ├── habits.ts ................... List/Create/Update/Delete habits
│   │   ├── details.ts .................. Get individual habit with full details
│   │   └── stats.ts .................... Habit statistics (streaks, progress)
│   │
│   ├── service/
│   │   ├── habits.ts ................... Business logic for list operations
│   │   ├── details.ts .................. Business logic for details
│   │   └── stats.ts .................... Business logic for statistics
│   │
│   └── routes/
│       ├── index.ts .................... GET/POST/PUT/DELETE /api/habits
│       ├── details.ts .................. Nested: /api/habits/:habitId/details
│       └── stats.ts .................... Nested: /api/habits/:habitId/stats
│
├── entries/
│   │
│   ├── controller/
│   │   ├── entries.ts .................. Full CRUD for habit entries
│   │   └── quick-log.ts ................ Quick increment/decrement buttons
│   │
│   ├── service/
│   │   ├── entries.ts .................. Business logic for entry operations
│   │   └── quick-log.ts ................ Business logic for quick actions
│   │
│   └── routes/
│       ├── index.ts .................... GET/POST/PUT/DELETE /api/entries
│       └── quick-log.ts ................ Nested: /api/entries/quick-log
│
└── profile/
    │
    ├── controller/
    │   └── profile.ts .................. Get/Update/Delete profile
    │
    ├── service/
    │   └── profile.ts .................. Profile business logic
    │
    └── routes/
        └── index.ts .................... GET/PUT/DELETE /api/profile


/**
 * ============================================================================
 * ROUTING HIERARCHY
 * ============================================================================
 */

/**
 * BASE: /api
 * └── routes/index.ts
 */

/**
 * HABITS: /api/habits
 * └── api-habits
 *   ├── habits/routes/index.ts ........... /api/habits → habits.controller
 *   ├── habits/routes/index.ts ........... /api/habits/:id → habits.controller
 *   ├── habits/routes/index.ts ........... /api/habits/:habitId/details
 *   │   └── habits/routes/details.ts ..... Merges with details.controller
 *   │       ├── GET /api/habits/:habitId/details
 *   │       ├── PATCH /api/habits/:habitId/details/archive
 *   │       └── /api/habits/:habitId/stats
 *   │           └── habits/routes/stats.ts
 *   │               ├── GET /api/habits/:habitId/stats
 *   │               ├── GET /api/habits/:habitId/stats/streaks
 *   │               └── GET /api/habits/:habitId/stats/progress
 */

/**
 * ENTRIES: /api/entries
 * └── entries/routes/index.ts ............ /api/entries → entries.controller
 *     └── /api/entries/quick-log
 *         └── entries/routes/quick-log.ts
 *             ├── POST /api/entries/quick-log/increment
 *             └── POST /api/entries/quick-log/decrement
 */

/**
 * PROFILE: /api/profile
 * └── profile/routes/index.ts ........... /api/profile → profile.controller
 *     ├── GET /api/profile
 *     ├── PUT /api/profile
 *     └── DELETE /api/profile
 */


/**
 * ============================================================================
 * HOW TO USE THIS STRUCTURE
 * ============================================================================
 * 
 * 1. WHEN LOOKING AT A FRONTEND COMPONENT:
 *    - Find the API endpoint it calls (e.g., GET /api/habits)
 *    - Navigate to routes/ → find the matching path
 *    - Follow the import to controller/ → see the handler
 *    - Follow call to service/ → see the business logic
 *
 * 2. WHEN ADDING A NEW ENDPOINT:
 *    - Decide which module it belongs to (habits, entries, profile)
 *    - Create/update controller in module/controller/
 *    - Create/update service in module/service/
 *    - Add route in module/routes/
 *    - Update main routes/index.ts if needed
 *
 * 3. FILE NAMING CONVENTION:
 *    - habits.ts ........................ For habits module main features
 *    - entries.ts ....................... For entries module main features
 *    - quick-log.ts ..................... For quick operations (increment/decrement)
 *    - details.ts ....................... For detailed view operations
 *    - stats.ts ......................... For statistics/analytics operations
 *
 * 4. EACH CONTROLLER FILE HAS:
 *    - comments showing the route and usage
 *    - handler functions that match the route
 *    - calls to corresponding service functions
 *
 * 5. EACH SERVICE FILE HAS:
 *    - pure business logic functions
 *    - database queries
 *    - data transformations
 *    - error handling
 */
