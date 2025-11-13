# CricHeroes - IPL Points Table Calculator

A full-stack web application for calculating IPL (Indian Premier League) team performance metrics, including points table updates, Net Run Rate (NRR) calculations, and strategic insights for match outcomes.

## 📋 Project Overview

CricHeroes is a Node.js + React application that simulates IPL match scenarios and calculates the impact on team standings. It features:

- **Backend:** Express.js API with in-memory data storage (no database required)
- **Frontend:** React 19 with Redux for state management and Vite for fast development
- **Testing:** Jest (backend) + Vitest (frontend) with comprehensive unit and integration tests
- **Data:** JSON-based in-memory storage in `backend/data/`

## 🏗️ Project Structure

```
cricheros-proj/
├── backend/                          # Node.js/Express API
│   ├── __tests__/                    # Test files
│   │   ├── server.test.js           # API endpoint tests
│   │   ├── iplCalculations.test.js  # Performance calculation tests
│   │   └── helpers.test.js          # Helper function unit tests
│   ├── controllers/                  # Route handlers
│   │   ├── calculateController.js
│   │   ├── pointsTableController.js
│   │   └── teamsController.js
│   ├── routes/                       # API route definitions
│   │   ├── calculateRoutes.js
│   │   ├── pointsTableRoutes.js
│   │   └── teamsRoutes.js
│   ├── utils/
│   │   └── iplCalculations.js       # Core calculation logic
│   ├── data/                         # In-memory JSON data
│   │   ├── pointsTable.json
│   │   └── teams.json
│   ├── app.js                        # Express app setup
│   ├── server.js                     # Server entry point
│   └── package.json
│
├── frontend/                         # React + Vite app
│   ├── src/
│   │   ├── pages/__tests__/         # React component tests
│   │   │   └── Homepage.test.jsx
│   │   ├── pages/
│   │   │   ├── Homepage.jsx         # Main form page
│   │   │   └── ResultPage.jsx       # Results display
│   │   ├── components/              # Reusable components
│   │   ├── api/
│   │   │   └── cricApi.js           # Redux Toolkit query hooks
│   │   ├── app/
│   │   │   └── store.js             # Redux store
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # React DOM render
│   ├── vitest.config.js             # Vitest configuration
│   ├── vite.config.js               # Vite configuration
│   └── package.json
│
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v16+ (LTS recommended)
- **npm:** v7+
- **Git:** For version control

### Installation

#### 1. Clone or Extract the Project

```powershell
cd D:\TEJASH PROJ\cricheros-proj
```

#### 2. Install Backend Dependencies

```powershell
cd backend
npm install
```

This installs:
- `express`: Web framework
- `cors`: Cross-origin resource sharing
- `jest`: Testing framework (dev)
- `supertest`: HTTP testing library (dev)
- `nodemon`: Auto-restart on file changes (dev)

#### 3. Install Frontend Dependencies

```powershell
cd ..\frontend
npm install
```

This installs:
- `react`, `react-dom`: UI library
- `react-router-dom`: Client-side routing
- `@reduxjs/toolkit`, `react-redux`: State management
- `axios`: HTTP client
- `vite`: Build tool
- `vitest`: Test runner (dev)
- `@testing-library/react`: React testing utilities (dev)
- `@testing-library/jest-dom`: DOM matchers (dev)

## 🔧 Running the Application

### Start Backend

```powershell
cd backend
npm run dev
```

Expected output:
```
Server running on port 5000
```

The API will be available at `http://localhost:5000`

### Start Frontend (in a new terminal)

```powershell
cd frontend
npm run dev
```

Expected output:
```
Local:   http://localhost:5173/
Press q to quit, h for help
```

Open `http://localhost:5173` in your browser.

### Build for Production

**Backend** (if needed):
```powershell
cd backend
npm run start
```

**Frontend**:
```powershell
cd frontend
npm run build
npm run preview
```

## ✅ Testing

### Run Backend Tests

```powershell
cd backend
npm install  # if not already done
npm test
```

**Test Coverage:**
- `server.test.js`: API endpoints (GET /api/points-table, GET /api/teams, POST /api/calculate with validation)
- `iplCalculations.test.js`: Performance range calculations
- `helpers.test.js`: Unit tests for NRR, ball conversion, match simulation logic

**Example Output:**
```
 PASS  __tests__/server.test.js
 PASS  __tests__/iplCalculations.test.js
 PASS  __tests__/helpers.test.js

Test Suites: 3 passed (3)
Tests: 12 passed (12)
Snapshots: 0 total
Time: 15.234s
```

### Run Frontend Tests

```powershell
cd frontend
npm install  # if not already done
npm test
```

**Test Coverage:**
- `Homepage.test.jsx`: Renders title, form controls, and mocked API hooks

**Example Output:**
```
 ✓ src/pages/__tests__/Homepage.test.jsx (1 test) 25ms

Test Files: 1 passed (1)
Tests: 1 passed (1)
```

### Run All Tests (Recommended)

Create a script in project root to run both:

```powershell
# From project root
cd backend; npm test; cd ..\frontend; npm test
```

## 📡 API Endpoints

### Base URL
`http://localhost:5000`

### 1. Get Points Table
```http
GET /api/points-table
```

**Response:**
```json
[
  {
    "team": "Chennai Super Kings",
    "matches": 7,
    "wins": 5,
    "losses": 2,
    "nrr": 0.771,
    "runsFor": 1130,
    "ballsFaced": 133.1667,
    "runsAgainst": 1071,
    "ballsBowled": 138.8333,
    "points": 10
  }
]
```

### 2. Get Teams List
```http
GET /api/teams
```

**Response:**
```json
["Chennai Super Kings", "Royal Challengers Bangalore", "Delhi Capitals", ...]
```

### 3. Calculate Performance Range
```http
POST /api/calculate
Content-Type: application/json

{
  "team": "Chennai Super Kings",
  "opponent": "Royal Challengers Bangalore",
  "overs": 20,
  "runs": 160,
  "toss": "bat",
  "desiredPosition": 2
}
```

**Response:**
```json
{
  "team": "Chennai Super Kings",
  "opponent": "Royal Challengers Bangalore",
  "overs": 20,
  "calculationResult": {
    "minRestrictRuns": 145.5,
    "maxRestrictRuns": 175.0,
    "overs": 20,
    "revisedNRRMin": 0.125,
    "revisedNRRMax": 0.385
  },
  "performanceRange": {
    "minRestrictRuns": 145.5,
    "maxRestrictRuns": 175.0,
    "runs": 160,
    "overs": 20
  },
  "nrrRange": {
    "min": 0.125,
    "max": 0.385
  },
  "pointsTable": [...]
}
```

**Parameters:**
- `team` (string, required): Team name (must exist in pointsTable)
- `opponent` (string, required): Opponent team name
- `overs` (number, required): Match overs (e.g., 20 for T20)
- `runs` (number, required): Runs scored (batting) or to chase (bowling)
- `toss` (string, required): "bat" or "bowl"
- `desiredPosition` (number, required): Target position (1-5)

## 📊 Data Structure

### Points Table (`backend/data/pointsTable.json`)
Each team has:
- `team`: Team name (string)
- `matches`: Total matches played (number)
- `wins`: Total wins (number)
- `losses`: Total losses (number)
- `points`: Total points (number)
- `nrr`: Net Run Rate (decimal)
- `runsFor`: Runs scored (number)
- `runsAgainst`: Runs conceded (number)
- `ballsFaced`: Balls faced (number, in balls, not overs)
- `ballsBowled`: Balls bowled (number)

### Teams (`backend/data/teams.json`)
Simple array of team names:
```json
["Chennai Super Kings", "Royal Challengers Bangalore", ...]
```

## 🔌 Key Features

### Backend Features
- **Express REST API** with CORS enabled
- **In-memory data storage** (no database, all data in JSON files)
- **NRR Calculation** using complex match simulation
- **Performance range detection** for team standings
- **Input validation** and error handling

### Frontend Features
- **React 19** with hooks for state management
- **Redux Toolkit** for global state
- **React Router** for client-side navigation
- **Form validation** (team selection, overs, runs, toss)
- **Real-time calculations** via API calls
- **Session storage** for result persistence

### Testing Features
- **Jest** for backend unit and integration tests
- **Vitest** for frontend component tests
- **Testing Library** for React component testing
- **Supertest** for HTTP API testing
- **Mocked API hooks** in React tests

## 🛠️ Troubleshooting

### Port Already in Use
If port 5000 is busy:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

For frontend port 5173:
```powershell
# Update vite.config.js server.port
```

### Tests Failing
**Backend:**
```powershell
cd backend
npm install --save-dev jest@^29.5.0 supertest@^6.4.0
npm test
```

**Frontend:**
```powershell
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
npm test
```

### API Not Responding
1. Ensure backend is running: `npm run dev` in `/backend`
2. Check `frontend/src/api/cricApi.js` for correct base URL (should be `http://localhost:5000`)
3. Verify CORS is enabled in `backend/app.js`

## 📚 Code Conventions

- **Backend:** CommonJS (require/module.exports)
- **Frontend:** ES Modules (import/export)
- **Naming:** camelCase for functions/variables, PascalCase for React components
- **Comments:** Added for complex logic (NRR calculations, binary search)
- **No external databases:** All data stored in `backend/data/` JSON files

## 🔐 Notes

- **No Authentication:** This is a demo app; production should add auth
- **No Rate Limiting:** Add express-rate-limit for production
- **CORS:** Allows requests from `http://localhost:3000` and `http://localhost:5173`
- **Data Persistence:** Changes are in-memory only; refresh resets data

## 📝 Assignment Requirements Met

✅ **Backend:** Node.js (Express.js)  
✅ **Frontend:** React 19 with Redux  
✅ **Tests:** Jest (backend) + Vitest (frontend) with unit and integration tests  
✅ **Database:** None—in-memory JSON storage  
✅ **Code Quality:** Modular structure, clean naming, comments where needed  
✅ **Test Files:** Separate `__tests__` folders in both backend and frontend  

## 🤝 Development Notes

- Use `npm run dev` for development with hot reload (backend/frontend)
- Use `npm test` to run tests in watch mode
- Update `backend/data/` JSON files to modify team/points data
- Backend auto-exports all necessary functions (see `iplCalculations.js`)

## 📄 License

ISC (as specified in package.json)

---

**Created:** November 2025  
**Project:** CricHeroes - IPL Points Table Calculator  
**Stack:** Node.js + Express + React 19 + Redux + Vite
