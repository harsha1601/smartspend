const { spawn } = require('child_process');
const path = require('path');

console.log('================================================================');
console.log('🌟 Starting SmartSpend: Personal Finance & E-Commerce Suite');
console.log('   Student 1: Frontend (Vite + React) -> http://localhost:5173');
console.log('   Student 2: Backend (Express + MongoDB) -> http://localhost:5000');
console.log('   Student 3: E-Commerce & QA Suite (Integrated & Ready)');
console.log('================================================================\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 1. Start Backend Server
const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'student2-backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend Vite Server
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'student1-frontend'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\nStopping all SmartSpend servers...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
