


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const projectRoutes = require('./routes/projectRoutes'); // project routes  
 const resumeRoutes = require('./routes/resumeRoutes'); // resume routes


const {
  FRONTEND_URL,
  SESSION_SECRET,
} = process.env;

const app = express();
app.use(express.json());
// CORS
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Session
app.use(cookieSession({
  name: 'session',
  keys: [SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000,
  // maxAge: 3 * 60 * 1000 ,// 3 minutes in milliseconds

  sameSite: "lax",
  secure: false
}));

// Mount routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api',projectRoutes)
// app.use('/resumes', resumeRoutes); // mount resume routes
app.use('/api/resumes', resumeRoutes);

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
