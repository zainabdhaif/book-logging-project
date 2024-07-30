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

//controllers
const authCtrl = require('./controllers/auth.js');

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



app.get("/", (req, res) => {
    res.render("index.ejs", {
      user: req.session.user,
    });
  });

app.use('/auth', authCtrl);
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });