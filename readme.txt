Web Application Documentation
####Overview####
The web application is a social newsfeed platform where users 
can sign up or log in using their email and password. Once authenticated, 
new users are directed to a profiling page to input additional information. 
After profiling, users land on the newsfeed page. The newsfeed can be of 
two types: private and shared. Users can post, comment, like, and save 
posts and comments on both types of newsfeeds. A unique feature allows 
users to invite peers to a shared newsfeed page.

####Startup File####
The starting point of the application is server.js.

#Note - newsfeed has not integrate with the server login page. newsfeed access is through server_newsfeed.js

####Flow####
The user starts with either the Login or Sign Up page.
Upon successful login or sign up, new users are taken to a profiling page (not present in the provided files).
After profiling, the user is directed to the newsfeed page.
From the newsfeed page, users can perform various actions like posting, commenting, liking, and saving posts/comments.
Module Descriptions
database.js: This file likely contains configurations and setup for connecting to the PostgreSQL database.
db-queries.js: Contains SQL queries for various operations, like fetching or storing data in the PostgreSQL database.
log-in.js: Handles the user login functionality, including verifying user credentials.
neo4j_database.js: This file might be related to the Neo4j graph database. It's possibly used for storing or querying relational data, like friendships or user connections.
newsfeed.js: Manages the main newsfeed display, fetching posts, comments, and other related functionalities.
newsfeed_controller.js: Contains the controllers for the newsfeed actions, like adding a post, commenting, liking, etc.
newsfeed_model.js: Manages data models for the newsfeed, potentially handling data structure and database interactions.
sign-up.js: Manages user registration, including storing new user data in the database.

####Data Flow####
User Data: User credentials (email and password) and profile data are stored in a PostgreSQL database.
Newsfeed Data: All newsfeed-related data, including posts, comments, likes, and connections, are stored in a Neo4j graph database.
User Interactions: Interactions such as friendships or connections might also be stored in the Neo4j graph database, indicating relationships between users.
The application fetches and sends data to the respective databases using queries defined in db-queries.js for PostgreSQL operations and respective model/controllers for Neo4j operations.

