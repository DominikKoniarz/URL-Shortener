# URL Shortener

URL Shortener application created in HTML, CSS, Vanilla JavaScript on frontend and NodeJS (Express) on backend.

# Genesis of this project

There was an idea to train my skils in developing web server based on express and additionaly learn how to use MySQL database.
URL Shortener combines these two things.

# What to do to launch this project on your PC?

1. First of all you have to install [NodeJS](https://nodejs.org/en) (18.15.0) and XAMPP package to launch MySQL database.
2. Open XAMPP control panel and start Apache and MySQL process. Then go to your browser and access this address: http://localhost/phpmyadmin
3. Paste this code to MySQL terminal to create database:

```SQL
CREATE DATABASE `url-shortener` CHARACTER SET utf8 COLLATE utf8_general_ci;
```

4. Select newly created database from menu on the left and import <b>sites.sql</b> file placed in [database](https://github.com/DominikKoniarz/URL-Shortener/tree/main/database) folder in this repository. After that database configuration is done.
5. Clone this repository to your PC. Open terminal and navigate to directory where a while before you copied repository files. Then run proper command (you should already have installed NodeJS):

```
npm i
node server.js
```

6. Then go to following address: http://localhost:3000. Paste URL that you want to shorten and app will do it for you. Shortened URL paste in browser search bar an click Enter. Server will redirect you to correlated website. Enjoy!

# Known issues

1. When app is on and you would decide to turn off MySQL database in XAMPP control panel server will report error (but app will not crash) and you would not be able to shorten another URL. This problem is caused by not properly handled situation when database connection unexpectedly corrupts. It will be mended in future.

# References

Icons from [open source](https://ionic.io/ionicons).
