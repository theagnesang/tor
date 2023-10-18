import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { createApi } from "unsplash-js";
import NewsFeedController from "./public/javascript/newsfeed_controller.js";

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

const newsFeedController = new NewsFeedController();

app.get('/newsfeed', async (req, res) => newsFeedController.getAllNodes(req, res));
app.get('/newsfeed/:userid', async (req, res) => newsFeedController.userGetAllContent(req, res));

app.post('/newsfeed/:userid/comment', async (req, res) => newsFeedController.userPutComment(req, res));
app.post('/newsfeed/:userid/post', async (req, res) => newsFeedController.userPutPost(req, res));
app.post('/newsfeed/:userid/like', async (req, res) => newsFeedController.userLikedPostComment(req, res));
app.post('/newsfeed/:userid/saved', async (req, res) => newsFeedController.userSavedPostComment(req, res));


app.listen(port,'localhost', () => {
    console.log(`Server running on http://localhost:${port}`);
});


