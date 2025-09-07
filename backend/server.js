


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const path = require('path');
const fs = require('fs');


const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');


const projectRoutes = require('./routes/projectRoutes'); // project routes  
 const resumeRoutes = require('./routes/resumeRoutes'); // resume routes
//  const skillRoutes = require('./routes/skillRoutes'); // skill routes
//  const calendarRoutes = require('./routes/calendarRoute'); // calendar routes
const originalsDir = path.join(__dirname, 'uploads', 'originals');
const formattedDir = path.join(__dirname, 'uploads', 'formatted');


if (!fs.existsSync(originalsDir)) {
    fs.mkdirSync(originalsDir, { recursive: true });
    console.log(`✅ Created directory: ${originalsDir}`);
}
if (!fs.existsSync(formattedDir)) {
    fs.mkdirSync(formattedDir, { recursive: true });
    console.log(`✅ Created directory: ${formattedDir}`);
}








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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Mount routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api',projectRoutes)
// app.use('/resumes', resumeRoutes); // mount resume routes
app.use('/api/resumes', resumeRoutes);
// app.use('/api', skillRoutes); // mount skill routes
// app.use("/api/calendar", calendarRoutes);

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err.stack);
  res.status(500).send('Something went wrong!');
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

