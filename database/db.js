// Database setup and operations
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'bp_tracker.db');

// Create/open database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Create table if it doesn't exist
function initializeDatabase() {
  const sql = `
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date_time TEXT NOT NULL,
      systolic INTEGER NOT NULL,
      diastolic INTEGER NOT NULL,
      heart_rate INTEGER NOT NULL,
      location TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(sql, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    }
  });
}

// Add new entry
function addEntry(entry) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO entries (date_time, systolic, diastolic, heart_rate, location, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [
      entry.dateTime,
      entry.systolic,
      entry.diastolic,
      entry.heartRate,
      entry.location,
      entry.notes
    ], function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, ...entry });
    });
  });
}

// Get all entries
function getAllEntries() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM entries ORDER BY date_time DESC';
    
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Get entry by ID
function getEntryById(id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM entries WHERE id = ?';
    
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Delete entry
function deleteEntry(id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM entries WHERE id = ?';
    
    db.run(sql, [id], function(err) {
      if (err) reject(err);
      else resolve({ deleted: this.changes });
    });
  });
}

// Get statistics
function getStats() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        COUNT(*) as total,
        AVG(systolic) as avg_systolic,
        AVG(diastolic) as avg_diastolic,
        AVG(heart_rate) as avg_heart_rate,
        MAX(systolic) as max_systolic,
        MAX(diastolic) as max_diastolic,
        MAX(heart_rate) as max_heart_rate,
        MIN(systolic) as min_systolic,
        MIN(diastolic) as min_diastolic,
        MIN(heart_rate) as min_heart_rate
      FROM entries
    `;
    
    db.get(sql, [], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

module.exports = {
  addEntry,
  getAllEntries,
  getEntryById,
  deleteEntry,
  getStats
};
