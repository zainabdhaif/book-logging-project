const express = require('express');

const router = express.Router();
const uploadMiddleware = require("../middleware/uploadMiddleware.js");
const upload = uploadMiddleware("bookCovers");

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


//create is for 
//push is for embedded

//to add a book to a certain user, we need to get id of user, then 
// router.post('/books', async (req, res, next)=> {
//   try{
//     const currentUser = await User.findById(req.session.user._id);

//     //to change date to an acceptable format to be accepted by DB
//     req.body.date = new Date(req.body.date);
//     // const imageUrl = req.file.path;
//     currentUser.books.push(req.body);

//     await currentUser.save();
//     res.redirect(`/users/${currentUser._id}/books/index`);
//   }
//   catch(error){
//     console.error(err);

//     res.redirect('/');
//   }
// });
router.post('/', async (req, res, next) => {
  try{
    const currentUser = await User.findById(req.session.user._id);

    req.body.date = new Date(req.body.date);
    const newBook = {
      title:req.body.title,
      author:req.body.author,
      averageRating: req.body.averageRating,
    };

    const book = await Book.create(newBook);

    const bookId = book._id;
    const bookEd = await Book.findById(bookId);

    const editionData = {
      publishingHouse: req.body.publishingHouse,
      datePublished: req.body.datePublished,
      noOfPages: req.body.noOfPages,
      bookCover: req.body.bookCover
    };

    const edition = bookEd.editions.push(editionData);
    await bookEd.save();

    //book is added to

    currentUser.books.push(book._id);
    await currentUser.save();
    
    res.redirect(`/users/${currentUser._id}/books/index`);

  }catch (error){
    console.error(error);

    res.redirect('/');
  }
})

module.exports = router; 
