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
