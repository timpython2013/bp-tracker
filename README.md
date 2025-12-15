# Blood Pressure Tracker

A command-line application for tracking and monitoring blood pressure readings built with Node.js.

## Features

- ✅ Track systolic, diastolic, heart rate, location, and notes
- ✅ Data validation for all health metrics
- ✅ CSV storage for easy data portability
- ✅ View complete history of all entries
- ✅ Calculate statistics (averages, highs, lows)
- ✅ Automatic BP categorization (Normal, Elevated, High BP Stage 1/2)
- ✅ Simple and intuitive CLI interface

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

## Usage

Run the application:
```bash
node bp-tracker.js
```

Follow the interactive prompts to:
- Add new blood pressure entries
- View your complete history
- See statistics and trends

## Data Storage

All entries are stored in `bp_data.csv` in the following format:
```
DateTime,Systolic,Diastolic,HeartRate,Location,Notes
```

## Requirements

- Node.js 12.x or higher
- npm

## Future Enhancements

- Phase 2: REST API with SQLite database
- Phase 3: Web dashboard with visualization
- Export to PDF reports
- Multi-user support

## Author

Built as a learning project to demonstrate Node.js fundamentals.

---

## Phase 2: REST API (Current)

### API Server

The application now includes a REST API built with Express.js and SQLite database.

**Start the API server:**
```bash
node api-server.js
```

Server runs on `http://localhost:3000`

### API Endpoints

#### Get all entries
```bash
GET /api/entries
```

#### Get specific entry
```bash
GET /api/entries/:id
```

#### Add new entry
```bash
POST /api/entries
Content-Type: application/json

{
  "dateTime": "2024-12-07 14:30:00",
  "systolic": 120,
  "diastolic": 80,
  "heartRate": 72,
  "location": "Home",
  "notes": "Optional notes"
}
```

#### Delete entry
```bash
DELETE /api/entries/:id
```

#### Get statistics
```bash
GET /api/stats
```

### Testing with curl

**Add an entry:**
```bash
curl -X POST http://localhost:3000/api/entries \
  -H "Content-Type: application/json" \
  -d '{"dateTime":"2024-12-07 14:30:00","systolic":120,"diastolic":80,"heartRate":72,"location":"Home","notes":"Test"}'
```

**Get all entries:**
```bash
curl http://localhost:3000/api/entries
```

**Get statistics:**
```bash
curl http://localhost:3000/api/stats
```

### Database

Data is stored in SQLite database at `database/bp_tracker.db`

### Environment Variables

Copy `.env.example` to `.env` and configure:
- `PORT` - API server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
