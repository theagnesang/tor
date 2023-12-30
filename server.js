import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { createApi } from "unsplash-js";
import db from './src/javascript/postgres_database.js';
import bcrypt from 'bcrypt';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import flash from 'connect-flash';
import NewsFeedController from "./src/javascript/newsfeed_controller.js";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// TODO: turn react to build version
// TODO: connect react-build to express

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


app.use(cors({
    origin: 'http://localhost:3001', // Replace with your frontend's URL
    credentials: true
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
app.set('view engine', 'ejs');
app.set('views', './views');
global.fetch = fetch;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'tor-feed/public')));

const unsplashAccess = createApi({ accessKey: process.env.UNSPLASH_ACCESS_KEY });
app.get("/user-login", async (req, res) => {
  if(req.isAuthenticated()){
    res.redirect("http://localhost:3001");
  } else {
      try {
          const unsplashImage = await unsplashAccess.search.getPhotos({ query: "creator" });
          const randomIndex = Math.floor(Math.random() * unsplashImage.response?.results.length);
          const photoURL = unsplashImage.response?.results[randomIndex].urls.raw;
          const photoAltText = unsplashImage.response?.results[randomIndex].alt_description;
          res.render("log-in.ejs", {
              photo: photoURL,
              photoAlt: photoAltText
          });
      }
      catch (error) {
          console.error("Failed to make request:", error.message);
          res.status(500).send("Failed to fetch activity.");
      }
  }
  });

  app.post('/user-login', (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) { 
            return res.status(500).send('Internal Server Error'); 
        }
        if (!user) { 
            return res.status(401).send(info.message);
        }
        req.logIn(user, async (err) => {
            if (err) { 
                return res.status(500).send('Internal Server Error'); 
            }
            // Check onboarding status
            const userProfile = await db.oneOrNone('SELECT * FROM auth.user_profile WHERE id = $1', [req.user.userid]);
            const hasCompletedOnboarding = userProfile !== null;
            console.log("hasCompletedOnboarding",hasCompletedOnboarding)
            if (hasCompletedOnboarding) {
                res.redirect("http://localhost:3001/");
            } else {
                res.redirect("/onboarding");
            }
        });
    })(req, res, next);
});



app.get('/user-signup', async (req, res) => {
if(req.isAuthenticated()){
  res.redirect("http://localhost:3001");
} else {
    try {
        const unsplashImage = await unsplashAccess.search.getPhotos({ query: "creator" });
        const randomIndex = Math.floor(Math.random() * unsplashImage.response?.results.length);
        const photoURL = unsplashImage.response?.results[randomIndex].urls.raw;
        const photoAltText = unsplashImage.response?.results[randomIndex].alt_description;
        res.render("sign-up.ejs", {
            photo: photoURL,
            photoAlt: photoAltText
        });
    }
    catch (error) {
        console.error("Failed to make request:", error.message);
        res.status(500).send("Failed to fetch activity.");
    }
}
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


app.get('/onboarding', (req, res) => {
  res.render("onboarding.ejs");
});

app.post('/onboarding', async (req, res) => {
  if (!req.isAuthenticated()) {
      return res.status(403).send('You must be logged in to complete onboarding');
  }

  try {
      const data = req.body; 
      console.log('data in server.js',data)
      const userId = req.user.userid; 
      
      // Check if user already has a profile
      const existingProfile = await db.oneOrNone('SELECT * FROM auth.user_profile WHERE id = $1', [userId]);
      
      if (existingProfile) {
          // Update existing profile with new data
          await db.none('UPDATE auth.user_profile SET first_name = $1, last_name = $2, country = $3, content_type = $4 WHERE id = $5', [data.first_name, data.last_name, data.country, data.content_type, userId]);
          
      } else {
          // Insert new profile with data
          await db.none('INSERT INTO auth.user_profile (id, first_name, last_name, country, content_type) VALUES ($1, $2, $3, $4, $5)', [userId, data.first_name, data.last_name, data.country, data.content_type]);
          await db.none('INSERT INTO auth.newsfeeds (user_id) VALUES ($1)', [userId]);
      }
      
      res.redirect("http://localhost:3001");
  } catch (error) {
      console.error('Error during onboarding:', error);
      res.status(500).send('Internal Server Error');
  }
});

const newsFeedController = new NewsFeedController();

/* below API are all not secured*/

// app.get('/newsfeed', async (req, res) => newsFeedController.getAllNodes(req, res));

//test url  http://localhost:3000/api?shared_feedid=9fcc356a-51fa-4af1-a525-71a9d5227842 - user5 shared
//test url  http://localhost:3000/api?private_feedid=6f4d4b3e-a948-4668-8949-415d0b0796be - user4 private
//test url  http://localhost:3000/api?shared_feedid=2b1a473f-b56d-44ce-8116-d548187feea2 - user4 shared


app.get('/api', async (req, res) => {
  if (req.query.shared_feedid) {
    return newsFeedController.getAllItems_sharedfeed(req, res);
  } else if (req.query.private_feedid) {
    return newsFeedController.getAllItems_privatefeed(req, res);
  } else {
    return res.status(400).send('Invalid request');
  }
});

app.get('/api/userinfo', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      res.json({ 
        user_id: req.user.userid
      });
    } catch (error) {
      // handle error
      res.status(500).send('Server Error');
    }
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('/api/getOnboardingInfo', async (req, res) => {
  if (req.isAuthenticated()) {
      try {
          // Assuming you have a method to check if the user profile exists
          const userProfile = await db.oneOrNone('SELECT * FROM auth.user_profile WHERE userid = $1', [req.user.user_id]);
          const hasCompletedOnboarding = userProfile !== null; // onboarding is complete if the profile exists
          res.json({ hasCompletedOnboarding });
      } catch (error) {
          console.error('Error fetching onboarding info:', error);
          res.status(500).send('Internal Server Error');
      }
  } else {
      res.status(401).send('Unauthorized');
  }
});

//http://localhost:3000/api/getUserFeedId?user_id=5
app.get('/api/UserFeedId', async (req, res) => newsFeedController.getUserFeedId(req, res)); 
app.put('/api/UserFeedId', async (req, res) => newsFeedController.putUserFeedId(req, res));
app.delete('/api/UserFeedId', async (req, res) => newsFeedController.deleteUserFeedId(req, res));
app.put('/api/SharedFeedId', async (req, res) => newsFeedController.putSharedFeedId(req, res));
app.get('/api/SharedFeedId', async (req, res) => newsFeedController.getSharedFeedId(req, res));


// app.post('/api/UserFeedId', async (req, res) => newsFeedController.PostUserFeed(req, res)); inside app.post('/onboarding'

/*
http://localhost:3000/api/updateUserFeedId
{
    "user_id": 4,
    "buddy_id": 5
}

SELECT *
        FROM auth.newsfeeds
        WHERE shared_feedid= '2b1a473f-b56d-44ce-8116-d548187feea2';

UPDATE auth.newsfeeds
SET shared_feedid= UUID('2b1a473f-b56d-44ce-8116-d548187feea2')
WHERE user_id = 4;

*/
app.put('/api/addBuddy', async (req, res) => newsFeedController.addBuddy(req, res));

app.post('/api/BuddyRequestResponse', async (req, res) => newsFeedController.postBuddyRequestResponse(req, res));
app.get('/api/BuddyRequestResponse', async (req, res) => newsFeedController.getBuddyRequestResponse(req, res));
app.put('/api/BuddyRequestResponse', async (req, res) => newsFeedController.putBuddyRequestResponse(req, res));
app.delete('/api/BuddyRequestResponse', async (req, res) => newsFeedController.deleteBuddyRequestResponse(req, res));


http://localhost:3000/api/putItem?private_feedid=6f4d4b3e-a948-4668-8949-415d0b0796be&type=post&content=I am posting this from postman!
app.get('/api/feedItem', async (req, res) => newsFeedController.getAllItems(req, res));
app.post('/api/feedItem', async (req, res) => newsFeedController.postFeedItem(req, res));
app.delete('/api/feedItem', async (req, res) => newsFeedController.deleteFeedItem(req, res));

app.delete('/api/singleFeedItem', async (req, res) => newsFeedController.deleteSinglefeedItem(req, res));

app.get('/api/likedItem', async (req, res) => newsFeedController.getLikedItem(req, res));
app.post('/api/likedItem', async (req, res) => newsFeedController.postLikedItem(req, res));
app.delete('/api/likedItem', async (req, res) => newsFeedController.deleteLikedItem(req, res));

app.get('/api/savedItem', async (req, res) => newsFeedController.getSavedItem(req, res));
app.get('/api/allSavedItem', async (req, res) => newsFeedController.getAllSavedItem(req, res));
app.post('/api/savedItem', async (req, res) => newsFeedController.postSavedItem(req, res));
app.delete('/api/savedItem', async (req, res) => newsFeedController.deleteSavedItem(req, res));
// app.post('/api/createUserFeed', async (req, res) => newsFeedController.createUserFeed(req, res));

app.get('/api/firstname', async (req, res) => newsFeedController.getFirstName(req, res));
app.put('/api/firstname', async (req, res) => newsFeedController.putFirstName(req, res));
app.put('/api/lastname', async (req, res) => newsFeedController.putLastName(req, res));
app.put('/api/country', async (req, res) => newsFeedController.putCountry(req, res));
app.put('/api/timezone', async (req, res) => newsFeedController.putTimeZone(req, res));
app.put('/api/contenttype', async (req, res) => newsFeedController.putContentType(req, res));

app.get('/api/screenpreference', async (req, res) => newsFeedController.getScreenPreference(req, res));
app.put('/api/screenpreference', async (req, res) => newsFeedController.putScreenPreference(req, res));

/*
app.route("/path")
    .post(function(req, res) {})
    .put(function(req, res) {})
    .get(function(req, res) {})
    .delete(function(req, res) {})
*/

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('/app', express.static('./build'));

//const reactBuildPath = path.join(__dirname, 'tor-feed');



// The "catchall" handler for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'tor-feed/src/app.js'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});