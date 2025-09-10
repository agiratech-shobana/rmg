


// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const cookieSession = require('cookie-session');
// const path = require('path');
// const fs = require('fs');


// const authRoutes = require('./routes/auth');
// const apiRoutes = require('./routes/api');


// const projectRoutes = require('./routes/projectRoutes'); // project routes  
//  const resumeRoutes = require('./routes/resumeRoutes'); // resume routes
// //  const skillRoutes = require('./routes/skillRoutes'); // skill routes
// //  const calendarRoutes = require('./routes/calendarRoute'); // calendar routes
// const originalsDir = path.join(__dirname, 'uploads', 'originals');
// const formattedDir = path.join(__dirname, 'uploads', 'formatted');


// if (!fs.existsSync(originalsDir)) {
//     fs.mkdirSync(originalsDir, { recursive: true });
//     console.log(`✅ Created directory: ${originalsDir}`);
// }
// if (!fs.existsSync(formattedDir)) {
//     fs.mkdirSync(formattedDir, { recursive: true });
//     console.log(`✅ Created directory: ${formattedDir}`);
// }





// const whitelist = [
//   process.env.FRONTEND_URL, // Your Vercel URL for production
//   process.env.DEV_FRONTEND_URL // Your localhost URL for development
// ];


// const {
//   FRONTEND_URL,
//   SESSION_SECRET,
// } = process.env;

// const app = express();
// app.use(express.json());
// // CORS
// // app.use(cors({
// //   origin: FRONTEND_URL,
// //   credentials: true
// // }));

// const corsOptions = {
//   origin: function (origin, callback) {
//     // The `!origin` allows requests from tools like Postman
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// };

// app.use(cors(corsOptions));







// // Session
// app.use(cookieSession({
//   name: 'session',
//   keys: [SESSION_SECRET],
//   maxAge: 24 * 60 * 60 * 1000,
//   // maxAge: 3 * 60 * 1000 ,// 3 minutes in milliseconds

//   // sameSite: "lax",
//   // secure: false
//  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//   secure: process.env.NODE_ENV === 'production' ? true : false,
//   httpOnly: true // Good security practice




// }));

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // Mount routes
// app.use('/auth', authRoutes);
// app.use('/api', apiRoutes);
// app.use('/api',projectRoutes)
// // app.use('/resumes', resumeRoutes); // mount resume routes
// app.use('/api/resumes', resumeRoutes);
// // app.use('/api', skillRoutes); // mount skill routes
// // app.use("/api/calendar", calendarRoutes);

// // Global error handler (optional)
// app.use((err, req, res, next) => {
//   console.error('Unexpected error:', err.stack);
//   res.status(500).send('Something went wrong!');
// });


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const projectRoutes = require('./routes/projectRoutes');  
const resumeRoutes = require('./routes/resumeRoutes');  

const originalsDir = path.join(__dirname, 'uploads', 'originals');
const formattedDir = path.join(__dirname, 'uploads', 'formatted');

// Ensure upload directories exist
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
  DEV_FRONTEND_URL,
  SESSION_SECRET,
  NODE_ENV
} = process.env;

const app = express();
app.use(express.json());

// ✅ Correct CORS setup
const whitelist = [FRONTEND_URL, DEV_FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

// ✅ Session middleware (must come before routes)
app.use(cookieSession({
  name: 'session',
  keys: [SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
  secure: NODE_ENV === 'production', // true if deployed on https
  httpOnly: true
}));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Mount routes after session + CORS
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api', projectRoutes);
app.use('/api/resumes', resumeRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
