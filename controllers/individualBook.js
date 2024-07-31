const express = require('express');

const router = express.Router();

const User = require('../models/user.js');
const Book = require('../models/book.js');
//show each individual book
router.get('/:bookId', async (req, res, next) => {
    try {
      const book = await Book.findById(req.params.bookId);
   
      res.render('nUser/showBooks.ejs', {book});
  
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  });

  module.exports = router; 