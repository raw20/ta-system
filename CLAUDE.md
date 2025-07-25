# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Main Development Workflow
- `npm run dev` - Start Vite development server on http://localhost:5173
- `npm run electron:dev` - Start both Vite dev server and Electron app in development mode
- `npm run electron` - Launch Electron app (requires built frontend)
- `npm run build` - Build TypeScript and bundle with Vite
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run electron:build` - Build production Electron app

### Development Flow
For active development, use `npm run electron:dev` which concurrently runs the Vite dev server and launches Electron with development configuration.

## Architecture Overview

### High-Level Structure
This is an **Electron-based desktop application** for employee time and attendance (TA) management system. The application consists of:

**Frontend Stack:**
- React 19 with TypeScript
- React Router 7 for routing
- Tailwind CSS 4 for styling  
- Vite as build tool
- Jotai for state management (atom-based)

**Backend/Database:**
- Electron main process handles IPC and database operations
- SQLite database using better-sqlite3
- Database located at `electron/db/ta-app.db`
- Schema defined in `electron/db/schema.sql`

### Key Architectural Patterns

**1. Electron IPC Communication**
- Main process (`electron/main.js`) handles database operations
- IPC handlers for CRUD operations: `employees:get-all`, `employees:create`, `employees:update`, `employees:delete`
- Preload script (`electron/preload.js`) exposes APIs to renderer process

**2. Database Design**
The SQLite schema supports comprehensive employee time management:
- `employees` - Employee information (emp_code, name, position, department)
- `monthly_work_plans` - Monthly work planning with day-by-day status (day_01 through day_31)
- `work_schedules` - Daily work assignments with shift numbers (1-9 shifts)
- `night_work_hours` - Night shift hour tracking
- `monthly_attendance` - Attendance records with JSON-based daily data
- `annual_leave_status` - Annual leave tracking and balance
- `work_codes` - Work status codes (M=Manager, P=Parking, C=Cart, etc.)

**3. Frontend Architecture**
- **Layout System**: Main layout with sidebar navigation and header
- **Route Structure**: Flat routing (not nested) - pages like `/employees/add`, `/employees/edit`
- **Page Organization**: Each major feature has dedicated pages (Dashboard, EmployeeManagement, MonthlyPlan, etc.)
- **Type Safety**: Comprehensive TypeScript interfaces in `src/types/database.ts`

**4. Employee Position Hierarchy**
The system recognizes Korean position types: "파트장" | "선임" | "조장" | "정규사원" | "단시간사원"

### Database Schema Key Points
- Uses `emp_code` as primary employee identifier (format: entry date like "202502020")
- Monthly plans store day-by-day status in individual columns (day_01, day_02, etc.)
- Work shifts numbered 1-9 with specific time slots
- Comprehensive tracking of work hours, overtime, night shifts, and leave types
- Employee status tracking: "active" | "inactive"

### Key File Locations
- **Database**: `electron/db/database.js` (connection management), `electron/db/schema.sql` (schema)
- **Types**: `src/types/database.ts` (comprehensive TypeScript interfaces)
- **Routing**: `src/router.tsx` (React Router configuration)
- **Layout**: `src/components/Layout/Layout.tsx` with Sidebar and Header components
- **Main Entry**: `src/main.tsx` (React app entry point)

### Development Notes
- Application runs in development on localhost:5173 
- Uses WAL mode for SQLite (better concurrency)
- Electron preload script provides secure IPC bridge
- Tailwind CSS 4 with Vite plugin integration
- No test framework currently configured