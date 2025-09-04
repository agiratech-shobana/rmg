const express = require('express');
const msal = require('@azure/msal-node');

const router = express.Router();

const {
  CLIENT_ID,
  CLIENT_SECRET,
  TENANT_ID,
  REDIRECT_URI,
  FRONTEND_URL,
} = process.env;

const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    clientSecret: CLIENT_SECRET,
  },
};
const cca = new msal.ConfidentialClientApplication(msalConfig);
const SCOPES = ["openid", "profile", "email", "User.Read"];

// Login route
router.get('/login', (req, res) => {
  cca.getAuthCodeUrl({
    scopes: SCOPES,
    redirectUri: REDIRECT_URI,
    //  prompt: "select_account",
    prompt:"none",
  })
  .then(url => res.redirect(url))
  .catch(err => res.status(500).send(err.message));
});

// Redirect callback
const { createUserIfNotExists } = require("../models/userModel");
router.get('/redirect', async (req, res) => {
  try {
    const response = await cca.acquireTokenByCode({
      code: req.query.code,
      scopes: SCOPES,
      redirectUri: REDIRECT_URI,
    });
    const claims = response.idTokenClaims;
    const email = claims.preferred_username || claims.email || claims.upn;

    if (!email.toLowerCase().endsWith('@agiratech.com')) {
      return res.status(403).send('Access denied: Only @agiratech.com allowed');
    }

      try {
      const user = await createUserIfNotExists(claims.oid, claims.name, email);
      console.log("User saved:", user);
    } catch (err) {
      console.error(" Error saving user:", err);
      // You can decide whether to continue or stop here
    }

    req.session.user = {
      name: claims.name,
      email,
      oid: claims.oid,
    };
    res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Login error');
  }
});

// Current user info
router.get('/user', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
  res.json(req.session.user);
});

// Logout
router.get('/logout', (req, res) => {
  req.session = null;
  const logoutUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${FRONTEND_URL}`;
  res.redirect(FRONTEND_URL);
});

module.exports = router;


//this is the file which is get from the net 0n sep1 
//which will ask for the multiple account 
//uncomment iti and try this with the mahiama account 



// const express = require('express');
// const msal = require('@azure/msal-node');

// const router = express.Router();

// const {
//   CLIENT_ID,
//   CLIENT_SECRET,
//   TENANT_ID,
//   REDIRECT_URI,
//   FRONTEND_URL,
// } = process.env;

// const msalConfig = {
//   auth: {
//     clientId: CLIENT_ID,
//     authority: `https://login.microsoftonline.com/${TENANT_ID}`,
//     clientSecret: CLIENT_SECRET,
//   },
// };
// const cca = new msal.ConfidentialClientApplication(msalConfig);
// const SCOPES = ["openid", "profile", "email", "User.Read"];

// // Login route
// router.get('/login', (req, res) => {
//   cca.getAuthCodeUrl({
//     scopes: SCOPES,
//     redirectUri: REDIRECT_URI,
//     prompt: "select_account",
//   })
//   .then(url => res.redirect(url))
//   .catch(err => res.status(500).send(err.message));
// });

// // Redirect callback
// const { createUserIfNotExists } = require("../models/userModel");
// router.get('/redirect', async (req, res) => {
//   try {
//     const response = await cca.acquireTokenByCode({
//       code: req.query.code,
//       scopes: SCOPES,
//       redirectUri: REDIRECT_URI,
//     });
//     const claims = response.idTokenClaims;
//     const email = claims.preferred_username || claims.email || claims.upn;

//     // The security check is now handled by the Azure AD configuration.
//     // Azure AD will only issue a token if the user is in your specified tenant.
//     // The following if statement is no longer needed.
//     // if (!email.toLowerCase().endsWith('@agiratech.com')) {
//     //   return res.status(403).send('Access denied: Only @agiratech.com allowed');
//     // }

//     try {
//       const user = await createUserIfNotExists(claims.oid, claims.name, email);
//       console.log("User saved:", user);
//     } catch (err) {
//       console.error(" Error saving user:", err);
//       // You can decide whether to continue or stop here
//     }

//     req.session.user = {
//       name: claims.name,
//       email,
//       oid: claims.oid,
//     };
//     res.redirect(`${FRONTEND_URL}/dashboard`);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Login error');
//   }
// });

// // Current user info
// router.get('/user', (req, res) => {
//   if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
//   res.json(req.session.user);
// });

// // Logout
// router.get('/logout', (req, res) => {
//   req.session = null;
//   const logoutUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${FRONTEND_URL}`;
//   res.redirect(FRONTEND_URL);
// });

// module.exports = router;