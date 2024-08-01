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

  router.get('/addListBook', async (req, res, next)=> {
    try {
      const currentUser = await User.findById(req.session.user._id);
      const listType = req.query.listType;
      const list = currentUser.lists.find(l => l.listType === listType);
  
      if (!list) {
        return res.redirect('/');
      }
  
      res.render('nUser/addListBook.ejs', { list });
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  });
  module.exports = router; 