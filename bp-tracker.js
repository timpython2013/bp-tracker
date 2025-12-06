// Blood Pressure Tracker - Phase 1 Professional Version
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');

const DATA_FILE = 'bp_data.csv';

// Initialize CSV file with headers if it doesn't exist
function initializeCSV() {
  if (!fs.existsSync(DATA_FILE)) {
    const headers = 'DateTime,Systolic,Diastolic,HeartRate,Location,Notes\n';
    fs.writeFileSync(DATA_FILE, headers);
    console.log(chalk.green('📊 Created new data file: bp_data.csv\n'));
  }
}

// Format current date/time
function getCurrentDateTime() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

// Escape CSV fields
function escapeCSV(field) {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

// Get BP category
function getBPCategory(systolic, diastolic) {
  const sys = parseInt(systolic);
  const dia = parseInt(diastolic);
  
  if (sys < 120 && dia < 80) return { text: 'Normal', color: 'green', icon: '✅' };
  if (sys < 130 && dia < 80) return { text: 'Elevated', color: 'yellow', icon: '⚠️' };
  if (sys < 140 || dia < 90) return { text: 'High BP Stage 1', color: 'yellow', icon: '⚠️' };
  return { text: 'High BP Stage 2', color: 'red', icon: '🚨' };
}

// Add new BP entry
async function addEntry() {
  console.log(chalk.cyan.bold('\n=== New Blood Pressure Entry ===\n'));
  
  const defaultDateTime = getCurrentDateTime();
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'dateTime',
      message: 'Date/Time (press Enter for now):',
      default: defaultDateTime
    },
    {
      type: 'number',
      name: 'systolic',
      message: 'Systolic (mmHg):',
      validate: (value) => {
        if (value >= 70 && value <= 250) return true;
        return 'Please enter a value between 70 and 250';
      }
    },
    {
      type: 'number',
      name: 'diastolic',
      message: 'Diastolic (mmHg):',
      validate: (value) => {
        if (value >= 40 && value <= 150) return true;
        return 'Please enter a value between 40 and 150';
      }
    },
    {
      type: 'number',
      name: 'heartRate',
      message: 'Heart Rate (bpm):',
      validate: (value) => {
        if (value >= 30 && value <= 200) return true;
        return 'Please enter a value between 30 and 200';
      }
    },
    {
      type: 'input',
      name: 'location',
      message: 'Location:',
      default: 'Home'
    },
    {
      type: 'input',
      name: 'notes',
      message: 'Notes (optional):',
      default: ''
    }
  ]);
  
  // Save to CSV
  const row = `${answers.dateTime},${answers.systolic},${answers.diastolic},${answers.heartRate},${escapeCSV(answers.location)},${escapeCSV(answers.notes)}\n`;
  fs.appendFileSync(DATA_FILE, row);
  
  console.log(chalk.green.bold('\n✅ Entry saved successfully!\n'));
  
  // Show summary
  const category = getBPCategory(answers.systolic, answers.diastolic);
  console.log(chalk.bold('Summary:'));
  console.log(`  BP: ${chalk.cyan(answers.systolic + '/' + answers.diastolic)} mmHg - ${chalk[category.color](category.icon + ' ' + category.text)}`);
  console.log(`  Heart Rate: ${chalk.cyan(answers.heartRate)} bpm\n`);
}

// View all entries
function viewEntries() {
  if (!fs.existsSync(DATA_FILE)) {
    console.log(chalk.yellow('\n📊 No entries found. Add your first entry!\n'));
    return;
  }
  
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  const lines = data.split('\n').filter(line => line.trim());
  
  if (lines.length <= 1) {
    console.log(chalk.yellow('\n📊 No entries found. Add your first entry!\n'));
    return;
  }
  
  console.log(chalk.cyan.bold('\n=== Blood Pressure History ===\n'));
  
  // Print header
  console.log(chalk.bold(lines[0]));
  console.log(chalk.gray('─'.repeat(80)));
  
  // Print entries
  for (let i = 1; i < lines.length; i++) {
    console.log(lines[i]);
  }
  
  console.log(chalk.gray('─'.repeat(80)));
  console.log(chalk.green(`\nTotal entries: ${lines.length - 1}\n`));
}

// View statistics
function viewStats() {
  if (!fs.existsSync(DATA_FILE)) {
    console.log(chalk.yellow('\n📊 No data available yet.\n'));
    return;
  }
  
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  const lines = data.split('\n').filter(line => line.trim()).slice(1); // Skip header
  
  if (lines.length === 0) {
    console.log(chalk.yellow('\n📊 No data available yet.\n'));
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
  
  console.log(chalk.cyan.bold('\n=== Statistics ===\n'));
  console.log(chalk.bold(`Total Readings: ${chalk.green(count)}`));
  console.log(chalk.bold('\nBlood Pressure (mmHg):'));
  console.log(`  Average: ${chalk.cyan(Math.round(systolicSum/count) + '/' + Math.round(diastolicSum/count))}`);
  console.log(`  Highest: ${chalk.red(systolicMax + '/' + diastolicMax)}`);
  console.log(`  Lowest:  ${chalk.green(systolicMin + '/' + diastolicMin)}`);
  console.log(chalk.bold('\nHeart Rate (bpm):'));
  console.log(`  Average: ${chalk.cyan(Math.round(hrSum/count))}`);
  console.log(`  Highest: ${chalk.red(hrMax)}`);
  console.log(`  Lowest:  ${chalk.green(hrMin)}\n`);
}

// Main menu
async function showMenu() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: chalk.bold('What would you like to do?'),
      choices: [
        { name: '➕ Add new entry', value: 'add' },
        { name: '📋 View all entries', value: 'view' },
        { name: '📊 View statistics', value: 'stats' },
        { name: '🚪 Exit', value: 'exit' }
      ]
    }
  ]);
  
  switch(answer.choice) {
    case 'add':
      await addEntry();
      await showMenu();
      break;
    case 'view':
      viewEntries();
      await showMenu();
      break;
    case 'stats':
      viewStats();
      await showMenu();
      break;
    case 'exit':
      console.log(chalk.green.bold('\n👋 Goodbye! Stay healthy!\n'));
      process.exit(0);
      break;
  }
}

// Start the application
console.log(chalk.blue.bold('\n💉 Blood Pressure Tracker v1.1 (Phase 1)\n'));
initializeCSV();
showMenu();
