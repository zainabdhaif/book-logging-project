const express = require('express');

const router = express.Router();

const User = require('../models/user.js');

const Book = require('../models/book.js');

//all books page
router.get('/index', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      const books = currentUser.books;
  
      res.render('books/index.ejs', { books });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

router.get('/new', async (req, res) => {
    res.render('books/new.ejs');
});



module.exports = router;