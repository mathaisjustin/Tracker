/**
 * TRACKER BACKEND - FILE TREE AND FLOW DIAGRAM
 * 
 * Visual representation of all files and how requests flow through them
 */

// ============================================================================
// FILE TREE
// ============================================================================

/*
src/
│
├── server.ts .............................. ✂️ Express server entry point
│   ├── imports from ./db/supabase
│   ├── imports from ./middleware/auth
│   ├── imports from ./routes
│   └── starts listening on port 5000
│
├── API_STRUCTURE.ts ....................... 📋 API endpoint documentation
├── FOLDER_STRUCTURE.ts .................... 📋 Navigation guide
├── BACKEND_STRUCTURE.md ................... 📋 This file
│
├── db/
│   ├── client.ts .......................... Database client pool
│   └── supabase.ts ........................ Supabase SDK initialization
│
├── middleware/
│   └── auth.ts ............................ Middleware for JWT validation
│
├── routes/
│   └── index.ts ........................... 🌳 MAIN ROUTER
│       ├── imports habitsRoutes from ./habits/routes
│       ├── imports entriesRoutes from ./entries/routes
│       └── imports profileRoutes from ./profile/routes
│
│
├── habits/ ................................ 📦 HABITS MODULE
│   ├── controller/
│   │   ├── habits.ts ...................... Habits CRUD handlers
│   │   ├── details.ts ..................... Details page handlers
│   │   └── stats.ts ....................... Stats handlers
│   ├── service/
│   │   ├── habits.ts ...................... Habits business logic
│   │   ├── details.ts ..................... Details business logic
│   │   └── stats.ts ....................... Stats business logic
│   └── routes/
│       ├── index.ts ....................... Main habits routes
│       ├── details.ts ..................... Details nested routes
│       └── stats.ts ....................... Stats nested routes
│
├── entries/ ............................... 📦 ENTRIES MODULE
│   ├── controller/
│   │   ├── entries.ts ..................... Entries CRUD handlers
│   │   └── quick-log.ts ................... Quick op handlers
│   ├── service/
│   │   ├── entries.ts ..................... Entries business logic
│   │   └── quick-log.ts ................... Quick op business logic
│   └── routes/
│       ├── index.ts ....................... Main entries routes
│       └── quick-log.ts ................... Quick log nested routes
│
└── profile/ ............................... 📦 PROFILE MODULE
    ├── controller/
    │   └── profile.ts ..................... Profile CRUD handlers
    ├── service/
    │   └── profile.ts ..................... Profile business logic
    └── routes/
        └── index.ts ....................... Profile routes


// ============================================================================
// REQUEST FLOW EXAMPLES
// ============================================================================

/**
 * EXAMPLE 1: GET /api/habits
 * 
 * Browser Request
 *     │
 *     ↓
 * src/server.ts
 *  ├─ app.use("/api", routes)
 *     │
 *     ↓
 * src/routes/index.ts
 *  ├─ router.use("/habits", habitsRoutes)
 *     │
 *     ↓
 * src/habits/routes/index.ts
 *  ├─ router.get("/", getHabits)
 *     │
 *     ↓
 * src/habits/controller/habits.ts
 *  ├─ getHabits() function
 *     │ calls getHabitsService()
 *     ↓
 * src/habits/service/habits.ts
 *  ├─ getHabitsService(userId)
 *     │ queries database
 *     │ transforms data
 *     ↓
 * Browser Response ← Returns JSON array
 */

/**
 * EXAMPLE 2: GET /api/habits/:habitId/details
 * 
 * Browser Request
 *     │
 *     ↓
 * src/server.ts → src/routes/index.ts
 *     ├─ /habits → habitsRoutes
 *     │
 *     ↓
 * src/habits/routes/index.ts
 *  ├─ /:habitId/details → router.use(detailsRoutes)
 *     │
 *     ↓
 * src/habits/routes/details.ts
 *  ├─ router.get("/", getHabitDetails)
 *     │
 *     ↓
 * src/habits/controller/details.ts
 *  ├─ getHabitDetails() function
 *     │ calls getHabitDetailsService()
 *     ↓
 * src/habits/service/details.ts
 *  ├─ getHabitDetailsService(habitId, userId)
 *     │ queries multiple tables
 *     │ calculates streaks
 *     │ aggregates data
 *     ↓
 * Browser Response ← Returns habit object with details
 */

/**
 * EXAMPLE 3: GET /api/habits/:habitId/stats
 * 
 * Browser Request
 *     │
 *     ↓
 * src/routes/index.ts → /habits → habitsRoutes
 *     │
 *     ↓
 * src/habits/routes/index.ts
 *  ├─ /:habitId/details → detailsRoutes
 *     │
 *     ↓
 * src/habits/routes/details.ts
 *  ├─ /stats → statsRoutes
 *     │
 *     ↓
 * src/habits/routes/stats.ts
 *  ├─ router.get("/", getStats)
 *     │
 *     ↓
 * src/habits/controller/stats.ts
 *  ├─ getStats() function
 *     │ calls getStatsService()
 *     ↓
 * src/habits/service/stats.ts
 *  ├─ getStatsService(habitId)
 *     │ queries stats
 *     ↓
 * Browser Response ← Returns stats object
 */

/**
 * EXAMPLE 4: POST /api/entries/quick-log/increment
 * 
 * Browser Request
 *     │
 *     ↓
 * src/routes/index.ts → /entries → entriesRoutes
 *     │
 *     ↓
 * src/entries/routes/index.ts
 *  ├─ /quick-log → quickLogRoutes
 *     │
 *     ↓
 * src/entries/routes/quick-log.ts
 *  ├─ router.post("/increment", quickIncrementEntry)
 *     │
 *     ↓
 * src/entries/controller/quick-log.ts
 *  ├─ quickIncrementEntry() function
 *     │ calls quickIncrementService()
 *     ↓
 * src/entries/service/quick-log.ts
 *  ├─ quickIncrementService(habitId, userId)
 *     │ updates entry in database
 *     ↓
 * Browser Response ← Returns updated entry
 */


// ============================================================================
// ROUTING ARCHITECTURE
// ============================================================================

/**
 * Root Router: src/routes/index.ts
 * │
 * ├── /api/habits ...... router.use("/habits", habitsRoutes)
 * │   ├── GET / ........ getHabits()
 * │   ├── POST / ....... createHabit()
 * │   ├── PUT /:id ..... updateHabit()
 * │   ├── DELETE /:id .. deleteHabit()
 * │   │
 * │   └── /:habitId/details ...... (nested router)
 * │       ├── GET / ............ getHabitDetails()
 * │       ├── PATCH /archive ... archiveHabit()
 * │       │
 * │       └── /stats .......... (nested router)
 * │           ├── GET / ............ getStats()
 * │           ├── GET /streaks .... getStreaks()
 * │           └── GET /progress ... getProgress()
 * │
 * ├── /api/entries .... router.use("/entries", entriesRoutes)
 * │   ├── GET / ........ getEntries()
 * │   ├── POST / ....... createEntry()
 * │   ├── PUT /:id ..... updateEntry()
 * │   ├── DELETE /:id .. deleteEntry()
 * │   │
 * │   └── /quick-log .. (nested router)
 * │       ├── POST /increment .. quickIncrementEntry()
 * │       └── POST /decrement .. quickDecrementEntry()
 * │
 * └── /api/profile .... router.use("/profile", profileRoutes)
 *     ├── GET / ........ getProfile()
 *     ├── PUT / ........ updateProfile()
 *     └── DELETE / ..... deleteProfile()
 */


// ============================================================================
// MODULE DEPENDENCIES
// ============================================================================

/**
 * Dependency graph (what imports what)
 * 
 * controller files
 *     ↓ import from
 * service files
 *     ↓ import from
 * db/ (supabase.ts, client.ts)
 * 
 * routes files
 *     ↓ import from
 * controller files
 *     ↓ import from
 * service files
 * 
 * routes/index.ts (main)
 *     ↓ import from
 * habits/routes/index.ts
 * entries/routes/index.ts
 * profile/routes/index.ts
 * 
 * server.ts
 *     ↓ import from
 * middleware/auth.ts
 * db/supabase.ts
 * routes/index.ts (main)
 */
