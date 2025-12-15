// REST API Server for BP Tracker
const express = require('express');
const db = require('./database/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Blood Pressure Tracker API',
    version: '2.0',
    endpoints: {
      'GET /api/entries': 'Get all entries',
      'GET /api/entries/:id': 'Get entry by ID',
      'POST /api/entries': 'Add new entry',
      'DELETE /api/entries/:id': 'Delete entry',
      'GET /api/stats': 'Get statistics'
    }
  });
});

// Get all entries
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await db.getAllEntries();
    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get entry by ID
app.get('/api/entries/:id', async (req, res) => {
  try {
    const entry = await db.getEntryById(req.params.id);
    if (entry) {
      res.json({ success: true, data: entry });
    } else {
      res.status(404).json({ success: false, error: 'Entry not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new entry
app.post('/api/entries', async (req, res) => {
  try {
    const { dateTime, systolic, diastolic, heartRate, location, notes } = req.body;
    
    // Validation
    if (!dateTime || !systolic || !diastolic || !heartRate) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: dateTime, systolic, diastolic, heartRate' 
      });
    }
    
    if (systolic < 70 || systolic > 250) {
      return res.status(400).json({ 
        success: false, 
        error: 'Systolic must be between 70 and 250' 
      });
    }
    
    if (diastolic < 40 || diastolic > 150) {
      return res.status(400).json({ 
        success: false, 
        error: 'Diastolic must be between 40 and 150' 
      });
    }
    
    if (heartRate < 30 || heartRate > 200) {
      return res.status(400).json({ 
        success: false, 
        error: 'Heart rate must be between 30 and 200' 
      });
    }
    
    const entry = await db.addEntry({
      dateTime,
      systolic,
      diastolic,
      heartRate,
      location: location || 'Unknown',
      notes: notes || ''
    });
    
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete entry
app.delete('/api/entries/:id', async (req, res) => {
  try {
    const result = await db.deleteEntry(req.params.id);
    if (result.deleted > 0) {
      res.json({ success: true, message: 'Entry deleted' });
    } else {
      res.status(404).json({ success: false, error: 'Entry not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`);
  console.log(`📊 View endpoints: http://localhost:${PORT}/`);
});
