


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

// // Session
// // app.use(cookieSession({
// //   name: 'session',
// //   keys: [SESSION_SECRET],
// //   maxAge: 24 * 60 * 60 * 1000,

// //   sameSite: "lax",
// //   secure: false
// // }));

// app.use(cookieSession({
//   name: 'session',
//   keys: [SESSION_SECRET],
//   maxAge: 24 * 60 * 60 * 1000, // 1 day

//   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//   secure: process.env.NODE_ENV === "production", // must be true on HTTPS
//   httpOnly: true
// }));
// const whitelist = [
//   process.env.FRONTEND_URL,
//   process.env.DEV_FRONTEND_URL,
//   /\.vercel\.app$/  // allow preview deployments
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || whitelist.includes(origin) || /\.vercel\.app$/.test(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));






// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // Mount routes
// app.use('/auth', authRoutes);
// app.use('/api', apiRoutes);
// app.use('/api',projectRoutes)
// // app.use('/resumes', resumeRoutes); // mount resume routes
// app.use('/api/resumes', resumeRoutes);

// app.use((err, req, res, next) => {
//   console.error('Unexpected error:', err.stack);
//   res.status(500).send('Something went wrong!');
// });


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const path = require("path");
const fs = require("fs");

// Routes
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const projectRoutes = require("./routes/projectRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const originalsDir = path.join(__dirname, "uploads", "originals");
const formattedDir = path.join(__dirname, "uploads", "formatted");

// Ensure upload dirs exist
if (!fs.existsSync(originalsDir)) {
  fs.mkdirSync(originalsDir, { recursive: true });
  console.log(`✅ Created directory: ${originalsDir}`);
}
if (!fs.existsSync(formattedDir)) {
  fs.mkdirSync(formattedDir, { recursive: true });
  console.log(`✅ Created directory: ${formattedDir}`);
}

const { FRONTEND_URL, DEV_FRONTEND_URL, SESSION_SECRET, NODE_ENV } = process.env;

const app = express();
app.use(express.json());

// ✅ Trust Render proxy so secure cookies work
app.set("trust proxy", 1);

// ✅ Session middleware
app.use(
  cookieSession({
    name: "session",
    keys: [SESSION_SECRET],
    httpOnly: true,
    sameSite: NODE_ENV === "production" ? "none" : "lax",
    secure: NODE_ENV === "production", // must be true on Render (HTTPS)
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
);

// ✅ CORS setup with whitelist
const whitelist = [
  FRONTEND_URL, // production frontend
  DEV_FRONTEND_URL, // optional dev frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server calls
      if (
        whitelist.includes(origin) ||
        /\.vercel\.app$/.test(origin) // allow Vercel preview URLs
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// View engine (if needed for auth redirects)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Mount routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/api", projectRoutes);
app.use("/api/resumes", resumeRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err.stack);
  res.status(500).send("Something went wrong!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
