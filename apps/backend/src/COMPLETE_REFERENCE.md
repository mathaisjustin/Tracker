/**
 * BACKEND COMPLETE STRUCTURE - FINAL REFERENCE
 * 
 * Clean, organized backend with 27 TypeScript files
 * All old files removed and replaced with proper modular structure
 */

apps/backend/
├── package.json
├── tsconfig.json
│
└── src/
    ├── server.ts ......................... Main entry point [CORE]
    ├── API_STRUCTURE.ts .................. API documentation [GUIDE]
    ├── FOLDER_STRUCTURE.ts ............... Navigation guide [GUIDE]
    ├── BACKEND_STRUCTURE.md .............. File tree overview [GUIDE]
    ├── FLOW_DIAGRAM.md ................... Request flow diagram [GUIDE]
    │
    │
    │ ========================================================================
    │ DATABASE LAYER
    │ ========================================================================
    │
    ├── db/
    │   ├── client.ts ..................... PostgreSQL/Database pool setup
    │   └── supabase.ts ................... Supabase client (JWT, auth, queries)
    │
    │ ========================================================================
    │ MIDDLEWARE
    │ ========================================================================
    │
    ├── middleware/
    │   └── auth.ts ....................... JWT token validation middleware
    │
    │ ========================================================================
    │ ROUTING
    │ ========================================================================
    │
    ├── routes/
    │   └── index.ts ...................... ✂️ Main router
    │                                   Imports:
    │                                   - habitsRoutes
    │                                   - entriesRoutes
    │                                   - profileRoutes
    │                                   
    │                                   Routes:
    │                                   /api/health → GET
    │                                   /api/habits → habitsRoutes
    │                                   /api/entries → entriesRoutes
    │                                   /api/profile → profileRoutes
    │
    │ ========================================================================
    │ HABITS MODULE (9 FILES)
    │ ========================================================================
    │
    ├── habits/
    │   │
    │   ├── controller/
    │   │   │
    │   │   ├── habits.ts ................. Habits CRUD handlers
    │   │   │                           ✓ getHabits() → GET /
    │   │   │                           ✓ createHabit() → POST /
    │   │   │                           ✓ updateHabit() → PUT /:id
    │   │   │                           ✓ deleteHabit() → DELETE /:id
    │   │   │
    │   │   ├── details.ts ................ Individual habit details
    │   │   │                           ✓ getHabitDetails() → GET /:habitId/details
    │   │   │                           ✓ archiveHabit() → PATCH /:habitId/details/archive
    │   │   │
    │   │   └── stats.ts .................. Habit statistics
    │   │                               ✓ getStats() → GET /:habitId/stats
    │   │                               ✓ getStreaks() → GET /:habitId/stats/streaks
    │   │                               ✓ getProgress() → GET /:habitId/stats/progress
    │   │
    │   ├── service/
    │   │   │
    │   │   ├── habits.ts ................. Habits business logic
    │   │   │                           ✓ getHabitsService(userId)
    │   │   │                           ✓ createHabitService(userId, data)
    │   │   │                           ✓ updateHabitService(habitId, data)
    │   │   │                           ✓ deleteHabitService(habitId)
    │   │   │
    │   │   ├── details.ts ................ Details business logic
    │   │   │                           ✓ getHabitDetailsService(habitId, userId)
    │   │   │                           ✓ archiveHabitService(habitId, userId)
    │   │   │
    │   │   └── stats.ts .................. Stats business logic
    │   │                               ✓ getStatsService(habitId)
    │   │                               ✓ getStreaksService(habitId)
    │   │                               ✓ getProgressService(habitId, timeframe)
    │   │
    │   └── routes/
    │       │
    │       ├── index.ts .................. Main habits router
    │       │                           GET    /api/habits
    │       │                           POST   /api/habits
    │       │                           PUT    /api/habits/:id
    │       │                           DELETE /api/habits/:id
    │       │                           Mounts:
    │       │                           - /:habitId/details → detailsRoutes
    │       │
    │       ├── details.ts ................ Habit details routes
    │       │                           GET    /api/habits/:habitId/details
    │       │                           PATCH  /api/habits/:habitId/details/archive
    │       │                           Mounts:
    │       │                           - /stats → statsRoutes
    │       │
    │       └── stats.ts .................. Stats routes
    │                               GET /api/habits/:habitId/stats
    │                               GET /api/habits/:habitId/stats/streaks
    │                               GET /api/habits/:habitId/stats/progress
    │
    │ ========================================================================
    │ ENTRIES MODULE (6 FILES)
    │ ========================================================================
    │
    ├── entries/
    │   │
    │   ├── controller/
    │   │   │
    │   │   ├── entries.ts ................ Detailed entry CRUD
    │   │   │                           ✓ getEntries() → GET /
    │   │   │                           ✓ createEntry() → POST /
    │   │   │                           ✓ updateEntry() → PUT /:id
    │   │   │                           ✓ deleteEntry() → DELETE /:id
    │   │   │
    │   │   └── quick-log.ts .............. Quick increment/decrement
    │   │                               ✓ quickIncrementEntry() → POST /quick-log/increment
    │   │                               ✓ quickDecrementEntry() → POST /quick-log/decrement
    │   │
    │   ├── service/
    │   │   │
    │   │   ├── entries.ts ................ Entry CRUD business logic
    │   │   │                           ✓ getEntriesService(userId, filters)
    │   │   │                           ✓ createEntryService(userId, data)
    │   │   │                           ✓ updateEntryService(entryId, data)
    │   │   │                           ✓ deleteEntryService(entryId)
    │   │   │
    │   │   └── quick-log.ts .............. Quick op business logic
    │   │                               ✓ quickIncrementService(habitId, userId)
    │   │                               ✓ quickDecrementService(habitId, userId)
    │   │
    │   └── routes/
    │       │
    │       ├── index.ts .................. Main entries router
    │       │                           GET    /api/entries
    │       │                           POST   /api/entries
    │       │                           PUT    /api/entries/:id
    │       │                           DELETE /api/entries/:id
    │       │                           Mounts:
    │       │                           - /quick-log → quickLogRoutes
    │       │
    │       └── quick-log.ts .............. Quick log routes
    │                               POST /api/entries/quick-log/increment
    │                               POST /api/entries/quick-log/decrement
    │
    │ ========================================================================
    │ PROFILE MODULE (3 FILES)
    │ ========================================================================
    │
    └── profile/
        │
        ├── controller/
        │   │
        │   └── profile.ts ................ Profile CRUD
        │                               ✓ getProfile() → GET /
        │                               ✓ updateProfile() → PUT /
        │                               ✓ deleteProfile() → DELETE /
        │
        ├── service/
        │   │
        │   └── profile.ts ................ Profile business logic
        │                               ✓ getProfileService(userId)
        │                               ✓ updateProfileService(userId, data)
        │                               ✓ deleteProfileService(userId)
        │
        └── routes/
            │
            └── index.ts .................. Profile routes
                                        GET    /api/profile
                                        PUT    /api/profile
                                        DELETE /api/profile


/**
 * ========================================================================
 * FILE COUNT SUMMARY
 * ========================================================================
 */

Core Files (Documentation + Entry):
  • server.ts
  • API_STRUCTURE.ts
  • FOLDER_STRUCTURE.ts
  • BACKEND_STRUCTURE.md
  • FLOW_DIAGRAM.md
  Subtotal: 5 files

Database Layer:
  • db/client.ts
  • db/supabase.ts
  Subtotal: 2 files

Middleware:
  • middleware/auth.ts
  Subtotal: 1 file

Routes (Aggregator):
  • routes/index.ts
  Subtotal: 1 file

Habits Module:
  Controllers: habits.ts, details.ts, stats.ts (3)
  Services: habits.ts, details.ts, stats.ts (3)
  Routes: index.ts, details.ts, stats.ts (3)
  Subtotal: 9 files

Entries Module:
  Controllers: entries.ts, quick-log.ts (2)
  Services: entries.ts, quick-log.ts (2)
  Routes: index.ts, quick-log.ts (2)
  Subtotal: 6 files

Profile Module:
  Controllers: profile.ts (1)
  Services: profile.ts (1)
  Routes: index.ts (1)
  Subtotal: 3 files

TOTAL: 27 TypeScript/Documentation files


/**
 * ========================================================================
 * EACH COMPONENT'S RESPONSIBILITY
 * ========================================================================
 */

// CONTROLLER
// - Receives HTTP request
// - Validates request parameters
// - Calls service function
// - Sends HTTP response

// SERVICE
// - Contains business logic
// - Queries database
// - Transforms/aggregates data
// - Throws errors with messages
// - Returns clean objects

// ROUTES
// - Defines HTTP endpoints
// - Maps to controller functions
// - Applies middleware
// - Handles nested routes
// - Documents endpoints in comments


/**
 * ========================================================================
 * HOW TO NAVIGATE
 * ========================================================================
 * 
 * 1. USER CLICKS SOMETHING IN FRONTEND
 *    → Frontend makes API call (e.g., GET /api/habits)
 *
 * 2. FIND THE ENDPOINT
 *    → Go to src/routes/index.ts
 *    → Find which router it's mounted on
 *    → Go to that module's routes/index.ts
 *
 * 3. FIND THE HANDLER
 *    → Look at routes file for the HTTP method
 *    → See which controller function it calls
 *    → Go to controller/[name].ts
 *
 * 4. FIND THE LOGIC
 *    → In controller, see which service it calls
 *    → Go to service/[name].ts
 *    → All business logic is there
 *
 * 5. MAKE CHANGES
 *    → Update service logic first
 *    → Then update controller if needed
 *    → Verify routes are correct
 */
