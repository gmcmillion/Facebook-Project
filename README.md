# Facebook-Project
To Run: 
1. Download/Clone this projects master branch onto desktop
2. Using Terminal(in Mac) enter into projects directory, and type 'npm install'
3. Download & Install Postgres -> http://postgresapp.com
4. Within the app, open the command line with psql and create 2 databases
5. For the first database, type 'CREATE DATABASE facebook;'
6. For the second test database, type 'CREATE DATABASE facebooktest;'
7. Now create your username and password by typing in 'CREATE USER postgres WITH PASSWORD 'pgpass';'
8. Now grant this user privileges to both databases by typing 'GRANT ALL PRIVILEGES ON DATABASE facebook to postgres;' and 'GRANT ALL PRIVILEGES ON DATABASE facebooktest to postgres;'
9. Once the first database 'facebook' has been created, you should now be able to launch the website from within Terminal by either typing, within the projects directory, 'npm start' or 'nodemon' (if nodemon is installed). Then within your web browser, navigate to localhost:3000 and you should see the home page.  
10. Once the second database 'facebooktest' has been created, navigate to the projects directory in Terminal and type 'npm run test' to begin mocha testing

This project includes:
- 3 initial webpages (create account/login page, news feed page, users profile page)
- Create an account page: would have the functionality that would allow a user to sign up for a new account. There would also be checks to prevent users to register an email more than once.  
- Login page: login, reset password, and delete your account functionality. When logged in, the current user would be monitored using session data.
- News Feed page: the page which follows logging in, or creating an account. The feed would be populated by users posts including other users posts as long as they are friends. User may also create a post from this page, whether it may be a text post, or image. Socket.io would be used so if other users were logged on, they would see the post instantly when posted. Posts could be deleted as well. Posts may also be commented on and ‘liked’ by other users. To add new friends, you may search by email and add the user. Once friends are linked, you will be able to comment or like other users posts.
- Profile Page: the users custom page which holds all posts from newest to oldest and pictures. This page is accessed from the nav bar in the News Feed page. Posts made from this page will also appear on the News Feed page. Can also add new friends from this page as well.

Posts:
- User can make a post in 2 ways: post on their newsfeed page or post on their profile pages.
- Posts will be handled using AJAX calls to the server side, then within the callback function on the client side, the pages HTML will be updated with the new post.
- Posts will initially only be text. Could possibly include images as well (Will need to learn about storing images in a database)
- Posts can be edited by the author
- Posts may be commented on by other users
- Posts may be liked by other users
- Posts may be deleted only by its author
- Posts would be timestamped when created
- Comments will also be timestamped

Used Technologies:
- HTML, CSS, Javascript, jQuery, NodeJS, ExpressJS, Postgres, Socket.io, client-sessions, Mocha, Chai


