import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { createApi } from "unsplash-js";
import db from './public/javascript/database.js';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;

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

app.post('/user-signup', async (req, res) => {
    try {
        const existingUser = await db.any('SELECT * FROM auth.users WHERE email = $1', [req.body.email]);
        
        if(existingUser.length > 0){
            return res.status(400).send("Email already exists");
        }

        const saltRounds = 10;
        console.log("Password to hash:", req.body.pwd);
        const hashedPassword = await bcrypt.hash(req.body.pwd, saltRounds);
        await db.none('INSERT INTO auth.users(email, passwordhash,status) VALUES($1, $2, $3)', [req.body.email, hashedPassword, 'Active']);
    
        res.status(201).send("User registered successfully");

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/user-login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.pwd;
    
    try {
        const user = await db.oneOrNone('SELECT * FROM auth.users WHERE email = $1', [email]);
        if (user) {
            const isValidPassword = await bcrypt.compare(password, user.passwordhash);
            if (isValidPassword) {
                // User authenticated successfully
                // Here you can set up session or JWT token for the authenticated user
                res.send('Login successful');
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(401).send('User not found');
        }

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});