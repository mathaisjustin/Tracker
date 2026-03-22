/**
 * TRACKER BACKEND - API STRUCTURE
 * 
 * This document shows the complete API structure, mirroring the folder organization
 * Each path maps directly to its controller and service files
 */

/**
 * ============================================================================
 * HABITS MODULE - /api/habits
 * ============================================================================
 * Location: src/habits/
 * 
 * Structure:
 * habits/
 * ├── controller/
 * │   ├── habits.ts ..................... Habits list controller
 * │   ├── details.ts .................... Habit details controller
 * │   └── stats.ts ...................... Habit stats controller
 * ├── service/
 * │   ├── habits.ts ..................... Habits list service
 * │   ├── details.ts .................... Habit details service
 * │   └── stats.ts ...................... Habit stats service
 * └── routes/
 *     ├── index.ts ...................... Main habits routes
 *     ├── details.ts .................... Habit details routes
 *     └── stats.ts ...................... Habit stats routes
 */

// GET /api/habits
// Returns: Array of all habits for the user with today's progress
// Controller: src/habits/controller/habits.ts → getHabits()
// Service: src/habits/service/habits.ts → getHabitsService()
// Frontend Used: Habits list page - displays all habits with today's count

// POST /api/habits
// Body: { name, color, type, unit, daily_limit }
// Returns: Created habit object
// Controller: src/habits/controller/habits.ts → createHabit()
// Service: src/habits/service/habits.ts → createHabitService()
// Frontend Used: Create habit modal/form

// PUT /api/habits/:id
// Body: { name, color, type, unit, daily_limit }
// Returns: Updated habit object
// Controller: src/habits/controller/habits.ts → updateHabit()
// Service: src/habits/service/habits.ts → updateHabitService()
// Frontend Used: Edit habit modal/form

// DELETE /api/habits/:id
// Returns: { success: true }
// Controller: src/habits/controller/habits.ts → deleteHabit()
// Service: src/habits/service/habits.ts → deleteHabitService()
// Frontend Used: Archive button on habits list page

/**
 * ============================================================================
 * HABIT DETAILS NESTED ROUTE - /api/habits/:habitId/details
 * ============================================================================
 * Location: src/habits/routes/details.ts
 * 
 * Accessed from: Habit details page (click on habit card)
 * Shows detailed view with stats and entry history
 */

// GET /api/habits/:habitId/details
// Returns: { habit, streak, today, recent_entries }
// Controller: src/habits/controller/details.ts → getHabitDetails()
// Service: src/habits/service/details.ts → getHabitDetailsService()
// Frontend Used: Habit details page - main content

// PATCH /api/habits/:habitId/details/archive
// Returns: { success: true, archived_at }
// Controller: src/habits/controller/details.ts → archiveHabit()
// Service: src/habits/service/details.ts → archiveHabitService()
// Frontend Used: Archive button on habit details page

/**
 * ============================================================================
 * HABIT STATS NESTED ROUTE - /api/habits/:habitId/stats
 * ============================================================================
 * Location: src/habits/routes/stats.ts
 * 
 * Accessed from: Within habit details page - stats section
 */

// GET /api/habits/:habitId/stats
// Returns: { best_streak, current_streak, total_entries, completion_rate }
// Controller: src/habits/controller/stats.ts → getStats()
// Service: src/habits/service/stats.ts → getStatsService()
// Frontend Used: Habit details page - overall stats section

// GET /api/habits/:habitId/stats/streaks
// Returns: { current_streak, best_streak, last_entry_date }
// Controller: src/habits/controller/stats.ts → getStreaks()
// Service: src/habits/service/stats.ts → getStreaksService()
// Frontend Used: Habit details page - streak display

// GET /api/habits/:habitId/stats/progress
// Returns: { daily_progress, weekly_progress, monthly_progress }
// Controller: src/habits/controller/stats.ts → getProgress()
// Service: src/habits/service/stats.ts → getProgressService()
// Frontend Used: Habit details page - progress chart/visualization

/**
 * ============================================================================
 * ENTRIES MODULE - /api/entries
 * ============================================================================
 * Location: src/entries/
 * 
 * Structure:
 * entries/
 * ├── controller/
 * │   ├── entries.ts ................... Detailed entries CRUD controller
 * │   └── quick-log.ts ................. Quick increment/decrement controller
 * ├── service/
 * │   ├── entries.ts ................... Detailed entries CRUD service
 * │   └── quick-log.ts ................. Quick increment/decrement service
 * └── routes/
 *     ├── index.ts ..................... Main entries routes
 *     └── quick-log.ts ................. Quick log routes
 */

// GET /api/entries
// Query: ?habitId=xxx (optional, get entries for specific habit)
// Returns: Array of entries
// Controller: src/entries/controller/entries.ts → getEntries()
// Service: src/entries/service/entries.ts → getEntriesService()
// Frontend Used: Habit details page - entries history section

// POST /api/entries
// Body: { habitId, quantity, entry_date }
// Returns: Created entry object
// Controller: src/entries/controller/entries.ts → createEntry()
// Service: src/entries/service/entries.ts → createEntryService()
// Frontend Used: Habit details page - manual entry form

// PUT /api/entries/:id
// Body: { quantity }
// Returns: Updated entry object
// Controller: src/entries/controller/entries.ts → updateEntry()
// Service: src/entries/service/entries.ts → updateEntryService()
// Frontend Used: Habit details page - edit entry, increment/decrement buttons

// DELETE /api/entries/:id
// Returns: { success: true }
// Controller: src/entries/controller/entries.ts → deleteEntry()
// Service: src/entries/service/entries.ts → deleteEntryService()
// Frontend Used: Habit details page - delete entry button

/**
 * ============================================================================
 * QUICK LOG NESTED ROUTE - /api/entries/quick-log
 * ============================================================================
 * Location: src/entries/routes/quick-log.ts
 * 
 * Quick single-click increment/decrement from habits list page
 * These are fast operations without detailed forms
 */

// POST /api/entries/quick-log/increment
// Body: { habitId }
// Returns: { success: true, entry: { new_quantity } }
// Controller: src/entries/controller/quick-log.ts → quickIncrementEntry()
// Service: src/entries/service/quick-log.ts → quickIncrementService()
// Frontend Used: Habits list page - single click increment button (large button on card)

// POST /api/entries/quick-log/decrement
// Body: { habitId }
// Returns: { success: true, entry: { new_quantity } }
// Controller: src/entries/controller/quick-log.ts → quickDecrementEntry()
// Service: src/entries/service/quick-log.ts → quickDecrementService()
// Frontend Used: Habits list page - single click decrement button (paired with increment)

/**
 * ============================================================================
 * PROFILE MODULE - /api/profile
 * ============================================================================
 * Location: src/profile/
 * 
 * Structure:
 * profile/
 * ├── controller/
 * │   └── profile.ts ................... Profile CRUD controller
 * ├── service/
 * │   └── profile.ts ................... Profile CRUD service
 * └── routes/
 *     └── index.ts ..................... Profile routes
 */

// GET /api/profile
// Returns: { id, email, onboarding_completed, is_pro, preferences, ... }
// Controller: src/profile/controller/profile.ts → getProfile()
// Service: src/profile/service/profile.ts → getProfileService()
// Frontend Used: Profile page, settings page - current user info

// PUT /api/profile
// Body: { email, name, preferences, theme, timezone, unit }
// Returns: Updated profile object
// Controller: src/profile/controller/profile.ts → updateProfile()
// Service: src/profile/service/profile.ts → updateProfileService()
// Frontend Used: Settings page - all update forms

// DELETE /api/profile
// Returns: { success: true }
// Controller: src/profile/controller/profile.ts → deleteProfile()
// Service: src/profile/service/profile.ts → deleteProfileService()
// Frontend Used: Settings page - delete account button

/**
 * ============================================================================
 * SUMMARY OF EACH FRONTEND PAGE AND ITS ENDPOINTS
 * ============================================================================
 * 
 * 1. HABITS LIST PAGE (/dashboard)
 *    ├─ GET /api/habits
 *    │  └─ Shows all habits with today's progress
 *    └─ POST /api/entries/quick-log/increment
 *    └─ POST /api/entries/quick-log/decrement
 *       └─ Single click buttons to increment/decrement habit count
 *
 * 2. HABIT DETAILS PAGE (/dashboard/:habitId)
 *    ├─ GET /api/habits/:habitId/details
 *    │  └─ Main details page content
 *    ├─ GET /api/habits/:habitId/stats
 *    │  └─ Overall statistics
 *    ├─ GET /api/habits/:habitId/stats/streaks
 *    │  └─ Current and best streak display
 *    ├─ GET /api/habits/:habitId/stats/progress
 *    │  └─ Progress chart/visualization
 *    ├─ GET /api/entries?habitId=xxx
 *    │  └─ Recent entries history
 *    ├─ POST /api/entries
 *    │  └─ Add new entry manually
 *    ├─ PUT /api/entries/:id
 *    │  └─ Edit existing entry, increment/decrement buttons
 *    ├─ DELETE /api/entries/:id
 *    │  └─ Delete entry button
 *    └─ PATCH /api/habits/:habitId/details/archive
 *       └─ Archive button
 *
 * 3. PROFILE/SETTINGS PAGE (/settings)
 *    ├─ GET /api/profile
 *    │  └─ Current profile data for form
 *    ├─ PUT /api/profile
 *    │  └─ All settings update forms
 *    └─ DELETE /api/profile
 *       └─ Delete account button
 */
