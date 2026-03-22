/**
 * TRACKER BACKEND - COMPLETE ASCII TREE
 * 
 * Visual folder structure showing all 27 files organized by feature
 */

backend/
│
└── src/
    │
    ├── 📄 server.ts
    ├── 📋 API_STRUCTURE.ts
    ├── 📋 FOLDER_STRUCTURE.ts
    ├── 📋 BACKEND_STRUCTURE.md
    ├── 📋 FLOW_DIAGRAM.md
    ├── 📋 COMPLETE_REFERENCE.md
    │
    ├── 🗂️  db/
    │   ├── client.ts
    │   └── supabase.ts
    │
    ├── 🗂️  middleware/
    │   └── auth.ts
    │
    ├── 🗂️  routes/
    │   └── index.ts (main router)
    │
    │
    ├── 📦 habits/
    │   │
    │   ├── controller/
    │   │   ├── habits.ts ............. CRUD operations
    │   │   ├── details.ts ............ Detail view
    │   │   └── stats.ts ............. Statistics
    │   │
    │   ├── service/
    │   │   ├── habits.ts ............. Business logic (CRUD)
    │   │   ├── details.ts ............ Business logic (Details)
    │   │   └── stats.ts ............. Business logic (Stats)
    │   │
    │   └── routes/
    │       ├── index.ts ............. GET/POST/PUT/DELETE /api/habits
    │       ├── details.ts ........... Nested: /api/habits/:id/details
    │       └── stats.ts ............. Nested: /api/habits/:id/stats
    │
    │
    ├── 📦 entries/
    │   │
    │   ├── controller/
    │   │   ├── entries.ts ........... Full CRUD
    │   │   └── quick-log.ts ......... Quick ops
    │   │
    │   ├── service/
    │   │   ├── entries.ts ........... Business logic (CRUD)
    │   │   └── quick-log.ts ......... Business logic (Quick)
    │   │
    │   └── routes/
    │       ├── index.ts ............. GET/POST/PUT/DELETE /api/entries
    │       └── quick-log.ts ......... Nested: /api/entries/quick-log
    │
    │
    └── 📦 profile/
        │
        ├── controller/
        │   └── profile.ts ............ GET/PUT/DELETE
        │
        ├── service/
        │   └── profile.ts ............ Business logic
        │
        └── routes/
            └── index.ts ............. GET/PUT/DELETE /api/profile


/**
 * FILE SUMMARY BY LAYER
 */

DOCUMENTATION LAYER (6 files)
├── server.ts
├── API_STRUCTURE.ts
├── FOLDER_STRUCTURE.ts
├── BACKEND_STRUCTURE.md
├── FLOW_DIAGRAM.md
└── COMPLETE_REFERENCE.md

DATABASE LAYER (2 files)
├── db/client.ts
└── db/supabase.ts

MIDDLEWARE LAYER (1 file)
└── middleware/auth.ts

ROUTING LAYER (1 file)
└── routes/index.ts

FEATURE MODULES (17 files)
├── habits (9 files)
│   ├── controller (3)
│   ├── service (3)
│   └── routes (3)
├── entries (6 files)
│   ├── controller (2)
│   ├── service (2)
│   └── routes (2)
└── profile (3 files)
    ├── controller (1)
    ├── service (1)
    └── routes (1)

────────────────────────────
TOTAL: 27 FILES


/**
 * ENDPOINT SUMMARY
 */

GET  /api/health .................... Health check
                                      From: routes/index.ts

GET  /api/habits .................... Get all habits
POST /api/habits .................... Create habit
PUT  /api/habits/:id ................ Update habit
DEL  /api/habits/:id ................ Delete habit
                                      From: habits/routes/index.ts

GET  /api/habits/:habitId/details ... Get habit details
PATCH /api/habits/:habitId/details/archive .... Archive habit
                                      From: habits/routes/details.ts

GET  /api/habits/:habitId/stats ...... Get habit stats
GET  /api/habits/:habitId/stats/streaks
GET  /api/habits/:habitId/stats/progress
                                      From: habits/routes/stats.ts

GET  /api/entries ................... Get entries
POST /api/entries ................... Create entry
PUT  /api/entries/:id ............... Update entry
DEL  /api/entries/:id ............... Delete entry
                                      From: entries/routes/index.ts

POST /api/entries/quick-log/increment .... Quick increment
POST /api/entries/quick-log/decrement .... Quick decrement
                                      From: entries/routes/quick-log.ts

GET  /api/profile ................... Get profile
PUT  /api/profile ................... Update profile
DEL  /api/profile ................... Delete profile
                                      From: profile/routes/index.ts

────────────────────────────────────
TOTAL: 20 API ENDPOINTS


/**
 * MODULE STRUCTURE PATTERN
 */

Each module follows same pattern:

module/
├── controller/
│   ├── [feature1].ts ............. Handler functions
│   ├── [feature2].ts ............. Handler functions
│   └── [feature3].ts ............. Handler functions
│
├── service/
│   ├── [feature1].ts ............. Business logic
│   ├── [feature2].ts ............. Business logic
│   └── [feature3].ts ............. Business logic
│
└── routes/
    ├── index.ts ................... Main routes
    ├── [feature2].ts .............. Nested routes
    └── [feature3].ts .............. Nested routes

IMPORTS FLOW:
routes/*.ts ← imports from ← controller/*.ts
                          ← imports from ← service/*.ts
                                     ← imports from ← db/


/**
 * QUICK LOOKUP TABLE
 */

Need to find code for...        │ Go to...
──────────────────────────────────────────────────────────────────
GET /api/habits                 │ habits/routes/index.ts (line: router.get)
                                │ → habits/controller/habits.ts (getHabits)
                                │ → habits/service/habits.ts (getHabitsService)
──────────────────────────────────────────────────────────────────
GET /api/habits/:id/details     │ habits/routes/details.ts (line: router.get)
                                │ → habits/controller/details.ts (getHabitDetails)
                                │ → habits/service/details.ts (getHabitDetailsService)
──────────────────────────────────────────────────────────────────
GET /api/habits/:id/stats       │ habits/routes/stats.ts (line: router.get)
                                │ → habits/controller/stats.ts (getStats)
                                │ → habits/service/stats.ts (getStatsService)
──────────────────────────────────────────────────────────────────
GET /api/entries                │ entries/routes/index.ts (line: router.get)
                                │ → entries/controller/entries.ts (getEntries)
                                │ → entries/service/entries.ts (getEntriesService)
──────────────────────────────────────────────────────────────────
POST /api/entries/quick-log/inc │ entries/routes/quick-log.ts (line: router.post)
                                │ → entries/controller/quick-log.ts (quickIncrementEntry)
                                │ → entries/service/quick-log.ts (quickIncrementService)
──────────────────────────────────────────────────────────────────
GET /api/profile                │ profile/routes/index.ts (line: router.get)
                                │ → profile/controller/profile.ts (getProfile)
                                │ → profile/service/profile.ts (getProfileService)
──────────────────────────────────────────────────────────────────
