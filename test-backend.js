console.log('Starting server...');

import express from 'express';
import cors from 'cors';

console.log('Basic imports successful');

import nodemailer from 'nodemailer';

console.log('Nodemailer import successful');

const app = express();
app.use(cors());
app.use(express.json());

console.log('Express configured');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 587,
  secure: false,
  auth: {
    user: 'info@cabeceo.hu',
    pass: 'Clobufclobuf01#'
  }
});

console.log('Transporter created successfully');

app.post('/api/contact', (req, res) => {
  console.log('Contact endpoint hit:', req.body);
  res.json({ success: true, message: 'Test response' });
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

console.log('Server setup complete');
