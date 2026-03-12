# Habit Automation Platform

A modern habit and activity tracking platform designed to simplify personal productivity using a clean dashboard and Telegram automation.

The platform allows users to track habits, monitor progress, and log activities through both a web interface and simple Telegram commands. By combining a web dashboard with messaging-based automation, the system reduces friction in daily habit tracking and makes logging progress quick and accessible.

---

# Overview

This project is a lightweight personal productivity system built using a modern full-stack architecture.

Users can manage habits, track daily activities, and view progress through a responsive dashboard. A Telegram bot integration enables quick updates without opening the web interface, allowing users to log activities directly from their messaging app.

The system is designed to be modular and extensible so additional features such as analytics, reminders, or integrations can be added easily.

---

# Tech Stack

### Frontend

* Next.js (App Router)
* TailwindCSS
* shadcn/ui

### Backend

* Node.js API
* Hosted on Oracle Cloud Always Free Tier

### Database

* Supabase PostgreSQL

### Authentication

* BetterAuth

### Automation

* Telegram Bot

### Hosting

* Vercel (Frontend)
* Oracle Cloud (Backend)
* Supabase (Database)

---

# Features

## Habit Tracking

* Create and manage habits
* Log daily progress
* Track consistency over time
* View activity history

## Dashboard

* Habit overview
* Daily progress tracking
* Activity timeline
* Habit statistics

## Telegram Bot Integration

Users can update habits quickly using Telegram commands.

Example commands:

/done gym
/done reading
/water 2L
/sleep 7h

The bot sends requests to the backend API which updates the database and reflects changes on the dashboard.

## Authentication

Secure login and user management using BetterAuth.

Features include:

* Protected routes
* Session management
* User-specific habit tracking

---

# System Architecture

Telegram Bot
│
▼
Backend API (Oracle Cloud)
│
▼
Supabase PostgreSQL
│
▼
Next.js Dashboard (Vercel)

---

# Project Structure (Planned)

src/

components/
UI components and reusable elements

app/
Next.js routes and pages

lib/
Utility functions and API helpers

server/
Backend API logic

bot/
Telegram bot integration

---

# Database Schema (Initial Plan)

Users

* id
* email
* created_at

Habits

* id
* user_id
* name
* description
* created_at

HabitLogs

* id
* habit_id
* date
* status
* source (dashboard | telegram)

ActivityLog

* id
* user_id
* action
* source
* created_at

---

# Development Setup

Clone the repository

git clone https://github.com/yourusername/habit-automation-platform.git

Install dependencies

npm install

Run development server

npm run dev

---

# Roadmap

Phase 1

* Project setup
* Authentication
* Habit CRUD
* Dashboard UI

Phase 2

* Telegram bot integration
* Habit logging via Telegram

Phase 3

* Habit analytics
* Streak tracking
* Charts and insights

Phase 4

* Notifications
* Reminders
* Advanced analytics

---

# Future Improvements

* AI habit recommendations
* Mobile support
* Push notifications
* Data export
* Multi-user support

---

# License

MIT License

---

# Goal

The goal of this project is to build a simple but powerful personal tracking system that combines a modern dashboard with messaging automation to make habit tracking effortless.
