/**
 * TRACKER BACKEND - COMPLETE FILE STRUCTURE
 * ============================================================================
 * 
 * All files and folders organized by feature module
 * Each module follows: Controller → Routes → Service pattern
 */

BACKEND ROOT: apps/backend/
│
├── package.json ......................... Dependencies & scripts
├── tsconfig.json ........................ TypeScript configuration
│
└── src/
    │
    ├── server.ts ........................ Express server entry point
    ├── API_STRUCTURE.ts ................. API documentation (all endpoints)
    ├── FOLDER_STRUCTURE.ts .............. This folder guide
    │
    ├── db/
    │   ├── client.ts .................... Database client (PostgreSQL/etc)
    │   └── supabase.ts .................. Supabase client setup
    │
    ├── middleware/
    │   └── auth.ts ...................... Authentication middleware
    │
    ├── routes/
    │   └── index.ts ..................... Main router (combines all modules)
    │
    │
    │ ============================================================================
    │ HABITS MODULE - /api/habits
    │ ============================================================================
    │
    ├── habits/
    │   │
    │   ├── controller/
    │   │   ├── habits.ts ................ GET/POST/PUT/DELETE habits list
    │   │   │                           Functions:
    │   │   │                           - getHabits()
    │   │   │                           - createHabit()
    │   │   │                           - updateHabit()
    │   │   │                           - deleteHabit()
    │   │   │
    │   │   ├── details.ts ............... Get individual habit details
    │   │   │                           Functions:
    │   │   │                           - getHabitDetails()
    │   │   │                           - archiveHabit()
    │   │   │
    │   │   └── stats.ts ................. Statistics & streaks for habits
    │   │                               Functions:
    │   │                               - getStats()
    │   │                               - getStreaks()
    │   │                               - getProgress()
    │   │
    │   ├── service/
    │   │   ├── habits.ts ................ Business logic for habits
    │   │   │                           Functions:
    │   │   │                           - getHabitsService()
    │   │   │                           - createHabitService()
    │   │   │                           - updateHabitService()
    │   │   │                           - deleteHabitService()
    │   │   │
    │   │   ├── details.ts ............... Business logic for details
    │   │   │                           Functions:
    │   │   │                           - getHabitDetailsService()
    │   │   │                           - archiveHabitService()
    │   │   │
    │   │   └── stats.ts ................. Business logic for stats
    │   │                               Functions:
    │   │                               - getStatsService()
    │   │                               - getStreaksService()
    │   │                               - getProgressService()
    │   │
    │   └── routes/
    │       ├── index.ts ................. Main habits routes
    │       │                           Routes:
    │       │                           GET    /api/habits
    │       │                           POST   /api/habits
    │       │                           PUT    /api/habits/:id
    │       │                           DELETE /api/habits/:id
    │       │                           (Also mounts details routes)
    │       │
    │       ├── details.ts ............... Habit details nested routes
    │       │                           Routes:
    │       │                           GET    /api/habits/:habitId/details
    │       │                           PATCH  /api/habits/:habitId/details/archive
    │       │                           (Also mounts stats routes)
    │       │
    │       └── stats.ts ................. Stats nested routes
    │                               Routes:
    │                               GET /api/habits/:habitId/stats
    │                               GET /api/habits/:habitId/stats/streaks
    │                               GET /api/habits/:habitId/stats/progress
    │
    │
    │ ============================================================================
    │ ENTRIES MODULE - /api/entries
    │ ============================================================================
    │
    ├── entries/
    │   │
    │   ├── controller/
    │   │   ├── entries.ts ............... Full CRUD for habit entries
    │   │   │                           Functions:
    │   │   │                           - getEntries()
    │   │   │                           - createEntry()
    │   │   │                           - updateEntry()
    │   │   │                           - deleteEntry()
    │   │   │
    │   │   └── quick-log.ts ............. Quick increment/decrement
    │   │                               Functions:
    │   │                               - quickIncrementEntry()
    │   │                               - quickDecrementEntry()
    │   │
    │   ├── service/
    │   │   ├── entries.ts ............... Business logic for entries
    │   │   │                           Functions:
    │   │   │                           - getEntriesService()
    │   │   │                           - createEntryService()
    │   │   │                           - updateEntryService()
    │   │   │                           - deleteEntryService()
    │   │   │
    │   │   └── quick-log.ts ............. Business logic for quick ops
    │   │                               Functions:
    │   │                               - quickIncrementService()
    │   │                               - quickDecrementService()
    │   │
    │   └── routes/
    │       ├── index.ts ................. Main entries routes
    │       │                           Routes:
    │       │                           GET    /api/entries
    │       │                           POST   /api/entries
    │       │                           PUT    /api/entries/:id
    │       │                           DELETE /api/entries/:id
    │       │                           (Also mounts quick-log routes)
    │       │
    │       └── quick-log.ts ............. Quick log nested routes
    │                               Routes:
    │                               POST /api/entries/quick-log/increment
    │                               POST /api/entries/quick-log/decrement
    │
    │
    │ ============================================================================
    │ PROFILE MODULE - /api/profile
    │ ============================================================================
    │
    └── profile/
        │
        ├── controller/
        │   └── profile.ts ............... Profile CRUD operations
        │                               Functions:
        │                               - getProfile()
        │                               - updateProfile()
        │                               - deleteProfile()
        │
        ├── service/
        │   └── profile.ts ............... Business logic for profile
        │                               Functions:
        │                               - getProfileService()
        │                               - updateProfileService()
        │                               - deleteProfileService()
        │
        └── routes/
            └── index.ts ................. Profile routes
                                        Routes:
                                        GET    /api/profile
                                        PUT    /api/profile
                                        DELETE /api/profile


/**
 * ============================================================================
 * QUICK REFERENCE: WHICH FILE FOR WHAT?
 * ============================================================================
 */

// Need to add a new endpoint?
// 1. Add handler function to controller/[feature].ts
// 2. Add business logic to service/[feature].ts
// 3. Add route to routes/[feature].ts
// 4. Import in routes/index.ts if top-level module

// Need to find where GET /api/habits/:habitId/details is handled?
// 1. Look in routes/index.ts → router.use("/habits", habitsRoutes)
// 2. Go to habits/routes/index.ts → mounted as "/:habitId/details"
// 3. Go to habits/routes/details.ts → GET /
// 4. See function from controller/details.ts → getHabitDetails()
// 5. Check service/details.ts → getHabitDetailsService()

// Frontend calling /api/entries/quick-log/increment?
// 1. routes/index.ts → router.use("/entries", entriesRoutes)
// 2. entries/routes/index.ts → router.use("/quick-log", quickLogRoutes)
// 3. entries/routes/quick-log.ts → POST /increment
// 4. controller/quick-log.ts → quickIncrementEntry()
// 5. service/quick-log.ts → quickIncrementService()


/**
 * ============================================================================
 * TOTAL FILE COUNT
 * ============================================================================
 * 
 * Core Files:
 *   - server.ts ......................... 1 file
 *   - API_STRUCTURE.ts .................. 1 file
 *   - FOLDER_STRUCTURE.ts ............... 1 file
 * 
 * Database:
 *   - db/*.ts ........................... 2 files (client, supabase)
 * 
 * Middleware:
 *   - middleware/*.ts ................... 1 file (auth)
 * 
 * Routes (Main):
 *   - routes/index.ts ................... 1 file
 * 
 * Habits Module:
 *   - controller/3 ...................... 3 files (habits, details, stats)
 *   - service/3 ......................... 3 files (habits, details, stats)
 *   - routes/3 .......................... 3 files (index, details, stats)
 *   Total: 9 files
 * 
 * Entries Module:
 *   - controller/2 ...................... 2 files (entries, quick-log)
 *   - service/2 ......................... 2 files (entries, quick-log)
 *   - routes/2 .......................... 2 files (index, quick-log)
 *   Total: 6 files
 * 
 * Profile Module:
 *   - controller/1 ...................... 1 file (profile)
 *   - service/1 ......................... 1 file (profile)
 *   - routes/1 .......................... 1 file (index)
 *   Total: 3 files
 * 
 * ============================================================================
 * GRAND TOTAL: 27 TypeScript files (organized clearly by feature)
 * ============================================================================
 */
