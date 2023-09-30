import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { createApi } from "unsplash-js";
import db from './public/javascript/database.js';
import bcrypt from 'bcrypt';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import flash from 'connect-flash';

const app = express();
const port = 3000;

app.use(flash());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 48 * 60 * 60 * 1000, // 1 hour in milliseconds
        sameSite: true, // This is a good practice for security
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'pwd' },
    async (email, password, done) => {
      try {
        const lowerCaseEmail = email.toLowerCase();
        const user = await db.oneOrNone('SELECT * FROM auth.users WHERE email = $1', [lowerCaseEmail]);
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        const isValidPassword = await bcrypt.compare(password, user.passwordhash);
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
));

passport.serializeUser((user, done) => {
    console.log(user); // Debugging line
    if(user && user.userid) { // Adjust this line to match the identifier in your database
        done(null, user.userid); // And adjust this line as well
    } else {
        done(new Error("User ID is not found"), null);
    }
});
  
passport.deserializeUser(async (userid, done) => {
    try {
      const user = await db.one('SELECT * FROM auth.users WHERE userid = $1', [userid]);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
});  
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

global.fetch = fetch;

const unsplashAccess = createApi({ accessKey: process.env.UNSPLASH_ACCESS_KEY });

app.get("/", async (req, res) => {
    try {
        const unsplashImage = await unsplashAccess.search.getPhotos({ query: "creator" });
        const randomIndex = Math.floor(Math.random() * unsplashImage.response?.results.length);
        const photoURL = unsplashImage.response?.results[randomIndex].urls.raw;
        const photoAltText = unsplashImage.response?.results[randomIndex].alt_description;
        res.render("index.ejs", {
            photo: photoURL,
            photoAlt: photoAltText
        });
    }
    catch (error) {
        console.error("Failed to make request:", error.message);
        res.status(500).send("Failed to fetch activity.");
    }
});

app.get('/signup', async (req, res) => {
    try {
        const unsplashImage = await unsplashAccess.search.getPhotos({ query: "creator" });
        const randomIndex = Math.floor(Math.random() * unsplashImage.response?.results.length);
        const photoURL = unsplashImage.response?.results[randomIndex].urls.raw;
        const photoAltText = unsplashImage.response?.results[randomIndex].alt_description;
        res.render("create account.ejs", {
            photo: photoURL,
            photoAlt: photoAltText
        });
    }
    catch (error) {
        console.error("Failed to make request:", error.message);
        res.status(500).send("Failed to fetch activity.");
    }
});

app.get('/onboarding', (req, res) => {
    res.render("onboarding.ejs");
});

app.post('/user-signup', async (req, res) => {
    try {
        const lowerCaseEmail = req.body.email.toLowerCase();
        const existingUser = await db.any('SELECT * FROM auth.users WHERE email ILIKE $1', [lowerCaseEmail]);
        
        if(existingUser.length > 0){
            return res.status(400).send("Email already exists");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.pwd, saltRounds);
        await db.none('INSERT INTO auth.users(email, passwordhash,status) VALUES($1, $2, $3)', [req.body.email, hashedPassword, 'Active']);
        res.status(201).send('User created successfully');
        
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/user-login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) { 
        return res.status(500).send('Internal Server Error'); 
      }
      if (!user) { 
        return res.status(401).send(info.message); // Send plain error message here
      }
      req.logIn(user, (err) => {
        if (err) { 
          return res.status(500).send('Internal Server Error'); 
        }
        return res.redirect('/feed');
      });
    })(req, res, next);
  });

app.get('/feed', (req, res) => {
    if (req.isAuthenticated()){
        res.render("feed.ejs");
    } else {
        res.redirect("/");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});