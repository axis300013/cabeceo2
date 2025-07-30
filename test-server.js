console.log('Testing Node.js execution...');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

// Simple server test
import express from 'express';
const app = express();

app.listen(3001, () => {
  console.log('✅ Simple test server running on http://localhost:3001');
});

setTimeout(() => {
  console.log('Server should be running now...');
}, 1000);
