// index.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Initialize Passport configuration
require('./config/passport');

const app = express();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Middleware to parse JSON (if needed for APIs)
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`
      <h1>Welcome, ${req.user.email}</h1>
      <a href="/dashboard">Go to Dashboard</a><br/>
      <a href="/logout">Logout</a>
    `);
  } else {
    res.send('<h1>Welcome to Canvas Calendar App</h1><a href="/auth/google">Login with Google</a>');
  }
});

// Authentication routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    // Successful authentication
    try {
      const user = req.user;
      const canvasApiKey = process.env.CANVAS_API_KEY; // Static key from .env

      // Fetch courses from Canvas API
      const response = await axios.get('https://canvas.instructure.com/api/v1/courses', {
        headers: {
          Authorization: `Bearer ${canvasApiKey}`
        }
      });

      const courses = response.data;

      // Update user with courses in Supabase
      const { data, error } = await supabase
        .from('users')
        .update({ courses: courses })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating courses:', error);
        // Optionally, handle the error (e.g., notify the user)
      }

      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error during post-authentication process:', error);
      res.redirect('/');
    }
  }
);

// Dashboard route
app.get('/dashboard', async (req, res) => {
  if (req.isAuthenticated()) {
    // Fetch latest user data from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('Error fetching user data:', error);
      return res.status(500).send('Internal Server Error');
    }

    res.send(`
      <h1>Dashboard</h1>
      <p>Email: ${user.email}</p>
      <h2>Courses:</h2>
      <pre>${JSON.stringify(user.courses, null, 2)}</pre>
      <a href="/">Home</a><br/>
      <a href="/logout">Logout</a>
    `);
  } else {
    res.redirect('/');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
