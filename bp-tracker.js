// Blood Pressure Tracker
// Save as: bp-tracker.js

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const DATA_FILE = 'bp_data.csv';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Initialize CSV file with headers if it doesn't exist
function initializeCSV() {
  if (!fs.existsSync(DATA_FILE)) {
    const headers = 'DateTime,Systolic,Diastolic,HeartRate,Location,Notes\n';
    fs.writeFileSync(DATA_FILE, headers);
    console.log('📊 Created new data file: bp_data.csv\n');
  }
}

// Format current date/time
function getCurrentDateTime() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

// Validate numeric input
function isValidNumber(value, min, max) {
  const num = parseInt(value);
  return !isNaN(num) && num >= min && num <= max;
}

// Escape CSV fields
function escapeCSV(field) {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

// Add new BP entry
async function addEntry() {
  console.log('\n=== New Blood Pressure Entry ===\n');
  
  // Date/Time
  const defaultDateTime = getCurrentDateTime();
  console.log(`Default: ${defaultDateTime}`);
  const dateTime = await ask('Date/Time (press Enter for now, or enter YYYY-MM-DD HH:MM:SS): ');
  const finalDateTime = dateTime || defaultDateTime;
  
  // Systolic
  let systolic;
  while (true) {
    systolic = await ask('Systolic (mmHg, 70-250): ');
    if (isValidNumber(systolic, 70, 250)) break;
    console.log('❌ Please enter a valid number between 70 and 250');
  }
  
  // Diastolic
  let diastolic;
  while (true) {
    diastolic = await ask('Diastolic (mmHg, 40-150): ');
    if (isValidNumber(diastolic, 40, 150)) break;
    console.log('❌ Please enter a valid number between 40 and 150');
  }
  
  // Heart Rate
  let heartRate;
  while (true) {
    heartRate = await ask('Heart Rate (bpm, 30-200): ');
    if (isValidNumber(heartRate, 30, 200)) break;
    console.log('❌ Please enter a valid number between 30 and 200');
  }
  
  // Location
  const location = await ask('Location (e.g., Home, Doctor\'s Office): ');
  
  // Notes
  const notes = await ask('Notes (optional): ');
  
  // Save to CSV
  const row = `${finalDateTime},${systolic},${diastolic},${heartRate},${escapeCSV(location)},${escapeCSV(notes)}\n`;
  fs.appendFileSync(DATA_FILE, row);
  
  console.log('\n✅ Entry saved successfully!\n');
  
  // Show summary
  const bp = `${systolic}/${diastolic}`;
  let category = '';
  if (parseInt(systolic) < 120 && parseInt(diastolic) < 80) category = '✅ Normal';
  else if (parseInt(systolic) < 130 && parseInt(diastolic) < 80) category = '⚠️  Elevated';
  else if (parseInt(systolic) < 140 || parseInt(diastolic) < 90) category = '⚠️  High BP Stage 1';
  else category = '🚨 High BP Stage 2';
  
  console.log(`BP: ${bp} mmHg - ${category}`);
  console.log(`Heart Rate: ${heartRate} bpm\n`);
}

// View all entries
function viewEntries() {
  if (!fs.existsSync(DATA_FILE)) {
    console.log('\n📊 No entries found. Add your first entry!\n');
    return;
  }
  
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  const lines = data.split('\n').filter(line => line.trim());
  
  if (lines.length <= 1) {
    console.log('\n📊 No entries found. Add your first entry!\n');
    return;
  }
  
  console.log('\n=== Blood Pressure History ===\n');
  console.log(lines.join('\n'));
  console.log(`\nTotal entries: ${lines.length - 1}\n`);
}

// View statistics
function viewStats() {
  if (!fs.existsSync(DATA_FILE)) {
    console.log('\n📊 No data available yet.\n');
    return;
  }
  
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  const lines = data.split('\n').filter(line => line.trim()).slice(1); // Skip header
  
  if (lines.length === 0) {
    console.log('\n📊 No data available yet.\n');
    return;
  }
  
  let systolicSum = 0, diastolicSum = 0, hrSum = 0;
  let systolicMax = 0, diastolicMax = 0, hrMax = 0;
  let systolicMin = 999, diastolicMin = 999, hrMin = 999;
  
  lines.forEach(line => {
    const parts = line.split(',');
    const sys = parseInt(parts[1]);
    const dia = parseInt(parts[2]);
    const hr = parseInt(parts[3]);
    
    systolicSum += sys;
    diastolicSum += dia;
    hrSum += hr;
    
    systolicMax = Math.max(systolicMax, sys);
    diastolicMax = Math.max(diastolicMax, dia);
    hrMax = Math.max(hrMax, hr);
    
    systolicMin = Math.min(systolicMin, sys);
    diastolicMin = Math.min(diastolicMin, dia);
    hrMin = Math.min(hrMin, hr);
  });
  
  const count = lines.length;
  
  console.log('\n=== Statistics ===\n');
  console.log(`Total Readings: ${count}`);
  console.log(`\nBlood Pressure (mmHg):`);
  console.log(`  Average: ${Math.round(systolicSum/count)}/${Math.round(diastolicSum/count)}`);
  console.log(`  Highest: ${systolicMax}/${diastolicMax}`);
  console.log(`  Lowest:  ${systolicMin}/${diastolicMin}`);
  console.log(`\nHeart Rate (bpm):`);
  console.log(`  Average: ${Math.round(hrSum/count)}`);
  console.log(`  Highest: ${hrMax}`);
  console.log(`  Lowest:  ${hrMin}\n`);
}

// Main menu
async function showMenu() {
  console.log('=== Blood Pressure Tracker ===');
  console.log('1. Add new entry');
  console.log('2. View all entries');
  console.log('3. View statistics');
  console.log('4. Exit');
  
  const choice = await ask('\nSelect option (1-4): ');
  
  switch(choice) {
    case '1':
      await addEntry();
      await showMenu();
      break;
    case '2':
      viewEntries();
      await showMenu();
      break;
    case '3':
      viewStats();
      await showMenu();
      break;
    case '4':
      console.log('\n👋 Goodbye! Stay healthy!\n');
      rl.close();
      break;
    default:
      console.log('\n❌ Invalid option. Please try again.\n');
      await showMenu();
  }
}

// Start the application
console.log('\n💉 Blood Pressure Tracker v1.0\n');
initializeCSV();
showMenu();
