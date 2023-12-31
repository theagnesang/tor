# Web Application Documentation

## Overview
The web application is a accountabiltiy platform where content creators share their idea with an accountability buddy.  
You can like, favorited post or comments between each other and encourage one another for content ideation, content sharing and content feedback.

This is a alpha stage. Current there are plans include more functionality to
1) Able to add goals and milestone for each content you create.
2) RAG implementation -- To retrieve data that are relevant to your ideation. This is useful if you are created a post that are relevant to your past post.
3) sent notification for user.
4) use Python Django backend
5) use firebase for authentication
5) authentication page to be done on react.
6) Use Typescript

## Startup File
1. Installing Postgresql 16 and the dependecies from the ./package.json (Node.js dependencies) and ./tor-feed/package.json (React.js dependencies)
2. Run "psql -U username -d database_name -f schema.sql" to create the database for creaTor web app. 
3. Replace the username, database_name in the ./.env copy. Rename it as ./.env
4. Run "node ./server.js"
5. Open another CLI and run "./tor-feed npm start". click yes if prompted to change port from 3000 to 3001.
6. Go to url http://localhost:3000/log-in.
7. Create your first profile!

~Note - react.js is running on development. 

## Flow
1. The user starts with either the Login or Sign Up page.
2. Upon successful login or sign up, new users are taken to a profiling page.
3. (For new user) In Profiling page, user can put in additional details for their account
3. After profiling, the user is directed to the newsfeed page.
4. From the newsfeed page, users can perform various actions like posting, commenting, liking, and saving posts/comments in their private feed.
5. user can sent a buddy invitation by keying in the user's id. Once the requestee accepted the invite. The buddy feed will be available for both of them.

## Directory
1) public -- styling files and html files for authentication page.
2) src  -- contain backend code for authentication page and API route for postgres sql.
3) tor-feed -- contain react src
4) views -- views data for authentication and profiling pages
5) .env -- config file for postgresql database
6) .gitignore - gitignore file
7) package-lock.json -- for node.js
8) package.json -- for node.js
9) readme.md -- information for this project
10) schema.sql -- to populate the database required to run this web app
11) server.js -- main entry file to run the node.js
12) javascript - main folder for all backend files
13) public - styling files and html files for newsfeed page.
14) react modular files for newsfeedpage. All the name of the files represent a functionality element of the newsfeed page.
15) newsfeed_controller.js -- controller for API route
16) newsfeed_model.js -- model for the API. Running on postgres SQL query.
17) newsfeed_database.js -- connector to postgresql database.


## Data Flow
1) Database Name -- Authentication
2) Database Schema -- Auth
### Tables
1) Buddy_request -- data to store buddy request.
2) content_type -- mapping data for content choices given in profile
3) newsfeed_items -- comment/posts data generated in newsfeed page
4) newsfeed_like -- like data generated in newsfeed page
5) newsfeed_saveditem -- saved comment/posts data generated in newsfeedpage
6) newsfeed -- private_feed and share_feed id. These id are used to ensure user are seeing the correct feed.
7) user_profile -- additional data for each user (e.g. country type and content created)
8) users -- user data. For authentication purpose
