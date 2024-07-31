//all the requires and imports
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const imgur = require('imgur');
const fileUpload = require('express-fileupload');
app.use(fileUpload());

//middleware things
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

//controllers
const authCtrl = require('./controllers/auth.js');
const bookCtrl = require('./controllers/books.js');
const userCtrl = require('./controllers/user.js');
// const singleBookCtrl = require('./controllers/individualBook.js');


//port thingy
const port = process.env.PORT ? process.env.PORT : '5020';

//call db
require('./config/database');

//setting up morgan to work, and the over stuff for form acception
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView);



// LINK TO PUBLIC DIRECTORY - to be able to style things 
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("index.ejs", {
      user: req.session.user,
    });
  });

app.use('/auth', authCtrl);
app.use(isSignedIn);
app.use('/users/:userId/books',bookCtrl);
app.use('/users/:userId/nUser', userCtrl);
// app.use('/users/:userId/nUser/book', singleBookCtrl);

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });